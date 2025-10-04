// src/features/home/components/VegetableCarousel.tsx
import { useDispatch } from "react-redux";
import { addToCart } from "../../cart/store/cartSlice";
import { type AppDispatch } from "../../../store";

type VegetableProduct = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
};

const vegetables: VegetableProduct[] = [
  { 
    id: 1, 
    name: "Parsely", 
    price: 4.99, 
    imageUrl: "/placeholder.png", 
    description: "Fresh organic parsley, perfect for seasoning and garnishing your favorite dishes."
  },
  { 
    id: 2, 
    name: "Fresh Spinach", 
    price: 3.99, 
    imageUrl: "/placeholder.png", 
    description: "Nutrient-rich spinach leaves, great for salads and cooking."
  },
  { 
    id: 3, 
    name: "Organic Banana", 
    price: 7.99, 
    imageUrl: "/placeholder.png", 
    description: "Sweet and creamy organic bananas, packed with potassium and vitamins."
  },
  { 
    id: 4, 
    name: "Bell Pepper", 
    price: 7.99, 
    imageUrl: "/placeholder.png", 
    description: "Colorful bell peppers, rich in vitamin C and perfect for cooking."
  },
  { 
    id: 5, 
    name: "Fresh Potatoes", 
    price: 7.99, 
    imageUrl: "/placeholder.png", 
    description: "Farm-fresh potatoes, versatile and delicious for any meal."
  },
  { 
    id: 6, 
    name: "Green Broccoli", 
    price: 5.99, 
    imageUrl: "/placeholder.png", 
    description: "Nutritious broccoli florets, packed with vitamins and minerals."
  },
];

export default function VegetableCarousel() {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = (product: VegetableProduct) => {
    dispatch(addToCart({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      quantity: 1 
    }));
  };

  return (
    <div className="container-fluid vesitable py-5">
      <div className="container py-5">
        <h1 className="mb-0">Fresh Organic Vegetables</h1>
        <div className="row g-4 mt-4">
          {vegetables.map((vegetable) => (
            <div key={vegetable.id} className="col-md-6 col-lg-4 col-xl-2">
              <div className="border border-primary rounded position-relative vesitable-item">
                <div className="vesitable-img">
                  <img 
                    src={vegetable.imageUrl} 
                    className="img-fluid w-100 rounded-top" 
                    alt={vegetable.name}
                  />
                </div>
                <div 
                  className="text-white bg-primary px-3 py-1 rounded position-absolute" 
                  style={{top: '10px', right: '10px'}}
                >
                  Vegetable
                </div>
                <div className="p-4 rounded-bottom">
                  <h4>{vegetable.name}</h4>
                  <p>{vegetable.description}</p>
                  <div className="d-flex justify-content-between flex-lg-wrap">
                    <p className="text-dark fs-5 fw-bold mb-0">${vegetable.price.toFixed(2)} / kg</p>
                    <button 
                      onClick={() => handleAddToCart(vegetable)}
                      className="btn border border-secondary rounded-pill px-3 text-primary"
                    >
                      <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
