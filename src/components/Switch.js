"use client";

import { useState } from "react";
import styles from "./Switch.module.css";

export function Switch({
  id,
  title,
  description,
  defaultChecked = false,
  onChange,
  disabled = false,
}) {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = () => {
    if (disabled) return;
    const newValue = !checked;
    setChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={styles.switchContainer} onClick={handleChange}>
      <div className={styles.content}>
        <p htmlFor={id} className={styles.title}>
          {title}
        </p>
        <p className={styles.description}>{description}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        className={`${styles.switch} ${checked ? styles.checked : ""} ${
          disabled ? styles.disabled : ""
        }`}
      >
        <span className={styles.thumb} />
      </button>
    </div>
  );
}
