"use client";
import { useState } from "react";
import styles from "./uploadbox.module.css";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";

export default function UploadBox({ mealId }) {
  const [fileInfo, setFileInfo] = useState(null);
  const [file, setFile] = useState(null);
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFile = async (file) => {
    if (!file) return;

    // allow images or heic/heif by extension (some HEIC uploads may not report a proper mime type)
    const isHeic = file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif");
    if (!file.type.startsWith("image/") && !isHeic) {
      alert("Only image files are allowed.");
      return;
    }

    if (file.size > MAX_SIZE) {
      alert("Maximum file size is 10MB");
      return;
    }

    if (isHeic) {
      toast.loading("Processing...");
      try {
        const heic2any = (await import("heic2any")).default;
        const heicblob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.9,
        });

        const convertedFile = new File(
          [heicblob],
          file.name.replace(/\.(heic|heif)$/i, ".jpg"),
          { type: "image/jpeg" }
        );
        toast.dismiss();
        setFile(convertedFile);
        setFileInfo({
          name: convertedFile.name,
          size: (convertedFile.size / 1024 / 1024).toFixed(2) + " MB",
          preview: URL.createObjectURL(convertedFile),
        });
        URL.revokeObjectURL(file.preview);
      } catch (error) {
        toast.dismiss();
        toast.error("Failed convert image.");
        console.error("HEIC conversion error:", error);
        return;
      }
    } else {
      setFile(file);
      setFileInfo({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        preview: URL.createObjectURL(file),
      });
      if (fileInfo?.preview) URL.revokeObjectURL(fileInfo.preview);
    }
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
    toast.loading("Uploading...");

    const formData = new FormData();
    formData.append("upload_file", file);
    formData.append("context", `.${mealId}`);
    formData.append("uploadboxV", '1');

    try {
      const res = await fetch("https://www.mensa-kl.de/ajax/iphone_upload.php", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.dismiss();
        toast.success("Image submitted!");
        console.log(res);
        setFile(null);
        setFileInfo(null);
      } else {
        toast.error("Image was rejected");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
    toast.dismiss();
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
        title="Drag an image here or click to upload"
      >
        {!file && (
          <>
            <Upload />
            <p>Click to upload an image of your meal</p>
          </>
        )}

        <input
          id="fileInput"
          type="file"
          accept="image/png, image/jpeg, image/webp, image/heic, image/heif"
          onChange={handleChange}
          style={{ display: "none" }}
        />

        {fileInfo && (
          <div className={styles.preview}>
            <img src={fileInfo.preview} alt="Preview" />
            <p>
              {fileInfo.name} ({fileInfo.size} / {MAX_SIZE / 1024 / 1024} MB)
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
