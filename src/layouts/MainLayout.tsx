// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../shared/components/Navbar";
import Footer from "../shared/components/Footer";
import BackToTop from "../shared/components/BackToTop";

export default function MainLayout() {
  useEffect(() => {
    // Hide spinner when page loads
    const spinner = document.getElementById('spinner');
    if (spinner) {
      spinner.classList.remove('show');
      spinner.classList.add('hide');
    }
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '160px' }}>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
