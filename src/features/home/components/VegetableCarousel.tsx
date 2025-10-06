import { useEffect, useState } from "react";
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
    name: "Parsley",
    price: 4.99,
    imageUrl: "/placeholder.png",
    description: "Fresh organic parsley for seasoning and garnishing.",
  },
  {
    id: 2,
    name: "Fresh Spinach",
    price: 3.99,
    imageUrl: "/placeholder.png",
    description: "Rich in iron, perfect for salads and soups.",
  },
  {
    id: 3,
    name: "Organic Banana",
    price: 2.99,
    imageUrl: "/placeholder.png",
    description: "Sweet and creamy bananas, full of potassium.",
  },
  {
    id: 4,
    name: "Bell Pepper",
    price: 5.49,
    imageUrl: "/placeholder.png",
    description: "Crisp and colorful bell peppers for any dish.",
  },
  {
    id: 5,
    name: "Fresh Potatoes",
    price: 2.49,
    imageUrl: "/placeholder.png",
    description: "Farm-fresh potatoes for all cooking needs.",
  },
  {
    id: 6,
    name: "Green Broccoli",
    price: 4.99,
    imageUrl: "/placeholder.png",
    description: "Healthy broccoli florets packed with vitamins.",
  },
  {
    id: 7,
    name: "Cherry Tomato",
    price: 3.49,
    imageUrl: "/placeholder.png",
    description: "Juicy cherry tomatoes for fresh salads.",
  },
  {
    id: 8,
    name: "Cucumber",
    price: 2.99,
    imageUrl: "/placeholder.png",
    description: "Cool and crisp cucumbers, great for hydration.",
  },
  {
    id: 9,
    name: "Carrot",
    price: 3.29,
    imageUrl: "/placeholder.png",
    description: "Sweet orange carrots rich in beta-carotene.",
  },
  {
    id: 10,
    name: "Onion",
    price: 1.99,
    imageUrl: "/placeholder.png",
    description: "Fresh onions for flavorful cooking.",
  },
];

export default function VegetableCarousel() {
  const dispatch = useDispatch<AppDispatch>();
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 6;

  const handleAddToCart = (product: VegetableProduct) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      })
    );
  };

  // Chỉ chạy tự động nếu có hơn 7 sản phẩm
  useEffect(() => {
    if (vegetables.length <= visibleCount) return;

    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + visibleCount) % vegetables.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Lấy 7 sản phẩm hiển thị (vòng lại đầu nếu hết)
  const visibleVegetables = [
    ...vegetables.slice(startIndex, startIndex + visibleCount),
    ...vegetables.slice(
      0,
      Math.max(0, startIndex + visibleCount - vegetables.length)
    ),
  ].slice(0, visibleCount);

  return (
    <div className="container-fluid vesitable py-5">
      <div className="container py-5">
        <h1 className="mb-0">Fresh Organic Vegetables</h1>
        <div className="row g-4 mt-4">
          {visibleVegetables.map((vegetable) => (
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
                  style={{ top: "10px", right: "10px" }}
                >
                  Vegetable
                </div>
                <div className="p-4 rounded-bottom">
                  <h4>{vegetable.name}</h4>
                  <p>{vegetable.description}</p>
                  <div className="d-flex justify-content-between flex-lg-wrap">
                    <p className="text-dark fs-5 fw-bold mb-0">
                      ${vegetable.price.toFixed(2)} / kg
                    </p>
                    <button
                      onClick={() => handleAddToCart(vegetable)}
                      className="btn border border-secondary rounded-pill px-3 text-primary"
                    >
                      <i className="fa fa-shopping-bag me-2 text-primary"></i>{" "}
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chỉ hiển thị chấm nếu có hơn 7 sản phẩm */}
        {vegetables.length > visibleCount && (
          <div className="mt-3 d-flex justify-content-center">
            {Array.from({
              length: Math.ceil(vegetables.length / visibleCount),
            }).map((_, idx) => (
              <span
                key={idx}
                onClick={() => setStartIndex(idx * visibleCount)}
                className={`mx-1 rounded-circle ${
                  startIndex / visibleCount === idx
                    ? "bg-primary"
                    : "bg-secondary"
                }`}
                style={{ width: 10, height: 10, cursor: "pointer" }}
              ></span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
