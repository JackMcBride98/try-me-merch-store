import Stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env.mjs";
import { type BasketProduct } from "@/components/basketProvider";
import { prisma } from "@/server/db";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = req.body as { products: BasketProduct[] };

    const productStockKeepingUnits =
      await prisma.productStockKeepingUnit.findMany({
        where: {
          id: {
            in: body.products.map((product) => product.id),
          },
        },
      });

    productStockKeepingUnits.forEach(async (productStockKeepingUnit) => {
      await prisma.productStockKeepingUnit.update({
        where: { id: productStockKeepingUnit.id },
        data: {
          quantity:
            productStockKeepingUnit.quantity -
            body.products.find(
              (product) => product.id === productStockKeepingUnit.id
            )!.quantity,
        },
      });
    });

    try {
      const session = await stripe.checkout.sessions.create({
        line_items: body.products.map((product) => ({
          price: product.stripePriceId,
          quantity: product.quantity,
        })),
        mode: "payment",
        success_url: `${req.headers.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`,
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
