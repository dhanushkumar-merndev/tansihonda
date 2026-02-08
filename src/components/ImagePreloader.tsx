"use client";

import Image from "next/image";

const images = [
  // Scooters
  "/scooter/dio110.png",
  "/scooter/activa110.png",
  "/scooter/activa125.png",
  "/scooter/dio125.png",
  
  // Motorcycles
  "/motorcycle/cb125hornet.png",
  "/motorcycle/Hornet2.0.png",
  "/motorcycle/livo.png",
  "/motorcycle/nx200.png",
  "/motorcycle/shine100.png",
  "/motorcycle/shine100dx.png",
  "/motorcycle/shine125.png",
  "/motorcycle/sp125.png",
  "/motorcycle/sp160.png",
  "/motorcycle/unicorn.png",

  // EVs
  "/ev/E.png",
  "/ev/q.png",

  // Static Content (Logos, Icons, SVGs)
  "/logo.svg",
  "/th.svg",
  "/click.svg",
  "/ev/EV Honda.svg",

  // Contacts
  "/contacts/Gunjur.png",
  "/contacts/Hoodi.png",
  "/contacts/Marathahalli.png",
  "/contacts/Panathur.png",
  "/contacts/Sale.png",
  "/contacts/Seegehalli.png",
  "/contacts/Service.png",
  "/contacts/Tansi Honda.png",
  "/contacts/White line.png",
  "/contacts/Whitefield1.png",
  "/contacts/number.png",
  "/contacts/tansi.png"
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
