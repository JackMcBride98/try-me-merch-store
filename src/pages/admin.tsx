import Head from "next/head";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const formSchema = z.object({
  name: z.string().min(1),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Not a valid date"),
  link: z.string().url(),
});
type FormFields = z.infer<typeof formSchema>;

export default function Admin() {
  const { data: session } = useSession();
  const gigs = api.gigs.getAll.useQuery();
  const newGig = api.gigs.create.useMutation();
  const deleteGig = api.gigs.delete.useMutation();

  const handleDeleteGig = async (id: string) => {
    await deleteGig.mutateAsync({ id });
    await gigs.refetch();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({ resolver: zodResolver(formSchema) });

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    await newGig.mutateAsync(data);
    await gigs.refetch();
  });

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
        <p>Upcoming gigs</p>
        {gigs.data ? (
          gigs.data.length > 0 ? (
            gigs.data.map((gig) => (
              <div
                className="child:mx-2 flex divide-x-2 divide-black [&>*]:px-2"
                key={gig.id}
              >
                <p>{gig.name}</p>
                <p>{gig.date.toDateString()}</p>
                <p>{gig.link}</p>
                <button onClick={() => handleDeleteGig(gig.id)}>X</button>
              </div>
            ))
          ) : (
            <p>No gigs yet</p>
          )
        ) : (
          <p>Loading gigs...</p>
        )}

        <form
          onSubmit={onSubmit}
          className="flex flex-col items-center space-y-4"
        >
          <p>New gig</p>
          <label
            htmlFor="name"
            className="flex w-full justify-between space-x-2"
          >
            <p>Name</p>
            <input {...register("name")} />
          </label>
          <p className="text-red-500">{errors.name?.message}</p>
          <label
            htmlFor="date"
            className="flex w-full justify-between space-x-2"
          >
            <p>Date</p>
            <input type="date" {...register("date")} className="" />
          </label>
          <p className="text-red-500">{errors.date?.message}</p>
          <label
            htmlFor="link"
            className="flex w-full justify-between space-x-2"
          >
            <p>Tix link</p>
            <input {...register("link")} className="" />
          </label>
          <p className="text-red-500">{errors.link?.message}</p>
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
