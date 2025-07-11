import React from "react";
import styles from "./LoadingAnimation.module.css";

// CSS and HTML c/o https://loading.io/css/

const LoadingAnimation = () => {
  return (
    <div className={styles.ldsEllipsis}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default LoadingAnimation;