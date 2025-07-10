import Link from "next/link";
import styles from "./page.module.css";


export default function ReportPage() {   



  return (
    <div className={styles.container}>
      <header className={styles.headerContainer}>
        <div className={styles.headerWrapper}>
          <div className={styles.headerContent}>
            <div className={styles.headerTitleSection}>
              <Link href="/" className={styles.headerTitle}>KL Mensa</Link>
              <p className={styles.headerSubtitle}>Rheinland-Pfälzische Technische Universität Kaiserslautern-Landau</p>
            </div>
            
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Report something for being:</h1>
        <ul className={styles.list}>
            <li>Harasment</li>
            <li>Spam</li>
            <li>Illegal content</li>
            <li>Content is not relevant or useful</li>
        </ul>
        <button className={styles.button}>Report</button>
      </main>
    </div>
  )
}