"use client";

import Image from "next/image";

const images = [
  // Scooters
  "/scooter/dio110.webp",
  "/scooter/activa110.webp",
  "/scooter/activa125.webp",
  "/scooter/dio125.webp",
  
  // Motorcycles
  "/motorcycle/cb125hornet.webp",
  "/motorcycle/Hornet2.0.webp",
  "/motorcycle/livo.webp",
  "/motorcycle/nx200.webp",
  "/motorcycle/shine100.webp",
  "/motorcycle/shine100dx.webp",
  "/motorcycle/shine125.webp",
  "/motorcycle/sp125.webp",
  "/motorcycle/sp160.webp",
  "/motorcycle/unicorn.webp",

  // EVs
  "/ev/E.webp",
  "/ev/q.webp",

  // Static Content (Logos, Icons, SVGs)
  "/logo.svg",
  "/th.svg",
  "/click.svg",
  "/ev/EV Honda.svg",

  // Contacts
  "/contacts/Gunjur.webp",
  "/contacts/Hoodi.webp",
  "/contacts/Marathahalli.webp",
  "/contacts/Panathur.webp",
  "/contacts/Sale.webp",
  "/contacts/Seegehalli.webp",
  "/contacts/Service.webp",
  "/contacts/Tansi Honda.webp",
  "/contacts/White line.webp",
  "/contacts/Whitefield1.webp",
  "/contacts/number.webp",
  "/contacts/tansi.webp",

  // Big Wing
  "/bw/cb350.webp",
  "/bw/cb350hness.webp",
  "/bw/cb350rs.webp",
  "/bw/cbr650r.webp",
  "/bw/nx200.webp",

];

export function ImagePreloader() {
  return (
    <div className="hidden">
      {images.map((src) => (
        <div key={src} className="relative w-10 h-10"> {/* Container for fill */}
            <Image
            src={src}
            alt="preload"
            fill
            priority={true}
            sizes="(max-width: 640px) 85vw, (max-width: 768px) 70vw, (max-width: 1024px) 38vw, 420px"
            />
        </div>
      ))}
    </div>
  );
}
