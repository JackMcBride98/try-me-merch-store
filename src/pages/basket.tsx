import BasketContext from "@/components/basketProvider";
import { Header } from "@/components/header";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useContext, useState } from "react";

export default function Basket() {
  const { data: session } = useSession();
  const [basket] = useContext(BasketContext);
  const [error, setError] = useState(false);

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: basket }),
      });

      if (!res.ok) {
        setError(true);

        return setTimeout(() => {
          setError(false);
        }, 1500);
      }

      const result = (await res.json()) as { id: string; url: string };

      window.location.replace(result.url);
    } catch (e) {
      setError(true);
      console.error(e);
    } finally {
      setError(false);
    }
  };

  if (!session) {
    return (
      <>
        <Head>
          <title>Try Me - Basket</title>
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
        <div className="max-w-screen flex min-h-screen w-full flex-col items-center bg-gradient-to-b from-black to-[#04100C] pb-4 text-white">
          <h1 className="mb-4 mt-24 text-4xl">Basket</h1>
          <h1 className="mt-8 text-2xl">Coming soon</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Try Me - Basket</title>
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

      <main className="max-w-screen bg-animate flex min-h-screen w-full flex-col items-center space-y-8 pb-4 text-white">
        <h1 className="mt-[4.5rem] text-2xl ">Products in Basket</h1>
        {error ? (
          <h1 className="mt-[4.5rem] text-2xl ">
            There was an error creating the checkout session, please try again
            later
          </h1>
        ) : (
          <>
            {basket.map((product) => (
              <>
                <p>
                  {product.name} x {product.quantity}
                </p>
              </>
            ))}
            <button
              onClick={() => handleCheckout()}
              className="rounded-md bg-black p-4 text-4xl text-white"
            >
              Checkout 😱
            </button>
          </>
        )}
      </main>
    </>
  );
}
