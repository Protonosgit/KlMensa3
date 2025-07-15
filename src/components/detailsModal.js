"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./details.module.css";
import { extractAdditives } from "@/app/utils/additives";
import StarRating from "./starrating";
import { Badge } from "@/components/ui/badge"
import { getCookie } from "@/app/utils/cookie-monster";
import { publishComment,updateComment,deleteComment,fetchComments, reportComment, fetchImages } from "@/app/utils/database-actions";
import { createClient } from "@/app/utils/supabase/client";
import toast from "react-hot-toast";
import { BananaIcon, BanIcon, CookingPot, Delete, DeleteIcon, FlagIcon, Share2Icon, UploadIcon, Vegan } from "lucide-react";

export default function MealPopup({ meal, onClose, comments, setComments, images, setImages}) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [additives, setAdditives] = useState([]);
  const [user, setUser] = useState();
  const [settings, setSettings] = useState();
  const [commentId, setCommentId] = useState(null);
  const [actionPending, setActionPending] = useState(false);
  const [datachanged, setDataChanged] = useState(0);
  const [ownsImage, setOwnsImage] = useState('');

    useEffect(() => {
      setAdditives(extractAdditives(meal.zsnumnamen));
      const settingsCookie = getCookie('settings') || null;
      if(settingsCookie) {
        setSettings(JSON.parse(settingsCookie));
      }
      async function fetchUserData() {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();
        if(data?.user) {
          setUser(data?.user);
        }
      }
      fetchUserData();
      
      const ownComment = comments?.filter(c => c.user_id !== null);
        if (ownComment.length > 0) {
          setStars(ownComment[0]?.rating);
          setComment(ownComment[0]?.comment_text);
          setCommentId(ownComment[0]?.id);
        }
      const ownImage = images?.filter(c => c.owner_id !== null);
        if (ownImage.length > 0) {
          setOwnsImage(ownImage[0]?.image_name);
        }
    }, [meal]);

    useEffect(() => {
      if(datachanged === 0) return;
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
        }
        const newImages = await fetchImages([meal?.artikel_id]);
        if (newImages && newImages.length > 0) {
          setImages(prevImages => {
            // Remove any comment with the same id as in newComments
            const newIds = newImages.map(c => c.id);
            const filtered = prevImages.filter(c => !newIds.includes(c.id));
            // Append newComments
            return [...filtered, ...newImages];
          });
        }
      }
      fetchMealComments();
    }, [datachanged]);
    


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

  async function handleReportRequest(commentId, imageId) {
    // will be handled in seperate form on different page in the future!!
    if(confirm("Report the content for being: offensive, spam, irrelevant or a threat to our constitution?")) {
      toast.success("Report sent!");
      reportComment(commentId, imageId);
    }
  }

  async function handleUploadMealImage() {
    if (!user) {
      toast.error("You need to be logged in to upload images!");
      return;
    }if(ownsImage) {
      if (confirm("You already have an image for this meal. Do you want to delete it?")) {
        const supabase = createClient();
        await supabase.storage.from("meal-images").remove([ownsImage]);
        toast.success("Image deleted!");
        setDataChanged((prev) => prev + 1);
      }
      return;
    }
    const supabase = createClient();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/png, image/jpeg, image/webp";
    fileInput.onchange = async () => {
      const file = fileInput.files[0];
      if (
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif")
      ) {
        toast.error(
          "HEIC/HEIF images are not supported. Please select a JPG, PNG, or WEBP file."
        );
        return;
      }
      toast.loading("Processing image...");
      const artikelId = meal.artikel_id.replace(/\./g, "");

      // Convert image to webp and compress
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
          // Compress and convert to webp
          canvas.toBlob(
            async (blob) => {
              toast.loading("Uploading image...");
              const { data, error } = await supabase.storage
                .from("meal-images")
                .upload(artikelId + "_" + Date.now() + ".webp", blob, {
                  contentType: "image/webp",
                });
              toast.dismiss();
              if (error) {
                toast.error(
                  "Error while uploading, maybe you already posted an image!"
                );
              } else {
                toast.success("Image uploaded successfully!");
                setDataChanged((prev) => prev + 1);
              }
            },
            "image/webp",
            0.8
          ); // 0.8 is quality/compression
        };
        img.onerror = (err) => {
          toast.dismiss();
          toast.error("Failed to process image.");
        };
      };
      reader.onerror = (err) => {
        toast.error("Failed to read image file.");
      };
      reader.readAsDataURL(file);
    };
    fileInput.click();
  }

  const shareData = {
  title: "MDN",
  text: "Learn web development on MDN!",
  url: "https://developer.mozilla.org",
};


  return (
    <div style={{display: meal? "flex" : "none"}} className={styles.popupOverlay} onClick={onClose}>
    <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
      <div className={styles.popupImageContainer}>
        {(images && images.length > 0) ? (
          <Image 
              placeholder="blur"
              blurDataURL="/plate_placeholder.png"
              priority={false} loading={"lazy"}
              src={"https://gbxuqreqhbkcxrwfeeig.supabase.co"+images[0]?.image_url} alt="dish-image"
              className={styles.popupImage}
              width={600} height={500} />
          ) : (
            <Image 
              priority={false} 
              loading={"lazy"} 
              src={meal.image? "https://www.mensa-kl.de/mimg/"+meal?.image : "/plate_placeholder.png"} 
              alt="dish-image" className={styles.popupImage} 
              width={600} height={500} />
          )}
        <div className={styles.overlayActionsBar}>
          <button onClick={handleUploadMealImage} className={styles.popupActionButton}>{ownsImage ? <CookingPot /> : <UploadIcon />}</button>
          <button onClick={() => handleReportRequest(null, images[0]?.image_name)} className={styles.popupActionButton}><FlagIcon /></button>
          <button onClick={() => navigator.clipboard.writeText("kl-mensa.vercel.app?artid="+meal.artikel_id) && toast.success("Link copied to clipboard!")} className={styles.popupActionButton}><Share2Icon /></button>
          <button onClick={onClose} className={styles.popupActionButton}>×</button>
        </div>
      </div>
      <div className={styles.popupDetails}>
      <a href={meal.loc_link} title="Click for directions to location" className={styles.popupLocation}>{meal.menuekennztext=="V+" ? <Vegan size={14} className={styles.veganIcon} /> : ""}{meal.dpartname}</a>
        <h2 className={styles.popupTitle} title={meal?.titleCombined}>{settings?.intitle ? (meal.titleAdditivesCombined) : meal.titleCombined}</h2>
                {additives.length > 1 && <div><b>Additives:</b> {additives.map((additive) => <Badge title={additive.name} className={styles.dietaryTag} key={additive.code}>{additive.name}</Badge>)}</div>}
        <div className={styles.popupPriceRating}>
          <span title="This price is only for students!" className={styles.popupPrice}>{meal.price}</span>
          <div className={styles.popupRating}>
            <StarRating mealRating={meal.rating} disabled={true} />
            <span className={styles.ratingCount}>{meal.rating_amt}</span>
          </div>
        </div>

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