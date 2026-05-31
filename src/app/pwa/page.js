"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import shared from "@/styles/shared_page.module.css";
import { ArrowDownToLine } from "lucide-react";
import Icon from "../../../public/icons/Icon.svg";

export default function InstallPWA() {
  const [platform, setPlatform] = useState(null);
  const [browser, setBrowser] = useState(null);
  const [prompt, setPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    const ua = window.navigator.userAgent.toLowerCase();
    let os = "unknown";
    let engine = "unknown";

    if (ua.includes("windows")) {
      os = "windows";
    } else if (ua.includes("android")) {
      os = "android";
    } else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
      os = "ios";
    } else if (ua.includes("macintosh")) {
      os = "macos";
    } else if (ua.includes("linux") && !ua.includes("android") && !ua.includes("cros")) {
      os = "linux";
    }

    if (/gecko\/\d+/i.test(ua) && /firefox/i.test(ua)) {
      engine = "gecko";
    } else if (
      /applewebkit/i.test(ua) &&
      !/chrome|crios|crmo|edg|opr/i.test(ua)
    ) {
      engine = "safari";
    } else if (/chrome|crios|crmo|edg|opr/i.test(ua)) {
      engine = "chromium";
    }

    console.log(os, engine);
    setPlatform(os);
    setBrowser(engine);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallPrompt = async () => {
    if (!prompt) {
      alert("Your browser does not support this feature. Please follow the guide below!");
      return;
    }

    prompt.prompt();

    await prompt.userChoice;

    setPrompt(null);
  };

    const directInstallButton = () => {
      return (<button className={styles.installButton} onClick={handleInstallPrompt}>Direct Install <ArrowDownToLine className={styles.arrow} size={20} /></button>)
    }


  const AdaptiveInstructions = () => {
    switch (platform) {
      case "windows":
        if (browser === "chromium")
          return (<>
          {directInstallButton()}
          <Image className={styles.hintImage} src="/screenshots/win_chrom_pwahint.png" loading="eager" alt="windows-chromium" width={500} height={500}/></>);
        if (browser === "gecko" || browser === "safari")
          return (<p>Your browser does not support Progressive Web Apps on Windows.</p>);
      case "android":
        if (browser === "chromium")
          return (<>
          {directInstallButton()}
          <Image className={styles.hintImage} src="/screenshots/and_chro_pwahint.png" loading="eager" alt="windows-chromium" width={300} height={300}/></>);
        if (browser === "gecko")
          return (<Image className={styles.hintImage} src="/screenshots/and_firef_pwahint.png" loading="eager" alt="install screenshot" width={300} height={300}/>);
      case "ios":
        if (browser === "safari")
          return (<Image className={styles.hintImage} src="/screenshots/ios_safa_pwahint.png" loading="eager" alt="install screenshot" width={300} height={300}/>);
        if (browser !== "safari")
          return <p>Only Safari supports Progressive Web Apps on iOS!</p>;
      case "macos":
        if (browser === "chromium")
          return (<>{directInstallButton()}
          <Image className={styles.hintImage} src="/screenshots/win_chrom_pwahint.png" loading="eager" alt="windows-chromium" width={500} height={500}/></>);
        if (browser === "safari")
          return (<Image className={styles.hintImage} src="/screenshots/win_chrom_pwahint.png" loading="eager" alt="windows-chromium" width={500} height={500}/>);
        if (browser === "gecko")
          return (<p>Your browser does not support Progressive Web Apps on MacOS.</p>);
      default:
        return (
          <p>Your OS was not detected. Please search for instructions on installing PWAs.</p>
        );
    }
  };

  return (
    <div className={shared.container}>
      <header className={shared.headerContainer}>
        <div className={shared.headerWrapper}>
          <div className={shared.headerContent}>
            <Link href={"/"} className={shared.headerTitleSection}>
              <h1 className={shared.headerTitle}>Mensa KL</h1>
              <h2 className={shared.headerSubtitle}>
                Mensaplan der Rheinland-Pfälzischen Technischen <Icon className={shared.subtitleIcon}/>niversität in
                Kaiserslautern
              </h2>
            </Link>
          </div>
        </div>
      </header>

      <main className={shared.main}>
        <div style={{ padding: 20 }}>
          <h1>Web App</h1>

          <AdaptiveInstructions />
          <p className={styles.disclaimer} >Depending on your OS or browser features like offline mode or sync might not be supported!</p>
        </div>
      </main>
    </div>
  );
}
