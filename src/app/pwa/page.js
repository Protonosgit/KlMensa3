import Link from "next/link";
import styles from "./page.module.css";
import shared from "@/styles/shared_page.module.css"
import { CodeIcon } from "lucide-react";


export default function ReportPage() {   



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
        <h3 className={styles.subtitle}>Install Portable Web App:</h3>
        <p className={styles.description}>
          You can install kl-mensa as a portable web app on your phone.<br />
        </p>
        <button className={styles.installButton}>Install</button>

      </main>
    </div>
  )
}