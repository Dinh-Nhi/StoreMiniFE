// src/features/products/pages/ProductDetail.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../shared/utils/api";
import { useDispatch } from "react-redux";
import { addToCart } from "../../cart/store/cartSlice";
import { type AppDispatch } from "../../../store";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => {
        // backend có thể trả object trực tiếp hoặc {data: ...}
        setProduct(res.data);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        id: Number(product.id),
        name: product.name,
        price: product.price,
        quantity: 1,
      })
    );
    alert("Đã thêm vào giỏ hàng");
  };

  if (loading) return <div className="p-6">Loading product...</div>;
  if (!product) return <div className="p-6">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <img
            src={product.imageUrl ?? "/placeholder.png"}
            alt={product.name}
            className="w-full h-80 object-cover rounded"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl text-blue-600 font-semibold mb-4">${product.price}</p>
          <p className="text-sm text-gray-700 mb-6">{product.description}</p>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
