import { Header } from "@/components/header";
import { SocialLink } from "@/components/socialLink";
import { prisma } from "@/server/db";
import { type Gig } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type HomeProps = {
  gigs: Array<Gig>;
};

export default function Home({ gigs }: HomeProps) {
  const gigsRef = useRef<HTMLHeadingElement>(null);

  return (
    <>
      <Head>
        <title>Try Me</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <div className="max-w-screen bg-animate flex min-h-screen w-full flex-col items-center text-white">
        <Header
          dropdownOptions={
            <>
              <DropdownMenu.Item
                className="p-2 hover:cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <Link href="/">Home</Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="p-2 hover:cursor-pointer"
                onClick={() => {
                  if (gigsRef.current) {
                    window.scrollTo({
                      top: gigsRef.current?.offsetTop - 300,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                Gigs
              </DropdownMenu.Item>
              <DropdownMenu.Item className="p-2">
                <Link href="/store">Store</Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="p-2 hover:cursor-pointer"
                onClick={() =>
                  window.scrollTo({ top: 999999, behavior: "smooth" })
                }
              >
                Socials
              </DropdownMenu.Item>
            </>
          }
        />
        <main className="mt-[4.5rem] flex h-full w-full flex-col items-center">
          <Image
            src="/trumpet.jpg"
            alt="picture of try me"
            width={520}
            height={520}
            className="object-contain"
          />

          <Link
            href="/store"
            className="cool-text text-md my-6 rounded-lg bg-white/10 bg-gradient-to-b from-black/20 via-white/20 to-black/20 px-4 py-6 text-center text-3xl font-bold text-white"
          >
            Visit store
          </Link>

          <h2 ref={gigsRef} className="mb-2 mt-4 text-2xl">
            Upcoming gigs
          </h2>
          {gigs.length > 0 ? (
            gigs
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((gig) => (
                <a
                  href={gig.link}
                  key={gig.id}
                  className="glow distort mx-2 my-6 flex rounded-md bg-[#7DFCB2]/20 p-2 transition hover:scale-105 md:text-2xl"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {gig.name} {gig.date.toLocaleDateString()}
                </a>
              ))
          ) : (
            <p>No upcoming gigs, check linktree</p>
          )}
          <p className="my-4 text-2xl">
            Check our{" "}
            <a
              href={"https://linktr.ee/trymewav"}
              className="underline hover:italic"
            >
              linktree
            </a>{" "}
            too
          </p>
          <div className="relative flex h-full w-full flex-col items-center bg-transparent">
            <div>
              <Image
                src="/gig.jpg"
                alt="try me on stage"
                width={2579}
                height={3869}
              />
            </div>
            <div className="absolute top-0 flex h-full w-full items-center justify-center space-x-4 sm:space-x-8 md:space-x-12 lg:space-x-16 xl:space-x-20">
              <SocialLink
                link="https://www.facebook.com/trymewav/"
                imageUrl="/facebook-logo.png"
                alt="facebook logo"
              />
              <SocialLink
                link="https://www.instagram.com/trymewav/"
                imageUrl="/instagram-logo.png"
                alt="instagram logo"
              />
              <SocialLink
                link="https://www.tiktok.com/@trymewav"
                imageUrl="/tik-tok.png"
                alt="tik tok logo"
                className="invert"
              />
              <SocialLink
                link="https://www.youtube.com/channel/UC9JCSPyLfx51eaIp43XRAsg"
                imageUrl="/youtube.png"
                alt="youtube logo"
              />
              <SocialLink
                link="mailto:management@jonathansavage.co.uk"
                imageUrl="/email-logo.png"
                alt="email logo"
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const gigs = await prisma.gig.findMany();
  return {
    props: {
      gigs,
    },
  };
}
