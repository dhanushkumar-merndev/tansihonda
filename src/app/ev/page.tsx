"use client";

import Image from "next/image";
import Link from "next/link";
import { usePdfPrefetch } from "@/hooks/use-pdf-prefetch";

export default function Ev() {
  const { prefetch, cancelPrefetch } = usePdfPrefetch();

  return (
    <div className="min-h-dvh bg-white">
      <div className="relative flex flex-col min-h-dvh bg-[#0072BA]">

        {/* TOP WHITE AREA */}
        <div className="absolute top-0 left-0 w-full h-[12dvh] bg-white z-10">
          <Link href="/" className="relative w-full h-full block">
            <Image
              src="/ev/EV Honda.svg"
              alt="Logo"
              fill
              className="object-contain scale-80 mt-7 md:scale-45 md:mt-0 object-top"
              priority
            />
          </Link>
        </div>

        {/* GRADIENT DIVIDER */}
        <div
          className="pointer-events-none absolute top-[12dvh] left-0 w-full h-6
          bg-linear-to-b from-white via-[#0072BA]/90 to-[#0072BA]
          backdrop-blur-md z-10"
        />

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center pt-[14dvh] md:pt-0">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center
                       px-4 py-6"
          >
            {/* CARD 1 */}
            <Link
              href="/pdf/ev/honda-activa-e.pdf"
              onMouseEnter={() => prefetch("ev/honda-activa-e.pdf")}
              onMouseLeave={cancelPrefetch}
              className="relative w-[85vw] md:w-[45vw] max-w-[600px]
                         h-[30dvh] lg:h-[360px]
                         bg-white rounded-2xl shadow-2xl overflow-hidden group
                         transition-transform duration-300"
            >
              <Image
                src="/ev/E.png"
                alt="Honda Activa Electric"
                fill
                className="object-contain mt-1 scale-80 lg:scale-95
                           group-hover:scale-100 transition-transform duration-500"
                sizes="(max-width: 768px) 85vw, 45vw"
                priority
              />

              <div
                className="absolute bottom-0 right-0 w-12 h-12 rounded-full
                           flex items-center justify-center"
              >
                <Image src="/click.svg" alt="Open" width={24} height={24} className="w-6 h-6" />
              </div>
            </Link>

            {/* CARD 2 */}
            <Link
              href="/pdf/ev/honda-qc1.pdf"
              onMouseEnter={() => prefetch("ev/honda-qc1.pdf")}
              onMouseLeave={cancelPrefetch}
              className="relative w-[85vw] md:w-[45vw] max-w-[600px]
                         h-[30dvh] lg:h-[360px]
                         bg-white rounded-2xl shadow-2xl overflow-hidden group
                         transition-transform duration-300"
            >
              <Image
                src="/ev/q.png"
                alt="Honda EM1 e:"
                fill
                className="object-contain scale-80 lg:scale-95
                           group-hover:scale-100 transition-transform duration-500"
                sizes="(max-width: 768px) 85vw, 45vw"
                priority={true}
              />

              <div
                className="absolute bottom-0 right-0 w-12 h-12 rounded-full
                           flex items-center justify-center"
              >
                <Image src="/click.svg" alt="Open" width={24} height={24} className="w-6 h-6" />
              </div>
            </Link>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="w-full h-20 md:h-24 flex items-center justify-center bg-[#0072BA] -mt-10 mb-5 md:-mt-36 md:mb-20">
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
