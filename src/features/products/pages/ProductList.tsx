import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import api from "../../../shared/utils/api";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {products.map((p) => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
}
