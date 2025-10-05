import styles from "./page.module.css";
import Schedule from '@/components/schedule';
import FilterMenu from "@/components/filtermenu";
import { Suspense } from "react";
import SettingsModal from "@/components/settings";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { InfoIcon } from "lucide-react";
import { cookies } from 'next/headers';

export default async function Home() { 
  const cookieStore = await cookies();
  let settings = null;
  const settingsCookie = cookieStore.get("settings") || null;
  if (settingsCookie?.value) {
    settings = JSON.parse(settingsCookie.value);
  }

  // Skeleton loading animation
    const SkeletonLoading = () => (
      <div className={styles.skeletonGrid}>
        {[...Array(18)].map((_, i) => (
          <div key={i} className={styles.skeletonContainer}>
            <div className={`${styles.skeleton} ${styles.skeletonBox}`}/>
            <div>
              <div className={`${styles.skeleton} ${styles.skeletonLine}`} style={{width: "100%"}}/>
              <div className={`${styles.skeleton} ${styles.skeletonLine}`}/>
            </div>
          </div>
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
              <h2 className={styles.headerSubtitle}>Mensaplan der Rheinland-Pfälzischen Technischen Universität in Kaiserslautern</h2>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.newsBox}>
        <p className={styles.newsTitle}><InfoIcon size={20} />Shutdown notice</p>
        <p className={styles.newsText}>This domain will cease to exist on November 1st !</p>
      </div>

      <main className={styles.main}>
        <div className={styles.headerButtonSection}>
          <SettingsModal />
          <FilterMenu/>
        </div>
        <Suspense fallback={<SkeletonLoading />}>
          <Schedule settingsCookie={settings}/>
        </Suspense>
      </main>
      <footer className={styles.footer}>
        <div className={styles.linkGrid}>
          <a href="https://www.studierendenwerk-kaiserslautern.de/de/" className={styles.footerLink}>Studierendenwerk</a>
          <a href="https://rptu.de" className={styles.footerLink}>RPTU</a>
          <a href="https://www.mensa-kl.de/legal.html" className={styles.footerLink}>Privacy Policy</a>
          <a href="https://www.mensa-kl.de/" className={styles.footerLink}>Images/Ratings</a>
          <a href="https://github.com/Protonosgit/KlMensa3/issues" className={styles.footerLink}>Report issue</a>
          <a href="https://github.com/Protonosgit/KlMensa3" className={styles.footerLink}>Source</a>
          <a href="https://gibtesheutepommes.de/" className={styles.footerLink}>GehP</a>
          <a href="/api/menudata" className={styles.footerLink}>Api</a>
        </div>
          <p>2025 mensa-kl v3 prototype<br/></p>
      </footer>
      <ScrollToTopButton />
    </div>
  )
}