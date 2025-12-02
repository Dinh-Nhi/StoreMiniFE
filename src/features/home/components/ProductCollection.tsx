import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCategoryByIsShow,
  getProductByCategoryId,
  getMediaProductByFileKey,
} from "../../../helper/api";
import { useDispatch } from "react-redux";
import { addToCart } from "../../cart/store/cartSlice";
import { type AppDispatch } from "../../../store";

export default function ProductSection() {
  const dispatch = useDispatch<AppDispatch>();

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [productImages, setProductImages] = useState<Record<number, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<number, any>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<number, any>>({});
  const visibleCount = 4;

  // 🔹 Lấy danh mục hiển thị
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategoryByIsShow();
        const data = res.data || [];
        setCategories(data);
        if (data.length > 0) setSelectedCategory(data[0].id);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Lấy sản phẩm theo danh mục
  useEffect(() => {
    if (!selectedCategory) return;
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getProductByCategoryId(selectedCategory);
        const data = res.data || [];

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
        }

        // 🔹 Mặc định chọn màu & size đầu tiên (nếu có)
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
      } catch (err) {
        console.error("❌ Lỗi khi tải sản phẩm:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
      Object.values(productImages).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedCategory]);

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

  // 🔹 Thêm vào giỏ hàng
  const handleAddToCart = (product: any) => {
    const selectedVariant = selectedVariants[product.id];
    const selectedSize = selectedSizes[product.id];

    if (!selectedVariant) {
      alert("⚠️ Vui lòng chọn màu sản phẩm!");
      return;
    }

    if (!selectedSize) {
      alert("⚠️ Vui lòng chọn size sản phẩm!");
      return;
    }

    const variantImage =
      selectedVariant.image ||
      productImages[product.id] ||
      "/img/placeholder.png";

    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        image: variantImage,
        variantId: selectedVariant.id,
        color: selectedVariant.color,
        size: selectedSize.size,
        sizeId: selectedSize.id,
        price: selectedVariant.price || product.basePrice,
        discount: selectedVariant.discount || product.discount || 0,
        quantity: 1,
        maxStock: selectedSize.stock,
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

    alert("🛒 Sản phẩm đã được thêm vào giỏ hàng!");
  };

  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        {/* 🔹 Header + Danh mục */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h2 className="fw-bold text-primary mb-0">Bộ sưu tập thời trang mới</h2>
          <div className="d-flex gap-2 flex-wrap">
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
                  setSelectedVariants({});
                  setSelectedSizes({});
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 🔹 Loading */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        )}

        {/* 🔹 Danh sách sản phẩm */}
        {!loading && products.length > 0 && (
          <div className="row g-4">
            {visibleItems.map((product) => {
              const variants = product.variants || [];
              const selectedVariant = selectedVariants[product.id];
              const sizes = selectedVariant?.sizes || [];
              const selectedSize = selectedSizes[product.id];
              const priceBeforeDiscount =
              (selectedVariant && typeof selectedVariant.price !== "undefined" && selectedVariant.price !== null)
                ? selectedVariant.price
                : product.basePrice ?? 0;

              const discountPct =
              (selectedVariant && typeof selectedVariant.discount !== "undefined" && selectedVariant.discount !== null)
                ? selectedVariant.discount
                : (typeof product.discount !== "undefined" && product.discount !== null)
                  ? product.discount
                  : 0;

              const finalPrice = Math.round(priceBeforeDiscount * (1 - discountPct / 100));


              return (
                <div key={product.id} className="col-md-6 col-lg-3">
                  <div className="border rounded bg-light p-3 h-100 d-flex flex-column">
                    {/* Ảnh sản phẩm */}
                    <Link to={`/products/${product.id}`} className="text-decoration-none">
                      <img
                        src={productImages[product.id] || "/img/placeholder.png"}
                        className="img-fluid rounded mb-3"
                        alt={product.name}
                        style={{ height: "250px", objectFit: "cover" }}
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src = "/img/placeholder.png")
                        }
                      />
                    </Link>

                    {/* Tên */}
                    <h5 className="fw-bold text-dark text-truncate">
                      <Link
                        to={`/products/${product.id}`}
                        className="text-dark text-decoration-none"
                      >
                        {product.name}
                      </Link>
                    </h5>
                    <p className="text-muted small mb-2 text-truncate">
                      {product.description}
                    </p>

                    {/* 🔹 Màu sắc */}
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
                              // Chọn luôn size đầu tiên của màu mới
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

                    {/* 🔹 Giá + nút mua */}
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <div>
                        {/* Giá bán (sau giảm) */}
                        <div className="text-danger fw-bold">
                          {finalPrice.toLocaleString("vi-VN")}₫
                        </div>

                        {/* Giá gốc (chỉ hiện khi có giảm giá) */}
                        {discountPct > 0 && (
                          <div
                            className="text-muted text-decoration-line-through"
                            style={{ fontSize: "0.85rem" }}
                          >
                            {priceBeforeDiscount.toLocaleString("vi-VN")}₫
                          </div>
                        )}
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
              );
            })}
          </div>
        )}

        {/* 🔹 Không có sản phẩm */}
        {!loading && products.length === 0 && (
          <div className="text-center py-5 text-muted">
            Không có sản phẩm nào trong danh mục này.
          </div>
        )}
      </div>
    </div>
  );
}
