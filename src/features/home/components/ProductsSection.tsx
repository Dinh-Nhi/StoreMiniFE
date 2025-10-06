import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../cart/store/cartSlice";
import { type AppDispatch } from "../../../store";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
};

const products: Product[] = [
  // 👕 ÁO
  {
    id: 1,
    name: "Áo thun cotton",
    price: 249000,
    imageUrl: "/img/shirt1.png",
    category: "Shirt",
    description: "Thoáng mát, thấm hút mồ hôi.",
  },
  {
    id: 2,
    name: "Áo sơ mi trắng",
    price: 399000,
    imageUrl: "/img/shirt2.png",
    category: "Shirt",
    description: "Form chuẩn, dễ phối đồ.",
  },
  {
    id: 3,
    name: "Áo polo thể thao",
    price: 299000,
    imageUrl: "/img/shirt3.png",
    category: "Shirt",
    description: "Phong cách năng động.",
  },
  {
    id: 4,
    name: "Áo hoodie nỉ",
    price: 459000,
    imageUrl: "/img/shirt4.png",
    category: "Shirt",
    description: "Giữ ấm và thoải mái.",
  },

  // 👖 QUẦN
  {
    id: 5,
    name: "Quần jean slim fit",
    price: 499000,
    imageUrl: "/img/pants1.png",
    category: "Pants",
    description: "Vải co giãn, bền màu.",
  },
  {
    id: 6,
    name: "Quần tây công sở",
    price: 549000,
    imageUrl: "/img/pants2.png",
    category: "Pants",
    description: "Lịch sự, sang trọng.",
  },
  {
    id: 7,
    name: "Quần short kaki",
    price: 329000,
    imageUrl: "/img/pants3.png",
    category: "Pants",
    description: "Phù hợp đi chơi, dạo phố.",
  },
  {
    id: 8,
    name: "Quần jogger thể thao",
    price: 379000,
    imageUrl: "/img/pants4.png",
    category: "Pants",
    description: "Thoải mái khi vận động.",
  },

  // 👟 GIÀY
  {
    id: 9,
    name: "Giày sneaker trắng",
    price: 599000,
    imageUrl: "/img/shoes1.png",
    category: "Shoes",
    description: "Phong cách hiện đại.",
  },
  {
    id: 10,
    name: "Giày da cổ điển",
    price: 899000,
    imageUrl: "/img/shoes2.png",
    category: "Shoes",
    description: "Thích hợp đi làm.",
  },
  {
    id: 11,
    name: "Giày lười nam",
    price: 749000,
    imageUrl: "/img/shoes3.png",
    category: "Shoes",
    description: "Đơn giản và tinh tế.",
  },
  {
    id: 12,
    name: "Giày sandal nữ",
    price: 499000,
    imageUrl: "/img/shoes4.png",
    category: "Shoes",
    description: "Thời trang mùa hè.",
  },

  // 👜 TÚI
  {
    id: 13,
    name: "Túi xách nữ da bò",
    price: 1099000,
    imageUrl: "/img/bag1.png",
    category: "Bags",
    description: "Sang trọng và bền đẹp.",
  },
  {
    id: 14,
    name: "Túi đeo chéo nam",
    price: 459000,
    imageUrl: "/img/bag2.png",
    category: "Bags",
    description: "Tiện lợi và thời trang.",
  },
  {
    id: 15,
    name: "Balo laptop",
    price: 659000,
    imageUrl: "/img/bag3.png",
    category: "Bags",
    description: "Chống nước, chứa nhiều ngăn.",
  },
  {
    id: 16,
    name: "Túi tote canvas",
    price: 299000,
    imageUrl: "/img/bag4.png",
    category: "Bags",
    description: "Phù hợp cho đi học, đi chơi.",
  },
];

export default function FashionCarousel() {
  const dispatch = useDispatch<AppDispatch>();
  const categories = ["Shirt", "Pants", "Shoes", "Bags"];
  const [activeTab, setActiveTab] = useState("Shirt");
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;

  const filteredProducts = products.filter((p) => p.category === activeTab);

  // Tự động carousel nếu nhiều hơn 4 sản phẩm
  useEffect(() => {
    if (filteredProducts.length <= visibleCount) return;

    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + visibleCount) % filteredProducts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const visibleItems = [
    ...filteredProducts.slice(startIndex, startIndex + visibleCount),
    ...filteredProducts.slice(
      0,
      Math.max(0, startIndex + visibleCount - filteredProducts.length)
    ),
  ].slice(0, visibleCount);

  const handleAddToCart = (product: Product) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      })
    );
  };

  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary">Bộ sưu tập thời trang mới</h2>
          <div className="d-flex gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn rounded-pill px-4 py-2 ${
                  activeTab === cat
                    ? "btn-primary text-white"
                    : "btn-outline-primary"
                }`}
                onClick={() => {
                  setActiveTab(cat);
                  setStartIndex(0);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="row g-4">
          {visibleItems.map((product) => (
            <div key={product.id} className="col-md-6 col-lg-3">
              <div className="border rounded bg-light position-relative p-3 h-100">
                <img
                  src={product.imageUrl}
                  className="img-fluid rounded mb-3"
                  alt={product.name}
                />
                <h5 className="fw-bold">{product.name}</h5>
                <p className="text-muted">{product.description}</p>
                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <span className="text-dark fw-bold">
                    {product.price.toLocaleString()}₫
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn border border-secondary rounded-pill px-3 text-primary"
                  >
                    <i className="fa fa-shopping-bag me-2 text-primary"></i> Mua
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nút chọn trang */}
        {filteredProducts.length > visibleCount && (
          <div className="mt-3 d-flex justify-content-center">
            {Array.from({
              length: Math.ceil(filteredProducts.length / visibleCount),
            }).map((_, idx) => (
              <span
                key={idx}
                onClick={() => setStartIndex(idx * visibleCount)}
                className={`mx-1 rounded-circle ${
                  Math.floor(startIndex / visibleCount) === idx
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
