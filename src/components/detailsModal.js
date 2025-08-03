"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import styles from "./details.module.css";
import { extractAdditives } from "@/app/utils/additives";
import StarRating from "./starrating";
import { Badge } from "@/components/ui/badge"
import { getCookie } from "@/app/utils/cookie-monster";
import { publishComment,updateComment,deleteComment,fetchComments, reportComment, fetchImages } from "@/app/utils/database-actions";
import { createClient } from "@/app/utils/supabase/client";
import toast from "react-hot-toast";
import { Bookmark, Bot, CookingPot, Droplets, EllipsisVertical, FlagIcon, Info, Share2Icon, UploadIcon } from "lucide-react";
import  veganIcon from "../../public/icons/vegan.svg";
import vegiOpIcon from "../../public/icons/vegi-op.svg";
import veganOpIcon  from "../../public/icons/vegan-op.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MealPopup({ meal, onClose, comments, setComments, images, setImages }) {
  // State variables for managing user input, meal details, and UI updates.
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [additives, setAdditives] = useState([]);
  const [user, setUser] = useState();
  const [settings, setSettings] = useState();
  const [commentId, setCommentId] = useState(null);
  const [actionPending, setActionPending] = useState(false);
  const [datachanged, setDataChanged] = useState(0);
  const [ownsImage, setOwnsImage] = useState('');
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);


  function checkUserOwnsComment(commentList) {
    const ownComment = commentList?.filter((c) => c.user_id !== null);
    if (ownComment.length > 0) {
      setStars(ownComment[0]?.rating);
      setComment(ownComment[0]?.comment_text);
      setCommentId(ownComment[0]?.id);
    }
  }
  function checkUserOwnsImage(imageList) {
    const ownImage = imageList?.filter((c) => c.owner_id !== null);
    if (ownImage.length > 0) {
      setOwnsImage(ownImage[0]?.image_name);
    }
  }
  //settings and userdata
    useEffect(() => {
      // retrieve cookies for settings
      setAdditives(extractAdditives(meal.zsnumnamen));
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
        }
      }
      fetchUserData();

      const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("bookmarks"))
      ?.split("=")[1];
      if (cookieValue) {
        const bookmarks = JSON.parse(cookieValue);
        setIsBookmarked(bookmarks.includes(meal.artikel_id));
      }
      
      checkUserOwnsComment(comments);
      checkUserOwnsImage(images);

      // Calculate Rating from supabase and legacy api
      const sumOfRatings = comments.reduce((acc, curr) => acc + curr.rating, 0);
      const fullSum = sumOfRatings + (meal.rating*meal.rating_amt || 0);
      const fullCount = comments.length  + (meal.rating_amt || 0);
      setRating(fullSum/fullCount);
      setRatingCount(fullCount);
      //console.log(meal);
    }, [meal]);

    // update neccessary fields when image or comment is updated
    useEffect(() => {
      if(datachanged === 0) return;
      // check if user has posted a comment and populate form
      async function fetchMealComments() {
        const newComments = await fetchComments([meal?.artikel_id]);
        if (newComments && newComments.length > 0) {
          setComments(prevComments => {
            // Remove any comment with the same id as in newComments
            const newIds = newComments.map(c => c.id);
            const filtered = prevComments.filter(c => !newIds.includes(c.id));
            // Append newComments
            return [...filtered, ...newComments];
          });
        } else {
          setComments([]);
        }
        checkUserOwnsComment(newComments);
        // check if user has uploaded an image and toggle button
        const newImages = await fetchImages([meal?.artikel_id]);
        if (newImages && newImages.length > 0) {
          setImages(prevImages => {
            // Remove any comment with the same id as in newComments
            const newIds = newImages.map(c => c.id);
            const filtered = prevImages.filter(c => !newIds.includes(c.id));
            // Append newComments
            return [...filtered, ...newImages];
          });
        } else {
          setImages([]);
        }
        checkUserOwnsImage(newImages);
      }
      fetchMealComments();
    }, [datachanged]);
    


  // Handle publishing or updating a comment.
  async function handlePublishRating() {
    if(stars<1) {toast.error("Please rate the meal!"); return;}
    setActionPending(true);
    if(commentId) {
      const response = await updateComment(commentId, stars, comment);
      if(response?.error) {
        toast.error(response?.error);
      } else {
        toast.success("Comment updated!");
      }
      setActionPending(false);
      setDataChanged(prev => prev+1);
      return;
    }

    const response = await publishComment(meal?.artikel_id, stars, comment);
    if(response?.error) {
      toast.error(response?.error);
    } else {
      setCommentId(response?.data[0]?.id);
      toast.success("Comment published!");
    }
    setActionPending(false);
    setDataChanged(prev => prev+1);
  }

  // Handle deleting a comment.
  async function handleDeleteRating() {
    setActionPending(true);
    const response = await deleteComment(commentId);
    if(response?.error) {
      toast.error(response?.error);
    } else {
      toast.success("Comment deleted!");
      setStars(0);
      setComment("");
      setCommentId(null);
    }
    setActionPending(false);
    setDataChanged(prev => prev+1);
  }

  // Handle reporting a comment or image.
  async function handleReportRequest(commentId, imageId) {
    // will be handled in seperate form on different page in the future!!
    if(confirm("Report the content for being: offensive, spam, irrelevant or harmfull in any way?")) {
      toast.success("Report sent!");
      reportComment(commentId, imageId);
    }
  }

  // close modal on escape
  useEffect(() => {
    const handleEscapePress = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscapePress);
    return () => {
      document.removeEventListener('keydown', handleEscapePress);
    };
  }, []);


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
    console.log(meal);
  }

  // Handle uploading a meal image.
async function handleUploadMealImage() {
  if (!user) {
    toast.error("You must be logged in to upload an image");
    return;
  }

  const artikelId = meal.artikel_id.replace(/\./g, "");
  const supabase = createClient();

  // Check if user already has an image uploaded
  if (ownsImage) {
    if (confirm("You already have an image for this meal. Do you want to delete it?")) {
      await supabase.storage.from("meal-images").remove([ownsImage]);
      toast.success("Image deleted!");
      setDataChanged((prev) => prev + 1);
    }
    return;
  }

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
              setDataChanged((prev) => prev + 1);
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
    return <h2 className={styles.popupTitle} title={meal?.titleAdditivesCombined}>{settings?.intitle ? (meal.titleAdditivesCombined) : meal.titleCombined}</h2>;
  }


  // Render the modal UI for meal details, comments, and actions.
  return (
    <div style={{ display: meal ? "flex" : "none" }} title="" className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.popupImageContainer}>
          {/* Render meal image from any source or placeholder */}
          {(images && images.length > 0) ? (
            <Image 
              placeholder="blur"
              blurDataURL="/plate_placeholder.png"
              priority={false} loading={"lazy"}
              src={"https://gbxuqreqhbkcxrwfeeig.supabase.co"+images[0]?.image_url} alt="dish-image" title={meal.atextohnezsz1}
              className={styles.popupImage}
              width={600} height={500} />
          ) : (
            <Image 
              priority={false} 
              loading={"lazy"} 
              src={meal.image? "https://www.mensa-kl.de/mimg/"+meal?.image : "/plate_placeholder.png"}  title={meal.atextohnezsz1}
              alt="dish-image" className={styles.popupImage} 
              width={600} height={500} />
          )}

          <div className={styles.overlayLocationBar}>
              <a href={meal.loc_link} title="Location" className={styles.popupLocation}>
              {meal.dpartname}
              
              {meal?.dpname == "Robotic Kitchen" ? <Bot size={18} className={styles.otherIcon} /> : ""}
              {meal?.vegiOption ? <Image src={vegiOpIcon} alt="vegan-icon" width={18} height={18} className={styles.otherIcon} /> : ""}
              {meal?.veganOption ? <Image src={veganOpIcon} alt="vegan-icon" width={18} height={18} className={styles.otherIcon} /> : ""}
              {meal?.menuekennztext == "V+" ? <Image src={veganIcon} alt="vegan-icon" width={18} height={18} className={styles.otherIcon} /> : ""}
            </a>
          </div>

          <div className={styles.overlayActionsBar}>
            <DropdownMenu>
              <DropdownMenuTrigger className={styles.popupActionButton}><EllipsisVertical size={18} /></DropdownMenuTrigger>
                <DropdownMenuContent className={styles.dropdownMenuContent}>
                  <DropdownMenuItem className={styles.dropdownMenuItem} onClick={(e) => (handleBookmark(e))} ><Bookmark size={18} className={isBookmarked ? styles.bookmarkActive : styles.bookmark} />Bookmark</DropdownMenuItem>
                  <DropdownMenuItem className={styles.dropdownMenuItem} onClick={() => navigator.clipboard.writeText("kl-mensa.vercel.app?artid="+meal.artikel_id) && toast.success("Link copied to clipboard!")}><Share2Icon size={18} />Share</DropdownMenuItem>
                  <DropdownMenuItem className={styles.dropdownMenuItem} onClick={() => (handleUploadMealImage())}>{ownsImage ? <CookingPot size={18} /> : <UploadIcon size={18} />}Submit image</DropdownMenuItem>
                  <DropdownMenuSeparator className={styles.dropdownMenuSeparator} />
                  <DropdownMenuItem className={styles.dropdownMenuItem} onClick={() => (handleReportRequest(meal.id))}><FlagIcon size={18} />Report image</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            <button onClick={onClose} className={styles.popupActionButton}>×</button>
          </div>
        </div>

        {/* Render meal details, comments, and action buttons */}
        <div className={styles.popupDetails}>
          <MealTitle />
          {meal.altOption &&
            <div className={styles.altLabel}>Alternative:
              <p className={styles.altText}>
                {meal.vegiOption && <><Image src={vegiOpIcon} alt="vegi" width={18} height={18} className={styles.otherIcon}/>{meal.altOption} (Vegi)</> }
                {meal.veganOption && <><Image src={veganOpIcon} alt="vegan" width={18} height={18} className={styles.otherIcon} />{meal.altOption} (vegan)</>}</p>
            </div>}

          <div className={styles.popupPriceRating}>
            <span title="Price" className={styles.popupPrice}>{meal?.price?.stu || meal?.price?.price}</span>
            <div className={styles.popupRating}>
              <StarRating mealRating={rating} disabled={true} />
              <span className={styles.ratingCount}>({ratingCount})</span>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.additivesSection}>
            <div className={styles.additivesTitle}>
              <p>Additives</p>
              <p className={styles.additivesContext}>Includes vegan options</p>
            </div>
            {additives.length > 1 && <div> {additives.map((additive) => <Badge title={additive.name} className={styles.dietaryTag} key={additive.code}>{additive.name}</Badge>)}</div>}
          </div>
        
          <div className={styles.divider} />

          <div className={styles.commentsSection}>
            <h3 className={styles.commentsTitle}>Comments {comments.length}</h3>
            <div className={styles.ownComent} style={{display: user? "flex" : "none"}}>
              <StarRating mealRating={stars} starsSet={setStars} />
              <textarea
                type="text"
                placeholder="Comment (optional)"
                className={styles.commentInput}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={120}
              ></textarea>
              <p className={styles.commentCounter}>{comment.length}/120</p>
              <div className={styles.commentButtons}>
                <button className={styles.commentButton} disabled={actionPending} title="Publish" style={{opacity: actionPending? 0.5 : 1, width: "100%"}} onClick={handlePublishRating}>Publish</button>
                <button className={styles.commentButton} disabled={actionPending} title="Delete" style={{opacity: actionPending? 0.5 : 1, display: commentId? "flex" : "none"}} onClick={handleDeleteRating}><CookingPot /></button>
              </div>
            </div>

            {comments.map((comment, index) => (
              <div key={index} className={styles.foreignComment}>
                <div className={styles.commentInfo}>
                   <StarRating mealRating={comment.rating} disabled={true} />
                  <span className={styles.commentDate}>{new Date(comment.created_at).toLocaleString("de-DE", { year: "numeric", month: "2-digit", day: "2-digit"})}</span>
                  <FlagIcon onClick={() => handleReportRequest(comment?.id)} size={16} fill="var(--text-color)" />
                </div>
                <p className={styles.commentText}>{comment.comment_text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}