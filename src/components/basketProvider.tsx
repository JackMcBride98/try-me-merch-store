import { type ProductStockKeepingUnit } from "@prisma/client";
import { createContext, useState } from "react";

export type BasketProduct = ProductStockKeepingUnit & {
  name: string;
  quantity: number;
  stripeProductId: string;
  stripePriceId: string;
};

export type BasketContextType = [
  Array<BasketProduct>,
  (product: BasketProduct) => void
];

// eslint-disable-next-line @typescript-eslint/no-empty-function
const BasketContext = createContext<BasketContextType>([[], () => {}]);

export type BasketProviderProps = {
  children: React.ReactNode;
};

export const BasketProvider = ({ children }: BasketProviderProps) => {
  const [basket, setBasket] = useState<Array<BasketProduct>>([]);
  const addToBasket = (product: BasketProduct) =>
    setBasket((basket) => [...basket, product]);

  return (
    <BasketContext.Provider value={[basket, addToBasket]}>
      {children}
    </BasketContext.Provider>
  );
};

export default BasketContext;
