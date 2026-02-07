"use client";

import Image from "next/image";
import Link from "next/link";
import { usePdfPrefetch } from "@/hooks/use-pdf-prefetch";

export default function Scooter() {
  const { prefetch } = usePdfPrefetch();

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
              priority
            />
          </Link>
        </div>

        <div className="pointer-events-none absolute top-[8vh] md:top-[10vh] left-0 w-full h-6
          bg-linear-to-b from-white via-[#E31E24]/90 to-[#E31E24]
          backdrop-blur-md z-10"
        /> 

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 
                          place-items-center px-4 py-6 
                          mt-[12vh] md:mt-[10vh] ">

            {/* CARD TEMPLATE */}
            {[
              { img: "/dio110.png", alt: "Dio 110" },
              { img: "/activa110.png", alt: "Activa 110" },
              { img: "/activa125.png", alt: "Activa 125" },
              { img: "/dio125.png", alt: "Dio 125" },
            ].map((card, i) => {
              const pdfPath = `${card.alt.replace(/\s+/g, '_')}.pdf`;
              return (
              <Link
                key={i}
                href={`/pdf/${pdfPath}`}
                onMouseEnter={() => prefetch(pdfPath)}
                className="relative group
                           w-[85vw] sm:w-[70vw] md:w-[38vw] lg:w-[420px]
                           h-[22vh] sm:h-[24vh] md:h-[240px] lg:h-[280px]
                           bg-white rounded-xl shadow-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300"
              >
                {/* Main Image */}
                <Image
                  src={card.img}
                  alt={card.alt}
                  fill
                  className="object-contain scale-90 group-hover:scale-95 transition-transform duration-500"
                />

                {/* Bottom-right clickable icon */}
                <div
                  className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white shadow-lg
                             flex items-center justify-center group-hover:bg-red-50 transition-colors"
                >
                  <Image src="/click.svg" alt="Open" width={20} height={20} />
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
              priority
            />
          </div>
        </footer>

      </div>
    </div>
  );
}
