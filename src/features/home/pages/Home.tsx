// src/features/home/pages/Home.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../products/components/ProductCard";
import BestsellerSection from "../components/BestsellerSection";
import VegetableCarousel from "../components/VegetableCarousel";
import TestimonialSection from "../components/TestimonialSection";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to products page with search query
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
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
              <h1 className="mb-5 display-3 text-primary">Organic Veggies & Fruits Foods</h1>
              <form onSubmit={handleSearch} className="position-relative mx-auto">
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
                  style={{top: 0, right: '25%'}}
                >
                  Submit Now
                </button>
              </form>
            </div>
            <div className="col-md-12 col-lg-5">
              <div id="carouselId" className="carousel slide position-relative" data-bs-ride="carousel">
                <div className="carousel-inner" role="listbox">
                  <div className="carousel-item active rounded">
                    <img src="../../../../public/img/hero-img-1.png" className="img-fluid w-100 h-100 bg-secondary rounded" alt="Fresh fruits" />
                    <Link to="/products" className="btn px-4 py-2 text-white rounded">
                      Fruites
                    </Link>
                  </div>
                  <div className="carousel-item rounded">
                    <img src="../../../../public/img/hero-img-2.png" className="img-fluid w-100 h-100 rounded" alt="Fresh vegetables" />
                    <Link to="/products" className="btn px-4 py-2 text-white rounded">
                      Vesitables
                    </Link>
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselId" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselId" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
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
            <div className="col-md-6 col-lg-3">
              <div className="featurs-item text-center rounded bg-light p-4">
                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                  <i className="fas fa-car-side fa-3x text-white"></i>
                </div>
                <div className="featurs-content text-center">
                  <h5>Free Shipping</h5>
                  <p className="mb-0">Free on order over $300</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="featurs-item text-center rounded bg-light p-4">
                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                  <i className="fas fa-user-shield fa-3x text-white"></i>
                </div>
                <div className="featurs-content text-center">
                  <h5>Security Payment</h5>
                  <p className="mb-0">100% security payment</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="featurs-item text-center rounded bg-light p-4">
                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                  <i className="fas fa-exchange-alt fa-3x text-white"></i>
                </div>
                <div className="featurs-content text-center">
                  <h5>30 Day Return</h5>
                  <p className="mb-0">30 day money guarantee</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="featurs-item text-center rounded bg-light p-4">
                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                  <i className="fa fa-phone-alt fa-3x text-white"></i>
                </div>
                <div className="featurs-content text-center">
                  <h5>24/7 Support</h5>
                  <p className="mb-0">Support every time fast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container-fluid fruite py-5">
        <div className="container py-5">
          <div className="tab-class text-center">
            <div className="row g-4">
              <div className="col-lg-4 text-start">
                <h1>Our Organic Products</h1>
              </div>
              <div className="col-lg-8 text-end">
                <ul className="nav nav-pills d-inline-flex text-center mb-5">
                  <li className="nav-item">
                    <a className="d-flex m-2 py-2 bg-light rounded-pill active" data-bs-toggle="pill" href="#tab-1">
                      <span className="text-dark" style={{width: '130px'}}>All Products</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="d-flex py-2 m-2 bg-light rounded-pill" data-bs-toggle="pill" href="#tab-2">
                      <span className="text-dark" style={{width: '130px'}}>Vegetables</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="d-flex m-2 py-2 bg-light rounded-pill" data-bs-toggle="pill" href="#tab-3">
                      <span className="text-dark" style={{width: '130px'}}>Fruits</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="d-flex m-2 py-2 bg-light rounded-pill" data-bs-toggle="pill" href="#tab-4">
                      <span className="text-dark" style={{width: '130px'}}>Bread</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="d-flex m-2 py-2 bg-light rounded-pill" data-bs-toggle="pill" href="#tab-5">
                      <span className="text-dark" style={{width: '130px'}}>Meat</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="tab-content">
              <div id="tab-1" className="tab-pane fade show p-0 active">
                <div className="row g-4">
                  <div className="col-lg-12">
                    <div className="row g-4">
                      <div className="col-md-6 col-lg-4 col-xl-3">
                        <ProductCard 
                          id="1" 
                          name="Grapes" 
                          price={4.99} 
                          imageUrl="/placeholder.png"
                          category="Fruits"
                        />
                      </div>
                      <div className="col-md-6 col-lg-4 col-xl-3">
                        <ProductCard 
                          id="2" 
                          name="Raspberries" 
                          price={4.99} 
                          imageUrl="/placeholder.png"
                          category="Fruits"
                        />
                      </div>
                      <div className="col-md-6 col-lg-4 col-xl-3">
                        <ProductCard 
                          id="3" 
                          name="Apricots" 
                          price={4.99} 
                          imageUrl="/placeholder.png"
                          category="Fruits"
                        />
                      </div>
                      <div className="col-md-6 col-lg-4 col-xl-3">
                        <ProductCard 
                          id="4" 
                          name="Banana" 
                          price={4.99} 
                          imageUrl="/placeholder.png"
                          category="Fruits"
                        />
                      </div>
                      <div className="col-md-6 col-lg-4 col-xl-3">
                        <ProductCard 
                          id="5" 
                          name="Oranges" 
                          price={4.99} 
                          imageUrl="/placeholder.png"
                          category="Fruits"
                        />
                      </div>
                      <div className="col-md-6 col-lg-4 col-xl-3">
                        <ProductCard 
                          id="6" 
                          name="Raspberries" 
                          price={4.99} 
                          imageUrl="/placeholder.png"
                          category="Fruits"
                        />
                      </div>
                      <div className="col-md-6 col-lg-4 col-xl-3">
                        <ProductCard 
                          id="7" 
                          name="Grapes" 
                          price={4.99} 
                          imageUrl="/placeholder.png"
                          category="Fruits"
                        />
                      </div>
                      <div className="col-md-6 col-lg-4 col-xl-3">
                        <ProductCard 
                          id="8" 
                          name="Grapes" 
                          price={4.99} 
                          imageUrl="/placeholder.png"
                          category="Fruits"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>      
          </div>
        </div>
      </div>

      {/* Special Offers Section */}
      <div className="container-fluid service py-5">
        <div className="container py-5">
          <div className="row g-4 justify-content-center">
            <div className="col-md-6 col-lg-4">
              <Link to="/products">
                <div className="service-item bg-secondary rounded border border-secondary">
                  <img src="/placeholder.png" className="img-fluid rounded-top w-100" alt="Fresh Apples" />
                  <div className="px-4 rounded-bottom">
                    <div className="service-content bg-primary text-center p-4 rounded">
                      <h5 className="text-white">Fresh Apples</h5>
                      <h3 className="mb-0">20% OFF</h3>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-6 col-lg-4">
              <Link to="/products">
                <div className="service-item bg-dark rounded border border-dark">
                  <img src="/placeholder.png" className="img-fluid rounded-top w-100" alt="Tasty Fruits" />
                  <div className="px-4 rounded-bottom">
                    <div className="service-content bg-light text-center p-4 rounded">
                      <h5 className="text-primary">Tasty Fruits</h5>
                      <h3 className="mb-0">Free delivery</h3>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-6 col-lg-4">
              <Link to="/products">
                <div className="service-item bg-primary rounded border border-primary">
                  <img src="/placeholder.png" className="img-fluid rounded-top w-100" alt="Exotic Vegetables" />
                  <div className="px-4 rounded-bottom">
                    <div className="service-content bg-secondary text-center p-4 rounded">
                      <h5 className="text-white">Exotic Vegitable</h5>
                      <h3 className="mb-0">Discount 30$</h3>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Vegetable Carousel Section */}
      <VegetableCarousel />

      {/* Banner Section */}
      <div className="container-fluid banner bg-secondary my-5">
        <div className="container py-5">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <div className="py-4">
                <h1 className="display-3 text-white">Fresh Exotic Fruits</h1>
                <p className="fw-normal display-3 text-dark mb-4">in Our Store</p>
                <p className="mb-4 text-dark">The generated Lorem Ipsum is therefore always free from repetition injected humour, or non-characteristic words etc.</p>
                <Link to="/products" className="banner-btn btn border-2 border-white rounded-pill text-dark py-3 px-5">
                  BUY
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <img src="/placeholder.png" className="img-fluid w-100 rounded" alt="Fresh fruits banner" />
                <div 
                  className="d-flex align-items-center justify-content-center bg-white rounded-circle position-absolute" 
                  style={{width: '140px', height: '140px', top: 0, left: 0}}
                >
                  <h1 style={{fontSize: '100px'}}>1</h1>
                  <div className="d-flex flex-column">
                    <span className="h2 mb-0">50$</span>
                    <span className="h4 text-muted mb-0">kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
