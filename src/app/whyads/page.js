import Link from "next/link";
import styles from "./page.module.css";
import UploadPopup from "@/components/uploadModal";

export default function WhyAds() {


  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Why Ads</h1>
        <h2 className={styles.text}>Ads can either be shown by an official entity of the rptu or an admin.<br/>
          Topics may include: upcomming events, special offers, news or information about Non-profit organizations.
        </h2>
      </main>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; 2024 Mensa KL operated by <a href="https://www.studierendenwerk-kaiserslautern.de/" className={styles.footerLink}>Studierendenwerk Kaiserslautern.</a></p>
          <a href="https://www.mensa-kl.de/legal.html" className={styles.footerLink}>Privacy Policy</a>
        </div>
      </footer>
    </div>
  )
}