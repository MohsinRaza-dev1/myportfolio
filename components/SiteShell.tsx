"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import AccentColorPicker from "@/components/theme/AccentColorPicker";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Preloader />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <AccentColorPicker />
    </>
  );
}
