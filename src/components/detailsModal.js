"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./details.module.css";
import { extractAdditives } from "@/app/utils/additives";
import StarRating from "./starrating";
import { Badge } from "@/components/ui/badge"
import { getCookie } from "@/app/utils/cookie-monster";
import { publishComment,updateComment,deleteComment,reportComment } from "@/app/utils/database-actions";
import { createClient } from "@/app/utils/supabase/client";
import toast from "react-hot-toast";
import { Bookmark, Bot, CookingPot, EllipsisVertical, FlagIcon, InfoIcon, Scale, Share2Icon, UploadIcon } from "lucide-react";
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

export default function MealPopup({ mealsFull }) {
  const { isOpen, meal,openModal, closeModal } = useModalStore();
  // State variables for managing user input, meal details, and UI updates.
  const [showTooltip, setShowTooltip] = useState(false);
  const [additives, setAdditives] = useState([]);
  const [user, setUser] = useState();
  const [settings, setSettings] = useState();
  const [actionPending, setActionPending] = useState(false);
  const [ownsImage, setOwnsImage] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);


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
      let tooltipTimer;
      // retrieve cookies for settings
      setAdditives(extractAdditives(meal?.zsnumnamen));

      const settingsCookie = getCookie('settings') || null;
      if(settingsCookie) {
        setSettings(JSON.parse(settingsCookie));
      }

      // fetch userdata
      async function fetchUserData() {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();
        if(data?.user) {
          setUser(data?.user);

          // Show tooltip if there are too few ratins
          if(meal?.rating_amt < 3 || !meal?.rating_amt) {
          setShowTooltip(true);
          tooltipTimer = setTimeout(() => {
            setShowTooltip(false);
          }, 3000);
          }
        }
      }
      fetchUserData();

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

    }, [meal, mealsFull]);

    useEffect(() => {
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
    }, [])
    



  // Handle publishing or updating a comment.
  async function handleSetRating(rating) {
    setActionPending(true);
    toast.success("Rating failed successfully!");
    setShowTooltip(false);
    setActionPending(false);
  }

  // Handle deleting a comment.
  async function handleDeleteRating() {
    setActionPending(true);
    setActionPending(false);
  }

  // Handle reporting a comment or image.
  async function handleReportRequest(commentId, imageId) {
    // will be handled in seperate form on different page in the future!!
    if(confirm("Report the content for being: offensive, spam, irrelevant or harmfull in any way?")) {
      toast.success("Report sent!");
      reportComment(commentId, imageId);
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

  // Handle uploading a meal image.
async function handleUploadMealImage() {
  if (!user) {
    toast.error("You must be logged in to upload an image");
    return;
  }

  const artikelId = meal?.artikel_id.replace(/\./g, "");
  const supabase = createClient();

  // Check if user already has an image uploaded
  if (ownsImage) {
    if (confirm("You already have an image for this meal. Do you want to delete it?")) {
      await supabase.storage.from("meal-images").remove([ownsImage]);
      toast.success("Image deleted!");
    }
    return;
  }
  alert("Temporary disabled due to a server conflict!");
  return;

  // Set up file request
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/png, image/jpeg, image/webp, image/heic, image/heif";

  // When file is selected
  fileInput.onchange = async () => {
    toast.loading("Processing image...");
    const file = fileInput.files[0];

    // Convert image to webp and compress to 80%
    const img = document.createElement("img");
    const reader = new FileReader();
    reader.onload = async (e) => {
      img.src = e.target.result;
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        // Compress and convert to webp then upload to supabase bucket
        canvas.toBlob(
          async (blob) => {
            toast.loading("Uploading image...");
            // upload to supabase with article_id
            const { data, error } = await supabase.storage
              .from("meal-images")
              .upload(artikelId + "_" + Date.now() + ".webp", blob, {
                contentType: "image/webp",
              });
            toast.dismiss();
            if (error) {
              toast.error( "Error while uploading, maybe you already posted an image!");
            } else {
              toast.success("Image uploaded successfully!");

            }
          }, "image/webp", 0.8); // 0.8 is quality/compression
      };
      img.onerror = (err) => {
        toast.dismiss();
        toast.error("Failed to process image.");
      };
    };
    reader.onerror = (err) => {
      toast.error("Failed to read image file.");
    };
    

    // Check if file image is heic and convert
    if (file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif")) {
      try {
        const heic2any = (await import("heic2any")).default;
        const heicblob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.7
        });
        reader.readAsDataURL(heicblob);
      } catch (error) {
        toast.dismiss();
        toast.error("Failed convert image.");
      }
    } else {
      reader.readAsDataURL(file);
    }
  };
  // Trigger file input
  fileInput.click();
}

  // Render the meal title based on settings.
  const MealTitle = () => {
    if(settings?.threebar) return (
      <ul className={styles.popupTitleBullets} >
        {meal?.atextohnezsz1 && <li>{settings?.intitle ? meal?.atextz1	 : meal?.atextohnezsz1}</li>}
        {meal?.atextohnezsz2 && <li>{settings?.intitle ? meal?.atextz2	 : meal?.atextohnezsz2}</li>}
        {meal?.atextohnezsz3 && <li>{settings?.intitle ? meal?.atextz3	 : meal?.atextohnezsz3}</li>}
        {meal?.atextohnezsz4 && <li>{settings?.intitle ? meal?.atextz4	 : meal?.atextohnezsz4}</li>}
        {meal?.atextohnezsz5 && <li>{settings?.intitle ? meal?.atextz5	 : meal?.atextohnezsz5}</li>}
        {meal?.atextohnezsz6 && <li>{settings?.intitle ? meal?.atextz6	 : meal?.atextohnezsz6}</li>}
        {meal?.atextohnezsz7 && <li>{settings?.intitle ? meal?.atextz7	 : meal?.atextohnezsz7}</li>}
        {meal?.atextohnezsz8 && <li>{settings?.intitle ? meal?.atextz8	 : meal?.atextohnezsz8}</li>}
      </ul>);

    return <h2 className={styles.popupTitle} title={meal?.titleAdditivesCombined}>{settings?.intitle ? (meal?.titleAdditivesCombined) : meal?.titleCombined}</h2>;
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
                  <DropdownMenuItem className={styles.dropdownMenuItem} onClick={() => (handleUploadMealImage())}>{ownsImage ? <CookingPot size={18} /> : <UploadIcon size={18} />}Submit image</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className={styles.dropdownMenuItem} onClick={() => (handleReportRequest(meal.id))}><FlagIcon size={18} />Report image</DropdownMenuItem>
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
                <StarRating predefined={meal?.rating} starsSet={handleSetRating} />
                <span className={`${styles.tooltipBubble} ${showTooltip ? styles.triggerTooltip : ""}`} role="tooltip">Rate this meal</span>
              </div>
               <span className={styles.ratingCount} >({meal?.rating_amt || "0"})</span>
            </div>
          </div>


          {meal.altOption &&     
          <div className={styles.altBox}>
                {meal.vegiOption && <VeggieOpIcon className={styles.altIcon} />  }
                {meal.veganOption && <VeganOpIcon className={styles.altIcon} /> }
            <div>
              <p className={styles.altTitle}>{meal?.veganOption ? "Vegan" : "Veggie"} Alternative</p>
              <p className={styles.altDescription}>{meal?.altOption}</p>
            </div>
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
            {additives?.length > 1 ? <div> {additives?.map((additive) => <Badge title={additive?.name} className={styles.dietaryTag} key={additive?.code}>{additive?.name}</Badge>)}</div> : <p className={styles.additivesContext}>Read the title</p>}
          </div>
        

        </div>
      </div>
    </div>
  )
}