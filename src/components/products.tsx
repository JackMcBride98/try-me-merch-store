import { UploadButton } from "@uploadthing/react";
import { useState } from "react";
import Image from "next/image";
import type { OurFileRouter } from "@/server/uploadthing";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

export const newProductFormSchema = z.object({
  name: z.string().min(1, "Must not be empty"),
  description: z.string().min(1, "Must not be empty"),
  sizes: z.array(
    z.object({
      size: z.string().min(1),
      price: z.coerce
        .number()
        .multipleOf(0.01, "Maximum 2 decimal places")
        .min(0),
      amount: z.coerce.number().int("Must be a whole number").min(0),
    })
  ),
  // images: z.object({
  //   url: z.string().url(),
  //   alt: z.string().min(1),
  //   order: z.number().min(0),
  // }),
});
type ProductFormFields = z.infer<typeof newProductFormSchema>;

export const Products = () => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormFields>({
    resolver: zodResolver(newProductFormSchema),
    defaultValues: {
      sizes: [
        { size: "S", price: 0, amount: 0 },
        { size: "M", price: 0, amount: 0 },
        { size: "L", price: 0, amount: 0 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "sizes",
    control: control,
  });

  const onSubmit = handleSubmit((data) => {
    // await newProduct.mutateAsync(data);
    // await products.refetch();
    alert(JSON.stringify(data));
  });

  return (
    <>
      <h1 className="text-2xl">Products</h1>
      <p>
        This will show a list of products once they are stored in the database
      </p>
      <h1 className="text-2xl">New Product</h1>
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center space-y-4"
      >
        <label htmlFor="name" className="flex w-full justify-between space-x-2">
          <p>Name</p>
          <input {...register("name")} />
          <p className="text-red-500">{errors.name?.message}</p>
        </label>

        <label
          htmlFor="description"
          className="flex w-full justify-between space-x-2"
        >
          <p>Description</p>
          <input {...register("description")} />
          <p className="text-red-500">{errors.description?.message}</p>
        </label>

        <h1 className="text-2xl">Sizes</h1>

        {fields.map((field, index) => (
          <div key={field.id} className="rounded-md border border-black p-4">
            <label htmlFor="size" className="relative">
              <button
                onClick={() => remove(index)}
                className="absolute -right-2 -top-4 hover:scale-110"
              >
                X
              </button>

              <p>Size</p>
              <input
                {...register(`sizes.${index}.size`)}
                className="flex w-full justify-between space-x-2"
              />
              <p className="text-red-500">
                {errors.sizes?.[index]?.size?.message}
              </p>
            </label>

            <label htmlFor="price">
              <p>Price</p>
              <input
                {...register(`sizes.${index}.price`)}
                className="flex w-full justify-between space-x-2"
              />
            </label>
            <p className="text-red-500">
              {errors.sizes?.[index]?.price?.message}
            </p>

            <label htmlFor="amount">
              <p>Amount</p>
              <input
                {...register(`sizes.${index}.amount`)}
                className="flex w-full justify-between space-x-2"
              />
            </label>
            <p className="text-red-500">
              {errors.sizes?.[index]?.amount?.message}
            </p>
          </div>
        ))}
        <button
          type="button"
          className="rounded-md bg-black p-4 text-white"
          onClick={() => append({ size: "", price: 0, amount: 0 })}
        >
          Add Size
        </button>

        <input
          type="submit"
          value="Submit"
          className="rounded-md bg-black p-4 text-white"
        />
      </form>
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
    </>
  );
};
