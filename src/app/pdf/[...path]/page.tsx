"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
import { Download, ChevronLeft, FileText, X, ZoomIn, ZoomOut, Loader2, ChevronsLeft, ChevronsRight } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const pdfName = path.map(decodeURIComponent).join("/");
  const proxyUrl = `/api/pdf-proxy/${pdfName}`;

  const [showReload, setShowReload] = useState(false);

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

  const handleReload = () => {
    setIsLoading(true);
    setShowReload(false);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src; // Reload iframe
    }
  };

  useEffect(() => {
    resetTimeout();
    const handleInteraction = () => resetTimeout();

    // Reset states for new PDF
    setCurrentPage(1);
    setTotalPages(0);
    setOutline([]);
    setIsLoading(true);
    setLoadingProgress(0);
    setShowReload(false);

    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);
    window.addEventListener("scroll", handleInteraction);

    let pollingInterval: NodeJS.Timeout | null = null;
    let reloadTimer: NodeJS.Timeout | null = null;
    let listenersAttached = false;
    let attempts = 0;

    // Show reload option if loading takes too long
    reloadTimer = setTimeout(() => {
      if (isLoading) setShowReload(true);
    }, 10000); // 10 seconds

    const startPolling = () => {
      if (pollingInterval) return;
      
      pollingInterval = setInterval(async () => {
        attempts++;
        try {
          const iframe = iframeRef.current;
          const iframeWindow = iframe?.contentWindow as any;
          if (!iframeWindow) return;

          const currentApp = iframeWindow.PDFViewerApplication;
          
            // Attach event bus listeners
            if (currentApp && currentApp.eventBus && !listenersAttached) {
              currentApp.eventBus.on('progress', (evt: any) => {
                if (evt.total > 0) {
                  const percent = Math.round((evt.loaded / evt.total) * 100);
                  setLoadingProgress(percent);
                }
              });

              currentApp.eventBus.on('pagechanging', (evt: any) => {
              setCurrentPage(evt.pageNumber);
              if (currentApp.pagesCount) setTotalPages(currentApp.pagesCount);
            });
            
            // Set initial page info if available
            if (currentApp.pdfDocument) {
              setTotalPages(currentApp.pagesCount || 0);
              setCurrentPage(currentApp.page || 1);
            }
            
            // Add interaction listeners to iframe window
            iframeWindow.addEventListener("mousemove", handleInteraction);
            iframeWindow.addEventListener("touchstart", handleInteraction);
            const viewerContainer = iframeWindow.document.getElementById("viewerContainer");
            if (viewerContainer) {
              viewerContainer.addEventListener("scroll", handleInteraction);
            }

            listenersAttached = true;
          }
          
          if (currentApp && currentApp.eventBus) {
             currentApp.eventBus.on('error', (evt: any) => {
               console.error("PDF.js specific error", evt);
               // Don't immediately hide loading, but show reload option
               setShowReload(true);
             });
          }

          // Extract Data (Heading, Outline, Pages)
          if (currentApp && currentApp.pdfDocument) {
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

            // Final sync of page info
            if (currentApp.pagesCount > 0) {
              setTotalPages(currentApp.pagesCount);
              setCurrentPage(currentApp.page || 1);
              setIsLoading(false);
              setShowReload(false);
              
              // If we have listeners AND data, we can stop polling
              if (listenersAttached || attempts > 240) { // Increased timeout (2 mins)
                clearInterval(pollingInterval!);
                pollingInterval = null;
              }
            }
          }
        } catch (e) {
          // Cross-origin or initialization errors - common during early load
          if (attempts > 240) { // Increased timeout (2 mins)
            clearInterval(pollingInterval!);
            pollingInterval = null;
            setShowReload(true);
          }
        }
      }, 500);
    };

    // Start immediately and also on load as a fallback
    startPolling();
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", startPolling);
    }

    return () => {
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (pollingInterval) clearInterval(pollingInterval);
      if (reloadTimer) clearTimeout(reloadTimer);
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
        @keyframes pulse-gentle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .marquee-container {
          overflow: hidden;
          width: 100%;
          white-space: nowrap;
        }
        .marquee-content {
          display: inline-block;
          padding-left: 10%;
          animation: marquee 10s linear infinite;
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* Top Bar: Back Button (Mobile only) */}
      <div className={`md:hidden absolute top-2 md:top-4 left-4 z-50 transition-all duration-500 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-[#2a2a2e] text-white shadow-xl active:scale-95 transition flex items-center justify-center cursor-pointer border border-white/20 hover:bg-white/10"
          title="Go Back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Heading: Centered on Mobile */}
      <div className={`md:hidden absolute top-4 z-50 transition-all duration-500 flex items-center justify-center left-1/2 -translate-x-1/2 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="px-5 py-2 rounded-full bg-[#2a2a2e] border border-white/20 shadow-2xl -mt-1">
          <span className="text-white font-bold text-xs tracking-wide truncate max-w-[45vw] block">
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
    className={`order-1 md:order-0
               p-2 rounded-full bg-[#2a2a2e] text-white shadow-xl
               active:scale-95 transition flex items-center justify-center
               cursor-pointer border border-white/20 hover:bg-white/10`}
    title="Download PDF"
  >
    <Download className="w-6 h-6" />
  </button>

  {/* Topics Button — Mobile only */}
  <button
    onClick={() => setIsDrawerOpen(true)}
    className={`md:hidden p-2 rounded-full bg-[#2a2a2e] text-white shadow-xl
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

      {/* Topics Drawer/Sidebar */}
      <div
  className={`fixed inset-y-0 left-0 z-8000 bg-[#2a2a2e] shadow-2xl
  transition-all duration-500 ease-in-out border-r border-white/10
  ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}

  w-[80vw] max-w-[360px]        /* ✅ MOBILE WIDTH */
  sm:w-[70vw]

  ${isSidebarExpanded ? "md:w-[300px]" : "md:w-[60px] md:overflow-hidden"}
  md:translate-x-0`}
>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Header with Back button and Title for Desktop */}
          <div className={`p-4 border-b border-white/5 bg-white/5 backdrop-blur-md flex flex-col gap-4 ${!isSidebarExpanded && 'md:items-center md:px-2'}`}>
            <div className={`flex items-center ${isSidebarExpanded ? 'gap-3' : 'md:flex-col md:gap-4'} transition-all duration-300`}>
              <button
                onClick={() => router.back()}
                className="p-1.5 rounded-lg bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition flex items-center justify-center cursor-pointer border border-white/10"
                title="Go Back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {isSidebarExpanded && (
                <div className="flex-1 min-w-0 marquee-container mt-0.5">
                  <div className={`${heading.length > 22 ? 'marquee-content pr-[100%]' : ''} font-bold text-white tracking-wide text-sm`}>
                    {heading}
                  </div>
                </div>
              )}

              {/* Toggle / Close Buttons */}
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                  className="hidden md:flex p-1.5 hover:bg-white/10 rounded-lg transition-colors border border-transparent text-white/40 hover:text-white"
                  title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                  {isSidebarExpanded ? <ChevronsLeft className="w-4 h-4" /> : <ChevronsRight className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="md:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors border border-transparent"
                >
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>
            </div>

            {isSidebarExpanded && (
              <div className="flex items-center gap-2 px-1">
                <FileText className="w-4 h-4 text-white/30" />
                <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">Table of Contents</span>
              </div>
            )}
          </div>
          
          <div className={`flex-1 overflow-y-auto custom-scrollbar pt-2 ${!isSidebarExpanded && 'md:hidden'}`}>
            {outline.length > 0 ? (
              itemsRender(outline)
            ) : (
              <div className="p-10 text-center text-white/10">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-5" />
                <p className="text-sm">No topics found.</p>
              </div>
            )}
          </div>

          <div className={`p-4 bg-white/5 border-t border-white/5 flex items-center justify-center ${!isSidebarExpanded ? 'md:px-2' : ''}`}>
            <div className={`flex ${isSidebarExpanded ? 'items-center gap-1' : 'flex-col items-center'} text-center`}>
              <span className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-medium leading-tight">Tansi</span>
              <span className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-medium leading-tight">Honda</span>
              <span className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-medium leading-tight">Digital</span>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-90 transition-opacity duration-500"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* PDF viewer */}
      <iframe
        key={pdfName}
        ref={iframeRef}
        src={`/pdfjs/web/viewer.html?file=${encodeURIComponent(proxyUrl)}#pagemode=none`}
        className={`absolute inset-y-0 right-0 h-full border-none z-0 transition-all duration-500 
          ${isSidebarExpanded ? "w-full md:w-[calc(100%-320px)]" : "w-full md:w-[calc(100%-60px)]"}`}
        title="PDF Viewer"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#2a2a2e] flex flex-col items-center justify-center backdrop-blur-sm gap-4">
          <div className="relative">
            <Loader2 className="w-10 h-10 text-white/20 animate-spin" />
          </div>
          <p className="text-white/50 text-sm animate-pulse">Loading Document...</p>
          
          {showReload && (
            <button
              onClick={handleReload}
              className="mt-4 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all border border-white/10 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Reload Viewer
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 70%; transform: translateX(20%); }
          100% { width: 100%; transform: translateX(110%); }
        }
      `}</style>
    </div>
  );
}