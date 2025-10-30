import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../cart/store/cartSlice";
import { type AppDispatch } from "../../../store";
import { getBestSellingProducts, getMediaProductByFileKey } from "../../../helper/api";
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
  const [productImages, setProductImages] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);

  // 🔹 Lấy danh sách sản phẩm bán chạy + tải ảnh theo fileKey
  useEffect(() => {
    let isMounted = true;

    const fetchBestSelling = async () => {
      try {
        const res = await getBestSellingProducts(6);
        const data = res?.data || [];
        if (!isMounted) return;

        setProducts(data);

        // ✅ Tải ảnh song song
        const imageMap: Record<number, string> = {};
        const results = await Promise.all(
          data.map(async (p: BestsellerProduct) => {
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
        console.error("❌ Lỗi khi tải sản phẩm bán chạy:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBestSelling();

    return () => {
      isMounted = false;
      Object.values(productImages).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // 🔹 Xử lý thêm vào giỏ hàng
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

  // 🔹 Render sao đánh giá
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
                <div className="p-4 rounded bg-white shadow-sm border h-100 position-relative overflow-hidden">
                  {/* 🔹 Badge giảm giá */}
                  {product.discount ? (
                    <span
                      className="position-absolute bg-danger text-white fw-bold px-2 py-1 rounded"
                      style={{ top: "10px", right: "10px", fontSize: "0.8rem", zIndex: 10 }}
                    >
                      -{product.discount}%
                    </span>
                  ) : null}

                  <div className="row align-items-center">
                    {/* Ảnh sản phẩm */}
                    <div className="col-6">
                      <img
                        src={productImages[product.id] || "/img/placeholder.png"}
                        className="img-fluid rounded-circle w-100 border"
                        alt={product.name}
                        style={{
                          height: "180px",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    {/* Nội dung sản phẩm */}
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
