import Head from "next/head";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { NewGigForm } from "@/components/newGigForm";
import { UploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import { type OurFileRouter } from "@/server/uploadthing";
import { useState } from "react";

export default function Admin() {
  const { data: session } = useSession();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>();

  if (!session) {
    return (
      <>
        <Head>
          <title>Admin</title>
          <meta name="description" content="The admin page" />
          <link rel="icon" href="/logo.png" />
        </Head>
        <div className="max-w-screen bg-animate flex min-h-screen w-full flex-col items-center justify-center space-y-8 text-lg">
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
      <div className="max-w-screen bg-animate flex min-h-screen w-full flex-col items-center space-y-8">
        <Image
          src="/logo.png"
          alt="Try Me logo"
          width={256}
          height={256}
          className="py-1"
        />
        <NewGigForm />
        <UploadButton<OurFileRouter>
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            if (res) {
              setUploadedImageUrl(res[0]?.url);
            }
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />
        {uploadedImageUrl && (
          <Image
            src={uploadedImageUrl}
            alt="Uploaded image"
            width={256}
            height={256}
            className="py-1"
          />
        )}
      </div>
    </>
  );
}
