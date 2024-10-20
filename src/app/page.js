import Link from "next/link";
import styles from "./page.module.css";
import Schedule from '@/components/schedule';
import UploadPopup from "@/components/uploadModal";
import FilterMenu from "@/components/filtermenu";

export default function Home() {


  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent} >
          <h1 className={styles.headerTitle}>KL Mensa</h1>
          <p className={styles.headerSubtitle}>Rheinland-Pfälzische Technische Universität Kaiserslautern-Landau</p>
        </div>
        <div style={{flex: '1 1 auto'}} />
        <UploadPopup />
      </header>

      <main className={styles.main}>
        
        <FilterMenu/>
        <Schedule/>
      </main>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; 2024 Mensa KL operated by <a href="https://www.studierendenwerk-kaiserslautern.de/" className={styles.footerLink}>Studierendenwerk Kaiserslautern.</a></p>
          <a href="https://www.mensa-kl.de/legal.html" className={styles.footerLink}>Privacy Policy</a>
          <a href="https://github.com/Protonosgit/KlMensa3" className={styles.footerLink}>V3 developed by protonos</a>
        </div>
      </footer>
    </div>
  )
}