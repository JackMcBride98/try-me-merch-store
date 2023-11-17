import { Header } from "@/components/header";
import { prisma } from "@/server/db";
import type { Prisma } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export type StoreProps = {
  products: Array<
    Prisma.ProductGetPayload<{
      include: { stockKeepingUnits: true; images: true };
    }>
  >;
};

export default function Store({ products }: StoreProps) {
  return (
    <>
      <Head>
        <title>Try Me - Store</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <Header
        dropdownOptions={
          <>
            <DropdownMenu.Item
              className="p-2 hover:cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <Link href="/">Home</Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item className="p-2">
              <Link href="/store">Store</Link>
            </DropdownMenu.Item>
          </>
        }
      />

      <div className="max-w-screen flex min-h-screen w-full flex-col items-center bg-gradient-to-b from-black to-[#04100C] text-white">
        <h1 className="mb-4 mt-24 text-4xl">Store</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product) => {
            const prices = [
              ...new Set(product.stockKeepingUnits?.map((sku) => sku.price)),
            ];
            return (
              <Link
                href={`/product/${product.id}`}
                className="group flex h-full flex-col items-center rounded-md border border-[#7DFCB2] p-2 transition-all hover:bg-[#7DFCB2]/20"
                key={product.id}
              >
                {product.images[0] && (
                  <>
                    <div className="relative flex h-60 w-60 items-center justify-center xxs:h-64 xxs:w-64 xs:h-72 xs:w-72 md:h-80 md:w-80">
                      <Image
                        alt={product.name}
                        src={product.images[0].url}
                        fill={true}
                        className="object-contain"
                      />
                    </div>
                  </>
                )}
                <p className="text-xl font-bold group-hover:underline">
                  {product.name}
                </p>
                <p>
                  {prices.length > 1
                    ? `£${prices[0]} - £${prices[-1]}`
                    : `£${prices[0]}`}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const products = await prisma.product.findMany({
    include: {
      stockKeepingUnits: true,
      images: true,
    },
  });

  return {
    props: {
      products,
    },
  };
}
