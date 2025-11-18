import styles from "@/styles/shared_page.module.css";

export default function Loading() { 

  return (
    <div className={styles.container}>
      <header className={styles.headerContainer}>
        <div className={styles.headerWrapper}>
          <div className={styles.headerContent}>
            <div className={styles.headerTitleSection}>
              <h1 className={styles.headerTitle}>Mensa KL</h1>
              <h2 className={styles.headerSubtitle}>Mensaplan der Rheinland-Pfälzischen Technischen Universität in Kaiserslautern. Listen to Ghost!</h2>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <h1>loading...</h1>

      </main>
    </div>
  )
}