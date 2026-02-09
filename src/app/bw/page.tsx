"use client";

import Image from "next/image";
import Link from "next/link";
import { usePdfPrefetch } from "@/hooks/use-pdf-prefetch";
import { useState } from "react";
import { Phone } from "lucide-react";

export default function Scooter() {
  const { prefetch, cancelPrefetch } = usePdfPrefetch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="relative flex flex-col min-h-screen bg-black">

        {/* TOP WHITE AREA */}
        <div className="absolute top-0 left-0 w-full h-[8vh] md:h-[10vh] bg-black overflow-hidden z-10 mt-3">
          <Link href="https://www.tansihonda.com/bigwing-en-in.htm" className="absolute top-4 right-0 w-[120px] md:w-[180px] h-full">
            <Image
              src="/bw/logo.webp"
              alt="Logo"
              fill
              className="object-contain scale-80 -mt-2 object-top"
              sizes="(max-width: 768px) 120px, 180px"
              priority
            />
          </Link>
        </div>


        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center md:mt-6 lg:-mt-15">
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 
                          px-4 py-6 
                          mt-[12vh] md:mt-[10vh]`}
                          style={{ justifyItems: 'center' }}>

            {/* CARD TEMPLATE */}
            {[
             { img: "/bw/nx200.webp", alt: "nx200" },
              { img: "/bw/cb350.webp", alt: "cb350" },
              { img: "/bw/cb350hness.webp", alt: "cb350hness" },
              { img: "/bw/cb350rs.webp", alt: "cb350rs" },
              { img: "/bw/cbr650r.webp", alt: "cbr650r" },
             
            ].map((card, i) => {
              const pdfPath = `pdf/bw/${`honda-${card.alt.replace(/\s+/g, '_')}.pdf`}`;
              return (
              <Link
                  key={i}
                  href={`/pdf/${pdfPath.replace('pdf/', '')}`}
                  onMouseEnter={() => prefetch(pdfPath.replace('pdf/', 'docs/'))}
                  onMouseLeave={cancelPrefetch}
                  className={`relative group
                           w-[85vw] sm:w-[70vw] md:w-[38vw] lg:w-[420px]
                           h-[22vh] sm:h-[24vh] md:h-[240px] lg:h-[280px]
                           bg-white rounded-xl shadow-xl overflow-hidden `}
              >
                {/* Main Image */}  
                <Image
                  src={card.img}
                  alt={card.alt}
                  fill
                  className="object-contain scale-90 group-hover:scale-95 transition-transform duration-500"
                  sizes="(max-width: 640px) 85vw, (max-width: 768px) 70vw, (max-width: 1024px) 38vw, 420px"
                  priority={true}
                />

                {/* Bottom-right clickable icon */}
                <div
                  className="absolute bottom-0 right-0 w-12 h-12 rounded-full
                             flex items-center justify-center"
                >
                  <Image src="/click.svg" alt="Open" width={24} height={24} className="w-6 h-6" />
                </div>
              </Link>
              );
            })}

            {/* CONTACT CARD */}
            <button
              onClick={() => setIsModalOpen(true)}
              className={`relative group
                       w-[85vw] sm:w-[70vw] md:w-[38vw] lg:w-[420px]
                       h-[22vh] sm:h-[24vh] md:h-[240px] lg:h-[280px]
                       bg-black rounded-xl shadow-xl overflow-hidden 
                       flex items-center justify-center cursor-pointer
                       border border-white
                       `}
            >
              <div className="text-center flex flex-col items-center mt-3">
                <div className="text-4xl mb-2 border-2 border-white  p-2 rounded-full "><Phone fill="#fff"  className="w-5 h-5 text-white"/></div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Contact Us</h3>
              </div>
            </button>

          </div>
        </div>

        {/* FOOTER — ALWAYS AT BOTTOM */}
        <footer className="w-full h-[10vh] flex items-center justify-center bg-black lg:-mt-20 lg:mb-8">
          <Link href="https://www.tansihonda.com/bigwing-en-in.htm" className="relative w-[90vh] h-full">
            <Image
              src="/bw/footer.webp"
              alt="Tansi Honda Footer Logo"
              fill
              className="object-contain"
              priority
            />
          </Link>
        </footer>

        {/* CONTACT MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-1000 bg-black/80 flex items-center justify-center" onClick={() => setIsModalOpen(false)}>
            <div className="bg-[#111] text-white p-6 md:p-8 rounded-xl w-[80%] max-w-[400px] max-h-[80vh] overflow-y-auto shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
              <div className=" flex justify-center items-center mb-4">
                <h2 className="text-xl font-bold">Contact Numbers</h2>
               
              </div>
               <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-5 text-2xl hover:text-red-500 transition-colors">
                  ×
                </button>
              <h5 className="text-xs text-center mb-4 text-gray-400">(Click to Call)</h5>

              <h3 className="text-base font-semibold mt-4 mb-2">Sales</h3>
              <ul className="list-none p-0 mb-4 space-y-2">
                <li>
                  <a href="tel:+919071071112" className="block p-3 rounded-md bg-[#222] hover:bg-white hover:text-black transition-colors">
                    +91 90710 71112
                  </a>
                </li>
                <li>
                  <a href="tel:+919071071114" className="block p-3 rounded-md bg-[#222] hover:bg-white hover:text-black transition-colors">
                    +91 90710 71114
                  </a>
                </li>
                <li>
                  <a href="tel:+919071071116" className="block p-3 rounded-md bg-[#222] hover:bg-white hover:text-black transition-colors">
                    +91 90710 71116
                  </a>
                </li>
              </ul>

              <h3 className="text-base font-semibold mt-4 mb-2">Service</h3>
              <ul className="list-none p-0 mb-4 space-y-2">
                <li>
                  <a href="tel:+919071371117" className="block p-3 rounded-md bg-[#222] hover:bg-white hover:text-black transition-colors">
                    +91 90713 71117
                  </a>
                </li>
                <li>
                  <a href="tel:+919071371118" className="block p-3 rounded-md bg-[#222] hover:bg-white hover:text-black transition-colors">
                    +91 90713 71118
                  </a>
                </li>
              </ul>

              <h3 className="text-base font-semibold mt-4 mb-2">Helpline</h3>
              <ul className="list-none p-0 mb-4 space-y-2">
                <li>
                  <a href="tel:18001230365" className="block p-3 rounded-md bg-[#222] hover:bg-white hover:text-black transition-colors">
                    1800 123 0365
                  </a>
                </li>
              </ul>

              <h3 className="text-base font-semibold mt-4 mb-2">Email</h3>
              <ul className="list-none p-0 mb-4 space-y-2">
                <li>
                  <a href="mailto:customercare@tansihondabigwing.com" className="block p-3 rounded-md bg-[#222] hover:bg-white hover:text-black transition-colors break-all">
                    customercare@tansihondabigwing.com
                  </a>
                </li>
              </ul>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}