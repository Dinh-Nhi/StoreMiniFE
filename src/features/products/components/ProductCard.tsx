// src/features/products/components/ProductCard.tsx
import { useDispatch } from "react-redux";
import { addToCart } from "../../cart/store/cartSlice";
import { type AppDispatch } from "../../../store";

type Props = {
  id?: number | string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  description?: string;
};

export default function ProductCard({ id, name, price, imageUrl, category = "Fruits", description }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = () => {
    const numericId = Number(id ?? Date.now());
    dispatch(addToCart({ id: numericId, name, price, quantity: 1 }));
  };

  return (
    <div className="rounded position-relative fruite-item">
      <div className="fruite-img">
        <img 
          src={imageUrl ?? "/placeholder.png"} 
          className="img-fluid w-100 rounded-top" 
          alt={name}
        />
      </div>
      <div 
        className="text-white bg-secondary px-3 py-1 rounded position-absolute" 
        style={{top: '10px', left: '10px'}}
      >
        {category}
      </div>
      <div className="p-4 border border-secondary border-top-0 rounded-bottom">
        <h4>{name}</h4>
        <p>{description || "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt"}</p>
        <div className="d-flex justify-content-between flex-lg-wrap">
          <p className="text-dark fs-5 fw-bold mb-0">${price.toFixed(2)} / kg</p>
          <button 
            onClick={handleAddToCart}
            className="btn border border-secondary rounded-pill px-3 text-primary"
          >
            <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
