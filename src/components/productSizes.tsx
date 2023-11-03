import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormTrigger,
  useFieldArray,
} from "react-hook-form";
import type { ProductFormFields } from "./products";

export type ProductsSizesProps = {
  control: Control<ProductFormFields>;
  register: UseFormRegister<ProductFormFields>;
  errors: FieldErrors<ProductFormFields>;
  trigger: UseFormTrigger<ProductFormFields>;
};

export const ProductSizes = ({
  control,
  register,
  errors,
  trigger,
}: ProductsSizesProps) => {
  const { fields, append, remove } = useFieldArray({
    name: "sizes",
    control: control,
  });

  return (
    <>
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
      <p className="text-red-500">{errors.sizes?.root?.message}</p>
      <button
        type="button"
        className="rounded-md bg-black p-4 text-white"
        onClick={async () => {
          append({ size: "", price: 0, amount: 0 });
          await trigger("sizes");
        }}
      >
        Add Size
      </button>
    </>
  );
};
