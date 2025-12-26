"use client";
import styles from "./FilterModal.module.css";
import shared from "@/styles/shared.module.css";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "@/app/utils/client-system";
import { revalidatePage } from "@/app/utils/auth-actions";
import { Filter, MapPin, Beef, FlaskConical, Trash2 } from "lucide-react";

// Define clear names and codes for meal locations, additives, and proteins.
const mealLocationClearname = [
  { name: "Ausgabe 1", codes: [1] },
  { name: "Ausgabe 2", codes: [2] },
  { name: "Salatbuffet", codes: [6] },
  // { name: "Grill", codes: [10] },
  { name: "Atrium", codes: [16, 17, 18, 19] },
  { name: "Eintopf (Atrium)", codes: [13] },
  { name: "Abendmensa", codes: [4] },
];

// Missing:  weichtiere, bio, lupine, geschwärzt, gewachst, phenylalanine
const mealAdditiveClearname = [
  { name: "Lactose", code: "la" },
  { name: "Gluten", code: "gl" },
  { name: "Gelatin", code: "gt" },
  { name: "Coloring agent", code: "1" },
  { name: "Preservative", code: "2" },
  { name: "Antioxidant", code: "3" },
  { name: "Flavor enhancer", code: "4" },
  { name: "Sulphured", code: "5" },
  { name: "Blackened", code: "6" },
  // { name: "unknown", code: "7" },
  { name: "Phosphate", code: "8" },
  { name: "Sweetener", code: "9" },
  { name: "Phenylalanine", code: "10" },
  { name: "Eggs", code: "ei" },
  { name: "Soy", code: "so" },
  { name: "Residual alcohol", code: "a" },
  { name: "Nuts", code: "nu" },
  { name: "Sulfur dioxide", code: "sw" },
  { name: "Sesame", code: "se" },
  { name: "Mustard", code: "sf" },
  { name: "Celery", code: "sl" },
  // { name: "Bio", code: "unknown" },
  // { name: "Lupine", code: "unknown" },
  // { name: "Waxed", code: "unknown" },
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
  { name: "Crustaceans", code: "kr" },
];

export default function FilterModal({}) {
  // State variables for managing modal visibility, settings, and user authentication
  const [modalVisible, setModalVisible] = useState(false);
  const [mealLocations, setMealLocations] = useState([]);
  const [mealProteins, setMealProteins] = useState([]);
  const [mealAdditives, setMealAdditives] = useState([]);
  const [filterActive, setFilterActive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  function loadFilters() {
    setRefreshing(true);
    setFilterActive(false);

    // parse cookies once and safely JSON.parse values
    function parseCookies() {
      const map = {};
      if (!document?.cookie) return map;
      document.cookie.split("; ").forEach((pair) => {
        const idx = pair.indexOf("=");
        if (idx === -1) return;
        const name = pair.slice(0, idx);
        const val = pair.slice(idx + 1);
        map[name] = val;
      });
      return map;
    }
    function getArrayFromCookieMap(map, name) {
      const raw = map[name];
      if (!raw) return null;
      try {
        const parsed = JSON.parse(decodeURIComponent(raw));
        return Array.isArray(parsed) ? parsed : null;
      } catch (e) {
        console.warn("Failed parsing cookie", name, e);
        return null;
      }
    }

    const cookieMap = parseCookies();

    const locFromCookie = getArrayFromCookieMap(cookieMap, "location");
    if (locFromCookie && locFromCookie.length > 0) {
      setMealLocations(locFromCookie);
      setFilterActive(true);
    } else {
      setMealLocations([]);
    }

    const addFromCookie = getArrayFromCookieMap(cookieMap, "additive");
    if (addFromCookie && addFromCookie.length > 0) {
      setMealAdditives(addFromCookie);
      setFilterActive(true);
    } else {
      setMealAdditives([]);
    }

    const protFromCookie = getArrayFromCookieMap(cookieMap, "protein");
    if (protFromCookie && protFromCookie.length > 0) {
      setMealProteins(protFromCookie);
      setFilterActive(true);
    } else {
      setMealProteins([]);
    }

    setRefreshing(false);
  }

  useEffect(() => {
    loadFilters();
  }, []);

  // Update location filter based on user selection.
  function updateLocFilter(index) {
    const codes = mealLocationClearname[index]?.codes || [];
    setMealLocations((prev) => {
      const hasAny = codes.some((c) => prev.includes(c));
      if (hasAny) {
        return prev.filter((item) => !codes.includes(item));
      } else {
        return [...prev, ...codes];
      }
    });
  }

  // Update protein filter based on user selection.
  function updateProtFilter(index) {
    const code = mealProteinClearname[index]?.code;
    if (!code) return;
    setMealProteins((prev) => {
      return prev.includes(code)
        ? prev.filter((p) => p !== code)
        : [...prev, code];
    });
  }

  // Update additive filter based on user selection.
  function updateAddFilter(index) {
    const code = mealAdditiveClearname[index]?.code;
    if (!code) return;
    setMealAdditives((prev) => {
      return prev.includes(code)
        ? prev.filter((a) => a !== code)
        : [...prev, code];
    });
  }

  // Store selected filters in cookies and reload the page.
  async function storeFilter() {
    setRefreshing(true);
    const locArray = encodeURIComponent(JSON.stringify(mealLocations));
    document.cookie = `location=${locArray}; path=/`;
    const protArray = encodeURIComponent(JSON.stringify(mealProteins));
    document.cookie = `protein=${protArray}; path=/`;
    const addArray = encodeURIComponent(JSON.stringify(mealAdditives));
    document.cookie = `additive=${addArray}; path=/`;

    // reload local state and then revalidate
    loadFilters();
    try {
      await revalidatePage();
    } finally {
      setRefreshing(false);
    }
  }

  async function resetFilter() {
    setRefreshing(true);
    document.cookie =
      "location=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "protein=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie =
      "additive=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    setMealLocations([]);
    setMealProteins([]);
    setMealAdditives([]);

    loadFilters();
    try {
      await revalidatePage();
    } finally {
      setRefreshing(false);
    }
  }

  const handleSelectAllClicked = (
    checked,
    setter,
    template,
    multiple = false
  ) => {
    if (checked) {
      if (multiple) {
        setter(template.map((item) => item.codes).flat());
      } else {
        setter(template.map((item) => item.code));
      }
    } else {
      setter([]);
    }
  };

  // Detect back gesture on Android, Windows and maybe ios and close modal if open
  useEffect(() => {
    const handlePopState = () => {
      if (modalVisible) {
        setModalVisible(false);
      }
    };

    const handleEscapePress = (event) => {
      if (event.key === "Escape" && modalVisible) {
        setModalVisible(false);
        window.history.back();
      }
    };

    document.addEventListener("keydown", handleEscapePress);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("keydown", handleEscapePress);
    };
  }, [modalVisible]);

  function handleCloseModal() {
    setModalVisible(false);
    window.history.back();
  }

  useEffect(() => {
    // Disable page scrolling when the settings modal is open.
    if (modalVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [modalVisible]);

  return (
    <>
      <button
        className={shared.headderButton}
        title="Meal filters"
        onClick={() => {
          setModalVisible(true);
          window.history.pushState(
            null,
            "",
            window.location.href + "#filter"
          );
        }}
      >
        <Filter className={shared.headderIcon} />
      </button>
      {modalVisible && (
        <div className={shared.popupOverlay}>
          <div className={styles.popupContent}>
            {/* Render location filter section */}
            <div className={styles.filterSection}>
              <div className={styles.filterHeadder}>
                <p className={styles.filterTitle}>
                  <MapPin size={20} />
                  Location:
                </p>
                <p className={styles.filterSubtitle}>
                  Select all{" "}
                  <input
                    checked={mealLocations.length === 0}
                    onChange={(e) =>
                      handleSelectAllClicked(
                        !e.target.checked,
                        setMealLocations,
                        mealLocationClearname,
                        true
                      )
                    }
                    type="checkbox"
                    className={styles.filterCheckbox}
                  />
                </p>
              </div>
              <ul className={styles.filterList}>
                {mealLocationClearname.map((location, index) => {
                  const id = `loc-${index}`;
                  const checked = location.codes.some((c) =>
                    mealLocations.includes(c)
                  );
                  return (
                    <li key={index} className={styles.filterItem}>
                      <input
                        type="checkbox"
                        checked={!checked}
                        id={id}
                        onChange={() => updateLocFilter(index)}
                        className={styles.filterCheckbox}
                      />
                      <label htmlFor={id} className={styles.filterLabel}>
                        {location.name}
                      </label>
                    </li>
                  );
                })}
              </ul>
              <div className={styles.seperator} />
            </div>

            {/* Render protein filter section */}
            <div className={styles.filterSection}>
              <div className={styles.filterHeadder}>
                <p className={styles.filterTitle}>
                  <Beef size={20} />
                  Protein:
                </p>
                <p className={styles.filterSubtitle}>
                  Select all{" "}
                  <input
                    checked={mealProteins.length === 0}
                    onChange={(e) =>
                      handleSelectAllClicked(
                        !e.target.checked,
                        setMealProteins,
                        mealProteinClearname
                      )
                    }
                    type="checkbox"
                    className={styles.filterCheckbox}
                  />
                </p>
              </div>
              <ul className={styles.filterList}>
                {mealProteinClearname.map((protein, index) => {
                  const id = `prot-${index}`;
                  const checked = mealProteins.includes(protein.code);
                  return (
                    <li key={index} className={styles.filterItem}>
                      <input
                        type="checkbox"
                        id={id}
                        onChange={() => updateProtFilter(index)}
                        checked={!checked}
                        className={styles.filterCheckbox}
                      />
                      <label htmlFor={id} className={styles.filterLabel}>
                        {protein.name}
                      </label>
                    </li>
                  );
                })}
              </ul>
              <div className={styles.seperator} />
            </div>

            {/* Render additive filter section */}
            <div className={styles.filterSection}>
              <div className={styles.filterHeadder}>
                <p className={styles.filterTitle}>
                  <FlaskConical size={20} />
                  Additives:
                </p>
                <p className={styles.filterSubtitle}>
                  Select all{" "}
                  <input
                    checked={mealAdditives.length === 0}
                    onChange={(e) =>
                      handleSelectAllClicked(
                        !e.target.checked,
                        setMealAdditives,
                        mealAdditiveClearname
                      )
                    }
                    type="checkbox"
                    className={styles.filterCheckbox}
                  />
                </p>
              </div>
              <ul className={styles.filterList}>
                {mealAdditiveClearname.map((additive, index) => {
                  const id = `add-${index}`;
                  const checked = mealAdditives.includes(additive.code);
                  return (
                    <li key={index} className={styles.filterItem}>
                      <input
                        type="checkbox"
                        id={id}
                        onChange={() => updateAddFilter(index)}
                        checked={!checked}
                        className={styles.filterCheckbox}
                      />
                      <label htmlFor={id} className={styles.filterLabel}>
                        {additive.name}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {/* Render action buttons */}
          <div className={styles.buttonBar}>
            <button
              title="Apply filter"
              onClick={storeFilter}
              disabled={refreshing}
              className={styles.applyButton}
            >
              {refreshing ? <Spinner /> : "Apply"}
            </button>
            <button
              title="Reset filter"
              onClick={resetFilter}
              disabled={refreshing}
              className={styles.resetButton}
              style={{ display: filterActive ? "block" : "none" }}
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
