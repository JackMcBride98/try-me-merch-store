import Stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env.mjs";
import { type BasketProduct } from "@/components/basketProvider";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = req.body as { products: BasketProduct[] };

    try {
      const session = await stripe.checkout.sessions.create({
        line_items: body.products.map((product) => ({
          price: product.stripePriceId,
          quantity: product.amount,
        })),
        mode: "payment",
        success_url: `${req.headers.origin}/checkout/success`,
        cancel_url: `${req.headers.origin}/checkout/cancel`,
        automatic_tax: { enabled: true },
        shipping_address_collection: {
          allowed_countries: ["GB"],
        },
      });
      if (!session.url) {
        throw new Error(
          "No session URL returned from stripe checkout sessions create"
        );
      }

      res.status(200).json(session);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
