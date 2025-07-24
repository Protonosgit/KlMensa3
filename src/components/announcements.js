"use client";
import styles from "./settings.module.css";
import { useEffect, useState } from "react";

// Never used
export default function AnnouncementModal({}) {
  const [modalVisible, setModalVisible] = useState(false);


  return (
    <>

      {modalVisible && (
        <div className={styles.popupOverlay} onClick={() => setModalVisible(false)}>
          <div
            className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
              </div>
        </div>
      )}
    </>
  );
}
