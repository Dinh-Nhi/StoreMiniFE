import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../../../store";
import {
  removeFromCart,
  updateQuantity,
  updateVariant,
} from "../store/cartSlice";

export default function Cart() {
  const items = useSelector((s: RootState) => s.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 🔹 Load ảnh sản phẩm (chuẩn hóa URL)
  useEffect(() => {
    if (!items || items.length === 0) return;

    const imageMap: Record<string, string> = {};
    const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

    for (const it of items) {
      const key = `${it.productId}-${it.variantId}-${it.sizeId}`;

      if (
        it.image?.startsWith("http") ||
        it.image?.startsWith("blob:") ||
        it.image?.includes("/img/")
      ) {
        imageMap[key] = it.image;
      } else if (it.image) {
        // ✅ Sử dụng API media chuẩn (đảm bảo hoạt động với fileKey)
        imageMap[key] = `${baseUrl}/media/viewFileKeyForProduct/${it.image}`;
      } else {
        imageMap[key] = "/img/placeholder.png";
      }
    }
    setImages(imageMap);
  }, [items]);

  const total = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const handleCheckout = () => navigate("/checkout");

  if (!items?.length) {
    return (
      <div className="container py-5 text-center">
        <h3 className="fw-bold text-danger mb-3">Không có sản phẩm nào</h3>
        <p>Hãy thêm sản phẩm để bắt đầu mua sắm!</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-primary mb-4">Giỏ hàng của bạn</h2>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th></th>
              <th>Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Tổng</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, index) => (
              <tr key={`${it.productId}-${it.variantId}-${it.sizeId}-${index}`}>
                <td>
                  <img
                    src={
                      images[`${it.productId}-${it.variantId}-${it.sizeId}`] ||
                      "/img/placeholder.png"
                    }
                    alt={it.name}
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                    className="rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/img/placeholder.png";
                    }}
                  />
                </td>
                <td>
                  <div className="fw-semibold">{it.name}</div>

                  <div className="mt-2">
                    <div className="d-flex gap-3 flex-wrap align-items-center">
                      {/* Màu */}
                      <div>
                        <label className="small text-muted me-2">Màu:</label>
                        <select
                          value={it.color}
                          className="form-select form-select-sm d-inline-block w-auto"
                          onChange={(e) =>
                            dispatch(
                              updateVariant({
                                productId: it.productId,
                                oldVariantId: it.variantId,
                                oldSizeId: it.sizeId,
                                newColor: e.target.value,
                              })
                            )
                          }
                        >
                          {it.availableColors?.map((v) => (
                            <option key={v.id} value={v.color}>
                              {v.color}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Size */}
                      <div>
                        <label className="small text-muted me-2">Size:</label>
                        <select
                          value={it.size}
                          className="form-select form-select-sm d-inline-block w-auto"
                          onChange={(e) =>
                            dispatch(
                              updateVariant({
                                productId: it.productId,
                                oldVariantId: it.variantId,
                                oldSizeId: it.sizeId,
                                newSize: e.target.value,
                              })
                            )
                          }
                        >
                          {it.availableSizes?.map((s) => (
                            <option key={s.id} value={s.size}>
                              {s.size}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </td>
                <td>{it.price.toLocaleString()}₫</td>

                <td>
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: it.productId,
                            variantId: it.variantId,
                            sizeId: it.sizeId,
                            quantity: it.quantity - 1,
                          })
                        )
                      }
                      disabled={it.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3">{it.quantity}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: it.productId,
                            variantId: it.variantId,
                            sizeId: it.sizeId,
                            quantity: Math.min(
                              it.quantity + 1,
                              it.maxStock
                            ),
                          })
                        )
                      }
                      disabled={it.quantity >= it.maxStock}
                    >
                      +
                    </button>
                  </div>
                </td>

                <td>{(it.price * it.quantity).toLocaleString()}₫</td>

                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() =>
                      dispatch(
                        removeFromCart({
                          productId: it.productId,
                          variantId: it.variantId,
                          sizeId: it.sizeId,
                        })
                      )
                    }
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <h4 className="fw-bold">Tổng cộng: {total.toLocaleString()}₫</h4>
        <button
          onClick={handleCheckout}
          className="btn btn-success px-4 py-2 rounded-pill"
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
}
