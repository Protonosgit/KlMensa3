import Link from "next/link";
import styles from "./page.module.css";
import { CodeIcon } from "lucide-react";


export default function ReportPage() {   



  return (
    <div className={styles.container}>
      <header className={styles.headerContainer}>
        <div className={styles.headerWrapper}>
          <div className={styles.headerContent}>
            <Link href={"/"} className={styles.headerTitleSection}>
              <h1 className={styles.headerTitle}>Mensa KL</h1>
              <h2 className={styles.headerSubtitle}>Mensaplan der Rheinland-Pfälzischen Technischen Universität in Kaiserslautern</h2>
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <h3 className={styles.subtitle}>About this page</h3>
        <p className={styles.description}>
          Mensa KL was created in 2008 by <a href="https://www.johannesschildgen.de/">Johannes Schildgen</a>. Since then it's been offering images and ratings about the current meals on the menu. 
          The current owner and maintainer of the project is <a href="https://www.instagram.com/mensaklde/">Dennis Meckel</a>.<br/> 
          Also, visit <a href="https://studierendenwerk-kaiserslautern.de/">studierendenwerk-kaiserslautern.de</a>, the original data source, where you can also provide the Mensa team with feedback or suggestions.
          Feel free to check out the code on <a href="https://github.com/Protonosgit/KlMensa3">Github</a> and leave a star if you feel generous!<br/>
          Because of the nature of the project, we rely entirely on community support and positive user interactions. Thank you for your contributions!
        </p>
        <h3 className={styles.subtitle}>Developed by</h3>
        <div className={styles.profiles}>
          <a href="https://www.johannesschildgen.de/" className={styles.profileBox}>
            <CodeIcon className={styles.codeIcon} />
            <p className={styles.profileName}>Johannes Schildgen</p>
            <p className={styles.roleChip}>Founder</p>
          </a>
          <a href="about:blank" className={styles.profileBox}>
            <CodeIcon className={styles.codeIcon} />
            <p className={styles.profileName}>Dennis Meckel</p>
            <p className={styles.roleChip}>Maintainer</p>
          </a>

        </div>
        <h3 className={styles.subtitle}>Socials</h3>
      </main>
    </div>
  )
}