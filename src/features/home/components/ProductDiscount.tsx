import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../cart/store/cartSlice";
import { type AppDispatch } from "../../../store";
import {
  getDiscountedProducts,
  getMediaProductByFileKey,
} from "../../../helper/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DiscountedProductCarousel() {
  const dispatch = useDispatch<AppDispatch>();

  const [products, setProducts] = useState<any[]>([]);
  const [productImages, setProductImages] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<number, any>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<number, any>>({});
  const visibleCount = 4;

  const createdUrls = useRef<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getDiscountedProducts();
        const data = res.data || res || [];
        if (!isMounted) return;

        setProducts(data);

       // Lấy ảnh chính của từng sản phẩm
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
        if (isMounted) {
          results.forEach(({ id, url }) => (imageMap[id] = url));
          setProductImages(imageMap);

          // ✅ mặc định chọn variant & size đầu tiên
          const defaultVariants: Record<number, any> = {};
          const defaultSizes: Record<number, any> = {};
          data.forEach((p: any) => {
            if (p.variants?.length > 0) {
              const firstVariant = p.variants[0];
              defaultVariants[p.id] = firstVariant;
              if (firstVariant.sizes?.length > 0) {
                defaultSizes[p.id] = firstVariant.sizes[0];
              }
            }
          });
          setSelectedVariants(defaultVariants);
          setSelectedSizes(defaultSizes);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải sản phẩm giảm giá:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
      createdUrls.current.forEach((u) => URL.revokeObjectURL(u));
      createdUrls.current = [];
    };
  }, []);

  // 🔹 Tự động carousel
  useEffect(() => {
    if (products.length <= visibleCount) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + visibleCount) % products.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [products]);

  const visibleItems = [
    ...products.slice(startIndex, startIndex + visibleCount),
    ...products.slice(0, Math.max(0, startIndex + visibleCount - products.length)),
  ].slice(0, visibleCount);

  // 🔹 Thêm vào giỏ hàng (ảnh chính xác từ fileKey)
  const handleAddToCart = async (product: any) => {
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

    let variantImage = productImages[product.id] || "/img/placeholder.png";

    // ✅ Nếu variant có fileKey riêng → ưu tiên ảnh đó
    if (selectedVariant.fileKey) {
      try {
        const res = await getMediaProductByFileKey(selectedVariant.fileKey);
        const blob = res.data;
        const url = URL.createObjectURL(blob);
        createdUrls.current.push(url);
        variantImage = url;
      } catch {
        /* fallback giữ ảnh cũ */
      }
    }

    const discount = product.discount ?? 0;
    const finalPrice = Math.round(product.basePrice * (1 - discount / 100));

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
        <h2 className="fw-bold mb-4 text-primary">Sản phẩm giảm giá</h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <div className="row g-4">
            {visibleItems.map((product) => {
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
                <div key={product.id} className="col-md-6 col-lg-3">
                  <div className="position-relative border rounded bg-white shadow-sm h-100 d-flex flex-column overflow-hidden">
                    {discount > 0 && (
                      <span className="position-absolute bg-danger text-white fw-bold px-2 py-1 rounded-start" style={{ top: 10, right: 10 }}>
                        -{discount}%
                      </span>
                    )}

                    <Link to={`/products/${product.id}`}>
                      <img
                        src={img}
                        alt={product.name}
                        className="img-fluid rounded-top w-100"
                        style={{ height: "220px", objectFit: "cover", borderBottom: "1px solid #eee" }}
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src = "/img/placeholder.png")
                        }
                      />
                    </Link>

                    <div className="p-3 d-flex flex-column flex-grow-1">
                      <h5 className="fw-bold text-dark text-truncate">{product.name}</h5>

                      <p className="text-muted small mb-3 text-truncate">
                        {product.description || "Không có mô tả."}
                      </p>

                      {/* 🔹 Màu */}
                      {variants.length > 0 && (
                        <div className="mb-2">
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

                      {/* 🔹 Size */}
                      {sizes.length > 0 && (
                        <div className="mb-3">
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

                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <div>
                          <div className="text-danger fw-bold">
                            {formatCurrency(discountedPrice)}
                          </div>
                          <div className="text-muted text-decoration-line-through" style={{ fontSize: "0.85rem" }}>
                            {formatCurrency(product.basePrice)}
                          </div>
                        </div>

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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
