import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono";
import "./product.css";

export const metadata: Metadata = { title:"MUVETHERAPY | Clinical Performance", description:"Plataforma clínica y de rendimiento deportivo" };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
