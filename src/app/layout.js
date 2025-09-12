import localFont from "next/font/local";
import "./globals.css";
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
  title: "Mensa-KL - Der Mensaplan der RPTU in Kaiserslautern / Landau",
  description: "Mensa KL ermöglicht das einsehen des aktuellen Speiseplans der RPTU, sowie das abgeben von Bewertungen und Bildern zu Mahlzeiten",
};

export default async function RootLayout({ children }) {
  let settings;
  const cookieStore = await cookies();
  const settingsCookie = cookieStore.get('settings') || null;
  if(settingsCookie?.value) {
    settings = JSON.parse(settingsCookie.value);
  }

  return (
    <html lang="de" data-theme={settings?.dark ? "dark" : "light"} data-layout={settings?.layout} data-eyedef={settings?.eyedef}>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} key="desc" />
         <meta name="keywords" content="Mensa, RPTU, Kaiserslautern, Technische, Universitaet, Mensaplan, Essen, Studenten, mensa kl, Tu, Uni" />
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
      </body>
    </html>
  );
}

