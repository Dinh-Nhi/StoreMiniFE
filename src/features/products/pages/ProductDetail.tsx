import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getUserProductById,
  getAllMediaByFileKey,
  getMediaProductByFileKey,
  getProductByCategoryId,
} from "../../../helper/api";
import { addToCart } from "../../cart/store/cartSlice";
import { type AppDispatch } from "../../../store";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const [product, setProduct] = useState<any | null>(null);

  const [productImages, setProductImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("/img/placeholder.png");
  const [selectedImage, setSelectedImage] = useState<string>("/img/placeholder.png");

  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);

  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [relatedImages, setRelatedImages] = useState<Record<number, string>>({});
  const [relatedVariants, setRelatedVariants] = useState<Record<number, any>>({});
  const [relatedSizes, setRelatedSizes] = useState<Record<number, any>>({});

  // ====================================================================
  // FETCH PRODUCT
  // ====================================================================
  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await getUserProductById(id);
        const data = res.data;
        if (!isMounted) return;

        setProduct(data);

        // Main image
        let mainUrl = "/img/placeholder.png";
        if (data.fileKey) {
          try {
            const mainRes = await getMediaProductByFileKey(data.fileKey);
            mainUrl = URL.createObjectURL(mainRes.data);
          } catch {}
        }
        setMainImage(mainUrl);
        setSelectedImage(mainUrl);

        // Gallery
        if (data.fileKey) {
          try {
            const imgRes = await getAllMediaByFileKey(data.fileKey);
            const imgs = imgRes.data?.map((x: any) => x.data) || [];
            setProductImages(imgs.length > 0 ? imgs : [mainUrl]);
          } catch {
            setProductImages([mainUrl]);
          }
        }

        // Default variant + size
        if (data.variants?.length > 0) {
          const v = data.variants[0];
          setSelectedVariant(v);
          if (v.sizes?.length > 0) setSelectedSize(v.sizes[0]);
        }

        // RELATED PRODUCT
        if (data.categoryId) {
          try {
            const relatedRes = await getProductByCategoryId(data.categoryId);
            let list = relatedRes.data || [];

            list = list.filter((p: any) => p.id !== data.id).slice(0, 8);

            setRelatedProducts(list);

            const imgMap: Record<number, string> = {};
            const promises = list.map(async (p: any) => {
              try {
                const r = await getMediaProductByFileKey(p.fileKey);
                return { id: p.id, url: URL.createObjectURL(r.data) };
              } catch {
                return { id: p.id, url: "/img/placeholder.png" };
              }
            });

            const results = await Promise.all(promises);
            results.forEach((x) => (imgMap[x.id] = x.url));
            setRelatedImages(imgMap);

            const vMap: Record<number, any> = {};
            const sMap: Record<number, any> = {};

            list.forEach((p: any) => {
              if (p.variants?.length > 0) {
                vMap[p.id] = p.variants[0];
                if (p.variants[0].sizes?.length > 0) {
                  sMap[p.id] = p.variants[0].sizes[0];
                }
              }
            });

            setRelatedVariants(vMap);
            setRelatedSizes(sMap);
          } catch (err) {
            console.error("❌ Lỗi sản phẩm liên quan:", err);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // ====================================================================

  const handleAddToCart = () => {
    if (!product || !selectedVariant || !selectedSize)
      return alert("⚠️ Vui lòng chọn màu và size!");

    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        image: selectedVariant.image || mainImage,
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

    alert("🛒 Đã thêm vào giỏ!");
  };

  const handleAddRelatedToCart = (p: any) => {
    const v = relatedVariants[p.id];
    const s = relatedSizes[p.id];
    if (!v || !s) return alert("⚠️ Chọn màu/size!");

    dispatch(
      addToCart({
        productId: p.id,
        name: p.name,
        image: v.image || relatedImages[p.id],
        variantId: v.id,
        color: v.color,
        size: s.size,
        sizeId: s.id,
        price: v.price || p.basePrice,
        quantity: 1,
        maxStock: s.stock,
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

    alert("🛒 Đã thêm vào giỏ!");
  };

  if (loading) return <div className="p-5 text-center">Đang tải...</div>;
  if (!product) return <div className="p-5 text-center">Không tìm thấy sản phẩm</div>;

  // ============================================================
  // ⭐⭐⭐ TÍNH GIÁ GỐC & GIÁ BÁN (KHÔNG ĐỔI UI)
  // ============================================================

  const basePrice = selectedVariant?.price || product.basePrice || 0;
  const discount = product.discount || 0;

  const salePrice = basePrice * (1 - discount / 100);

  // ============================================================

  return (
    <div className="container py-5">

      {/* ======================================================
                MAIN PRODUCT SECTION
      ====================================================== */}
      <div className="row g-5 align-items-start" style={{ padding: "120px" }}>
        {/* LEFT IMAGE */}
        <div className="col-md-6 d-flex flex-column align-items-center">
          <img
            src={selectedImage}
            className="img-fluid rounded shadow-sm mb-3"
            style={{ width: "100%", maxWidth: 500, objectFit: "cover" }}
          />

          {productImages.length > 1 && (
            <div className="d-flex gap-2 flex-wrap justify-content-center">
              {productImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`rounded border ${
                    img === selectedImage ? "border-primary" : "border-light"
                  }`}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT INFO */}
        <div className="col-md-6">
          <h2 className="fw-bold">{product.name}</h2>
          <p className="text-secondary">{product.description}</p>

          {/* =======================================================
                          ✔✔ HIỂN THỊ GIÁ GỐC + GIÁ BÁN
          ======================================================= */}
          <div className="mb-4">
            <div className="text-danger text-decoration-line-through">
              {basePrice.toLocaleString()}₫
            </div>

            {discount > 0 && (
              <span className="text-secondary">Giảm: {discount}%</span>
            )}

            <h4 className="text-primary fw-bold mb-0">
              {salePrice.toLocaleString()}₫
            </h4>           
          </div>

          {/* Variant */}
          {product.variants.length > 0 && (
            <>
              <div className="fw-semibold mb-2">Màu sắc:</div>
              <div className="d-flex gap-2 flex-wrap mb-3">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    className={`btn btn-sm ${
                      selectedVariant?.id === v.id
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => {
                      setSelectedVariant(v);
                      setSelectedSize(v.sizes?.[0] || null);
                    }}
                  >
                    {v.color}
                  </button>
                ))}
              </div>

              {/* Size */}
              {selectedVariant && (
                <>
                  <div className="fw-semibold mb-2">Kích thước:</div>
                  <div className="d-flex gap-2 flex-wrap">
                    {selectedVariant.sizes?.map((s: any) => (
                      <button
                        key={s.id}
                        disabled={s.stock <= 0}
                        className={`btn btn-sm ${
                          selectedSize?.id === s.id
                            ? "btn-success"
                            : "btn-outline-success"
                        }`}
                        onClick={() => setSelectedSize(s)}
                      >
                        {s.size} 
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          <button
            onClick={handleAddToCart}
            className="btn btn-lg btn-primary rounded-pill px-4 mt-4"
          >
            <i className="fa fa-shopping-cart me-2"></i> Thêm vào giỏ
          </button>
        </div>
      </div>

    

      {/* ======================================================
                RELATED PRODUCTS SECTION
      ====================================================== */}
      <div className="mt-5 pt-4 border-top">
        <h4 className="fw-bold mb-4">Sản phẩm liên quan</h4>

        {relatedProducts.length === 0 && (
          <div className="text-muted">Không có sản phẩm liên quan.</div>
        )}

        <div className="row g-4">
          {relatedProducts.map((p) => {
            const v = relatedVariants[p.id];
            const s = relatedSizes[p.id];

            const base = v?.price || p.basePrice;
            const sale = base * (1 - (p.discount || 0) / 100);

            return (
              <div key={p.id} className="col-6 col-md-3">
                <div className="border rounded bg-light p-3 h-100 d-flex flex-column">

                  <div
                    onClick={() => (window.location.href = `/products/${p.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={relatedImages[p.id] || "/img/placeholder.png"}
                      className="img-fluid rounded mb-3"
                      style={{ height: 200, width: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <h6 className="fw-bold text-truncate">{p.name}</h6>
                  <p className="text-muted small text-truncate">{p.description}</p>

                  {/* Variant selection */}
                  {p.variants?.length > 0 && (
                    <div className="mb-2">
                      <span className="small text-muted me-2">Màu:</span>
                      {p.variants.map((x: any) => (
                        <button
                          key={x.id}
                          className={`btn btn-sm me-2 mb-2 ${
                            v?.id === x.id ? "btn-primary" : "btn-outline-primary"
                          }`}
                          onClick={() => {
                            setRelatedVariants({ ...relatedVariants, [p.id]: x });
                            setRelatedSizes({
                              ...relatedSizes,
                              [p.id]: x.sizes?.[0] || null,
                            });
                          }}
                        >
                          {x.color}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Size selection */}
                  {v?.sizes?.length > 0 && (
                    <div className="mb-3">
                      <span className="small text-muted me-2">Size:</span>
                      {v.sizes.map((x: any) => (
                        <button
                          key={x.id}
                          className={`btn btn-sm me-2 mb-2 ${
                            s?.id === x.id ? "btn-success" : "btn-outline-success"
                          }`}
                          onClick={() =>
                            setRelatedSizes({ ...relatedSizes, [p.id]: x })
                          }
                        >
                          {x.size}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* PRICE DISPLAY */}
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark">
                      <span className="text-danger text-decoration-line-through me-2 small">
                        {base.toLocaleString()}₫
                      </span>
                      {sale.toLocaleString()}₫
                    </span>

                    <button
                      className="
                        btn border border-secondary rounded-pill px-3 text-primary
                        d-flex align-items-center justify-content-center
                      "
                      onClick={() => handleAddRelatedToCart(p)}
                    >
                      <i className="fa fa-shopping-bag"></i>
                    </button>



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
