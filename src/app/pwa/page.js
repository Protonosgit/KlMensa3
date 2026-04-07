"use client"
import Link from "next/link";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import shared from "@/styles/shared_page.module.css"


export default function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [platform, setPlatform] = useState("");

    useEffect(() => {
      const userAgent = window.navigator.userAgent.toLowerCase();

      if (/android/.test(userAgent)) setPlatform("android");
      else if (/iphone|ipad|ipod/.test(userAgent)) setPlatform("ios");
      else setPlatform("desktop");

      const handler = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener("beforeinstallprompt", handler);

      return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
      if (!deferredPrompt) return;

      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log("User response:", outcome);
      setDeferredPrompt(null);
    };

    const renderInstructions = () => {
      switch (platform) {
        case "android":
          return <p>Tap "Install" or use browser menu → Add to Home Screen.</p>;
        case "ios":
          return <p>Tap Share → "Add to Home Screen".</p>;
        default:
          return <p>Use browser install button in address bar.</p>;
      }
    };  



  return (
    <div className={shared.container}>
      <header className={shared.headerContainer}>
        <div className={shared.headerWrapper}>
          <div className={shared.headerContent}>
            <Link href={"/"} className={shared.headerTitleSection}>
              <h1 className={shared.headerTitle}>Mensa KL</h1>
              <h2 className={shared.headerSubtitle}>Mensaplan der Rheinland-Pfälzischen Technischen Universität in Kaiserslautern</h2>
            </Link>
          </div>
        </div>
      </header>

      <main className={shared.main}>
    <div style={{ padding: 20 }}>
      <h1>Install App</h1>

      {deferredPrompt ? (
        <button onClick={handleInstall}>Install App</button>
      ) : (
        renderInstructions()
      )}
    </div>

      </main>
    </div>
  )
}