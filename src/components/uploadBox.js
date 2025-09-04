"use client";
import { useState } from "react";
import styles from "./uploadbox.module.css";
import toast from "react-hot-toast";

export default function UploadBox({ mealId }) {
  const [fileInfo, setFileInfo] = useState(null);
  const [file, setFile] = useState(null);
  const MAX_SIZE = 15 * 1024 * 1024; // 15MB

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    if (file.size > MAX_SIZE) {
      alert("File size must be less than 15MB.");
      return;
    }

    setFile(file);
    setFileInfo({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      preview: URL.createObjectURL(file),
    });
  };

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove(styles.dragover);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!mealId || !file) {
      return;
    }

    const formData = new FormData();
    formData.append("upload_file", file);
    formData.append("context", `.${mealId}`);

    try {
      const res = await fetch("https://mensa-kl.de/ajax/iphone_upload.php", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Upload successful!");
        console.log(res);
      } else {
        toast.error("Upload failed with status " + res.status);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while uploading.");
    }
  };

  return (
    <div>
      <div
        className={styles.uploadBox}
        onClick={() => document.getElementById("fileInput").click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add(styles.dragover);
        }}
        onDragLeave={(e) => e.currentTarget.classList.remove(styles.dragover)}
        onDrop={handleDrop}
      >
        <p>
          Drag an image her or tap to upload
        </p>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ display: "none" }}
        />

        {fileInfo && (
          <div className={styles.preview}>
            <img src={fileInfo.preview} alt="Preview" />
            <p>
              {fileInfo.name} ({fileInfo.size})
            </p>
          </div>
        )}
      </div>

      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={!file}
      >
        Submit
      </button>
    </div>
  );
}
