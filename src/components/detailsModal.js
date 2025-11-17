"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import shared from "@/styles/shared.module.css";
import styles from "./details.module.css";
import { extractAdditives } from "@/app/utils/additives";
import StarRating from "./starrating";
import { Badge } from "@/components/ui/badge"
import { getCookie, setCookie } from "@/app/utils/client-system";
import toast from "react-hot-toast";
import { ArrowDownUp, Bookmark, Bot, Clock10Icon, EllipsisVertical, FlagIcon, InfoIcon,  Leaf,  SaladIcon,  Scale,  Share2Icon, SoupIcon, StarOff } from "lucide-react";
import  VeganIcon from "../../public/icons/VeganIcon.svg";
import VeggieOpIcon from "../../public/icons/VeggieOpIcon.svg";
import VeganOpIcon  from "../../public/icons/VeganOpIcon.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useModalStore } from '@/app/utils/contextStore';
// lazy-load upload box to avoid loading heavy code unless modal is open
const UploadBox = dynamic(() => import("./uploadBox"), { ssr: false, loading: () => null });

export default function MealPopup({ mealsFull }) {
  const { isOpen, meal,openModal, closeModal } = useModalStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const [user, setUser] = useState();
  const [settings, setSettings] = useState();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedAdditive, setSelectedAdditive] = useState("");
  const ownedRatings = React.useRef([]);
  const [submittedRating, setSubmittedRating] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const tooltipTimer = useRef(null);
  const mounted = useRef(true);

  const requestCloseModal = () => {
    closeModal();
    window.history.back();
  }

  // Detect back gesture on Android, Windows and maybe ios and close modal if open
  useEffect(() => {
    const handlePopState = () => {
      if (isOpen) {
        closeModal();
      }
    };

    const handleEscapePress = (event) => {
      if (event.key === 'Escape' && isOpen) {
        closeModal();
        window.history.back();
      }
    };

    document.addEventListener('keydown', handleEscapePress);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('keydown', handleEscapePress);
    };

  }, [isOpen]);


  //settings and userdata
    const computedAdditives = useMemo(() => extractAdditives(meal?.zsnumnamen), [meal?.zsnumnamen]);

    useEffect(() => {
      setSelectedAdditive("");
      const settingsCookie = getCookie('settings') || null;
      if (settingsCookie) {
        try {
          const parsed = JSON.parse(settingsCookie);
          if (JSON.stringify(parsed) !== JSON.stringify(settings)) setSettings(parsed);
        } catch (e) {  }
      }

      setSelectedVariant(0);

      const bookmarksCookie = getCookie("bookmarks");
      if (bookmarksCookie) {
        try {
          const bookmarks = JSON.parse(bookmarksCookie);
          setIsBookmarked(bookmarks.includes(meal?.artikel_id));
        } catch(e) {
      }
    }

      if (user) {
        setSubmittedRating(ownedRatings.current.find(r => r.lId === meal?.legacyId)?.rating || 0);
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
      const mealId = urlParams.get('artid');
      if (mealId) {
        const foundmeal = mealsFull?.flatMap(m => m.meals).find(m => m?.artikel_id === mealId);
        if (!foundmeal) {
          alert('Meal has expired!');
          window.location.replace('/');
          return;
        }
        openModal(foundmeal);
      }

      async function fetchUserData() {
      }
      fetchUserData();

      return () => { mounted.current = false; }
    }, []);
    


  // Handle publish / update comment
  const handleSubmitRating = useCallback(async (rating) => {
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
  }, [meal?.legacyId, submittedRating]);

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
  const handleBookmark = useCallback((e) => {
    e?.preventDefault();
    const cookieValue = getCookie("bookmarks");
    let bookmarks = [];
    try { bookmarks = cookieValue ? JSON.parse(cookieValue) : []; } catch(e) { bookmarks = []; }
    const idx = bookmarks.indexOf(meal?.artikel_id);
    if (idx !== -1) bookmarks.splice(idx, 1); else bookmarks.push(meal?.artikel_id);
    setCookie("bookmarks", JSON.stringify(bookmarks));
    setIsBookmarked(prev => !prev);
  }, [meal?.artikel_id, setCookie]);



  // Render the meal title based on settings.
  const MealTitle = () => {

    if(settings?.threebar) return (
      <ul className={styles.popupTitleBullets} >
        {meal?.mergedATitle?.map((title, index) => <li key={index} className={meal?.additivePointer[index]?.includes(selectedAdditive) ? styles.highlighted : undefined}>{title.trim().replace(", ", '')}</li>)}
      </ul>);

    return (
      <h2 className={styles.popupTitle} >
        {meal?.mergedTitle?.map((title, index) =>  <span className={meal?.additivePointer[index]?.includes(selectedAdditive) ? styles.highlighted : undefined} key={index}>{title}</span>)}
      </h2>);
  }

  if(!meal || !isOpen) return null;


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
            src={selectedVariant == 0 ? meal?.image ? meal?.imageUrl : "/plate_placeholder.png" : meal?.altImage ? meal?.altImageUrl : "/plate_placeholder.png"}
            title={meal?.atextohnezsz1}
            alt="dish-image"
            className={styles.popupImage}
            width={640} height={310}
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
              {meal?.vegiOption ? (
                <VeggieOpIcon className={styles.greenIcon} />
              ) : (
                ""
              )}
              {meal?.veganOption ? (
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
                        meal?.artikel_id
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
          {meal.altOption && (
            <div
              className={styles.altBox}
              onClick={() => {
                setSelectedVariant(selectedVariant === 0 ? 1 : 0);
              }}
            >
              {meal.vegiOption && <VeggieOpIcon className={styles.altIcon} />}
              {meal.veganOption && <VeganOpIcon className={styles.altIcon} />}
              <div>
                <p className={styles.altTitle}>
                  {meal?.veganOption ? "Vegan" : "Veggie"} Alternative
                </p>
                <p className={styles.altDescription}>{meal?.altOption}</p>
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
          <div
            className={shared.divider}
            style={{ display: meal?.frei1 ? "block" : "none" }}
          />
          {meal?.frei1 && (
            <>
              <p className={styles.sectionTitle}>Information</p>
              <div className={styles.infoText}>
                {meal?.frei1?.includes("Uhr") ? (
                  <Clock10Icon size={18} className={styles.otherIcon} />
                ) : meal?.frei1?.includes("DIY") ? (
                  <Scale size={18} className={styles.otherIcon} />
                ) : meal?.frei1?.includes("Vegetarisch") ? (
                  <Leaf size={18} className={styles.otherIcon} />
                ) : (
                  <InfoIcon size={18} className={styles.otherIcon} />
                )}
                <p>{meal.frei1 + " " + meal.frei2 + " " + meal.frei3}</p>
              </div>
            </>
          )}

          {/* Additive chips */}
          <div className={shared.divider} />
          <div className={styles.additivesSection}>
            <div className={styles.sectionTitle}>
              <p>Additives</p>
              <p className={styles.additivesContext}>Includes all variants</p>
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
              <p className={styles.additivesContext}>Read the title</p>
            )}
          </div>

          {/* Nutrition */}
          {/* <div className={shared.divider} />
          <div className={styles.additivesSection}>
            <div className={styles.sectionTitle}>
              <p>Nutrition</p>
              <p className={styles.additivesContext}>Estimated based on title</p>
            </div>
          </div> */}

          {/* Image upload section */}
          <div className={shared.divider} />
          <div className={styles.additivesSection}>
            <div className={styles.sectionTitle}>
              <p>Submit image</p>
              <p className={styles.additivesContext}></p>
            </div>
            {isOpen && <UploadBox mealId={meal?.legacyId} />}
          </div>
        </div>
      </div>
    </div>
  );
}