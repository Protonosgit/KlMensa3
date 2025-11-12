import styles from "./page.module.css";
import Schedule from '@/components/schedule';
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { InfoIcon } from "lucide-react";
import { cookies } from 'next/headers';


const DynamicSettingsModal = dynamic(() => import("@/components/settings"), { ssr: true });
const DynamicFilterMenu = dynamic(() => import("@/components/filtermenu"), { ssr: true });
const DynamicScrollToTopButton = dynamic(() => import("@/components/ScrollToTopButton"), { ssr: true });


async function retrieveCookies() {
  const cookieStore = await cookies();
  const settingsCookie = cookieStore.get("settings") || null;
  if (settingsCookie?.value) {
    return JSON.parse(settingsCookie.value);
  }
  return null;
}

export default async function Home() {
  const settings = await retrieveCookies(); // <-- resolve here

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

      <div className={styles.newsBox} style={{display: "none"}}>
        <p className={styles.newsTitle}><InfoIcon size={20} />Account deletion</p>
        <p className={styles.newsText}>Login is disabled and Beta accounts are deleted soon!</p>
      </div>

      <main className={styles.main}>
        <div className={styles.headerButtonSection}>
          <DynamicSettingsModal />
          <DynamicFilterMenu/>
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
          <a href="https://www.mensa-kl.de/#upload" className={styles.footerLink}>Images/Ratings</a>
          <a href="/about" className={styles.footerLink}>About</a>
          <a href="https://github.com/Protonosgit/KlMensa3/issues" className={styles.footerLink}>Report issue</a>
          <a href="https://github.com/Protonosgit/KlMensa3" className={styles.footerLink}>Source</a>
          <a href="/api/menudata" className={styles.footerLink}>Api</a>
        </div>
          <p>2025 mensa-kl v3 prototype 🐡Powered by Fachschaft Biologie<br/></p>
      </footer>
      <DynamicScrollToTopButton />
    </div>
  )
}