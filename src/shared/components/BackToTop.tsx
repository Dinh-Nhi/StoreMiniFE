// src/shared/components/BackToTop.tsx
import { useState, useEffect } from "react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button 
      onClick={scrollToTop}
      className="btn btn-primary border-3 border-primary rounded-circle back-to-top"
      aria-label="Back to top"
    >
      <i className="fa fa-arrow-up"></i>
    </button>
  );
}
