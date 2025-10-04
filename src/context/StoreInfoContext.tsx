import { createContext, useContext } from "react";
import type { StoreInfoEntity } from "../types";

export const StoreInfoContext = createContext<StoreInfoEntity[] | null>(null);

export const useStoreInfo = () => {
  const ctx = useContext(StoreInfoContext);
  if (!ctx)
    throw new Error("useStoreInfo must be used inside StoreInfoProvider");
  return ctx;
};
