"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import styles from "./filter.module.css";
import { Filter, CookingPot } from "lucide-react";
import { useEffect, useState } from "react";


const mealLocationClearname = [
  { name: "Ausgabe 1", codes: [1] },
  { name: "Ausgabe 2", codes: [2] },
  { name: "Wok", codes: [] },
  { name: "Grill", codes: [10] },
  { name: "Atrium", codes: [16,17,18] },
  { name: "Eintopf (Atrium)", codes: [13] },
  { name: "Abendmensa", codes: [4] },
];

const mealAdditiveClearname = [
  { name: "Lactose", code: "la" },
  { name: "Gluten", code: "gl" },
  { name: "Coloring agent", code: "1" },
  { name: "Preservative", code: "2" },
  { name: "Antioxidant", code: "3" },
  { name: "Sulphured", code: "5" },
  { name: "Phosphate", code: "8" },
  { name: "Sweetener", code: "9" },
  { name: "Eggs", code: "ei" },
  { name: "Soy", code: "so" },
  { name: "Residual alcohol", code: "a" },
  { name: "Tree nuts", code: "nu" },
  { name: "Sulfur dioxide", code: "sw" },
  { name: "Sesame", code: "se" },
  { name: "Mustard", code: "sf" },
  { name: "Celery", code: "sl" }
];

const mealProteinClearname = [
  { name: "Poultry/Chicken", code: "g" },
  { name: "Beef", code: "r" },
  { name: "Lamb", code: "l" },
  { name: "Pork", code: "s" },
  { name: "Veal", code: "k" },
  { name: "Boar", code: "w" },
  { name: "Fish", code: "fi" },
  { name: "Eggs", code: "ei" },
  { name: "Crustaceans", code: "kr" }
];


export default function FilterMenu() {

  const [mealLocations, setMealLocations] = useState([]);
  const [mealProteins, setMealProteins] = useState([]);
  const [mealAdditives, setMealAdditives] = useState([]);
  const [filterActive, setFilterActive] = useState(false);


  useEffect(() => {
    // Get filter values from cookies
    function getArrayFromCookie(name) {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(name))
        ?.split('=')[1];
      
      return cookieValue ? JSON.parse(cookieValue) : null;
    }

    // load filter1 in ui thread
    if(getArrayFromCookie("location") !== null) {
      setMealLocations(getArrayFromCookie("location"));
      setFilterActive(true);
    }
    // load filter2 in ui thread
    if(getArrayFromCookie("additive") !== null) {
      setMealAdditives(getArrayFromCookie("additive"));
      setFilterActive(true);
    }
    // load filter3 in ui thread
    if(getArrayFromCookie("protein") !== null) {
      setMealProteins(getArrayFromCookie("protein"))
      setFilterActive(true);
    }
  }, []);


  function updateLocFilter(index) {
    const currentIndex = mealLocations.findIndex((item) =>
      mealLocationClearname[index].codes.some((code) => item === code)
    );
    setMealLocations((prev) => {
      if (currentIndex === -1) {
        return prev.concat(mealLocationClearname[index].codes);
      } else {
        return prev.filter((item) => !mealLocationClearname[index].codes.includes(item));
      }
    });
  }

  function updateProtFilter(index) {
    const currentIndex = mealProteins.indexOf(mealProteinClearname[index]?.code);
    setMealProteins((prev) => {
      if (currentIndex === -1) {
        return [...prev, mealProteinClearname[index]?.code];
      } else {
        return prev.filter((item) => item !== mealProteinClearname[index]?.code);
      }
    });
  }

  function updateAddFilter(index) {
    const currentIndex = mealAdditives.indexOf(mealAdditiveClearname[index]?.code);
    setMealAdditives((prev) => {
      if (currentIndex === -1) {
        return [...prev, mealAdditiveClearname[index]?.code];
      } else {
        return prev.filter((item) => item !== mealAdditiveClearname[index]?.code);
      }
    });
  }


  function storeFilter() {
    // store cookies with filters
    const locArray = JSON.stringify(mealLocations);
    document.cookie = `location=${locArray}; path=/`;

    const protArray = JSON.stringify(mealProteins);
    document.cookie = `protein=${protArray}; path=/`;

    const addArray = JSON.stringify(mealAdditives);
    document.cookie = `additive=${addArray}; path=/`;


    window.location.reload();
  }

  function resetFilter() {
    // delete all cookies
    document.cookie = "location=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "protein=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "additive=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    window.location.reload();
  }

  return (
    <Popover className={styles.filterMenu}>
      <PopoverTrigger className={styles.filterButton}>
        <Filter />
      </PopoverTrigger>
      <PopoverContent className={styles.filterContent}>
        <div className={styles.filterContainer}>
          <div className={styles.filterSection}>
            <p className={styles.filterTitle}>Location:</p>
            <ul className={styles.filterList}>
              {mealLocationClearname.map((location, index) => (
                <li key={index} className={styles.filterItem}>
                  <input
                    type="checkbox"
                    checked={!mealLocations.includes(location.codes[0])}
                    id={index}
                    onChange={(e) => updateLocFilter(index)}
                    className={styles.filterCheckbox}
                  />
                  <label
                    htmlFor={location.name}
                    className={styles.filterLabel}
                  >
                    {location.name}
                  </label>
                </li>
              ))}
            </ul>
            <div className={styles.seperator}/>
          </div>
          <div className={styles.filterSection}>
            <p className={styles.filterTitle}>Protein:</p>
            <ul className={styles.filterList}>
              {mealProteinClearname.map((protein, index) => (
                <li key={index} className={styles.filterItem}>
                  <input
                    type="checkbox"
                    id={index}
                    onChange={(e) => updateProtFilter(index, e.target.checked)}
                    checked={!mealProteins.includes(protein.code)}
                    className={styles.filterCheckbox}
                  />
                  <label htmlFor={protein.name} className={styles.filterLabel}>
                    {protein.name}
                  </label>
                </li>
              ))}
            </ul>
            <div className={styles.seperator}/>
          </div>
          <div className={styles.filterSection}>
            <p className={styles.filterTitle}>Additives:</p>
            <ul className={styles.filterList}>
              {mealAdditiveClearname.map((additive, index) => (
                <li key={index} className={styles.filterItem}>
                  <input
                    type="checkbox"
                    id={index}
                    onChange={(e) => updateAddFilter(index, e.target.checked)}
                    checked={!mealAdditives.includes(additive.code)}
                    className={styles.filterCheckbox}
                  />
                  <label htmlFor={additive.name} className={styles.filterLabel}>
                    {additive.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.buttonBar}>
          <button title="Apply filter" onClick={storeFilter} className={styles.applyButton}>Apply</button>
          <button title="Reset filter" onClick={resetFilter} className={styles.resetButton} style={{display: filterActive ? "block" : "none"}}><CookingPot size={20} /></button>
        </div>
        <p>We use cookies to store your preferences.</p>
      </PopoverContent>
    </Popover>
  );
}
