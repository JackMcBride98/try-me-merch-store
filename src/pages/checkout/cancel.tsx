import { Header } from "@/components/header";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Head from "next/head";
import Link from "next/link";

export default function CheckoutCancelPage() {
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
      <div className="max-w-screen bg-animate flex min-h-screen w-full flex-col items-center space-y-4 bg-gradient-to-b from-black to-[#04100C] pb-4 text-white">
        <p className="mt-[4.5rem]">Stripe order cancelled</p>
      </div>
    </>
  );
}
