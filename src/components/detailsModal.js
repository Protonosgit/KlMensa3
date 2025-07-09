"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./details.module.css";
import { extractAdditives } from "@/app/utils/additives";
import StarRating from "./starrating";
import { Badge } from "@/components/ui/badge"
import { getCookie } from "@/app/utils/cookie-monster";
import { publishComment,updateComment,deleteComment,fetchComments, reportComment } from "@/app/utils/database-actions";
import { createClient } from "@/app/utils/supabase/client";
import toast from "react-hot-toast";
import { BananaIcon, BanIcon, CookingPot, FlagIcon, Plus, UploadIcon, Vegan } from "lucide-react";

export default function MealPopup({ meal, onClose }) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [additives, setAdditives] = useState([]);
  const [user, setUser] = useState();
  const [settings, setSettings] = useState();
  const [mealComments, setMealComments] = useState([]);
  const [commentId, setCommentId] = useState(null);
  const [actionPending, setActionPending] = useState(false);
  const [datachanged, setDataChanged] = useState(false);

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
    }, [meal]);

    useEffect(() => {
      async function fetchMealComments() {
        const result = await fetchComments([meal.artikel_id]);
        const ownComment = result?.filter(c => c.user_id !== null);
        if (ownComment.length > 0) {
          setStars(ownComment[0]?.rating);
          setComment(ownComment[0]?.comment_text);
          setCommentId(ownComment[0]?.id);
        }
        setMealComments(result);
      }
      fetchMealComments();
    }, [datachanged]);
    


  async function handlePublishRating() {
    if(stars<1) {toast.error("Please rate the meal!"); return;}
    setActionPending(true);
    if(commentId) {
      const response = await updateComment(commentId, stars, comment);
      if(response?.error) {
        toast.error("Error updating comment!");
      } else {
        toast.success("Comment updated!");
      }
      setActionPending(false);
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
    setDataChanged(!datachanged);
  }

  async function handleDeleteRating() {
    setActionPending(true);
    const response = await deleteComment(commentId);
    if(response?.error) {
      toast.error("Error deleting comment!");
    } else {
      toast.success("Comment deleted!");
      setStars(0);
      setComment("");
      setCommentId(null);
    }
    setActionPending(false);
    setDataChanged(!datachanged);
  }

  async function handleReportRequest(commentId, imageId) {
    // will be handled in seperate form on different page in the future!!
    if(confirm("Report the content for being: offensive, spam, irrelevant or a threat to our constitution?")) {
      toast.success("Report sent!");
      reportComment(commentId, imageId);
    }
  }

  async function handleUploadMealImage() {
    const supabase = createClient();
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async () => {
      const artikelId = meal.artikel_id.replace(/\./g, '');
      const file = fileInput.files[0];
      const { data, error } = await supabase.storage
        .from('meal-images')
        .upload(artikelId+"_"+Date.now(), file);
      if (error) {
        toast.error("Error uploading image!");
      }
    };
    fileInput.click();
  }

  return (
    <div style={{display: meal? "flex" : "none"}} className={styles.popupOverlay} onClick={onClose}>
    <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
      <div className={styles.popupImageContainer}>
        <Image src={meal.image? "https://www.mensa-kl.de/mimg/"+meal.image : "/plate_placeholder.png"} alt={meal.titleCombined} width={600} height={500} className={styles.popupImage}/>
        <div className={styles.overlayActionsBar}>
          <button onClick={handleUploadMealImage} className={styles.popupActionButton}><UploadIcon /></button>
          <button onClick={() => handleReportRequest(null, null)} className={styles.popupActionButton}><FlagIcon /></button>
          <button onClick={onClose} className={styles.popupActionButton}>×</button>
        </div>
      </div>
      <div className={styles.popupDetails}>
      <a href={meal.loc_link} title="Click for directions to location" className={styles.popupLocation}>{meal.menuekennztext=="V+" ? <Vegan size={14} className={styles.veganIcon} /> : ""}{meal.dpartname}</a>
        <h2 className={styles.popupTitle} title={meal?.titleCombined}>{settings?.intitle ? meal.titleAdditivesCombined : meal.titleCombined}</h2>
                {additives.length > 1 && <p><b>Additives:</b> {additives.map((additive) => <Badge title={additive.name} className={styles.dietaryTag} key={additive.code}>{additive.name}</Badge>)}</p>}
        <div className={styles.popupPriceRating}>
          <span title="This price is only for students!" className={styles.popupPrice}>{meal.price}</span>
          <div className={styles.popupRating}>
            <StarRating mealRating={meal.rating} disabled={true} />
            <span className={styles.ratingCount}>{meal.rating_amt}</span>
          </div>
        </div>

        <div className={styles.commentsSection}>
          <h3 className={styles.commentsTitle}>Comments {mealComments.length}</h3>
          <div className={styles.ownComent} style={{display: user? "flex" : "none"}}>
            <StarRating mealRating={stars} starsSet={setStars} />
            <textarea
              type="text"
              placeholder="Comment (optional)"
              className={styles.commentInput}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={100}
            ></textarea>
            <p className={styles.commentCounter}>{comment.length}/100</p>
            <div className={styles.commentButtons}>
              <button className={styles.commentButton} disabled={actionPending} title="Publish" style={{opacity: actionPending? 0.5 : 1, width: "100%"}} onClick={handlePublishRating}>Publish</button>
              <button className={styles.commentButton} disabled={actionPending} title="Delete" style={{opacity: actionPending? 0.5 : 1, display: commentId? "flex" : "none"}} onClick={handleDeleteRating}><CookingPot /></button>
            </div>
          </div>

          {mealComments.map((comment, index) => (
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