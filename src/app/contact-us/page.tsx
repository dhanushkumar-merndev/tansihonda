import Image from "next/image";
import Link from "next/link";

export default function Scooter() {
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
              { img: "/E.png", alt: "EV Image 1" },
              { img: "/q.png", alt: "EV Image 2" },
              { img: "/E.png", alt: "EV Image 3" },
              { img: "/q.png", alt: "EV Image 4" },
            ].map((card, i) => (
              <div
                key={i}
                className="relative
                           w-[85vw] sm:w-[70vw] md:w-[38vw] lg:w-[420px]
                           h-[22vh] sm:h-[24vh] md:h-[240px] lg:h-[280px]
                           bg-white rounded-xl shadow-xl overflow-hidden"
              >
                {/* Main Image */}
                <Image
                  src={card.img}
                  alt={card.alt}
                  fill
                  className="object-contain scale-90"
                />

                {/* Bottom-right clickable icon */}
                <button
                  className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white shadow-md
                             flex items-center justify-center
                             hover:scale-105 transition"
                >
                  <Image src="/click.svg" alt="Open" width={18} height={18} />
                </button>
              </div>
            ))}

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