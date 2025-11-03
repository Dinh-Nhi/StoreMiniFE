import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../../cart/store/cartSlice";
import { type AppDispatch } from "../../../store";
import {
  getBestSellingProducts,
  getMediaProductByFileKey,
} from "../../../helper/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BestsellerSection() {
  const dispatch = useDispatch<AppDispatch>();
  const [products, setProducts] = useState<any[]>([]);
  const [productImages, setProductImages] = useState<Record<number, string>>({});
  const [selectedVariants, setSelectedVariants] = useState<Record<number, any>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const createdUrls = useRef<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchBestSelling = async () => {
      setLoading(true);
      try {
        const res = await getBestSellingProducts(6);
        const data = res?.data || [];
        if (!isMounted) return;
        setProducts(data);

        // ✅ Load ảnh sản phẩm
        const imageMap: Record<number, string> = {};
        const results = await Promise.all(
          data.map(async (p: any) => {
            if (p.fileKey) {
              try {
                const res = await getMediaProductByFileKey(p.fileKey);
                const blob = res.data;
                const url = URL.createObjectURL(blob);
                return { id: p.id, url };
              } catch {
                return { id: p.id, url: "/img/placeholder.png" };
              }
            } else {
              return { id: p.id, url: "/img/placeholder.png" };
            }
          })
        );

        results.forEach(({ id, url }) => (imageMap[id] = url));
        if (isMounted) setProductImages(imageMap);

        // ✅ Mặc định chọn màu và size
        const defaultVariants: Record<number, any> = {};
        const defaultSizes: Record<number, any> = {};
        data.forEach((p: any) => {
          if (p.variants?.length > 0) {
            const fv = p.variants[0];
            defaultVariants[p.id] = fv;
            defaultSizes[p.id] = fv.sizes?.[0] || null;
          }
        });
        setSelectedVariants(defaultVariants);
        setSelectedSizes(defaultSizes);
      } catch (err) {
        console.error("❌ Lỗi khi tải sản phẩm bán chạy:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBestSelling();

    return () => {
      isMounted = false;
      createdUrls.current.forEach((u) => URL.revokeObjectURL(u));
      createdUrls.current = [];
    };
  }, []);

  // ✅ Thêm vào giỏ hàng
  const handleAddToCart = (product: any) => {
    const selectedVariant = selectedVariants[product.id];
    const selectedSize = selectedSizes[product.id];

    if (!selectedVariant) {
      toast.warning("⚠️ Vui lòng chọn màu sản phẩm!");
      return;
    }
    if (!selectedSize) {
      toast.warning("⚠️ Vui lòng chọn size sản phẩm!");
      return;
    }

    const discount = product.discount ?? 0;
    const finalPrice = Math.round(product.basePrice * (1 - discount / 100));
    const variantImage =
      selectedVariant.image || productImages[product.id] || "/img/placeholder.png";

    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        image: variantImage,
        variantId: selectedVariant.id,
        color: selectedVariant.color,
        size: selectedSize.size,
        sizeId: selectedSize.id,
        price: finalPrice,
        quantity: 1,
        maxStock: selectedSize.stock ?? 999,
        availableColors: product.variants?.map((v: any) => ({
          id: v.id,
          color: v.color,
          sizes: v.sizes,
          price: v.price,
        })),
        availableSizes: selectedVariant.sizes?.map((s: any) => ({
          id: s.id,
          size: s.size,
          stock: s.stock,
        })),
      })
    );

    toast.success(`🛒 Đã thêm "${product.name}" vào giỏ hàng!`, {
      position: "bottom-right",
      autoClose: 2000,
      theme: "colored",
    });
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className="container-fluid py-5 bg-light">
      <div className="container py-5">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "700px" }}>
          <h1 className="display-5 fw-bold text-primary">Sản phẩm bán chạy</h1>
          <p className="text-muted">
            Khám phá những sản phẩm được yêu thích và bán chạy nhất trong cửa hàng của chúng tôi.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <div className="row g-4">
            {products.map((product) => {
              const img = productImages[product.id] || "/img/placeholder.png";
              const variants = product.variants || [];
              const selectedVariant = selectedVariants[product.id];
              const sizes = selectedVariant?.sizes || [];
              const selectedSize = selectedSizes[product.id];
              const discount = product.discount ?? 0;
              const discountedPrice = Math.round(
                product.basePrice * (1 - discount / 100)
              );

              return (
                <div key={product.id} className="col-lg-6 col-xl-4">
                  <div className="p-4 rounded bg-white shadow-sm border h-100 position-relative overflow-hidden">
                    {discount > 0 && (
                      <span
                        className="position-absolute bg-danger text-white fw-bold px-2 py-1 rounded"
                        style={{ top: 10, right: 10, fontSize: "0.8rem" }}
                      >
                        -{discount}%
                      </span>
                    )}

                    {/* 🔹 Link chi tiết bao quanh ảnh */}
                    <div className="text-center mb-3">
                      <Link to={`/products/${product.id}`}>
                        <img
                          src={img}
                          alt={product.name}
                          className="img-fluid rounded-circle border"
                          style={{
                            height: "180px",
                            width: "180px",
                            objectFit: "cover",
                            transition: "transform 0.3s",
                          }}
                          onError={(e) =>
                            ((e.target as HTMLImageElement).src = "/img/placeholder.png")
                          }
                        />
                      </Link>
                    </div>

                    {/* 🔹 Tên sản phẩm có link */}
                    <h5 className="fw-bold text-dark text-center text-truncate">
                      <Link
                        to={`/products/${product.id}`}
                        className="text-decoration-none text-dark"
                      >
                        {product.name}
                      </Link>
                    </h5>

                    <p className="text-muted small text-center text-truncate">
                      {product.description || "Không có mô tả."}
                    </p>

                    {/* Màu */}
                    {variants.length > 0 && (
                      <div className="text-center mb-2">
                        <span className="small text-muted me-2">Màu:</span>
                        {variants.map((v: any) => (
                          <button
                            key={v.id}
                            className={`btn btn-sm me-2 mb-2 ${
                              selectedVariant?.id === v.id
                                ? "btn-primary text-white"
                                : "btn-outline-primary"
                            }`}
                            onClick={() => {
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [product.id]: v,
                              }));
                              if (v.sizes?.length > 0) {
                                setSelectedSizes((prev) => ({
                                  ...prev,
                                  [product.id]: v.sizes[0],
                                }));
                              }
                            }}
                          >
                            {v.color}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Size */}
                    {sizes.length > 0 && (
                      <div className="text-center mb-3">
                        <span className="small text-muted me-2">Size:</span>
                        {sizes.map((s: any) => (
                          <button
                            key={s.id}
                            className={`btn btn-sm me-2 mb-2 ${
                              selectedSize?.id === s.id
                                ? "btn-success text-white"
                                : "btn-outline-success"
                            }`}
                            onClick={() =>
                              setSelectedSizes((prev) => ({
                                ...prev,
                                [product.id]: s,
                              }))
                            }
                          >
                            {s.size}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Giá và nút mua */}
                    <div className="d-flex justify-content-between align-items-center px-2 mt-2">
                      <div>
                        <div className="text-danger fw-bold">
                          {formatCurrency(discountedPrice)}
                        </div>
                        {discount > 0 && (
                          <div className="text-muted text-decoration-line-through small">
                            {formatCurrency(product.basePrice)}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="btn btn-outline-primary rounded-pill px-3"
                      >
                        <i className="fa fa-shopping-bag me-2"></i>Mua ngay
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
