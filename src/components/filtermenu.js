"use client"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import styles from "./filter.module.css";
import { Filter } from "lucide-react";

const locations = ["Ausgabe 1/2", "Ausgabe 1/2 vegan", "Wok", "Grill", "Buffet", "Atrium", "Unique", "Abendmensa"];
const proteins = ["Pork", "Beef", "Chicken","Fish", "Wild" ,"Vegetarian"];

export default function FilterMenu() {
  return (
    <Popover>
      <PopoverTrigger className={styles.filterButton}>
          <Filter />
          Filter
      </PopoverTrigger>
      <PopoverContent className={styles.filterContent}>
        <div className={styles.filterContainer}>
        <div className={styles.filterSection}>
        <p className={styles.filterTitle}>Location:</p>
        <ul className={styles.filterList}>
          {locations.map((location) => (
            <li key={location} className={styles.filterItem}>
              <input
                type="checkbox"
                checked
                id={location}
                className={styles.filterCheckbox}
              />
              <label htmlFor={location} className={styles.filterLabel}>
                {location}
              </label>
            </li>
          ))}
        </ul>
        </div>
        <div className={styles.filterSection}>
        <p className={styles.filterTitle}>Pick a Protein:</p>
        <ul className={styles.filterList}>
          {proteins.map((protein) => (
            <li key={protein} className={styles.filterItem}>
              <input
                type="checkbox"
                id={protein}
                checked
                className={styles.filterCheckbox}
              />
              <label htmlFor={protein} className={styles.filterLabel}>
                {protein}
              </label>
            </li>
          ))}
        </ul>
        </div>
        </div>
        <button className={styles.applyButton}>Apply</button>
        </PopoverContent>
    </Popover>
  );
}
