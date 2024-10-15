"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import styles from "./filter.module.css";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";

export default function FilterMenu() {
  const [mealLocations, setMealLocations] = useState([
    { id: 1, name: "Ausgabe 1/2", shown: true },
    { id: 2, name: "Ausgabe 1/2 vegan", shown: true },
    { id: 3, name: "Wok", shown: true },
    { id : 4, name: "Grill", shown: true },
    { id: 5, name: "Buffet", shown: true },
    { id: 6, name: "Atrium", shown: true },
    { id: 7, name: "Unique", shown: true },
    { id:  8, name: "Abendmensa", shown: true },
  ]);
  const [mealProteins, setMealproteins] = useState([
    { id: 1, name: "Pork", shown: true },
    { id: 2, name: "Beef", shown: true },
    { id: 3, name: "Chicken", shown: true },
    { id: 4, name: "Fish/", shown: true },
    { id: 5, name: "Boar", shown: true },
    { id: 6, name: "Vegetarian", shown: true },
  ]);

  const [mealAdditives, setMealAdditives] = useState([
    { id: 1, name: "Farbstoff", shown: true },
    { id: 2, name: "Konservierungsstoff", shown: true },
    { id: 3, name: "Antioxidationsmittel", shown: true },
    { id: 4, name: "Geschmacksverstärker", shown: true },
    { id: 5, name: "Geschwefelt", shown: true },
    { id: 6, name: "Geschwärzt", shown: true },
    { id: 7, name: "Gewachst", shown: true },
    { id: 8, name: "Phosphat", shown: true },
    { id: 9, name: "Süßungsmittel", shown: true },
    { id: 10, name: "Phenylalalninquelle", shown: true },
    { id: 11, name: "Laktose", shown: true },
    { id: 12, name: "Jodsalz", shown: true },
  ]);

// Rindfleisch<br>S: Schweinefleisch<br>V: Vegetarisch<br>G: Geflügel<br>F: Fisch/Schalentier<br>W: Wild<br>K: Kalb<br>L: Lamm<br>B: Bio<br>Lfrei: ohne <br><br>Es wird  verwendet.'

  useEffect(() => {
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(',');
    console.log(ca);
  }, []);

  function updateLocFilter(index, value) {
    setMealLocations((prev) => {
      const updatedLocations = [...prev];
      updatedLocations[index].shown = value;
      return updatedLocations;
    });
  }

  function updateProtFilter(index, value) {
    setMealproteins((prev) => {
      const updated = [...prev];
      updated[index].shown = value;
      return updated;
    });
  }

  function updateAddFilter(index, value) {
    setMealAdditives((prev) => {
      const updated = [...prev];
      updated[index].shown = value;
      return updated;
    });
  }


  function storeFilter() {
    // store cookies
    const locationCookie = mealLocations
      .filter((location) => location.shown)
      .map((location) => location.id).join(",");
    document.cookie = `location=${locationCookie}; path=/; max-age=31536000`;

    const proteinCookie = mealProteins
      .filter((protein) => protein.shown)
      .map((protein) => protein.id).join(",");
    document.cookie = `protein=${proteinCookie}; path=/; max-age=31536000`;

    const additiveCookie = mealAdditives
      .filter((additive) => additive.shown)
      .map((additive) => additive.id).join(",");
    document.cookie = `additive=${additiveCookie}; path=/; max-age=31536000`;

    window.location.reload();
    
  }

  return (
    <Popover className={styles.filterMenu}>
      <PopoverTrigger className={styles.filterButton}>
        <Filter />
        Filter
      </PopoverTrigger>
      <PopoverContent className={styles.filterContent}>
        <div className={styles.filterContainer}>
          <div className={styles.filterSection}>
            <p className={styles.filterTitle}>Location:</p>
            <ul className={styles.filterList}>
              {mealLocations.map((location, index) => (
                <li key={index} className={styles.filterItem}>
                  <input
                    type="checkbox"
                    checked={location.shown}
                    id={index}
                    onChange={(e) => updateLocFilter(index, e.target.checked)}
                    className={styles.filterCheckbox}
                  />
                  <label
                    htmlFor={location.index}
                    className={styles.filterLabel}
                  >
                    {location.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.filterSection}>
            <p className={styles.filterTitle}>Pick a Protein:</p>
            <ul className={styles.filterList}>
              {mealProteins.map((protein, index) => (
                <li key={index} className={styles.filterItem}>
                  <input
                    type="checkbox"
                    id={index}
                    onChange={(e) => updateProtFilter(index, e.target.checked)}
                    checked={protein.shown}
                    className={styles.filterCheckbox}
                  />
                  <label htmlFor={protein.index} className={styles.filterLabel}>
                    {protein.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.filterSection}>
            <p className={styles.filterTitle}>Select Additives:</p>
            <ul className={styles.filterList}>
              {mealAdditives.map((additive, index) => (
                <li key={index} className={styles.filterItem}>
                  <input
                    type="checkbox"
                    id={index}
                    onChange={(e) => updateAddFilter(index, e.target.checked)}
                    checked={additive.shown}
                    className={styles.filterCheckbox}
                  />
                  <label htmlFor={additive.index} className={styles.filterLabel}>
                    {additive.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button onClick={storeFilter} className={styles.applyButton}>Apply</button>
      </PopoverContent>
    </Popover>
  );
}
