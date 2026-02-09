"use client";

import Image from "next/image";
import Link from "next/link";
import { usePdfPrefetch } from "@/hooks/use-pdf-prefetch";

export default function Motorcycle() {
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
          <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5
                          gap-4 md:gap-5 lg:gap-6 
                          place-items-center px-4 py-6 
                          mt-[12vh] md:mt-[10vh] `}>

            {/* CARD TEMPLATE */}
            {[
              { img: "/motorcycle/shine100.webp", alt: "shine100" },
              { img: "/motorcycle/shine100dx.webp", alt: "shine100-dx" },
              { img: "/motorcycle/livo.webp", alt: "livo" },
              { img: "/motorcycle/shine125.webp", alt: "shine125" },
              { img: "/motorcycle/sp125.webp", alt: "sp125" },
              { img: "/motorcycle/cb125hornet.webp", alt: "cb125hornet" },
              { img: "/motorcycle/unicorn.webp", alt: "unicorn" },
              { img: "/motorcycle/sp160.webp", alt: "sp160" },
              { img: "/motorcycle/nx200.webp", alt: "nx200" },
              { img: "/motorcycle/Hornet2.0.webp", alt: "hornet2.0" },
            ].map((card, i) => {
              const pdfPath = `pdf/motorcycle/${`honda-${card.alt}`}.pdf`;
              return (
              <Link
                  key={i}
                  href={`/pdf/${pdfPath.replace('pdf/', '')}`}
                  onMouseEnter={() => prefetch(pdfPath.replace('pdf/', 'docs/'))}
                  className={`relative group
                           w-[85vw] md:w-[28vw] lg:w-[17vw]
                           h-[22vh] md:h-[24vh] lg:h-[240px]
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
        <footer className="w-full h-[10vh] flex items-center justify-center bg-[#E31E24] lg:-mt-20 lg:mb-8">
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


