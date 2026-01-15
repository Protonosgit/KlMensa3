"use client";
import { useState } from "react";
import styles from "./UploadBox.module.css";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";

export default function UploadBox({ mealId }) {
  const [fileInfo, setFileInfo] = useState(null);
  const [file, setFile] = useState(null);
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFile = async (file) => {
    
    if (!file) return;

    // allow regular images or heic/heif
    //const { isHeic } = await import("heic-to"); // better lib but double the size
    //const heicDetected = await isHeic(file); 
    const heicDetected = file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif");

    if (!file.type.startsWith("image/") && !heicDetected) {
      alert("Only image files are allowed.");
      return;
    }

    // Convert and write info
    let processedFile = null;
    if(heicDetected) {
      // const { heicTo } = await import("heic-to"); // better lib but double the size
      const heic2any = (await import("heic2any")).default;

      toast.loading("Converting file...");

      try {
        // Convert pic
        const jpegConverted = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.9,
        });

        // const jpegConverted = await heicTo({
        //   blob: file,
        //   type: "image/jpeg",
        //   quality: 0.9
        // });

        const convertedFile = new File(
          [jpegConverted],
          file.name.replace(/\.(heic|heif)$/i, ".jpg"),
          { type: "image/jpeg" }
        );
        processedFile = convertedFile;

      } catch (error) {
        toast.error("Failed to convert file");
        return;
      }

      toast.dismiss();
    } else {
      processedFile = file;
    }

    if (processedFile.size > MAX_SIZE) {
      alert("Maximum file size is 10MB");
      return;
    }

    setFile(processedFile);
    setFileInfo({
      name: processedFile.name,
      size: (processedFile.size / 1024 / 1024).toFixed(2) + " MB",
      preview: URL.createObjectURL(processedFile),
    });

    // try to prevent mem leaks (lets hope so at least)
    if (fileInfo?.preview) URL.revokeObjectURL(fileInfo.preview);
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
      toast.error("No file selected or id missing");
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
        setFile(null);
        setFileInfo(null);
      } else {
        toast.dismiss();
        toast.error("Image was rejected");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Upload failed");
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
