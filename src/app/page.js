import Link from "next/link";
import styles from "./page.module.css";
import Schedule from '@/components/schedule';
import UploadPopup from "@/components/uploadModal";
import FilterMenu from "@/components/filtermenu";
import { Suspense } from "react";
import SettingsModal from "@/components/settings";
import { createClient } from '@/app/utils/supabase/server';
import ScrollToTopButton from "@/components/ScrollToTopButton";
export default function Home() {
 

  // just for testing
  async function alertModal() {
    const supabase = createClient();
    const { data: alerts } = await supabase.from("alerts").select();
  }

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
      <header className={styles.header}>
        <div className={styles.headerContent} >
          <h1 className={styles.headerTitle}>KL Mensa</h1>
          <p className={styles.headerSubtitle}>Rheinland-Pfälzische Technische Universität Kaiserslautern-Landau</p>
        </div>
        <div style={{flex: '1 1 auto'}} />
        <UploadPopup />
        <SettingsModal />
      </header>

      <main className={styles.main}>
        
        <FilterMenu/>
        <Suspense fallback={<SkeletonLoading />}>
        <Schedule/>
        </Suspense>
      </main>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; 2024 Mensa KL operated by <a href="https://www.studierendenwerk-kaiserslautern.de/" className={styles.footerLink}>Studierendenwerk Kaiserslautern.</a></p>
          <a href="https://www.mensa-kl.de/legal.html" className={styles.footerLink}>Privacy Policy</a>
          <a href="https://github.com/Protonosgit/KlMensa3" className={styles.footerLink}>V3 developed by protonos</a>
        </div>
      </footer>
      <ScrollToTopButton />
    </div>
  )
}