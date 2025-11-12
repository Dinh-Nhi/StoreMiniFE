import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getUserProductById,
  getAllMediaByFileKey,
  getMediaProductByFileKey,
} from "../../../helper/api";
import { addToCart } from "../../cart/store/cartSlice";
import { type AppDispatch } from "../../../store";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("/img/placeholder.png");
  const [selectedImage, setSelectedImage] = useState<string>("/img/placeholder.png");
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        // 🔹 Lấy thông tin sản phẩm
        const res = await getUserProductById(id);
        const data = res.data;
        if (!isMounted) return;
        setProduct(data);

        // 🔹 Lấy ảnh chính từ fileKey (để dùng khi addToCart)
        let mainUrl = "/img/placeholder.png";
        if (data.fileKey) {
          try {
            const mainRes = await getMediaProductByFileKey(data.fileKey);
            const blob = mainRes.data;
            mainUrl = URL.createObjectURL(blob);
            setMainImage(mainUrl);
            setSelectedImage(mainUrl);
          } catch {
            console.warn("⚠️ Không thể tải ảnh chính, dùng ảnh mặc định.");
          }
        }

        // 🔹 Lấy toàn bộ ảnh gallery (nếu API hỗ trợ)
        if (data.fileKey) {
          try {
            const imgRes = await getAllMediaByFileKey(data.fileKey);
            const list = imgRes.data || [];
            const imageUrls = list.map((m: any) => m.data);
            if (imageUrls.length > 0) setProductImages(imageUrls);
          } catch (err) {
            console.error("❌ Lỗi khi tải gallery ảnh:", err);
            setProductImages([]);
          }
        }

        // 🔹 Chọn variant & size mặc định
        if (data.variants && data.variants.length > 0) {
          const firstVariant = data.variants[0];
          setSelectedVariant(firstVariant);
          if (firstVariant.sizes?.length > 0) {
            setSelectedSize(firstVariant.sizes[0]);
          }
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải sản phẩm:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
      URL.revokeObjectURL(mainImage);
    };
  }, [id]);

  // 🔹 Thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedVariant || !selectedSize) {
      alert("⚠️ Vui lòng chọn màu và size trước khi thêm vào giỏ hàng!");
      return;
    }

    // ✅ Ảnh dùng đúng logic ProductSection (blob hoặc fallback)
    const variantImage =
      selectedVariant.image || mainImage || "/img/placeholder.png";

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

  if (loading)
    return <div className="p-6 text-center">Đang tải sản phẩm...</div>;
  if (!product)
    return <div className="p-6 text-center">Không tìm thấy sản phẩm.</div>;

  const variants = product.variants || [];
  const displayPrice = selectedVariant?.price || product.basePrice || 0;

  return (
    <div className="container py-5">
      <div className="row g-5 align-items-start" style={{ padding: "120px" }}>
        {/* 🔹 Ảnh sản phẩm */}
        <div className="col-md-6 d-flex flex-column align-items-center">
          {/* Ảnh chính hiển thị */}
          <img
            src={selectedImage}
            alt={product.name}
            className="img-fluid rounded shadow-sm mb-3"
            style={{
              width: "100%",
              maxWidth: "500px",
              height: "auto",
              objectFit: "cover",
            }}
            onError={(e) =>
              ((e.target as HTMLImageElement).src = "/img/placeholder.png")
            }
          />

          {/* Gallery ảnh phụ */}
          {productImages.length > 1 && (
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {productImages.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  onClick={() => setSelectedImage(img)}
                  className={`rounded border ${
                    selectedImage === img ? "border-primary" : "border-light"
                  }`}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src = "/img/placeholder.png")
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* 🔹 Thông tin chi tiết */}
        <div className="col-md-6">
          <h2 className="fw-bold text-dark mb-3">{product.name}</h2>
          <p className="text-secondary mb-4">{product.description}</p>

          <h4 className="text-primary fw-bold mb-4">
            {displayPrice.toLocaleString()}₫
          </h4>

          {/* Màu sắc + Size */}
          {variants.length > 0 && (
            <div className="mb-4">
              <div className="fw-semibold text-dark mb-2">Màu sắc:</div>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {variants.map((v: any) => (
                  <button
                    key={v.id}
                    className={`btn btn-sm ${
                      selectedVariant?.id === v.id
                        ? "btn-primary text-white"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => {
                      setSelectedVariant(v);
                      setSelectedSize(null);
                    }}
                  >
                    {v.color}
                  </button>
                ))}
              </div>

              {selectedVariant && (
                <>
                  <div className="fw-semibold text-dark mb-2">Kích thước:</div>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedVariant.sizes?.map((s: any) => (
                      <button
                        key={s.id}
                        className={`btn btn-sm ${
                          selectedSize?.id === s.id
                            ? "btn-success text-white"
                            : "btn-outline-success"
                        }`}
                        onClick={() => setSelectedSize(s)}
                        disabled={s.stock <= 0}
                      >
                        {s.size}{" "}
                        <small className="text-secondary">
                          ({s.stock > 0 ? `Còn ${s.stock}` : "Hết"})
                        </small>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="btn btn-lg btn-primary rounded-pill px-4"
          >
            <i className="fa fa-shopping-cart me-2"></i> Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      {/* 🔹 Thông tin chi tiết khác */}
      <div className="mt-5 border-top pt-4">
        <h5 className="fw-bold mb-3">Thông tin chi tiết</h5>
        <ul className="list-unstyled mb-0">
          <li>
            <strong>Thương hiệu:</strong> {product.brandId}
          </li>
          <li>
            <strong>Danh mục:</strong> {product.categoryId}
          </li>
          <li>
            <strong>Giảm giá:</strong> {product.discount || 0}%
          </li>
          <li>
            <strong>Tình trạng:</strong>{" "}
            {product.active ? "Đang bán" : "Ngừng kinh doanh"}
          </li>
        </ul>
      </div>
    </div>
  );
}
