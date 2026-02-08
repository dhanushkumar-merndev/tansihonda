import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ImagePreloader } from "@/components/ImagePreloader";

export default function Home() {
  const redOutlineBtn =
    "w-full md:w-sm md:h-20 h-14 text-lg font-medium text-red-600 " +
    "border-red-600/40 " +
    "hover:bg-red-600 hover:text-white hover:border-red-600 " +
    "hover:ring-1 hover:ring-red-600/30 " +
    "transition-all duration-300 ease-in-out";

  const blueOutlineBtn =
    "w-full md:w-sm md:h-20 h-14 text-lg font-medium " +
    "text-[#0072BA] border-[#0072BA]/40 " +
    "hover:bg-[#0072BA] hover:text-white hover:border-[#0072BA] " +
    "hover:ring-1 hover:ring-[#0072BA]/30 " +
    "transition-all duration-300 ease-in-out";

  return (
   <div className="flex min-h-dvh items-center justify-center bg-zinc-50 -mt-[4vh]">
      <ImagePreloader />
      <div className="flex flex-col items-center justify-center">

        {/* Logo */}
        <div className="w-[100px] h-[100px] relative  mb-10">
          <Image
            src="/logo.svg"
            alt="Logo"
            fill
            className="object-cover scale-200 object-top"
            priority
          />
        </div>

        {/* Title */}
        <p className="text-center text-3xl font-semibold text-red-600/80 mt-2 ">
          Tansi Honda
        </p>

        {/* Subtitle */}
        <p className="text-center text-md text-muted-foreground mt-2 ">
          Vehicle&apos;s Digital Manual
        </p>

        {/* Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 w-sm md:w-full ">
          <Link href="/ev">
            <Button variant="outline" className={blueOutlineBtn} size="lg">
              EV
            </Button>
          </Link>
          <Link href="/scooter">
          <Button variant="outline" className={redOutlineBtn} size="lg">
            Scooter
          </Button>
          </Link>

          <Link href="/motorcycle">
          <Button variant="outline" className={redOutlineBtn} size="lg">
            Motorcycle
          </Button>
          </Link>

          <Link href="/contact-us">
          <Button variant="outline" className={redOutlineBtn} size="lg">
            Contact Us
          </Button>
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-sm text-gray-500 mt-4 ">
          © {new Date().getFullYear()} Tansi Honda. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
