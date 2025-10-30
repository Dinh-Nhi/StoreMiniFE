import { useEffect, useMemo, useState } from "react";
import BestsellerSection from "../components/ProductBestseller";
import VegetableCarousel from "../components/ProductDiscount";
import { useStoreInfo } from "../../../context/StoreInfoContext";
import ProductsSection from "../components/ProductCollection";
import { getMediaByFileKey, getMediaProductByFileKey } from "../../../helper/api";

interface Banner {
  id: number;
  code: string;
  name: string;
  sort: number;
  fileKey: string;
}

export default function Home() {
  const storeInfo = useStoreInfo();
  const [searchQuery, setSearchQuery] = useState("");
  const [bannerImages, setBannerImages] = useState<{ [key: number]: string }>(
    {}
  );
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ Memo hóa banners (chỉ tính lại khi storeInfo thay đổi)
  const banners = useMemo<Banner[]>(() => {
    return storeInfo
      .filter((item) => item.code === "BANNER")
      .sort((a, b) => a.sort - b.sort);
  }, [storeInfo]);

  // ✅ Load ảnh banner từ API (tối ưu, tải song song)
  useEffect(() => {
    if (banners.length === 0) return;

    let isMounted = true;

    const fetchBannerImages = async () => {
      try {
        const imageMap: Record<number, string> = {};

        const results = await Promise.all(
          banners.map(async (banner) => {
            const res = await getMediaByFileKey(banner.fileKey);
            const blob = res.data;
            const url = URL.createObjectURL(blob);
            return { id: banner.id, url };
          })
        );

        results.forEach(({ id, url }) => (imageMap[id] = url));

        if (isMounted) setBannerImages(imageMap);
      } catch (error) {
        console.error("❌ Lỗi khi tải ảnh banner:", error);
      }
    };

    fetchBannerImages();

    // 🧹 Giải phóng URL cũ khi component unmount hoặc banners đổi
    return () => {
      isMounted = false;
      Object.values(bannerImages).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [banners]); // ✅ Chỉ chạy lại khi danh sách banner thực sự thay đổi

  // ✅ Tự động chuyển banner sau mỗi 5s
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  return (
    <>
      {/* Hero Section */}
      <div className="container-fluid py-5 mb-5 hero-header">
        <div className="container-fluid p-0">
          <div
            id="heroCarousel"
            className="carousel slide position-relative"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`carousel-item ${
                    index === activeIndex ? "active" : ""
                  }`}
                >
                  {bannerImages[banner.id] ? (
                    <img
                      src={bannerImages[banner.id]}
                      className="d-block w-100"
                      alt={banner.name || "Banner"}
                      style={{
                        objectFit: "cover",
                        height: "500px", // Adjust height as needed
                        maxHeight: "100vh",
                      }}
                    />
                  ) : (
                    <div
                      className="bg-light text-center rounded d-flex align-items-center justify-content-center"
                      style={{ height: "500px" }}
                    >
                      Đang tải ảnh...
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide="prev"
              onClick={() =>
                setActiveIndex(
                  activeIndex === 0 ? banners.length - 1 : activeIndex - 1
                )
              }
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide="next"
              onClick={() => setActiveIndex((activeIndex + 1) % banners.length)}
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>

            {/* Carousel Indicators */}
            <div className="carousel-indicators">
              {banners.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#heroCarousel"
                  data-bs-slide-to={index}
                  className={index === activeIndex ? "active" : ""}
                  aria-current={index === activeIndex ? "true" : "false"}
                  onClick={() => setActiveIndex(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container-fluid featurs py-5">
        <div className="container py-5">
          <div className="row g-4">
            {storeInfo
              .filter((item) => item.parentCode === "SERVICE")
              .sort((a, b) => a.sort - b.sort)
              .map((service) => (
                <div key={service.id} className="col-md-6 col-lg-3">
                  <div className="featurs-item text-center rounded bg-light p-4">
                    <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                      <i
                        className={`${
                          service.fileKey || "fas fa-star"
                        } fa-3x text-white`}
                      ></i>
                    </div>
                    <div className="featurs-content text-center">
                      <h5>{service.code}</h5>
                      <p className="mb-0">{service.name}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <ProductsSection />

      {/* Vegetable Carousel Section */}
      <VegetableCarousel />

      {/* Bestseller Section */}
      <BestsellerSection />
    </>
  );
}
