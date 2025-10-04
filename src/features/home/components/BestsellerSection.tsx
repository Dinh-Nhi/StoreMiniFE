// src/features/home/components/BestsellerSection.tsx
import { useDispatch } from "react-redux";
import { addToCart } from "../../cart/store/cartSlice";
import { type AppDispatch } from "../../../store";

type BestsellerProduct = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
};

const bestsellerProducts: BestsellerProduct[] = [
  { id: 1, name: "Organic Tomato", price: 3.12, imageUrl: "/placeholder.png", rating: 4 },
  { id: 2, name: "Fresh Apple", price: 2.99, imageUrl: "/placeholder.png", rating: 4 },
  { id: 3, name: "Sweet Orange", price: 4.25, imageUrl: "/placeholder.png", rating: 4 },
  { id: 4, name: "Fresh Banana", price: 1.89, imageUrl: "/placeholder.png", rating: 4 },
  { id: 5, name: "Red Grapes", price: 5.50, imageUrl: "/placeholder.png", rating: 4 },
  { id: 6, name: "Green Lettuce", price: 2.75, imageUrl: "/placeholder.png", rating: 4 },
];

const featuredProducts: BestsellerProduct[] = [
  { id: 7, name: "Organic Strawberry", price: 6.99, imageUrl: "/placeholder.png", rating: 5 },
  { id: 8, name: "Fresh Mango", price: 4.50, imageUrl: "/placeholder.png", rating: 4 },
  { id: 9, name: "Sweet Pineapple", price: 3.89, imageUrl: "/placeholder.png", rating: 4 },
  { id: 10, name: "Fresh Avocado", price: 2.99, imageUrl: "/placeholder.png", rating: 5 },
];

export default function BestsellerSection() {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = (product: BestsellerProduct) => {
    dispatch(addToCart({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      quantity: 1 
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i 
        key={index}
        className={`fas fa-star ${index < rating ? 'text-primary' : ''}`}
      ></i>
    ));
  };

  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        <div className="text-center mx-auto mb-5" style={{maxWidth: '700px'}}>
          <h1 className="display-4">Bestseller Products</h1>
          <p>Discover our most popular and highest-rated organic products, loved by customers worldwide.</p>
        </div>
        <div className="row g-4">
          {/* Bestseller Products - Horizontal Layout */}
          {bestsellerProducts.map((product) => (
            <div key={product.id} className="col-lg-6 col-xl-4">
              <div className="p-4 rounded bg-light">
                <div className="row align-items-center">
                  <div className="col-6">
                    <img 
                      src={product.imageUrl} 
                      className="img-fluid rounded-circle w-100" 
                      alt={product.name}
                    />
                  </div>
                  <div className="col-6">
                    <a href="#" className="h5">{product.name}</a>
                    <div className="d-flex my-3">
                      {renderStars(product.rating)}
                    </div>
                    <h4 className="mb-3">${product.price.toFixed(2)}</h4>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="btn border border-secondary rounded-pill px-3 text-primary"
                    >
                      <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Featured Products - Vertical Layout */}
          {featuredProducts.map((product) => (
            <div key={product.id} className="col-md-6 col-lg-6 col-xl-3">
              <div className="text-center">
                <img 
                  src={product.imageUrl} 
                  className="img-fluid rounded" 
                  alt={product.name}
                />
                <div className="py-4">
                  <a href="#" className="h5">{product.name}</a>
                  <div className="d-flex my-3 justify-content-center">
                    {renderStars(product.rating)}
                  </div>
                  <h4 className="mb-3">${product.price.toFixed(2)}</h4>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="btn border border-secondary rounded-pill px-3 text-primary"
                  >
                    <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
