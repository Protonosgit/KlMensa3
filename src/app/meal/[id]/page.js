// src/app/@modal/(.)item/[id]/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { extractAdditives } from "@/app/utils/additives";
import StarRating from "@/components/starrating";
import { Badge } from "@/components/ui/badge"
import { getCookie, setCookie } from "@/app/utils/cookie-monster";
import { fetchMenu } from '@/app/utils/schedule-parser';
import toast from "react-hot-toast";
import { ArrowDownUp, Bookmark, Bot, EllipsisVertical, FlagIcon, InfoIcon,  Scale,  Share2Icon, SoupIcon, StarOff } from "lucide-react";
import  VeganIcon from   "../../../../public/icons/VeganIcon.svg";
import VeggieOpIcon from "../../../../public/icons/VeggieOpIcon.svg";
import VeganOpIcon  from "../../../../public/icons/VeganOpIcon.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UploadBox from "@/components/uploadBox";
import { putRating, deleteRating } from "@/app/utils/database-actions";
import { useRouter, useParams } from "next/navigation";
import styles from "@/styles/details.module.css";
import { retrieveUserAccountData } from "@/app/utils/auth-actions";


export default function MealPage({ params }) {
  // State variables for managing user input, meal details, and UI updates.
  const [meal, setMeal] = useState({});
  const [showTooltip, setShowTooltip] = useState(false);
  const [additives, setAdditives] = useState([]);
  const [user, setUser] = useState();
  const [settings, setSettings] = useState();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedAdditive, setSelectedAdditive] = useState("");
  const [submittedRating, setSubmittedRating] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);

  const requestCloseModal = () => {
    window.location.replace('/');
  }

  // Detect back gesture on Android, Windows and maybe ios and close modal if open
  useEffect(() => {
    const handlePopState = () => {
        window.location.replace('/');
    };

    const handleEscapePress = (event) => {
      if (event.key === 'Escape') {
        window.location.replace('/');
      }
    };

    document.addEventListener('keydown', handleEscapePress);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('keydown', handleEscapePress);
    };

  }, []);


  //settings and userdata
    useEffect(() => {

      async function loadSelectedMenuItem() {
        const mid = (await params)?.id;
        const mealsData = await fetchMenu();
        const meals = mealsData.reduce((acc, cur) => {
          return [...acc, ...cur.meals];
        }, []);
        const menu = meals.find((item) => item.artikel_id === mid);
        if (menu) {
          setMeal(menu);
          setAdditives(extractAdditives(menu?.zsnumnamen));
        } else {
          alert('Item has expired!');
          window.location.replace('/');
        }
      }

      // load data
      loadSelectedMenuItem();

      // Run on meal change
      setSelectedAdditive("");
      let tooltipTimer;
      
      

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


      return () => {
        if (tooltipTimer) {
          clearTimeout(tooltipTimer);
          setShowTooltip(false);
        }
      };
    }, []);

    useEffect(() => {

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
    return;
          if ('Translator' in self) {
            const translator = await Translator.create({
              sourceLanguage: "en",
              targetLanguage: "ja"
            });
          const detector = await LanguageDetector.create({ expectedInputLanguages: ["en", "ja"] });

          const results = await detector.detect("Hello jamaican");
          for (const result of results) {
            console.log(result.detectedLanguage, result.confidence);
          }
        }
  }

  // Handle bookmarking/unbookmarking the meal.
  async function handleBookmark(e) {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("bookmarks"))
      ?.split("=")[1];
    const bookmarks = cookieValue ? JSON.parse(cookieValue) : [];
    const bookmarkIndex = bookmarks.indexOf(meal?.artikel_id);

    if (bookmarkIndex !== -1) {
      bookmarks.splice(bookmarkIndex, 1);
    } else {
      bookmarks.push(meal?.artikel_id);
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
        {meal?.mergedTitle?.map((title, index) =>  <span className={meal?.additivePointer[index]?.includes(selectedAdditive) ? styles.highlighted : undefined} key={index}>{title}</span>)}
      </h2>);
  }


  // Render the modal UI for meal details, comments, and actions.
  return (
    <div title="" className={styles.popupOverlay} onClick={requestCloseModal}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.popupImageContainer}>
          {/* Render meal image from any source or placeholder */}
            <Image 
              priority={false} 
              loading={"lazy"} 
              src={selectedVariant == 0 ? (meal?.image? meal?.imageUrl : "/plate_placeholder.png") : (meal?.altImage? meal?.altImageUrl : "/plate_placeholder.png")}  title={meal?.atextohnezsz1}
              alt="dish-image" className={styles.popupImage} 
              width={1600} height={900} />

          <div className={styles.overlayLocationBar}>
              <p title="Location" className={styles.popupLocation}>
              {meal.dpartname}
              
              {meal?.dpname == "Robotic Kitchen" ? <Bot size={20} className={styles.otherIcon} /> : ""}
              {meal?.dpartname == "Salatbüfett" ? <Scale size={20} className={styles.otherIcon} /> : ""}
              {meal?.dpartname == "Eintopf 1" || meal?.dpartname == "Eintopf 2" ? <SoupIcon size={20} className={styles.otherIcon} /> : ""}
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
                  <DropdownMenuItem className={styles.dropdownMenuItem} onClick={() => navigator.clipboard.writeText("kl-mensa.vercel.app?artid="+meal?.artikel_id) && toast.success("Link copied to clipboard!")}><Share2Icon size={18} />Share</DropdownMenuItem>
  
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
                <StarRating disabled={!user} commonRating={selectedVariant == 0 ? meal?.rating : meal?.altRating} submittedRating={submittedRating} setSubmittedRating={setSubmittedRating} starsSet={handleSubmitRating} />
                <span className={`${styles.tooltipBubble} ${showTooltip ? styles.triggerTooltip : ""}`} role="tooltip">Click to rate this meal!</span>
              </div>
               <span className={styles.ratingCount} >({(selectedVariant == 0 ? meal?.rating_amt : meal?.altRating_amt) || "0"})</span>
            </div>
          </div>


          {/* Alternative options */}
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

          {/* Additional information */}
          <div className={styles.divider} style={{display: meal?.frei1 ? "block" : "none"}} />
            {meal?.frei1 &&<>
            <p className={styles.sectionTitle}>Information</p>
            <div className={styles.infoText}>
            <InfoIcon size={18} className={styles.otherIcon} />
            <p>{meal.frei1+" "+meal.frei2}</p>
            </div></>}

            {/* Additive chips */}
          <div className={styles.divider} />
          <div className={styles.additivesSection}>
            <div className={styles.sectionTitle}>
              <p>Additives</p>
              <p className={styles.additivesContext}>Includes all variants</p>
            </div>
            {additives?.length > 1 ? <div> {additives?.map((additive) => <Badge title={additive?.name} onClick={() => setSelectedAdditive(additive?.code)} className={styles.dietaryTag} key={additive?.code}>{additive?.name}</Badge>)}</div> : <p className={styles.additivesContext}>Read the title</p>}
          </div>

        {/* Nutrition */}
          {/* <div className={styles.divider} />
          <div className={styles.additivesSection}>
            <div className={styles.sectionTitle}>
              <p>Nutrition</p>
              <p className={styles.additivesContext}>Estimated based on title</p>
            </div>
          </div> */}

            {/* Image upload section */}
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