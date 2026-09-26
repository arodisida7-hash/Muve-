import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono";
import "./lab.css";

export const metadata: Metadata = {
  title: "MUVETHERAPY | Performance OS",
  description: "Plataforma clínica y de rendimiento para fisioterapia deportiva.",
  icons: { icon: "/Muve-/favicon.svg", shortcut: "/Muve-/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
