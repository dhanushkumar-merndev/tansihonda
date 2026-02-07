"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
import { Download, ChevronLeft, FileText, X, ZoomIn, ZoomOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface OutlineItem {
  title: string;
  dest?: any;
  items?: OutlineItem[];
}

export default function PdfViewer({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = use(params);
  const router = useRouter();
  const [heading, setHeading] = useState("");
  const [showControls, setShowControls] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const pdfName = path.map(decodeURIComponent).join("/");
  const proxyUrl = `/api/pdf-proxy/${pdfName}`;

  // Default heading from filename
  useEffect(() => {
    const nameOnly = pdfName.split('/').pop()?.replace('.pdf', '').replace(/-/g, ' ') || "";
    setHeading(nameOnly.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
  }, [pdfName]);

  const resetTimeout = () => {
    setShowControls(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2500);
  };

  const navigateToPage = useCallback((dest: any) => {
    try {
      const iframeWindow = iframeRef.current?.contentWindow as any;
      if (iframeWindow?.PDFViewerApplication) {
        // Use goToDestination and then adjust scroll
        iframeWindow.PDFViewerApplication.pdfLinkService.goToDestination(dest).then(() => {
          // Add a small delay to ensure PDF.js internal scroll has settled
          setTimeout(() => {
            const viewerContainer = iframeWindow.document.getElementById("viewerContainer");
            if (viewerContainer) {
              const offset = viewerContainer.clientHeight * 0.25;
              viewerContainer.scrollTop -= offset;
            }
          }, 100);
        });
        setIsDrawerOpen(false);
      }
    } catch (e) {
      console.error("Navigation failed", e);
    }
  }, []);

  const handleZoom = (type: "in" | "out") => {
    try {
      const iframeWindow = iframeRef.current?.contentWindow as any;
      const PDFViewerApplication = iframeWindow?.PDFViewerApplication;
      if (PDFViewerApplication) {
        if (type === "in") {
          PDFViewerApplication.zoomIn();
        } else {
          PDFViewerApplication.zoomOut();
        }
      }
    } catch (e) {
      console.error("Zoom failed", e);
    }
  };

  useEffect(() => {
    resetTimeout();
    const handleInteraction = () => resetTimeout();

    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);
    window.addEventListener("scroll", handleInteraction);

    const iframe = iframeRef.current;
    let iframeWindow: Window | null = null;
    let pollingInterval: NodeJS.Timeout | null = null;
    
    const setupIframeListeners = () => {
      try {
        iframeWindow = iframe?.contentWindow || null;
        if (iframeWindow) {
          iframeWindow.addEventListener("mousemove", handleInteraction);
          iframeWindow.addEventListener("touchstart", handleInteraction);
          
          const viewerContainer = iframeWindow.document.getElementById("viewerContainer");
          if (viewerContainer) {
            viewerContainer.addEventListener("scroll", handleInteraction);
          } else {
            iframeWindow.addEventListener("scroll", handleInteraction);
          }

          // Polling mechanism
          let attempts = 0;
          let listenersAttached = false;
          pollingInterval = setInterval(async () => {
            attempts++;
            // Re-fetch application in case it was null initially
            const currentApp = (iframeWindow as any)?.PDFViewerApplication;
            
            if (currentApp && currentApp.eventBus && !listenersAttached) {
              currentApp.eventBus.on('pagechanging', (evt: any) => {
                setCurrentPage(evt.pageNumber);
                if (currentApp.pagesCount) setTotalPages(currentApp.pagesCount);
              });
              
              // Immediately set initial page info
              if (currentApp.pdfDocument) {
                setTotalPages(currentApp.pagesCount || 0);
                setCurrentPage(currentApp.page || 1);
              }
              
              listenersAttached = true;
            }

            const tryExtractData = async () => {
              if (!currentApp || !currentApp.pdfDocument) return false;

              // Extract Heading
              try {
                const title = currentApp.metadata?.get('dc:title') || currentApp.documentInfo?.Title;
                if (title && title.trim() && title !== pdfName) {
                  setHeading(title);
                }
              } catch (e) { /* ignore */ }

              // Extract Outline
              try {
                const pdfOutline = await currentApp.pdfDocument.getOutline();
                if (pdfOutline && pdfOutline.length > 0) {
                  setOutline(pdfOutline);
                }
              } catch (e) { /* ignore */ }

              // Update page info immediately when document loads
              const pagesCount = currentApp.pagesCount || 0;
              const currentPageNum = currentApp.page || 1;
              
              if (pagesCount > 0) {
                setTotalPages(pagesCount);
                setCurrentPage(currentPageNum);
                return true;
              }
              
              return false;
            };

            const success = await tryExtractData();
            if ((success && listenersAttached) || attempts > 60) { // 30 seconds
              if (pollingInterval) {
                clearInterval(pollingInterval);
                pollingInterval = null;
              }
            }
          }, 500);
        }
      } catch (e) {
        console.warn("Iframe interaction limited", e);
      }
    };

    if (iframe) {
      if (iframe.contentDocument?.readyState === "complete") {
        setupIframeListeners();
      } else {
        iframe.addEventListener("load", setupIframeListeners);
      }
    }

    return () => {
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (pollingInterval) clearInterval(pollingInterval);
      
      if (iframeWindow) {
        try {
          iframeWindow.removeEventListener("mousemove", handleInteraction);
          iframeWindow.removeEventListener("touchstart", handleInteraction);
          iframeWindow.removeEventListener("scroll", handleInteraction);
        } catch (e) { /* ignore */ }
      }
    };
  }, [pdfName]);

  const itemsRender = (items: OutlineItem[], level = 0) => {
    return items.map((item, idx) => (
      <div key={`${level}-${idx}`} className="flex flex-col">
        <button
          onClick={() => navigateToPage(item.dest)}
          className={`text-left px-5 py-3 hover:bg-white/10 transition-colors flex items-center group relative border-l-2 ${
            level > 0 ? "ml-6 text-sm border-white/10" : "font-medium border-transparent"
          }`}
        >
          <span className="truncate flex-1 text-white/90 group-hover:text-white transition-colors">{item.title}</span>
          <ChevronLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 text-white/50" />
        </button>
        {item.items && item.items.length > 0 && itemsRender(item.items, level + 1)}
      </div>
    ));
  };

  return (
    <div 
      className="relative w-screen min-h-dvh bg-black md:bg-[#2a2a2e] flex flex-col overscroll-none overflow-hidden"
      onClick={resetTimeout}
      onMouseMove={resetTimeout}
      onTouchStart={resetTimeout}
    >
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
      
      {/* Top Bar: Back Button (Left) */}
      <div className={`absolute top-2 md:top-4 left-4 z-50 transition-all duration-500 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} md:opacity-100 md:translate-y-0`}>
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-[#2a2a2e] text-white shadow-xl active:scale-95 transition flex items-center justify-center cursor-pointer border border-white/20 hover:bg-white/10"
          title="Go Back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Heading: Centered on Mobile, Next to back button on Desktop */}
      <div className={`absolute top-4 z-50 transition-all duration-500 flex items-center justify-center left-1/2 -translate-x-1/2 md:left-[70px] md:translate-x-0 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} md:opacity-100 md:translate-y-0`}>
        <div className="px-5 py-2 rounded-full bg-[#2a2a2e] border border-white/20 shadow-2xl -mt-1 md:mt-1">
          <span className="text-white font-bold text-xs md:text-sm tracking-wide truncate max-w-[45vw] md:max-w-[60vw] block">
            {heading}
          </span>
        </div>
      </div>

      {/* Top Right Controls: Zoom, Topics & Download */}
<div
  className={`absolute top-2 md:top-4 right-4 z-50 transition-all duration-500
  flex flex-col md:flex-row items-center gap-2
  ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
  md:opacity-100 md:translate-y-0`}
>
  {/* Download Button — FIRST on mobile */}
  <button
    onClick={() => {
      const downloadUrl = new URL(`${proxyUrl}?download=1`, window.location.origin).href;
      window.location.assign(downloadUrl);
    }}
    className={`order-1 md:order-none
               p-2 rounded-full bg-[#2a2a2e] text-white shadow-xl
               active:scale-95 transition flex items-center justify-center
               cursor-pointer border border-white/20 hover:bg-white/10`}
    title="Download PDF"
  >
    <Download className="w-6 h-6" />
  </button>

  {/* Topics Button — BELOW on mobile */}
  <button
    onClick={() => setIsDrawerOpen(true)}
    className={`order-2 md:order-none
               p-2 rounded-full bg-[#2a2a2e] text-white shadow-xl
               active:scale-95 transition flex items-center justify-center
               cursor-pointer border border-white/20 hover:bg-white/10`}
    title="Show Topics"
  >
    <FileText className="w-6 h-6" />
  </button>

  {/* Zoom Controls — desktop only */}
  <div className="hidden md:flex items-center gap-2 bg-[#2a2a2e] rounded-full p-1 border border-white/20 shadow-xl">
    <button
      onClick={() => handleZoom("out")}
      className="p-1.5 rounded-full hover:bg-white/10 text-white transition"
    >
      <ZoomOut className="w-5 h-5" />
    </button>
    <button
      onClick={() => handleZoom("in")}
      className="p-1.5 rounded-full hover:bg-white/10 text-white transition"
    >
      <ZoomIn className="w-5 h-5" />
    </button>
  </div>
</div>


      {/* Page Counter */}
      {totalPages > 0 && (
      <div
  className={`absolute bottom-[env(safe-area-inset-bottom,16px)] mb-3 z-50
  transition-all duration-500 left-1/2 -translate-x-1/2
  ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
  md:opacity-100 md:translate-y-0`}
>
  <div
    className={`p-2 px-4 rounded-full bg-[#2a2a2e] text-white
               shadow-xl active:scale-95 transition
               flex items-center justify-center cursor-default
               border border-white/20`}
  >
    <span className="text-sm font-semibold whitespace-nowrap">
      Page {currentPage} of {totalPages}
    </span>
  </div>
</div>

      )}

      {/* Topics Drawer */}
      <div className={`fixed inset-y-0 left-0 z-[100] w-full sm:w-[320px] bg-[#2a2a2e] shadow-2xl transition-transform duration-500 ease-in-out border-r border-white/10 ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-white/50" />
              <h2 className="font-bold text-white tracking-wide">Topics</h2>
            </div>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white/40" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pt-2">
            {outline.length > 0 ? (
              itemsRender(outline)
            ) : (
              <div className="p-10 text-center text-white/10">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-5" />
                <p className="text-sm">No topics found.</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-white/5 border-t border-white/5">
            <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] text-center">
              Tansi Honda Digital
            </p>
          </div>
        </div>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity duration-500"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* PDF viewer */}
      <iframe
  key={pdfName}
  ref={iframeRef}
  src={`/pdfjs/web/viewer.html?file=${encodeURIComponent(proxyUrl)}#pagemode=none`}
  className="absolute inset-0 w-full h-full border-none z-0"
  title="PDF Viewer"
/>

    </div>
  );
}