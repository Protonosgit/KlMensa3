import localFont from "next/font/local";
import "./globals.css";
import AnnouncementModal from "@/components/announcements";

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
  title: "KLMensa",
  description: "Kl mensa v3 - See what's on the menu",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <AnnouncementModal />
      </body>
    </html>
  );
}
