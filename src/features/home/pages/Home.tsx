// src/features/home/pages/Home.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import BestsellerSection from "../components/ProductBestseller";
import VegetableCarousel from "../components/ProductDiscount";
import TestimonialSection from "../components/NewsSection";
import { useStoreInfo } from "../../../context/StoreInfoContext";
import ProductsSection from "../components/ProductCollection";

export default function Home() {
  const storeInfo = useStoreInfo();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to products page with search query
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="container-fluid py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-md-12 col-lg-7">
              <h4 className="mb-3 text-secondary">100% Organic Foods</h4>
              <h1 className="mb-5 display-3 text-primary">
                Organic Veggies & Fruits Foods
              </h1>
              <form
                onSubmit={handleSearch}
                className="position-relative mx-auto"
              >
                <input
                  className="form-control border-2 border-secondary w-75 py-3 px-4 rounded-pill"
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary border-2 border-secondary py-3 px-4 position-absolute rounded-pill text-white h-100"
                  style={{ top: 0, right: "25%" }}
                >
                  Submit Now
                </button>
              </form>
            </div>
            <div className="col-md-12 col-lg-5">
              <div
                id="carouselId"
                className="carousel slide position-relative"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner" role="listbox">
                  <div className="carousel-item active rounded">
                    <img
                      src="../../../../public/img/hero-img-1.png"
                      className="img-fluid w-100 h-100 bg-secondary rounded"
                      alt="Fresh fruits"
                    />
                    <Link
                      to="/products"
                      className="btn px-4 py-2 text-white rounded"
                    >
                      Fruites
                    </Link>
                  </div>
                  <div className="carousel-item rounded">
                    <img
                      src="../../../../public/img/hero-img-2.png"
                      className="img-fluid w-100 h-100 rounded"
                      alt="Fresh vegetables"
                    />
                    <Link
                      to="/products"
                      className="btn px-4 py-2 text-white rounded"
                    >
                      Vesitables
                    </Link>
                  </div>
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselId"
                  data-bs-slide="prev"
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
                  data-bs-target="#carouselId"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
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

      <ProductsSection />

      {/* Vegetable Carousel Section */}
      <VegetableCarousel />

      {/* Bestseller Section */}
      <BestsellerSection />

      {/* Stats Section */}
      <div className="container-fluid py-5">
        <div className="container">
          <div className="bg-light p-5 rounded">
            <div className="row g-4 justify-content-center">
              <div className="col-md-6 col-lg-6 col-xl-3">
                <div className="counter bg-white rounded p-5">
                  <i className="fa fa-users text-secondary"></i>
                  <h4>satisfied customers</h4>
                  <h1>1963</h1>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-xl-3">
                <div className="counter bg-white rounded p-5">
                  <i className="fa fa-users text-secondary"></i>
                  <h4>quality of service</h4>
                  <h1>99%</h1>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-xl-3">
                <div className="counter bg-white rounded p-5">
                  <i className="fa fa-users text-secondary"></i>
                  <h4>quality certificates</h4>
                  <h1>33</h1>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-xl-3">
                <div className="counter bg-white rounded p-5">
                  <i className="fa fa-users text-secondary"></i>
                  <h4>Available Products</h4>
                  <h1>789</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Testimonial Section */}
      <TestimonialSection />
      </>
    );
  }
