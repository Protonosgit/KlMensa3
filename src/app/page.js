import styles from "./page.module.css";
import Schedule from '@/components/schedule';
import FilterMenu from "@/components/filtermenu";
import { Suspense } from "react";
import SettingsModal from "@/components/settings";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function Home() {   

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
              <h1 className={styles.headerTitle}>KL Mensa</h1>
              <h2 className={styles.headerSubtitle}>Rheinland-Pfälzische Technische Universität Kaiserslautern-Landau</h2>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.newsBox} style={{display: "none"}}>
        <p className={styles.newsText}>⚠️ Der Rückmeldezeitraum für das Wintersemester 2025/2026 endet nächsten Montag; am 28.07. Details auf rptu.de.</p>
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
          <p>2025 Kl-mensa <a href="https://www.studierendenwerk-kaiserslautern.de/" className={styles.footerLink}>Studierendenwerk</a></p>
          <a href="https://rptu.de" className={styles.footerLink}>RPTU</a>
          <a href="https://www.mensa-kl.de/legal.html" className={styles.footerLink}>Privacy Policy</a>
          <a href="https://www.mensa-kl.de/" className={styles.footerLink}>Images from <b>mensa-kl.de</b></a>
          <a href="https://github.com/Protonosgit/KlMensa3" className={styles.footerLink}>Developer</a>
        </div>
      </footer>
      <ScrollToTopButton />
    </div>
  )
}