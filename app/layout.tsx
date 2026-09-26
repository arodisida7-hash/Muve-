import type { Metadata } from "next";
import "./globals.css";
import "./premium.css";
import "./studio.css";

export const metadata: Metadata = {
  title: "MUVETHERAPY | Clínica y rendimiento",
  description: "Plataforma clínica y de rendimiento para fisioterapia deportiva.",
  icons: { icon: "/Muve-/favicon.svg", shortcut: "/Muve-/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
