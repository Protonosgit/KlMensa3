import localFont from "next/font/local";
import "./globals.css";
import AnnouncementModal from "@/components/announcements";
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
  title: "KL-Mensa - Der Mensaplan der RPTU in Kaiserslautern / Landau",
  description: "Kl Mensa 3 ermöglicht das einsehen des Speiseplans, sowie das abgeben von Bewertungen und Bildern zu Mahlzeiten",
};

export default async function RootLayout({ children }) {
  let settings;
  const cookieStore = await cookies();
  const settingsCookie = cookieStore.get('settings') || null;
  if(settingsCookie?.value) {
    settings = JSON.parse(settingsCookie.value);
  }

  return (
    <html lang="en" data-theme={settings?.dark ? "dark" : "light"}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <AnnouncementModal />
      </body>
    </html>
  );
}

