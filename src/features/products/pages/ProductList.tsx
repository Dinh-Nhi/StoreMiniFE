import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getUserProducts,
  getCategoryByIsShow,
  getProductByCategoryId,
  getMediaProductByFileKey,
} from "../../../helper/api";
import { useDispatch } from "react-redux";
import { addToCart } from "../../cart/store/cartSlice";
import { type AppDispatch } from "../../../store";

interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  discount: number;
  fileKey: string;
  categoryId: number;
  variants: {
    id: number;
    color: string;
    price: number;
    stock: number;
    available: boolean;
    sizes: { id: number; size: string; stock: number }[];
  }[];
}

interface Category {
  id: number;
  name: string;
  isShow: boolean;
}

export default function ProductList() {
  const dispatch = useDispatch<AppDispatch>();

  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productImages, setProductImages] = useState<Record<number, string>>(
    {}
  );
  const [selectedVariants, setSelectedVariants] = useState<Record<number, any>>(
    {}
  );
  const [selectedSizes, setSelectedSizes] = useState<Record<number, any>>({});

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 12;
  const [totalPages, setTotalPages] = useState(1);

  // ===== LOAD CATEGORY =====
  useEffect(() => {
    getCategoryByIsShow()
      .then((res) => setCategories(res.data ?? []))
      .catch((err) => console.error(err));
  }, []);

  // ===== LOAD PRODUCTS =====
  useEffect(() => {
    if (selectedCategory) loadByCategory(selectedCategory);
    else loadAllProducts();
  }, [selectedCategory, search]);

  // ====== Load All ======
  const loadAllProducts = async () => {
    try {
      const res = await getUserProducts();
      let data: Product[] = res.data ?? [];

      // Save ALL for category count
      setAllProducts(data);

      // Filtering
      if (search.trim() !== "") {
        data = data.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      prepareProductData(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== Load By Category =====
  const loadByCategory = async (categoryId: number) => {
    try {
      const res = await getProductByCategoryId(categoryId);
      let data: Product[] = res.data ?? [];

      if (search.trim() !== "") {
        data = data.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      prepareProductData(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== Chuẩn hóa dữ liệu =====
  const prepareProductData = async (data: Product[]) => {
    setPage(1);
    setTotalPages(Math.ceil(data.length / PAGE_SIZE));

    // Load images
    const imgMap: Record<number, string> = {};

    const imgs = await Promise.all(
      data.map(async (p) => {
        try {
          const res = await getMediaProductByFileKey(p.fileKey);
          const blob = res.data;
          const url = URL.createObjectURL(blob);
          return { id: p.id, url };
        } catch {
          return { id: p.id, url: "/img/placeholder.png" };
        }
      })
    );

    imgs.forEach((i) => (imgMap[i.id] = i.url));
    setProductImages(imgMap);

    // Default variant + size
    const varMap: Record<number, any> = {};
    const sizeMap: Record<number, any> = {};

    data.forEach((p) => {
      if (p.variants?.length > 0) {
        const firstVariant = p.variants[0];
        varMap[p.id] = firstVariant;

        if (firstVariant.sizes?.length > 0) {
          sizeMap[p.id] = firstVariant.sizes[0];
        }
      }
    });

    setSelectedVariants(varMap);
    setSelectedSizes(sizeMap);
    setProducts(data);
  };

  const paginatedProducts = products.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleAddToCart = (product: Product) => {
    const variant = selectedVariants[product.id];
    const size = selectedSizes[product.id];

    if (!variant || !size) return alert("⚠️ Vui lòng chọn màu và size!");

    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        image: productImages[product.id],
        variantId: variant.id,
        color: variant.color,
        size: size.size,
        sizeId: size.id,
        price: variant.price || product.basePrice,
        quantity: 1,
        maxStock: size.stock,
        availableColors: product.variants?.map((v: any) => ({
          id: v.id,
          color: v.color,
          sizes: v.sizes,
          price: v.price,
        })),
        availableSizes: variant.sizes?.map((s: any) => ({
          id: s.id,
          size: s.size,
          stock: s.stock,
        })),
      })
    );

    alert("🛒 Sản phẩm đã được thêm vào giỏ hàng!");
  };

  return (
    <>
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Danh sách sản phẩm</h1>
      </div>

      <div className="container py-5">
        {/* SEARCH */}
        <div className="row mb-4">
          <div className="col-lg-4">
            <input
              type="search"
              className="form-control p-3"
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          {/* CATEGORY SIDEBAR */}
          <div className="col-lg-3">
            <h4>Danh mục</h4>
            <ul className="list-unstyled">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <div
                    className="d-flex justify-content-between py-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span>{cat.name}</span>

                    {/* FIXED COUNT: lấy từ allProducts */}
                    <span>
                      (
                      {
                        allProducts.filter((p) => p.categoryId === cat.id)
                          .length
                      }
                      )
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* PRODUCT GRID */}
          <div className="col-lg-9">
            <div className="row g-4">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => {
                  const variant = selectedVariants[product.id];
                  const sizeList = variant?.sizes || [];
                  const selectedSize = selectedSizes[product.id];

                  return (
                    <div
                      key={product.id}
                      className="col-md-6 col-lg-4 col-xl-4"
                    >
                      <div className="border rounded p-3 bg-light h-100">
                        {/* Image */}
                        <Link to={`/products/${product.id}`}>
                          <img
                            src={productImages[product.id]}
                            alt={product.name}
                            className="img-fluid rounded mb-3"
                            style={{ height: "240px", objectFit: "cover" }}
                          />
                        </Link>

                        {/* Product Title */}
                        <h6 className="fw-bold text-dark text-truncate">
                          {product.name}
                        </h6>

                        {/* Variant colors */}
                        {product.variants.length > 0 && (
                          <div className="mb-2">
                            <span className="small text-muted me-2">Màu:</span>
                            {product.variants.map((v) => (
                              <button
                                key={v.id}
                                className={`btn btn-sm me-2 ${
                                  variant?.id === v.id
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
                        {sizeList.length > 0 && (
                          <div className="mb-3">
                            <span className="small text-muted me-2">Size:</span>
                            {sizeList.map((s: any) => (
                              <button
                                key={s.id}
                                className={`btn btn-sm me-2 ${
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

                        <div className="d-flex justify-content-between align-items-center">
                          {/* Giá gốc + giá sale */}
                          <div>
                            <div className="text-muted text-decoration-line-through small">
                              {product.basePrice.toLocaleString()}₫
                            </div>
                            <div className="fw-bold text-danger">
                              {(
                                product.basePrice *
                                (1 - product.discount / 100)
                              ).toLocaleString()}
                              ₫
                            </div>
                          </div>

                          <button
                            className="btn border border-secondary rounded-pill px-3"
                            onClick={() => handleAddToCart(product)}
                          >
                            <i className="fa fa-shopping-bag me-2 text-primary"></i>
                            Mua
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <h4 className="text-center text-muted">Không có sản phẩm</h4>
              )}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`btn mx-1 ${
                    page === i + 1 ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
