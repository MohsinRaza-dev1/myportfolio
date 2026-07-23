import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohsin Raza | Software Engineer & Full Stack AI Developer",
  description:
    "Professional portfolio of Mohsin Raza, a Software Engineer and Full Stack AI Developer specializing in Python, FastAPI, Generative AI, LLMs, modern web applications, and intelligent automation.",
  keywords: [
    "Mohsin Raza",
    "Software Engineer",
    "Full Stack Developer",
    "AI Developer",
    "Python Developer",
    "FastAPI",
    "Generative AI",
    "Portfolio",
  ],
  authors: [{ name: "Mohsin Raza" }],
  openGraph: {
    title: "Mohsin Raza | Software Engineer & Full Stack AI Developer",
    description:
      "Professional portfolio of Mohsin Raza, a Software Engineer and Full Stack AI Developer specializing in Python, FastAPI, Generative AI, and modern web applications.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohsin Raza | Software Engineer & Full Stack AI Developer",
    description:
      "Professional portfolio of Mohsin Raza, a Software Engineer and Full Stack AI Developer specializing in Python, FastAPI, Generative AI, and modern web applications.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans`}>
        <Preloader />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
