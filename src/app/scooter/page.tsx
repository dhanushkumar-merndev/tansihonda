"use client";

import Image from "next/image";
import Link from "next/link";
import { usePdfPrefetch } from "@/hooks/use-pdf-prefetch";

export default function Scooter() {
  const { prefetch, cancelPrefetch } = usePdfPrefetch();

  return (
    <div className="min-h-screen bg-white">
      <div className="relative flex flex-col min-h-screen bg-[#E31E24]">

        {/* TOP WHITE AREA */}
        <div className="absolute top-0 left-0 w-full h-[8vh] md:h-[10vh] bg-white overflow-hidden z-10">
          <Link href="/" className="absolute top-2 right-4 w-[120px] md:w-[180px] h-full">
            <Image
              src="/logo.svg"
              alt="Logo"
              fill
              className="object-contain scale-200 -mt-2 object-top"
              sizes="(max-width: 768px) 120px, 180px"
              priority
            />
          </Link>
        </div>

        <div className={`pointer-events-none absolute top-[8vh] md:top-[10vh] left-0 w-full h-6
          bg-linear-to-b from-white via-[#E31E24]/90 to-[#E31E24]
          backdrop-blur-md z-10`}
        /> 

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 
                          place-items-center px-4 py-6 
                          mt-[12vh] md:mt-[10vh] `}>

            {/* CARD TEMPLATE */}
            {[
              { img: "/scooter/dio110.png", alt: "dio110" },
              { img: "/scooter/activa110.png", alt: "activa110" },
              { img: "/scooter/activa125.png", alt: "activa125" },
              { img: "/scooter/dio125.png", alt: "dio125" },
            ].map((card, i) => {
              const pdfPath = `pdf/scooter/${`honda-${card.alt.replace(/\s+/g, '_')}.pdf`}`;
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

          </div>
        </div>

        {/* FOOTER — ALWAYS AT BOTTOM */}
        <footer className="w-full h-[10vh] flex items-center justify-center bg-[#E31E24] md:-mt-20 md:mb-8">
          <div className="relative w-[20vh] sm:w-[30vh] h-full">
            <Image
              src="/th.svg"
              alt="Tansi Honda Footer Logo"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 20vh, 30vh"
              priority
            />
          </div>
        </footer>

      </div>
    </div>
  );
}
