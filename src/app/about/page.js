import Link from "next/link";
import styles from "./page.module.css";
import shared from "@/styles/shared_page.module.css"
import { CodeIcon } from "lucide-react";
import Icon from "../../../public/icons/Icon.svg";

export default function ReportPage() {   



  return (
    <div className={shared.container}>
      <header className={shared.headerContainer}>
        <div className={shared.headerWrapper}>
          <div className={shared.headerContent}>
            <Link href={"/"} className={shared.headerTitleSection}>
              <h1 className={shared.headerTitle}>Mensa KL</h1>
              <h2 className={shared.headerSubtitle}>Mensaplan der Rheinland-Pfälzischen Technischen <span style={{whiteSpace: "nowrap"}}><Icon className={shared.subtitleIcon}/>niversität</span> in Kaiserslautern</h2>
            </Link>
          </div>
        </div>
      </header>

      <main className={shared.main}>
        <h3 className={styles.subtitle}>About this page:</h3>
        <p className={styles.description}>
          Mensa KL was created in 2008 by <a href="https://www.johannesschildgen.de/">Johannes Schildgen</a>. Since then it's been offering images and ratings about the current meals on the menu. 
          The current owner and maintainer of the project is <a href="https://www.instagram.com/mensaklde/">Dennis Meckel</a>.<br/> 
          Also, visit <a href="https://studierendenwerk-kaiserslautern.de/">studierendenwerk-kaiserslautern.de</a>, the original data source, where you can also provide the Mensa team with feedback or suggestions.
          Feel free to check out the <a href="https://github.com/Protonosgit/KlMensa3">Repo</a>!<br/>
        </p>

      </main>
    </div>
  )
}