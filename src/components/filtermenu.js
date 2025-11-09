"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import styles from "./filter.module.css";
import { Filter,  MapPin, Beef, FlaskConical, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { revalidatePage } from "@/app/utils/auth-actions";
import { useFilterStore } from "@/app/utils/contextStore";

// Define clear names and codes for meal locations, additives, and proteins.
const mealLocationClearname = [
  { name: "Ausgabe 1", codes: [1] },
  { name: "Ausgabe 2", codes: [2] },
  { name: "Salatbuffet", codes: [6] },
  // { name: "Grill", codes: [10] },
  { name: "Atrium", codes: [16,17,18,19] },
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
  { name: "Poultry", code: "g" },
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
  // State variables
  const [mealLocations, setMealLocations] = useState([]);
  const [mealProteins, setMealProteins] = useState([]);
  const [mealAdditives, setMealAdditives] = useState([]);
  const [filterActive, setFilterActive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [allLocationsToggled, setAllLocToggled] = useState(true);
  const [allAdditiveToggled, setAllAdditiveToggled] = useState(true);
  const [allProteinToggled, setAllProteinToggled] = useState(true);

  function loadFilters() {
    setRefreshing(true);
    setFilterActive(false);
    // Load filter values from cookies and update state variables
    function getArrayFromCookie(name) {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(name))
        ?.split('=')[1];
      
      return cookieValue ? JSON.parse(cookieValue) : null;
    }
    // Load location filter from cookies.
    if(getArrayFromCookie("location") !== null && getArrayFromCookie("location")?.length > 0) {
      setMealLocations(getArrayFromCookie("location"));
      setFilterActive(true);
      setAllLocToggled(false);
    }
    // Load additive filter from cookies.
    if(getArrayFromCookie("additive") !== null && getArrayFromCookie("additive")?.length > 0) {
      setMealAdditives(getArrayFromCookie("additive"));
      setFilterActive(true);
      setAllAdditiveToggled(false);
    }
    // Load protein filter from cookies.
    if(getArrayFromCookie("protein") !== null && getArrayFromCookie("protein")?.length > 0) {
      setMealProteins(getArrayFromCookie("protein"))
      setFilterActive(true);
      setAllProteinToggled(false);
    }
    setRefreshing(false);
  }

  useEffect(() => {
    loadFilters();
  }, []);


  // Update location filter based on user selection.
  function updateLocFilter(index) {
    const currentIndex = mealLocations.findIndex((item) =>
      mealLocationClearname[index]?.codes.some((code) => item === code)
    );
    setMealLocations((prev) => {
      if (currentIndex === -1) {
        return prev.concat(mealLocationClearname[index]?.codes);
      } else {
        return prev.filter((item) => !mealLocationClearname[index].codes.includes(item));
      }
    });
  }

  // Update protein filter based on user selection.
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

  // Update additive filter based on user selection.
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


  // Store selected filters in cookies and reload the page.
  function storeFilter() {
    setRefreshing(true);
    // store cookies with filters
    const locArray = JSON.stringify(mealLocations);
    document.cookie = `location=${locArray}; path=/`;

    const protArray = JSON.stringify(mealProteins);
    document.cookie = `protein=${protArray}; path=/`;

    const addArray = JSON.stringify(mealAdditives);
    document.cookie = `additive=${addArray}; path=/`;

    loadFilters();
    revalidatePage();
  }

  // Reset all filters by clearing cookies and reload the page.
  function resetFilter() {
    setRefreshing(true);
    // delete all cookies
    document.cookie = "location=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "protein=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "additive=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    setMealLocations([]);
    setMealProteins([]);
    setMealAdditives([]);

    loadFilters();
    revalidatePage();
  }

  const handleSelectAllClicked = (currentStatus, targetVariable, templateVariable, multiple = false) => {
    if(currentStatus) {
      targetVariable([]);
    } else {
      if(multiple) {
        targetVariable((templateVariable.map((item) => item.codes)).flat());
      } else {
        targetVariable(templateVariable.map((item) => item.code));
      }
    }
  }


  // Render the filter menu UI.
  return (
    <Popover className={styles.filterMenu}>
      <PopoverTrigger title="Filter" className={styles.filterButton}>
        <Filter className={styles.filterIcon} />
      </PopoverTrigger>
      <PopoverContent className={styles.filterContent}>
        <div className={styles.filterContainer}>
          {/* Render location filter section */}
          <div className={styles.filterSection}>
            <div className={styles.filterHeadder}>
              <p className={styles.filterTitle}><MapPin size={20} />Location:</p>
              <p className={styles.filterSubtitle}>Select all <input defaultChecked={allLocationsToggled} onChange={(e) => handleSelectAllClicked(e.target.checked, setMealLocations, mealLocationClearname, true)} type="checkbox" className={styles.filterCheckbox} /></p>
            </div>
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

          {/* Render protein filter section */}
          <div className={styles.filterSection}>
            <div className={styles.filterHeadder}>
              <p className={styles.filterTitle}><Beef size={20} />Protein:</p>
              <p className={styles.filterSubtitle}>Select all <input defaultChecked={allProteinToggled} onChange={(e) => handleSelectAllClicked(e.target.checked, setMealProteins, mealProteinClearname)} type="checkbox" className={styles.filterCheckbox} /></p>
            </div>
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

          {/* Render additive filter section */}
          <div className={styles.filterSection}>
            <div className={styles.filterHeadder}>
              <p className={styles.filterTitle}><FlaskConical size={20} />Additives:</p>
              <p className={styles.filterSubtitle}>Select all <input defaultChecked={allAdditiveToggled} onChange={(e) => handleSelectAllClicked(e.target.checked, setMealAdditives, mealAdditiveClearname)} type="checkbox" className={styles.filterCheckbox} /></p>
            </div>
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
        {/* Render action buttons */}
        <div className={styles.buttonBar}>
          <button title="Apply filter" onClick={storeFilter} disabled={refreshing} className={styles.applyButton}>{refreshing ? <Spinner /> : "Apply"}</button>
          <button title="Reset filter" onClick={resetFilter} disabled={refreshing} className={styles.resetButton} style={{display: filterActive ? "block" : "none"}}><Trash2 size={20} /></button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
