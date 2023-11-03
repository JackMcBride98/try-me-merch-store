import { prisma } from "@/server/db";
import type { Prisma, Product } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
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
      <header className="fixed z-50 flex w-full bg-[#7DFCB2]/20 text-white">
        <div className="flex w-full items-center justify-between">
          <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger asChild>
              <HamburgerMenuIcon className="ml-4 flex h-8 w-8" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="mt-5 rounded-md bg-[#7DFCB2]/20 p-2">
              <DropdownMenu.Item
                className="p-2 hover:cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <Link href="/">Home</Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="p-2">
                <Link href="/store">Store</Link>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <Image
            src="/logo.png"
            alt="Try Me logo"
            width={64}
            height={64}
            className="py-1"
          />
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-4 h-8 w-8"
          >
            <path
              d="M5 1C5 0.447715 5.44772 0 6 0H9C9.55228 0 10 0.447715 10 1V2H14C14.5523 2 15 2.44772 15 3V6C15 6.8888 14.6131 7.68734 14 8.23608V11.5C14 12.3284 13.3284 13 12.5 13H2.5C1.67157 13 1 12.3284 1 11.5V8.2359C0.38697 7.68721 0 6.88883 0 6V3C0 2.44772 0.447716 2 1 2H5V1ZM9 1V2H6V1H9ZM1 3H5H5.5H9.5H10H14V6C14 6.654 13.6866 7.23467 13.1997 7.6004C12.8655 7.85144 12.4508 8 12 8H8V7.5C8 7.22386 7.77614 7 7.5 7C7.22386 7 7 7.22386 7 7.5V8H3C2.5493 8 2.1346 7.85133 1.80029 7.60022C1.31335 7.23446 1 6.65396 1 6V3ZM7 9H3C2.64961 9 2.31292 8.93972 2 8.82905V11.5C2 11.7761 2.22386 12 2.5 12H12.5C12.7761 12 13 11.7761 13 11.5V8.82915C12.6871 8.93978 12.3504 9 12 9H8V9.5C8 9.77614 7.77614 10 7.5 10C7.22386 10 7 9.77614 7 9.5V9Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
      </header>
      <div className="max-w-screen flex min-h-screen w-full flex-col items-center bg-gradient-to-b from-black to-[#04100C]">
        <h1 className="mb-4 mt-24 text-4xl">Store</h1>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => {
            const prices = [
              ...new Set(product.stockKeepingUnits?.map((sku) => sku.price)),
            ];
            return (
              <Link
                href={`/product/${product.id}`}
                className="flex flex-col items-center rounded-md border border-[#7DFCB2] p-4 transition-all hover:bg-[#7DFCB2]/20"
                key={product.id}
              >
                <p>{product.name}</p>
                {product.images[0] && (
                  <div>
                    <Image
                      alt={product.name}
                      src={product.images[0].url}
                      width={400}
                      height={400}
                    />
                  </div>
                )}
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
