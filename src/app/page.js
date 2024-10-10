import styles from "./page.module.css";
import Schedule from '@/components/schedule';

export default function Home() {


  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.headerTitle}>KL Mensa</h1>
        </div>
      </header>

      <main className={styles.main}>
        <h2 className={styles.weekTitle}>
          
        </h2>
        <Schedule/>
      </main>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; 2024 Mensa KL operated by <a href="https://www.studierendenwerk-kaiserslautern.de/" className={styles.footerLink}>Studierendenwerks Kaiserslautern.</a></p>
          <a href="https://www.mensa-kl.de/legal.html" className={styles.footerLink}>Privacy Policy</a>
        </div>
      </footer>
    </div>
  )
}