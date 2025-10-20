import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../cart/store/cartSlice";
import { type AppDispatch } from "../../../store";
import { getBestSellingProducts } from "../../../helper/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type BestsellerProduct = {
  id: number;
  name: string;
  basePrice: number;
  discount?: number; // %
  fileKey?: string;
  rating?: number;
  description?: string;
};

export default function BestsellerSection() {
  const dispatch = useDispatch<AppDispatch>();
  const [products, setProducts] = useState<BestsellerProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch API ---
  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const res = await getBestSellingProducts(6);
        setProducts(res?.data || []);
      } catch (err) {
        console.error("Failed to load best-selling products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSelling();
  }, []);

  const handleAddToCart = (product: BestsellerProduct) => {
    const finalPrice = Math.round(
      product.basePrice * (1 - (product.discount || 0) / 100)
    );

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: finalPrice,
        quantity: 1,
        image: product.fileKey,
      })
    );

    // ✅ Thông báo toast
    toast.success(`🛒 Đã thêm "${product.name}" vào giỏ hàng!`, {
      position: "bottom-right",
      autoClose: 2000,
      theme: "colored",
    });
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const renderStars = (rating: number = 4) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < rating ? "text-primary" : "text-muted"}`}
      ></i>
    ));
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Đang tải sản phẩm bán chạy...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-5">
        <p>Hiện chưa có sản phẩm bán chạy nào.</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5 bg-light">
      <div className="container py-5">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "700px" }}>
          <h1 className="display-5 fw-bold text-primary">Sản phẩm bán chạy</h1>
          <p className="text-muted">
            Khám phá những sản phẩm được yêu thích và bán chạy nhất trong cửa hàng của chúng tôi.
          </p>
        </div>

        <div className="row g-4">
          {products.map((product) => {
            const discountedPrice = Math.round(
              product.basePrice * (1 - (product.discount || 0) / 100)
            );

            return (
              <div key={product.id} className="col-lg-6 col-xl-4">
                <div className="p-4 rounded bg-white shadow-sm border h-100">
                  <div className="row align-items-center">
                    {/* Ảnh sản phẩm */}
                    <div className="col-6">
                      <div className="position-relative">
                        {product.discount ? (
                          <span
                            className="position-absolute bg-danger text-white fw-bold px-2 py-1 rounded"
                            style={{ top: "10px", right: "10px", fontSize: "0.8rem" }}
                          >
                            -{product.discount}%
                          </span>
                        ) : null}

                        <img
                          src={
                            product.fileKey
                              ? `/uploads/${product.fileKey}`
                              : "/img/placeholder.png"
                          }
                          className="img-fluid rounded-circle w-100 border"
                          alt={product.name}
                          style={{
                            height: "180px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </div>

                    {/* Nội dung */}
                    <div className="col-6">
                      <h5 className="fw-bold text-dark text-truncate">{product.name}</h5>
                      <div className="d-flex my-2">{renderStars(product.rating)}</div>

                      <div className="d-flex flex-column mb-3">
                        <span className="text-danger fw-bold">
                          {formatCurrency(discountedPrice)}
                        </span>
                        {product.discount ? (
                          <small className="text-muted text-decoration-line-through">
                            {formatCurrency(product.basePrice)}
                          </small>
                        ) : null}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="btn btn-outline-primary rounded-pill px-3"
                      >
                        <i className="fa fa-shopping-bag me-2"></i> Mua ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
