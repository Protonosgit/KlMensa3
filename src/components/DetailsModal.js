"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import shared from "@/styles/shared.module.css";
import styles from "./DetailsModal.module.css";
import { extractAdditives } from "@/app/utils/additives";
import StarRating from "./Starrating";
import { Badge } from "@/components/ui/badge";
import { getCookie, setCookie } from "@/app/utils/client-system";
import toast from "react-hot-toast";
import { getNutritionForId } from "@/app/utils/database-actions";
import {
  ArrowDownUp,
  Bookmark,
  Bot,
  Clock10Icon,
  EllipsisVertical,
  FlagIcon,
  InfoIcon,
  Leaf,
  SaladIcon,
  Scale,
  Share2Icon,
  SoupIcon,
  SparklesIcon,
  StarOff,
} from "lucide-react";
import VeganIcon from "../../public/icons/VeganIcon.svg";
import VeggieOpIcon from "../../public/icons/VeggieOpIcon.svg";
import VeganOpIcon from "../../public/icons/VeganOpIcon.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModalStore } from "@/app/utils/contextStore";
// lazy-load upload box to avoid loading heavy code unless modal is open
const UploadBox = dynamic(() => import("./UploadBox"), {
  ssr: false,
  loading: () => null,
});

export default function MealModal({ mealsFull }) {
  const { isOpen, meal, openModal, closeModal } = useModalStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const [user, setUser] = useState();
  const [settings, setSettings] = useState();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedAdditive, setSelectedAdditive] = useState("");
  const ownedRatings = React.useRef([]);
  const [submittedRating, setSubmittedRating] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [nutrition, setNutrition] = useState({});
  const tooltipTimer = useRef(null);
  const mounted = useRef(true);

  const requestCloseModal = () => {
    closeModal();
    window.history.back();
  };

  // Detect back gesture on Android, Windows and maybe ios and close modal if open
  useEffect(() => {
    const handlePopState = () => {
      if (isOpen) {
        closeModal();
      }
    };

    const handleEscapePress = (event) => {
      if (event.key === "Escape" && isOpen) {
        closeModal();
        window.history.back();
      }
    };

    document.addEventListener("keydown", handleEscapePress);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("keydown", handleEscapePress);
    };
  }, [isOpen]);

  //settings and userdata
  const computedAdditives = useMemo(
    () => extractAdditives(meal?.zsnumnamen),
    [meal?.zsnumnamen]
  );

  async function loadNutrition(id) {
    return null;
    const nutrition = await getNutritionForId(id);
    setNutrition(nutrition?.data[0]);
  }

  useEffect(() => {
    setSelectedAdditive("");
    const settingsCookie = getCookie("settings") || null;
    if (settingsCookie) {
      try {
        const parsed = JSON.parse(settingsCookie);
        if (JSON.stringify(parsed) !== JSON.stringify(settings))
          setSettings(parsed);
      } catch (e) {}
    }

    setSelectedVariant(0);

    const bookmarksCookie = getCookie("bookmarks");
    if (bookmarksCookie) {
      try {
        const bookmarks = JSON.parse(bookmarksCookie);
        setIsBookmarked(bookmarks.includes(meal?.murmurID));
      } catch (e) {}
    }

    if(isOpen) {
      loadNutrition(meal?.murmurID);
    }

    if (user) {
      setSubmittedRating(
        ownedRatings.current.find((r) => r.lId === meal?.legacyId)?.rating || 0
      );
    }

    return () => {
      if (tooltipTimer.current) {
        clearTimeout(tooltipTimer.current);
        tooltipTimer.current = null;
        setShowTooltip(false);
      }
    };
  }, [meal, mealsFull, computedAdditives, user]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mealId = urlParams.get("artid");
    if (mealId) {
      const foundmeal = mealsFull
        ?.flatMap((m) => m.meals)
        .find((m) => m?.murmurID === mealId);
      if (!foundmeal) {
        alert("Meal has expired!");
        window.location.replace("/");
        return;
      }
      loadNutrition(foundmeal?.murmurID);
      openModal(foundmeal);
    }

    async function fetchUserData() {
      
    }
    fetchUserData();

    return () => {
      mounted.current = false;
    };
  }, []);

  // Handle publish / update comment
  const handleSubmitRating = useCallback(
    async (rating) => {
      if (!meal?.legacyId) return;
      const previous = submittedRating;
      setSubmittedRating(rating);
      try {
        // if your putRating supports AbortController, pass one; otherwise await and handle errors
        await putRating(meal.legacyId, rating);
        toast.success("Rating saved");
      } catch (err) {
        setSubmittedRating(previous);
        toast.error("Failed to save rating");
        console.error(err);
      }
    },
    [meal?.legacyId, submittedRating]
  );

  // Handle delete comment
  const handleDeleteRating = useCallback(async () => {
    if (!meal?.legacyId) return;
    const previous = submittedRating;
    setSubmittedRating(0);
    try {
      await deleteRating(meal.legacyId);
      toast.success("Rating deleted");
    } catch (err) {
      setSubmittedRating(previous);
      toast.error("Failed to delete rating");
      console.error(err);
    }
  }, [meal?.legacyId, submittedRating]);

  // Handle reporting a comment or image.
  async function handleRequestImageTakedown() {
    toast.error("Under construction!");
  }

  // Handle bookmark
  const handleBookmark = useCallback(
    (e) => {
      e?.preventDefault();
      const cookieValue = getCookie("bookmarks");
      let bookmarks = [];
      try {
        bookmarks = cookieValue ? JSON.parse(cookieValue) : [];
      } catch (e) {
        bookmarks = [];
      }
      const idx = bookmarks.indexOf(meal?.murmurID);
      if (idx !== -1) bookmarks.splice(idx, 1);
      else bookmarks.push(meal?.murmurID);
      setCookie("bookmarks", JSON.stringify(bookmarks));
      setIsBookmarked((prev) => !prev);
    },
    [meal?.artikel_id, setCookie]
  );

  // Render the meal title based on settings.
  const MealTitle = () => {

    if (settings?.threebar)
      return (
        <ul className={styles.popupTitleBullets}>
          {meal?.titleReg?.map((titlepart, index) => (
            <li
              key={index}
              className={
                meal?.additivesMap[index]?.includes(selectedAdditive)
                  ? styles.highlighted
                  : undefined
              }
            >
              {titlepart.trim().replace(", ", "")}
            </li>
          ))}
        </ul>
      );

    return (
      <h2 className={styles.popupTitle}>
        {meal?.titleReg?.map((titlepart, index) => (
          <span
            className={
              meal?.titleRegAdditives[index]?.includes(selectedAdditive)
                ? styles.highlighted
                : undefined
            }
            key={index}
          >
            {titlepart}
          </span>
        ))}
      </h2>
    );
  };

  if (!meal || !isOpen) return null;

  return (
    <div title="" className={shared.popupOverlay} onClick={requestCloseModal}>
      <div className={shared.popupContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.popupImageContainer}>
          {/* Render meal image from any source or placeholder */}
          <Image
            priority={false}
            loading={"lazy"}
            onLoadStart={(e) => (e.target.style.opacity = "0")}
            onLoad={(e) => (e.target.style.opacity = "1")}
            onError={(e) => {
              const img = e.currentTarget;
              if (img.dataset.fallbackApplied) return;
              img.onerror = null;
              img.removeAttribute("srcset");
              img.dataset.fallbackApplied = "1";
              img.src = "/plate_placeholder.png";
            }}
            src={
              selectedVariant == 0
                ? meal?.image
                  ? meal?.imageUrl
                  : "/plate_placeholder.png"
                : meal?.altImage
                ? meal?.altImageUrl
                : "/plate_placeholder.png"
            }
            title={meal?.titleReg[0]}
            alt="dish-image"
            className={styles.popupImage}
            width={640}
            height={310}
          />

          <div className={styles.overlayLocationBar}>
            <p title="Location" className={styles.popupLocation}>
              {meal.dpartname}

              {meal?.dpname == "Robotic Kitchen" ? (
                <Bot size={20} className={styles.otherIcon} />
              ) : (
                ""
              )}
              {meal?.dpartname == "Salatbüfett" ? (
                <SaladIcon size={20} className={styles.otherIcon} />
              ) : (
                ""
              )}
              {meal?.dpartname == "Eintopf 1" ||
              meal?.dpartname == "Eintopf 2" ? (
                <SoupIcon size={20} className={styles.otherIcon} />
              ) : (
                ""
              )}
              {meal?.altType === 1 ? (
                <VeggieOpIcon className={styles.greenIcon} />
              ) : (
                ""
              )}
              {meal?.altType === 2 ? (
                <VeganOpIcon className={styles.greenIcon} />
              ) : (
                ""
              )}
              {meal?.menuekennztext == "V+" ? (
                <VeganIcon className={styles.greenIcon} />
              ) : (
                ""
              )}
            </p>
          </div>

          <div className={styles.overlayActionsBar}>
            <DropdownMenu>
              <DropdownMenuTrigger className={styles.popupActionButton}>
                <EllipsisVertical size={18} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className={shared.dropdownMenuContent}>
                <DropdownMenuItem
                  className={shared.dropdownMenuItem}
                  onClick={(e) => handleBookmark(e)}
                >
                  <Bookmark
                    size={18}
                    className={
                      isBookmarked ? styles.bookmarkActive : styles.bookmark
                    }
                  />
                  Bookmark
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={shared.dropdownMenuItem}
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_CURRENT_DOMAIN}?artid=` +
                        meal?.murmurID
                    ) && toast.success("Link copied to clipboard!")
                  }
                >
                  <Share2Icon size={18} />
                  Share
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className={shared.dropdownMenuItem}
                  onClick={() => handleRequestImageTakedown()}
                >
                  <FlagIcon size={18} />
                  Remove image
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={shared.dropdownMenuItem}
                  style={{ display: submittedRating ? "flex" : "none" }}
                  onClick={handleDeleteRating}
                >
                  <StarOff size={18} />
                  Delete rating
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={requestCloseModal}
              className={styles.popupActionButton}
            >
              ×
            </button>
          </div>
        </div>

        {/* Render meal details, comments and action buttons */}
        <div className={styles.popupDetails}>
          <MealTitle />

          <div className={styles.popupPriceRating}>
            <span title="Price" className={styles.popupPrice}>
              {meal?.price?.stu || meal?.price?.price}
            </span>
            <div className={styles.popupRating}>
              <div
                className={shared.tooltipWrapper}
                role="button"
                tabIndex={0}
                aria-label="Rate this meal"
              >
                <StarRating
                  disabled={!user}
                  commonRating={
                    selectedVariant == 0 ? meal?.rating : meal?.altRating
                  }
                  submittedRating={submittedRating}
                  setSubmittedRating={setSubmittedRating}
                  starsSet={handleSubmitRating}
                />
                <span
                  className={`${shared.tooltipBubble} ${
                    showTooltip ? shared.triggerTooltip : ""
                  }`}
                  role="tooltip"
                >
                  Click to rate this meal!
                </span>
              </div>
              <span className={styles.ratingCount}>
                (
                {(selectedVariant == 0
                  ? meal?.rating_amt
                  : meal?.altRating_amt) || "0"}
                )
              </span>
            </div>
          </div>

          {/* Alternative options */}
          {meal?.altType >0 && (
            <div
              className={styles.altBox}
              onClick={() => {
                setSelectedVariant(selectedVariant === 0 ? 1 : 0);
              }}
            >
              {meal.altType === 1 && (
                <VeggieOpIcon className={styles.altIcon} />
              )}
              {meal.altType === 2 && <VeganOpIcon className={styles.altIcon} />}
              <div>
                <p className={styles.altTitle}>
                  {meal?.altType === 2 ? "Vegan" : "Veggie"} Alternative
                </p>
                <p className={styles.altDescription}>{meal?.titleAlt.flat()}</p>
              </div>
              <ArrowDownUp
                size={20}
                className={`${styles.swapIcon} ${
                  selectedVariant === 1 ? styles.activeColor : ""
                }`}
              />
            </div>
          )}

          {/* Additional information */}
          {meal?.mergedFreitextList[0] && (
            <>
              <div className={shared.divider} />
              <p className={styles.sectionTitle}>Information</p>
              <div className={styles.infoText}>
                {meal?.mergedFreitextList[0]?.includes("Uhr") ? (
                  <Clock10Icon size={18} className={styles.otherIcon} />
                ) : meal?.mergedFreitextList[0]?.includes("DIY") ? (
                  <Scale size={18} className={styles.otherIcon} />
                ) : meal?.mergedFreitextList[0]?.includes("Vegetarisch") ? (
                  <Leaf size={18} className={styles.otherIcon} />
                ) : (
                  <InfoIcon size={18} className={styles.otherIcon} />
                )}
                <p>{meal?.mergedFreitextList[0]}</p>
              </div>
            </>
          )}

          {/* Additive chips */}
          <div className={styles.additivesSection}>
            <div className={shared.divider} />
            <div className={styles.sectionTitle}>
              <p>Additives</p>
              <p className={styles.sectionContext}>Includes all variants</p>
            </div>
            {computedAdditives?.length > 1 ? (
              <div>
                {" "}
                {computedAdditives?.map((additive) => (
                  <Badge
                    title={additive?.name}
                    onClick={() => setSelectedAdditive(additive?.code)}
                    className={styles.dietaryTag}
                    key={additive?.code}
                  >
                    {additive?.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className={styles.sectionContext}>Read the title</p>
            )}
          </div>

          {/* Nutrition */}
          {/* {nutrition && selectedVariant === 0 ? (
            <div className={styles.additivesSection}>
              <div className={shared.divider} />
              <div className={styles.sectionTitle}>
                <p>Nutrition</p>
                <p className={styles.sectionContext}>
                  <SparklesIcon size={18} />
                  AI powered
                </p>
              </div>
              <table className={styles.nutritionTable}>
                <thead>
                  <tr>
                    <th>Calories (kcal)</th>
                    <th>Protein (g)</th>
                    <th>Fat (g)</th>
                    <th>Carbohydrates (g)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{nutrition?.kalorien_kcal || "?"}</td>
                    <td>{nutrition?.protein_g || "?"}</td>
                    <td>{nutrition?.fett_g || "?"}</td>
                    <td>{nutrition?.kohlenhydrate_g || "?"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null} */}

          {/* Image upload section */}
          <div className={shared.divider} />
          <div className={styles.additivesSection}>
            <div className={styles.sectionTitle}>
              <p>Submit image</p>
            </div>
            {isOpen && <UploadBox mealId={meal?.legacyId} />}
          </div>
        </div>
      </div>
    </div>
  );
}
