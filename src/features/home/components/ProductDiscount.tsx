import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../cart/store/cartSlice";
import { type AppDispatch } from "../../../store";
import { getDiscountedProducts, getMediaProductByFileKey } from "../../../helper/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface DiscountedProduct {
  id: number;
  name: string;
  basePrice: number;
  discount: number; // %
  fileKey?: string;
  description?: string;
}

export default function DiscountedProductCarousel() {
  const dispatch = useDispatch<AppDispatch>();
  const [products, setProducts] = useState<DiscountedProduct[]>([]);
  const [productImages, setProductImages] = useState<{ [key: number]: string }>({});
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;

  // 🔹 Lấy danh sách sản phẩm giảm giá + ảnh từ fileKey
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await getDiscountedProducts();
        const data = res || [];
        if (!isMounted) return;
        setProducts(data);

        // ✅ Tải ảnh song song
        const imageMap: Record<number, string> = {};
        const results = await Promise.all(
          data.map(async (p: DiscountedProduct) => {
            if (p.fileKey) {
              try {
                const res = await getMediaProductByFileKey(p.fileKey);
                const blob = res.data;
                const url = URL.createObjectURL(blob);
                return { id: p.id, url };
              } catch (error) {
                console.warn(`⚠️ Không tải được ảnh sản phẩm ID ${p.id}`);
                return { id: p.id, url: "/img/placeholder.png" };
              }
            } else {
              return { id: p.id, url: "/img/placeholder.png" };
            }
          })
        );

        results.forEach(({ id, url }) => (imageMap[id] = url));
        if (isMounted) setProductImages(imageMap);
      } catch (err) {
        console.error("❌ Lỗi khi tải sản phẩm giảm giá:", err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      Object.values(productImages).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // 🔹 Tự động chuyển carousel
  useEffect(() => {
    if (products.length <= visibleCount) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + visibleCount) % products.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [products]);

  // 🔹 Lấy các sản phẩm hiển thị
  const visibleItems = [
    ...products.slice(startIndex, startIndex + visibleCount),
    ...products.slice(0, Math.max(0, startIndex + visibleCount - products.length)),
  ].slice(0, visibleCount);

  // 🔹 Thêm vào giỏ hàng
  const handleAddToCart = (product: DiscountedProduct) => {
    const finalPrice = Math.round(product.basePrice * (1 - product.discount / 100));

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: finalPrice,
        quantity: 1,
        image: productImages[product.id] || "/img/placeholder.png",
      })
    );

    toast.success(`🛒 Đã thêm "${product.name}" vào giỏ hàng!`, {
      position: "bottom-right",
      autoClose: 2000,
      theme: "colored",
    });
  };

  // 🔹 Format giá tiền
  const formatCurrency = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className="container-fluid py-5 bg-light">
      <div className="container py-5">
        <h2 className="fw-bold mb-4 text-primary">Sản phẩm giảm giá</h2>

        <div className="row g-4">
          {visibleItems.map((product) => {
            const discountedPrice = product.basePrice * (1 - product.discount / 100);

            return (
              <div key={product.id} className="col-md-6 col-lg-3">
                <div className="position-relative border rounded bg-white shadow-sm h-100 overflow-hidden">
                  {/* 🔹 Badge giảm giá */}
                  {product.discount > 0 && (
                    <span
                      className="position-absolute bg-danger text-white fw-bold px-2 py-1 rounded-start"
                      style={{
                        top: "10px",
                        right: "10px",
                        fontSize: "0.9rem",
                        zIndex: 10,
                      }}
                    >
                      -{product.discount}%
                    </span>
                  )}

                  {/* Ảnh sản phẩm */}
                  <img
                    src={productImages[product.id] || "/img/placeholder.png"}
                    className="img-fluid rounded-top w-100"
                    alt={product.name}
                    style={{
                      height: "220px",
                      objectFit: "cover",
                      borderBottom: "1px solid #eee",
                    }}
                  />

                  {/* Nội dung */}
                  <div className="p-3 d-flex flex-column">
                    <h5 className="fw-bold text-dark text-truncate">{product.name}</h5>
                    <p className="text-muted small mb-3">
                      {product.description || "Không có mô tả."}
                    </p>

                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-danger fw-bold">
                          {formatCurrency(discountedPrice)}
                        </div>
                        <div
                          className="text-muted text-decoration-line-through"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {formatCurrency(product.basePrice)}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="btn btn-outline-primary rounded-pill px-3"
                      >
                        <i className="fa fa-shopping-bag me-2"></i> Mua
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🔹 Chấm điều hướng */}
        {products.length > visibleCount && (
          <div className="mt-3 d-flex justify-content-center">
            {Array.from({ length: Math.ceil(products.length / visibleCount) }).map(
              (_, idx) => (
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
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
