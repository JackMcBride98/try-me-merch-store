import { type ProductStockKeepingUnit } from "@prisma/client";
import { createContext, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export type BasketProduct = ProductStockKeepingUnit & {
  name: string;
  quantity: number;
  stripeProductId: string;
  stripePriceId: string;
  maxQuantity: number;
};

export type BasketContextType = [
  Array<BasketProduct>,
  (product: BasketProduct) => void,
  () => void,
  error: string
];

const BasketContext = createContext<BasketContextType>([
  [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
  "",
]);

export type BasketProviderProps = {
  children: React.ReactNode;
};

export const BasketProvider = ({ children }: BasketProviderProps) => {
  const [basket, setBasket] = useLocalStorage<Array<BasketProduct>>(
    "basket",
    []
  );
  const [error, setError] = useState("");

  const addToBasket = (product: BasketProduct) => {
    const isProductAlreadyInBasket = basket.some((p) => p.id === product.id);
    if (isProductAlreadyInBasket) {
      const currentBasket = [...basket];

      const currentProductInBasket = currentBasket.find(
        (p) => p.id === product.id
      )!;

      const newTotalQuantity =
        currentProductInBasket.quantity + product.quantity;

      if (newTotalQuantity > currentProductInBasket.maxQuantity) {
        setError("You cannot add more than the available quantity");
        setTimeout(() => setError(""), 1500);
        return;
      }

      currentProductInBasket.quantity = newTotalQuantity;

      setBasket(currentBasket);
      return;
    }
    setBasket((basket) => [...basket, product]);
  };

  const clearBasket = () => {
    setBasket([]);
  };

  return (
    <BasketContext.Provider value={[basket, addToBasket, clearBasket, error]}>
      {children}
    </BasketContext.Provider>
  );
};

export default BasketContext;
