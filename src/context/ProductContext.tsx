// import React, { createContext, useContext, useEffect, useState } from "react";
// import { getCategoryByIsShow, getProductByCategoryId } from "../helper/api";

// export interface Category {
//   id: number;
//   name: string;
//   description?: string;
//   isShow?: boolean;
// }

// export interface Product {
//   id: number;
//   name: string;
//   description?: string;
//   basePrice: number;
//   active: boolean;
//   isNew: boolean;
//   isShow: boolean;
//   fileKey: string;
//   brandId?: number;
//   categoryId: number;
//   createdAt?: string;
//   updatedAt?: string;
//   variants?: any[];
// }

// interface ProductContextType {
//   categories: Category[];
//   products: Product[];
//   selectedCategory: number | null;
//   loading: boolean;
//   setSelectedCategory: (id: number | null) => void;
//   fetchProductsByCategory: (id: number) => Promise<void>;
// }

// const ProductContext = createContext<ProductContextType | undefined>(undefined);

// export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   // 🔹 Chỉ gọi 1 lần để load danh mục + sản phẩm đầu tiên
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setLoading(true);
//         const res = await getCategoryByIsShow();
//         if (res && Array.isArray(res.data)) {
//           setCategories(res.data);
//           if (res.data.length > 0) {
//             const firstId = res.data[0].id;
//             setSelectedCategory(firstId);
//             await fetchProductsByCategory(firstId);
//           }
//         }
//       } catch (err) {
//         console.error("❌ Error fetching categories:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInitialData();
//   }, []);

//   // 🔹 Gọi API lấy sản phẩm theo danh mục
//   const fetchProductsByCategory = async (id: number) => {
//     try {
//       setLoading(true);
//       const res = await getProductByCategoryId(id);
//       if (res && Array.isArray(res.data)) {
//         // 🧠 Loại bỏ trùng id (vì API bạn trả về 2 sản phẩm có id = 1)
//         const uniqueProducts = res.data.filter(
//           (p, index, self) => index === self.findIndex((x) => x.id === p.id)
//         );
//         setProducts(uniqueProducts);
//         setSelectedCategory(id);
//       } else {
//         setProducts([]);
//       }
//     } catch (err) {
//       console.error("❌ Error fetching products by category:", err);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ProductContext.Provider
//       value={{
//         categories,
//         products,
//         selectedCategory,
//         loading,
//         setSelectedCategory,
//         fetchProductsByCategory,
//       }}
//     >
//       {children}
//     </ProductContext.Provider>
//   );
// };

// export const useProductContext = (): ProductContextType => {
//   const context = useContext(ProductContext);
//   if (!context) {
//     throw new Error("useProductContext must be used inside <ProductProvider>");
//   }
//   return context;
// };
