import styles from "./page.module.css";
import shared from "@/styles/shared_page.module.css";
import Schedule from '@/components/ScheduleGrid';
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { InfoIcon } from "lucide-react";

const DynamicSettingsModal = dynamic(() => import("@/components/SettingsModal"), { ssr: true });
// const DynamicFilterModal = dynamic(() => import("@/components/FilterModal"), { ssr: true });
const DynamicFilterMenu = dynamic(() => import("@/components/FilterPopup"), { ssr: true });
const DynamicScrollToTopButton = dynamic(() => import("@/components/ScrollToTopButton"), { ssr: true });


export default async function Home() {

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
    <div className={shared.container}>
      <header className={shared.headerContainer}>
        <div className={shared.headerWrapper}>
          <div className={shared.headerContent}>
            <div className={shared.headerTitleSection}>
              <h1 className={shared.headerTitle}>Mensa KL</h1>
              <h2 className={shared.headerSubtitle}>Mensaplan der Rheinland-Pfälzischen Technischen Universität in Kaiserslautern</h2>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.newsBox} >
        <p className={styles.newsTitle}><InfoIcon size={20} />Open Beta</p>
        <p className={styles.newsText}>The open beta test will start soon, expected regular outages.</p>
      </div>

      <main className={shared.main}>
        <div className={styles.headerButtonSection}>
          <DynamicSettingsModal />
          <DynamicFilterMenu/>
          {/* <DynamicFilterModal/> */}
        </div>
        <Suspense fallback={<SkeletonLoading />}>
          <Schedule/>
        </Suspense>
      </main>
      <footer className={shared.footer}>
        <div className={shared.linkGrid}>
          <a href="https://www.studierendenwerk-kaiserslautern.de/de/" className={shared.footerLink}>Studierendenwerk</a>
          <a href="https://rptu.de" className={shared.footerLink}>RPTU</a>
          <a href="https://www.mensa-kl.de/legal.html" className={shared.footerLink}>Privacy Policy</a>
          <a href="https://www.mensa-kl.de/#upload" className={shared.footerLink}>Images/Ratings</a>
          <a href="/about" className={shared.footerLink}>About</a>
          <a href="https://github.com/Protonosgit/KlMensa3/issues" className={shared.footerLink}>Report issue</a>
          <a href="https://github.com/Protonosgit/KlMensa3" className={shared.footerLink}>Source</a>
          <a href="/api/menu_v1" className={shared.footerLink}>Api</a>
        </div>
          <p>2025 kl-mensa v2 prototype<br/></p>
      </footer>
      <DynamicScrollToTopButton />
    </div>
  )
}