import { useEffect, useState } from "react";
import { getCategoryByIsShow, getProductByCategoryId } from "../../../helper/api";
import { useDispatch } from "react-redux";
import { addToCart } from "../../cart/store/cartSlice";
import { type AppDispatch } from "../../../store";

export default function ProductSection() {
  const dispatch = useDispatch<AppDispatch>();

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;

  // 🔹 Lấy danh mục khi load trang
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategoryByIsShow();
        const data = res.data || [];
        setCategories(data);

        if (data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Lấy sản phẩm khi chọn danh mục
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) return;
      setLoading(true);
      try {
        const res = await getProductByCategoryId(selectedCategory);
        setProducts(res.data || []);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  // 🔹 Carousel tự động
  useEffect(() => {
    if (products.length <= visibleCount) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + visibleCount) % products.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [products]);

  // 🔹 Sản phẩm hiển thị
  const visibleItems = [
    ...products.slice(startIndex, startIndex + visibleCount),
    ...products.slice(
      0,
      Math.max(0, startIndex + visibleCount - products.length)
    ),
  ].slice(0, visibleCount);

  // 🔹 Thêm vào giỏ hàng
  const handleAddToCart = (product: any) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.basePrice,
        quantity: 1,
        image: product.fileKey || "/img/placeholder.png",
      })
    );
  };

  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        {/* Header + Danh mục */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h2 className="fw-bold text-primary">Bộ sưu tập thời trang mới</h2>

          <div className="d-flex gap-3 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`btn rounded-pill px-4 py-2 ${
                  selectedCategory === cat.id
                    ? "btn-primary text-white"
                    : "btn-outline-primary"
                }`}
                onClick={() => {
                  setStartIndex(0);
                  setSelectedCategory(cat.id);
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        )}

        {/* Danh sách sản phẩm */}
        {!loading && products.length > 0 && (
          <>
            <div className="row g-4">
              {visibleItems.map((product) => (
                <div
                  key={`${product.categoryId}-${product.id}`}
                  className="col-md-6 col-lg-3"
                >
                  <div className="border rounded bg-light position-relative p-3 h-100 d-flex flex-column">
                    <img
                      src={product.fileKey || "/img/placeholder.png"}
                      className="img-fluid rounded mb-3"
                      alt={product.name}
                    />
                    <h5 className="fw-bold text-dark text-truncate">{product.name}</h5>
                    <p className="text-muted small mb-3">
                      {product.description || "Không có mô tả."}
                    </p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <span className="text-dark fw-bold">
                        {product.basePrice.toLocaleString()}₫
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="btn border border-secondary rounded-pill px-3 text-primary"
                      >
                        <i className="fa fa-shopping-bag me-2 text-primary"></i>
                        Mua
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            {products.length > visibleCount && (
              <div className="mt-3 d-flex justify-content-center">
                {Array.from({
                  length: Math.ceil(products.length / visibleCount),
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
          </>
        )}

        {/* Không có sản phẩm */}
        {!loading && products.length === 0 && (
          <div className="text-center py-5 text-muted">
            Không có sản phẩm nào trong danh mục này.
          </div>
        )}
      </div>
    </div>
  );
}
