import Head from "next/head";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import type { FormEvent } from "react";

export default function Admin() {
  const { data: session } = useSession();

  const handleSubmitNewGig = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("form submitted");
    return null;
  };

  if (!session) {
    return (
      <>
        <Head>
          <title>Admin</title>
          <meta name="description" content="The admin page" />
          <link rel="icon" href="/logo.png" />
        </Head>
        <p>You must be signed in to use the admin page</p>
        <button
          className="rounded-full bg-[#7DFCB2]/40 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={() => void signIn()}
        >
          Sign in
        </button>
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
      <div className="max-w-screen bg-animate flex min-h-screen w-full flex-col items-center">
        <Image
          src="/logo.png"
          alt="Try Me logo"
          width={256}
          height={256}
          className="py-1"
        />
        <p>Upcoming gigs</p>

        <form
          onSubmit={handleSubmitNewGig}
          className="flex flex-col items-center space-y-4"
        >
          <p>New gig</p>
          <label
            htmlFor="gigName"
            className="flex w-full justify-between space-x-2"
          >
            <p>Name</p>
            <input type="text" id="gigName" name="gigName" className="" />
          </label>
          <label
            htmlFor="gigDate"
            className="flex w-full justify-between space-x-2"
          >
            <p>Date</p>
            <input type="date" id="gigDate" name="gigDate" className="" />
          </label>
          <label
            htmlFor="gig"
            className="flex w-full justify-between space-x-2"
          >
            <p>Ticket link</p>
            <input type="text" id="gigTime" name="gigTime" className="" />
          </label>
          <input
            type="submit"
            value="Submit"
            className="rounded-md bg-black p-4 text-white"
          />
        </form>
      </div>
    </>
  );
}
