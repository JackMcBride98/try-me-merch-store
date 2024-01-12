import { env } from "@/env.mjs";
import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }

  return stripePromise;
};

export default getStripe;
