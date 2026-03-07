import Link from "next/link";
import Image from "next/image"; // 1. Import the Image component

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex w-full h-20 items-center justify-between px-6 bg-black">
      
      {/* 2. Replace the text with the Image component */}
      <Link href="/">
        <Image 
          src="/ZeugUndKramFlach.png" 
          alt="Zeug Und Kram Logo" 
          width={150}  // Adjust based on your logo's needs
          height={50}  // Keep the aspect ratio consistent
          className="h-12 w-auto" // Control size via Tailwind
        />
      </Link>

      <nav className="flex gap-6">
        <Link href="/creations" className="text-2xl text-white hover:underline">Creations</Link>
        <Link href="/socials" className="text-2xl text-white hover:underline">Socials</Link>
      </nav>
    </header>
  );
}