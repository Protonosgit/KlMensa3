import Link from "next/link";
import styles from "../page.module.css";


export default function ReportPage() {   



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

      <main className={styles.main}>

      </main>
    </div>
  )
}