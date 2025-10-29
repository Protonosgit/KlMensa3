"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./details.module.css";
import { extractAdditives } from "@/app/utils/additives";
import StarRating from "./starrating";
import { Badge } from "@/components/ui/badge"
import { getCookie, setCookie } from "@/app/utils/cookie-monster";
import toast from "react-hot-toast";
import { ArrowDownUp, Bookmark, Bot, EllipsisVertical, FlagIcon, InfoIcon,  Share2Icon, StarOff } from "lucide-react";
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
import UploadBox from "./uploadBox";
import { putRating, deleteRating } from "@/app/utils/database-actions";

export default function MealPopup({ mealsFull }) {
  const { isOpen, meal,openModal, closeModal } = useModalStore();
  // State variables for managing user input, meal details, and UI updates.
  const [showTooltip, setShowTooltip] = useState(false);
  const [additives, setAdditives] = useState([]);
  const [user, setUser] = useState();
  const [settings, setSettings] = useState();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedAdditive, setSelectedAdditive] = useState("");
  const ownedRatings = React.useRef([]);
  const [submittedRating, setSubmittedRating] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);

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
      if (event.key === 'Escape') {
        closeModal();
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
    useEffect(() => {
      // Run on meal change
      setSelectedAdditive("");
      let tooltipTimer;
        
      // retrieve cookies for settings
      setAdditives(extractAdditives(meal?.zsnumnamen));

      // retrieve cookies for settings
      const settingsCookie = getCookie('settings') || null;
      if(settingsCookie) {
        setSettings(JSON.parse(settingsCookie));
      }

      // auto switching to alternative
      setSelectedVariant(0);

      // retrieve cookies for bookmarks
      const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("bookmarks"))
      ?.split("=")[1];
      if (cookieValue) {
        const bookmarks = JSON.parse(cookieValue);
        setIsBookmarked(bookmarks.includes(meal?.artikel_id));
      }

      // search for user owned rating
      if(user) {
        setSubmittedRating(ownedRatings.current.find(r => r.lId === meal?.legacyId)?.rating || 0);
      }

      return () => {
        if (tooltipTimer) {
          clearTimeout(tooltipTimer);
          setShowTooltip(false);
        }
      };

    }, [meal, mealsFull]);

    useEffect(() => {
      // Run once onload
      const urlParams = new URLSearchParams(window.location.search);
      const mealId = urlParams.get('artid');
      if(mealId) {
        const foundmeal = mealsFull?.flatMap(m => m.meals).find(m => m.artikel_id === mealId);
        if(!foundmeal) {
          alert('Meal has expired!');
          window.location.replace('/');
          return;
        }
        openModal(foundmeal);
      }

      // fetch userdata
      async function fetchUserData() {
        if(false) {
          setUser(null);

          // Show tooltip if there are too few ratins
          if(getCookie('rateHintShown') !== 'true') {
          setShowTooltip(true);
          tooltipTimer = setTimeout(() => {
            setShowTooltip(false);
            setCookie('rateHintShown', 'true', 20);
          }, 6000);
          }
        }

        // query database for all userowned ratings

        // ownedRatings.current = [{lId: 57076, rating: 4}, {lId: 57134, rating: 3}, {lId: 57093, rating: 2}];

      }
      fetchUserData();
    }, [])
    


  // Handle publishing or updating a comment.
  async function handleSubmitRating(rating) {
    // use put request to api here
    toast.error("Under construction!");
    putRating(meal.legacyId, rating);
  }

  // Handle deleting a comment.
  async function handleDeleteRating() {
    // use delete request to api heres
    toast.error("Under construction!");
    setSubmittedRating(0);
    deleteRating(meal.legacyId);
  }

  // Handle reporting a comment or image.
  async function handleRequestImageTakedown() {
    // will be handled in seperate form on different page in the future!!
    if(confirm("Request image removal from the site?")) {
      toast.error("Under construction!");
    }
  }

  // Handle bookmarking/unbookmarking the meal.
  async function handleBookmark(e) {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("bookmarks"))
      ?.split("=")[1];
    const bookmarks = cookieValue ? JSON.parse(cookieValue) : [];
    const bookmarkIndex = bookmarks.indexOf(meal.artikel_id);

    if (bookmarkIndex !== -1) {
      bookmarks.splice(bookmarkIndex, 1);
    } else {
      bookmarks.push(meal.artikel_id);
    }

    document.cookie = `bookmarks=${JSON.stringify(bookmarks)}; path=/`;
    setIsBookmarked(!isBookmarked);
    e.preventDefault();
  }


  // Render the meal title based on settings.
  const MealTitle = () => {
    if(settings?.threebar) return (
      <ul className={styles.popupTitleBullets} >
        {meal?.mergedATitle?.map((title, index) => <li key={index} className={meal?.additivePointer[index]?.includes(selectedAdditive) ? styles.highlighted : undefined}>{title.trim().replace(", ", '')}</li>)}
      </ul>);

    return (
      <h2 className={styles.popupTitle} >
        {meal?.mergedTitle?.map((title, index) =>   <span className={meal?.additivePointer[index]?.includes(selectedAdditive) ? styles.highlighted : undefined} key={index}>{title}</span>)}
      </h2>);
  }

  if(!meal || !isOpen) return null;

  // Render the modal UI for meal details, comments, and actions.
  return (
    <div title="" className={styles.popupOverlay} onClick={requestCloseModal}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.popupImageContainer}>
          {/* Render meal image from any source or placeholder */}
            <Image 
              priority={false} 
              loading={"lazy"} 
              src={meal?.image? meal?.imageUrl : "/plate_placeholder.png"}  title={meal?.atextohnezsz1}
              alt="dish-image" className={styles.popupImage} 
              width={1600} height={900} />

          <div className={styles.overlayLocationBar}>
              <p title="Location" className={styles.popupLocation}>
              {meal.dpartname}
              
              {meal?.dpname == "Robotic Kitchen" ? <Bot size={20} className={styles.otherIcon} /> : ""}
              {meal?.vegiOption ? <VeggieOpIcon className={styles.greenIcon} /> : ""}
              {meal?.veganOption ? <VeganOpIcon className={styles.greenIcon} /> : ""}
              {meal?.menuekennztext == "V+" ? <VeganIcon className={styles.greenIcon}/> : ""}
              
            </p>
          </div>

          <div className={styles.overlayActionsBar}>
            <DropdownMenu>
              <DropdownMenuTrigger className={styles.popupActionButton}><EllipsisVertical size={18} /></DropdownMenuTrigger>
                <DropdownMenuContent className={styles.dropdownMenuContent}>
                  <DropdownMenuItem className={styles.dropdownMenuItem} onClick={(e) => (handleBookmark(e))} ><Bookmark size={18} className={isBookmarked ? styles.bookmarkActive : styles.bookmark} />Bookmark</DropdownMenuItem>
                  <DropdownMenuItem className={styles.dropdownMenuItem} onClick={() => navigator.clipboard.writeText("kl-mensa.vercel.app?artid="+meal.artikel_id) && toast.success("Link copied to clipboard!")}><Share2Icon size={18} />Share</DropdownMenuItem>
  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className={styles.dropdownMenuItem} onClick={() => handleRequestImageTakedown()} ><FlagIcon size={18} />Remove image</DropdownMenuItem>
                  <DropdownMenuItem className={styles.dropdownMenuItem} style={{display: submittedRating ? "flex" : "none"}} onClick={handleDeleteRating} ><StarOff size={18} />Delete rating</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            <button onClick={requestCloseModal} className={styles.popupActionButton}>×</button>
          </div>
          
        </div>

        {/* Render meal details, comments, and action buttons */}
        <div className={styles.popupDetails}>
          <MealTitle />

          <div className={styles.popupPriceRating}>
            <span title="Price" className={styles.popupPrice}>{meal?.price?.stu || meal?.price?.price}</span>
            <div className={styles.popupRating}>
              <div
                className={styles.tooltipWrapper}
                role="button"
                tabIndex={0}
                aria-label="Rate this meal"
              >
                <StarRating disabled={!user} commonRating={meal?.rating} submittedRating={submittedRating} setSubmittedRating={setSubmittedRating} starsSet={handleSubmitRating} />
                <span className={`${styles.tooltipBubble} ${showTooltip ? styles.triggerTooltip : ""}`} role="tooltip">Click to rate this meal!</span>
              </div>
               <span className={styles.ratingCount} >({meal?.rating_amt || "0"})</span>
            </div>
          </div>


          {meal.altOption &&     
          <div className={styles.altBox} onClick={() => {setSelectedVariant(selectedVariant === 0 ? 1 : 0)}}>
                {meal.vegiOption && <VeggieOpIcon className={styles.altIcon} />  }
                {meal.veganOption && <VeganOpIcon className={styles.altIcon} /> }
            <div>
              <p className={styles.altTitle}>{meal?.veganOption ? "Vegan" : "Veggie"} Alternative</p>
              <p className={styles.altDescription}>{meal?.altOption}</p>
            </div>
            <ArrowDownUp size={20} className={`${styles.swapIcon} ${selectedVariant === 1 ? styles.activeColor : ""}`}/>
          </div>}
          <div className={styles.divider} style={{display: meal?.frei1 ? "block" : "none"}} />
            {meal?.frei1 &&<>
            <p className={styles.sectionTitle}>Information</p>
            <div className={styles.infoText}>
            <InfoIcon size={18} className={styles.otherIcon} />
            <p>{meal.frei1+" "+meal.frei2}</p>
            </div></>}

          <div className={styles.divider} />
          <div className={styles.additivesSection}>
            <div className={styles.sectionTitle}>
              <p>Additives</p>
              <p className={styles.additivesContext}>Includes all variants</p>
            </div>
            {additives?.length > 1 ? <div> {additives?.map((additive) => <Badge title={additive?.name} onClick={() => setSelectedAdditive(additive?.code)} className={styles.dietaryTag} key={additive?.code}>{additive?.name}</Badge>)}</div> : <p className={styles.additivesContext}>Read the title</p>}
          </div>
        
          <div className={styles.divider} />
          <div className={styles.additivesSection}>
            <div className={styles.sectionTitle}>
              <p>Submit image</p>
              <p className={styles.additivesContext}></p>
            </div>
            <UploadBox mealId={meal.legacyId}/>
          </div>

        </div>
      </div>
    </div>
  )
}