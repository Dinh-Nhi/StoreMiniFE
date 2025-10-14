import React, { createContext, useContext, useEffect, useState } from "react";
import { getCategoryByIsShow, getProductByCategoryId } from "../helper/api";

// =====================
// 🔹 Kiểu dữ liệu (Types)
// =====================
export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  basePrice: number;
  active: boolean;
  isNew: boolean;
  isShow: boolean;
  brandId?: number;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string; // nếu backend có trường ảnh
}

// =====================
// 🔹 Context type
// =====================
interface ProductContextType {
  categories: Category[];
  products: Product[];
  selectedCategory: number | null;
  loading: boolean;
  setSelectedCategory: (id: number | null) => void;
  fetchCategories: () => Promise<void>;
  fetchProductsByCategory: (id: number) => Promise<void>;
}

// =====================
// 🔹 Khởi tạo Context
// =====================
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// =====================
// 🔹 Provider chính
// =====================
export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 🔹 Lấy danh sách danh mục được hiển thị
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategoryByIsShow();
      if (res && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error("❌ Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Lấy sản phẩm theo categoryId
  const fetchProductsByCategory = async (id: number) => {
    try {
      setLoading(true);
      const res = await getProductByCategoryId(id);
      if (res && res.data) {
        setProducts(res.data);
        setSelectedCategory(id);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("❌ Error fetching products by category:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Tự động tải danh mục khi context mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        categories,
        products,
        selectedCategory,
        loading,
        setSelectedCategory,
        fetchCategories,
        fetchProductsByCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// =====================
// 🔹 Custom Hook
// =====================
export const useProductContext = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used inside <ProductProvider>");
  }
  return context;
};
