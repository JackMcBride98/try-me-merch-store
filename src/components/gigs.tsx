import { api } from "@/utils/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const newGigFormSchema = z.object({
  name: z.string().min(1),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Not a valid date"),
  link: z.string().url(),
});
type GigFormFields = z.infer<typeof newGigFormSchema>;

export const Gigs = () => {
  const gigs = api.gig.getAll.useQuery();
  const newGig = api.gig.create.useMutation();
  const deleteGig = api.gig.delete.useMutation();

  const handleDeleteGig = async (id: string) => {
    await deleteGig.mutateAsync({ id });
    await gigs.refetch();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GigFormFields>({ resolver: zodResolver(newGigFormSchema) });

  const onSubmit = handleSubmit(async (data) => {
    await newGig.mutateAsync(data);
    await gigs.refetch();
  });

  return (
    <>
      <h1 className="text-2xl">Upcoming gigs</h1>
      {gigs.data ? (
        gigs.data.length > 0 ? (
          gigs.data
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map((gig) => (
              <div
                className="child:mx-2 flex divide-x-2 divide-black rounded-md bg-[#7DFCB2]/20 p-2 [&>*]:px-2"
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
        <h1 className="text-2xl">New gig</h1>

        <label htmlFor="name" className="flex w-full justify-between space-x-2">
          <p>Name</p>
          <input {...register("name")} />
          <p className="text-red-500">{errors.name?.message}</p>
        </label>

        <label htmlFor="date" className="flex w-full justify-between space-x-2">
          <p>Date</p>
          <input type="date" {...register("date")} className="" />
          <p className="text-red-500">{errors.date?.message}</p>
        </label>

        <label htmlFor="link" className="flex w-full justify-between space-x-2">
          <p>Tix link</p>
          <input {...register("link")} className="" />
          <p className="text-red-500">{errors.link?.message}</p>
        </label>

        <input
          type="submit"
          value="Submit"
          className="rounded-md bg-black p-4 text-white"
        />
      </form>
    </>
  );
};
