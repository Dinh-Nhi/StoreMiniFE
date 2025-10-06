// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../shared/components/Navbar";
import Footer from "../shared/components/Footer";
import BackToTop from "../shared/components/BackToTop";
import { StoreInfoContext } from "../context/StoreInfoContext";
import { getStoreInfo } from "../helper/api";
import type { StoreInfoEntity } from "../types";

export default function MainLayout() {
  const [storeInfo, setStoreInfo] = useState<StoreInfoEntity[]>([]);

  useEffect(() => {
    getStoreInfo().then((res) => setStoreInfo(res.data));

    const spinner = document.getElementById("spinner");
    if (spinner) {
      spinner.classList.remove("show");
      spinner.classList.add("hide");
    }
  }, []);

  return (
    <StoreInfoContext.Provider value={storeInfo}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </StoreInfoContext.Provider>
  );
}
