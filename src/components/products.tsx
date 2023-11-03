import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/utils/api";
import { ProductSizes } from "./productSizes";
import { ProductImages } from "./productImages";
import Image from "next/image";

export const newProductFormSchema = z.object({
  name: z.string().min(1, "Must not be empty"),
  description: z.string().min(1, "Must not be empty"),
  sizes: z
    .array(
      z.object({
        size: z.string().min(1),
        price: z.coerce
          .number()
          .multipleOf(0.01, "Maximum 2 decimal places")
          .min(0),
        amount: z.coerce.number().int("Must be a whole number").min(0),
      })
    )
    .min(1, "Must have at least one size"),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        order: z.number().min(0),
      })
    )
    .min(1, "Must have at least one image"),
});
export type ProductFormFields = z.infer<typeof newProductFormSchema>;

export const Products = () => {
  const products = api.product.getAll.useQuery();
  const newProduct = api.product.create.useMutation();
  const deleteProduct = api.product.delete.useMutation();

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct.mutateAsync({ id });
    await products.refetch();
  };

  const {
    register,
    trigger,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ProductFormFields>({
    resolver: zodResolver(newProductFormSchema),
    defaultValues: {
      sizes: [
        { size: "S", price: 0, amount: 0 },
        { size: "M", price: 0, amount: 0 },
        { size: "L", price: 0, amount: 0 },
      ],
      images: [],
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await newProduct.mutateAsync(data);
    await products.refetch();
  });

  console.log(getValues());

  return (
    <>
      <h1 className="text-2xl">Products</h1>
      {products.data ? (
        products.data.length > 0 ? (
          products.data.map((product) => (
            <div
              className="relative flex flex-col items-center space-y-2 rounded-md bg-[#7DFCB2]/20 p-4"
              key={product.id}
            >
              <p>Name: {product.name}</p>
              <p>Description: {product.description}</p>
              <p>Sizes</p>
              <div className="flex flex-col space-y-2">
                {product.stockKeepingUnits.map((sku) => (
                  <div className="flex space-x-2" key={sku.id}>
                    <p>Size: {sku.size}</p>
                    <p>Price: £{sku.price}</p>
                    <p>Stock: {sku.amount}</p>
                  </div>
                ))}
              </div>
              <p>Images</p>
              <div className="flex flex-col">
                {product.images
                  .sort((a, b) => a.order - b.order)
                  .map((image) => (
                    <div key={image.id}>
                      <Image
                        alt={`Product image ${image.order + 1}`}
                        src={image.url}
                        width={256}
                        height={256}
                      />
                    </div>
                  ))}
              </div>
              {/* <p>{product.images}</p> */}
              <button
                className="absolute -top-2 right-2 hover:scale-105"
                onClick={() => handleDeleteProduct(product.id)}
              >
                X
              </button>
            </div>
          ))
        ) : (
          <p>No products yet</p>
        )
      ) : (
        <p>Loading products...</p>
      )}

      <h1 className="text-2xl">New Product</h1>
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center space-y-4 pb-4"
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

        <ProductSizes
          control={control}
          errors={errors}
          register={register}
          trigger={trigger}
        />

        <ProductImages errors={errors} control={control} />

        <input
          type="submit"
          value="Submit"
          className="mb-4 rounded-md bg-black p-4 text-white"
        />
      </form>
    </>
  );
};
