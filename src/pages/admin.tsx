import Head from "next/head";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { Gigs } from "@/components/gigs";
import "@uploadthing/react/styles.css";
import { Products } from "@/components/products";
import Link from "next/link";

export default function Admin() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <>
        <Head>
          <title>Admin</title>
          <meta name="description" content="The admin page" />
          <link rel="icon" href="/logo.png" />
        </Head>
        <div className="max-w-screen bg-animate flex min-h-screen w-full flex-col items-center justify-center space-y-8 text-lg text-white">
          <p>You must be signed in to use the admin page</p>
          <button
            className="rounded-full bg-[#7DFCB2]/40 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={() => void signIn()}
          >
            Sign in
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin</title>
        <meta name="description" content="The admin page" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="max-w-screen bg-animate flex min-h-screen w-full flex-col items-center space-y-8 pb-4 text-white">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Try Me logo"
            width={256}
            height={256}
            className="py-1"
          />
        </Link>
        <Gigs />
        <Products />
        <button
          onClick={() => signOut()}
          className="rounded-md bg-black p-4 text-white"
        >
          Sign out
        </button>
      </div>
    </>
  );
}
