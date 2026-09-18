import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muve Biomecánica | Demo",
  description: "Demo de plataforma clínica para evaluación biomecánica y seguimiento fisioterapéutico.",
  icons: {
    icon: "/Muve-/favicon.svg",
    shortcut: "/Muve-/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
