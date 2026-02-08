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
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start pt-[12vh] md:pt-[14vh] pb-8 px-8 md:px-4">
          
          {/* Tansi Honda Header */}
          <div className="relative w-full max-w-[500px] md:max-w-[600px] h-[100px] md:h-[160px] mb-6 md:mb-10">
            <Image src="/contacts/Tansi Honda.png" alt="Tansi Honda" fill className="object-contain" />
          </div>

          {/* Sales Badge */}
          <div className="relative w-[300px] md:w-[400px] h-[65px] md:h-[70px] mb-6 md:mb-10">
            <Image src="/contacts/Sale.png" alt="Sales" fill className="object-contain" />
          </div>

          {/* Location Contacts - Mobile: 1 column, Desktop: 2 columns */}
          <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-12 mb-6 md:mb-10">
            <Link href="tel:7259030091" className="relative w-full h-[60px] md:h-[80px] hover:scale-105 transition-transform">
              <Image src="/contacts/Hoodi.png" alt="Hoodi - Call 7259030091" fill className="object-contain" />
            </Link>
            <Link href="tel:9686573013" className="relative w-full h-[60px] md:h-[80px] hover:scale-105 transition-transform">
              <Image src="/contacts/Whitefield1.png" alt="Whitefield - Call 9686573013" fill className="object-contain" />
            </Link>
            <Link href="tel:7259030100" className="relative w-full h-[60px] md:h-[80px] hover:scale-105 transition-transform">
              <Image src="/contacts/Marathahalli.png" alt="Marathahalli - Call 7259030100" fill className="object-contain" />
            </Link>
            <Link href="tel:8971221818" className="relative w-full h-[60px] md:h-[80px] hover:scale-105 transition-transform">
              <Image src="/contacts/Seegehalli.png" alt="Seegehalli - Call 8971221818" fill className="object-contain" />
            </Link>
            <Link href="tel:9606450642" className="relative w-full h-[60px] md:h-[80px] hover:scale-105 transition-transform">
              <Image src="/contacts/Gunjur.png" alt="Gunjur - Call 9606450642" fill className="object-contain" />
            </Link>
            <Link href="tel:6364741741" className="relative w-full h-[60px] md:h-[80px] hover:scale-105 transition-transform">
              <Image src="/contacts/Panathur.png" alt="Panathur - Call 6364741741" fill className="object-contain" />
            </Link>
          </div>

          {/* Service Badge */}
          <div className="relative w-[300px] md:w-[400px] h-[65px] md:h-[70px] mb-5 md:mb-8">
            <Image src="/contacts/Service.png" alt="Service" fill className="object-contain" />
          </div>

          {/* Service Number */}
          <Link href="tel:18005329444" className="relative w-full max-w-[350px] md:max-w-[400px] h-[70px] md:h-[90px] mb-6 md:mb-10 hover:scale-105 transition-transform">
            <Image src="/contacts/number.png" alt="Service Number - Call 1800 532 9444" fill className="object-contain" />
          </Link>

          {/* White Line */}
          <div className="relative w-full max-w-[400px] md:max-w-[500px] h-[20px] mb-5 md:mb-8">
            <Image src="/contacts/White line.png" alt="Divider" fill className="object-contain" />
          </div>

          {/* Tansi Footer Info - Clickable Email and Website */}
          <div className="relative w-full max-w-[400px] md:max-w-[500px] flex flex-col items-center gap-3">
            <Link 
              href="mailto:customercare@tansihonda.com" 
              className="text-white text-base md:text-lg hover:scale-105 transition-transform"
            >
              E-mail: customercare@tansihonda.com
            </Link>
            <Link 
              href="https://www.tansihonda.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-xl md:text-2xl font-bold hover:scale-105 transition-transform"
            >
              www.tansihonda.com
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}