"use client";
import styles from "./upload.module.css";
import { useState } from "react";
import { useCallback } from "react";
import { toast, Toaster } from 'react-hot-toast';

export default function UploadPopup({}) {
  const [modalVisible, setModalVisible] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  }, []);

  const onFileInputChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  }, []);

  const handleUpload = useCallback(() => {
    setIsUploading(true);
    const options = {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'X-File-Name': files[0],
        'Content-Type': 'application/octet-stream',
        Origin: 'https://www.mensa-kl.de',
        Connection: 'keep-alive',
        Referer: 'https://www.mensa-kl.de/',
      },
      body: files[0],
    };
    
    
    fetch(`/api/relay?rating=${files[0]}`, options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
    toast.loading('Uploading...');
    setTimeout(() => {
      setIsUploading(false);
      setFiles([]);
      toast.dismiss();
      toast.error('Studentenwerk macht mal cors allow in headers von api rein pls :(');
    }, 1000);
  }, []);

  return (
    <>
      <button
        className={styles.uploadModalButton}
        onClick={() => setModalVisible(true)}
      >
        Submit photo
      </button>
      {modalVisible && (
        <div
          className={styles.popupOverlay}
          onClick={() => setModalVisible(false)}
        >
          <div
            className={styles.popupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.fileUploadPanel}>
      <div
        className={[styles.uploadArea, isDragging ? styles.uploadAreaDragging : null].join(' ')}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <p className={styles.uploadText}>
          Upload a photo of your meal.<br/> Photos will be conjugated using the files metadata
        </p>
        <input
          type="file"
          onChange={onFileInputChange}
          className={styles.fileInput}
          id="fileInput"
          //accept="image/jpeg"
        />
        <label htmlFor="fileInput" className={styles.selectButton}>
          Select File
        </label>
      </div>
      {files.length > 0 && (
        <div className={styles.fileList}>
          <h3>Selected File:</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
          <button 
          className={styles.uploadButton}
          onClick={handleUpload} 
          disabled={isUploading}
        > {isUploading ? 'Uploading...' : 'Fire!'}</button>
        </div>
      )}
    </div>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
}
