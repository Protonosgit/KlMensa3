import styles from "./page.module.css";
import Schedule from '@/components/schedule';
import FilterMenu from "@/components/filtermenu";
import { Suspense } from "react";
import SettingsModal from "@/components/settings";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { InfoIcon } from "lucide-react";
import { fetchNews } from "./utils/internal-api";

export default function Home() { 
  fetchNews();  

  // Skeleton loading animation
  const SkeletonLoading = () => (
      <div className={styles.skeletonGrid}>
        {[...Array(20)].map((_, i) => (
          <div className={styles.skeleton} key={i} />
        ))}
      </div>
  )


  return (
    <div className={styles.container}>
      <header className={styles.headerContainer}>
        <div className={styles.headerWrapper}>
          <div className={styles.headerContent}>
            <div className={styles.headerTitleSection}>
              <h1 className={styles.headerTitle}>Mensa KL</h1>
              <h2 className={styles.headerSubtitle}>Mensaplan der Rheinland-Pfälzische Technische Universität Kaiserslautern-Landau</h2>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.newsBox}>
        <p className={styles.newsText}><InfoIcon />Developer version expect bugs and issues!</p>
      </div>

      <main className={styles.main}>
        <div className={styles.headerButtonSection}>
          <SettingsModal />
          <FilterMenu/>
        </div>
        <Suspense fallback={<SkeletonLoading />}>
        <Schedule/>
        </Suspense>
      </main>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>2025 mensa-kl v3</p> <a href="https://www.studierendenwerk-kaiserslautern.de/" className={styles.footerLink}>Studierendenwerk</a>
          <a href="https://rptu.de" className={styles.footerLink}>RPTU</a>
          <a href="https://www.mensa-kl.de/legal.html" className={styles.footerLink}>Privacy Policy</a>
          <a href="https://www.mensa-kl.de/" className={styles.footerLink}>Images from <b>mensa-kl.de</b></a>
          <a href="https://github.com/Protonosgit/KlMensa3/issues" className={styles.footerLink}>Report issue</a>
          <a href="https://github.com/Protonosgit/KlMensa3" className={styles.footerLink}>Source</a>
          <a href="/api/menudata" className={styles.footerLink}>Api</a>
        </div>
      </footer>
      <ScrollToTopButton />
    </div>
  )
}