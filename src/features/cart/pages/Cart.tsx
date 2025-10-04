// src/features/cart/pages/Cart.tsx
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../../../store";
import { removeFromCart, clearCart } from "../store/cartSlice";
import api from "../../../shared/utils/api";

export default function Cart() {
  const items = useSelector((s: RootState) => s.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  const total = items.reduce((acc, it) => acc + it.price * it.quantity, 0);

  const handleRemove = (id: string | number) => {
    dispatch(removeFromCart(id as any));
  };

  const handleCheckout = async () => {
    try {
      // gọi endpoint checkout/purchase (backend cần implement)
      await api.post("/purchase", { items });
      alert("Checkout thành công!");
      dispatch(clearCart());
    } catch (err) {
      console.error(err);
      alert("Checkout thất bại. Kiểm tra backend.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <p>Giỏ hàng trống.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      <div className="space-y-4">
        {items.map((it: any) => (
          <div key={it.id} className="flex items-center justify-between border p-3 rounded">
            <div>
              <div className="font-semibold">{it.name}</div>
              <div className="text-sm text-gray-600">Qty: {it.quantity}</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="font-medium">${(it.price * it.quantity).toFixed(2)}</div>
              <button
                onClick={() => handleRemove(it.id)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
