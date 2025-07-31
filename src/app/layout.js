import localFont from "next/font/local";
import "./globals.css";
import AnnouncementModal from "@/components/announcements";
import { cookies } from "next/headers";
import Head from "next/head";


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
  description: "",
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
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} key="desc" />
        <meta property="og:title" content={metadata.title} />
        <meta
          property="og:description"
          content={metadata.description}
        />
        <meta
          property="og:image"
          content="https://kl-mensa.vercel.app/logo.png"
        />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <AnnouncementModal />
      </body>
    </html>
  );
}

