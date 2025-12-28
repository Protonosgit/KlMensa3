import localFont from "next/font/local";
import "./globals.css";
import { cookies } from "next/headers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Mensa-KL - Der Mensaplan der RPTU in Kaiserslautern / Landau",
  description: "Mensa KL ermöglicht das einsehen des aktuellen Speiseplans der RPTU, sowie das abgeben von Bewertungen und Bildern zu Mahlzeiten",
  keywords: ["Mensa","RPTU","Kaiserslautern","Speiseplan","Uni"],
  openGraph: {
    title: "Mensa-KL",
    description: "Mensa KL ermöglicht das einsehen des aktuellen Speiseplans der RPTU, sowie das abgeben von Bewertungen und Bildern zu Mahlzeiten",
    images: [`${process.env.NEXT_PUBLIC_CURRENT_DOMAIN}/logo.png`],
    site_name: "Mensa-KL",
    url: process.env.NEXT_PUBLIC_CURRENT_DOMAIN,
  },
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies()
  const settingsCookie = cookieStore.get('settings')
  const settings = settingsCookie?.value ? JSON.parse(settingsCookie.value) : {}

  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body data-theme={settings.dark ? "dark" : "light"} data-layout={settings.layout} data-eyedef={settings.eyedef}>
        {children}
      </body>
    </html>
  )
}