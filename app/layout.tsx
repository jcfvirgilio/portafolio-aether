import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AETHER® — Immersive Digital Experiences",
  description:
    "A concept portfolio about worlds that make the digital feel human. An original immersive WebGL experience built with Next.js, Three.js and GSAP.",
  openGraph: {
    title: "AETHER® — Beyond the Interface",
    description: "An original immersive creative-development portfolio concept.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a080d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
