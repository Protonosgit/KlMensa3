"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import styles from "./filter.module.css";
import { Filter, CookingPot } from "lucide-react";
import { useEffect, useState } from "react";

const mloc = [
  { id: 1, name: "Ausgabe 1/2", shown: true },
  { id: 2, name: "Ausgabe 1/2 vegan", shown: true },
  { id: 3, name: "Wok", shown: true },
  { id : 4, name: "Grill", shown: true },
  { id: 5, name: "Buffet", shown: true },
  { id: 6, name: "Atrium", shown: true },
  { id: 7, name: "Atrium Vegan", shown: true },
  { id: 8, name: "Salatbuffet", shown: true },
  { id:  9, name: "Abendmensa", shown: true },
  { id:  10, name: "Abendmensa vegan", shown: true },
  { id:  11, name: "News (soon ads)", shown: true },
]
const mprot =[
  { id: 1, name: "Pork", shown: true },
  { id: 2, name: "Beef", shown: true },
  { id: 3, name: "Chicken", shown: true },
  { id: 4, name: "Fish", shown: true },
  { id: 5, name: "Boar", shown: true },
  { id: 6, name: "Sheep", shown: true },
  { id: 7, name: "Vegetarian", shown: true },
]
const madd = [
  { id: 1, name: "Laktose", shown: true },
  { id: 2, name: "Gluten", shown: true },
  { id: 3, name: "Farbstoff", shown: true },
  { id: 4, name: "Konservierungsstoff", shown: true },
  { id: 5, name: "Antioxidationsmittel", shown: true },
  { id: 6, name: "Geschwefelt", shown: true },
  { id: 7, name: "Phosphat", shown: true },
  { id: 8, name: "Süßungsmittel", shown: true },
  { id: 9, name: "Eier", shown: true },
  { id: 10, name: "Soja", shown: true },
  { id: 11, name: "Restalkohol", shown: true },
  { id: 12, name: "Schalenfrüchte", shown: true },
]

export default function FilterMenu() {
  //
  // WARNING !!!! Filter is defined by cookies and cannot be updated once set!!!!
  // WARNING !!!! Filter is defined by cookies and cannot be updated once set!!!!
  //
  const [mealLocations, setMealLocations] = useState(mloc);
  const [mealProteins, setMealProteins] = useState(mprot);
  const [mealAdditives, setMealAdditives] = useState(madd);
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

  function updateLocFilter(index, value) {
    setMealLocations((prev) => {
      const updatedLocations = [...prev];
      updatedLocations[index].shown = value;
      return updatedLocations;
    });
  }

  function updateProtFilter(index, value) {
    setMealProteins((prev) => {
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
          <div className={styles.filterSection} style={{display: "none"}}>
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
        <div className={styles.buttonBar}>
          <button title="Apply filter" onClick={storeFilter} className={styles.applyButton}>Apply</button>
          <button title="Reset filter" onClick={resetFilter} className={styles.resetButton} style={{display: filterActive ? "block" : "none"}}><CookingPot size={20} /></button>
        </div>
        <p>We use cookies to store your preferences.</p>
      </PopoverContent>
    </Popover>
  );
}
