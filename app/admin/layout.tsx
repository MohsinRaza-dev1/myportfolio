"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Allow access to login page without auth
    if (pathname === "/admin/login") return;

    const authed = sessionStorage.getItem("admin_authenticated");
    if (authed !== "true") {
      router.replace("/admin/login");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
