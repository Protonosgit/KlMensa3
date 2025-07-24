import styles from "./page.module.css";

export default function Loading() { 

  return (
    <div className={styles.container}>
      <header className={styles.headerContainer}>
        <div className={styles.headerWrapper}>
          <div className={styles.headerContent}>
            <div className={styles.headerTitleSection}>
              <h1 className={styles.headerTitle}>KL Mensa</h1>
              <h2 className={styles.headerSubtitle}>Rheinland-Pfälzische Technische Universität Kaiserslautern-Landau try Tribute by Tenacious D!</h2>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <h1>Loading Schedule</h1>

      </main>
    </div>
  )
}