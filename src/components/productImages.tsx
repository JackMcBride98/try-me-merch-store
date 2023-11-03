import { type OurFileRouter } from "@/server/uploadthing";
import { UploadButton } from "@uploadthing/react";
import { useState } from "react";
import { type Control, type FieldErrors, useFieldArray } from "react-hook-form";
import Image from "next/image";
import { type ProductFormFields } from "./products";

export type ProductImagesProps = {
  errors: FieldErrors<ProductFormFields>;
  control: Control<ProductFormFields>;
};

//TODO: Allow removing of images and delete these images off the server when form is submitted

export const ProductImages = ({ errors, control }: ProductImagesProps) => {
  const [uploadedImageUrls, setUploadedImageUrls] = useState<Array<string>>([]);

  const { append } = useFieldArray({
    name: "images",
    control: control,
  });

  return (
    <>
      <h1 className="text-2xl">Images</h1>

      <UploadButton<OurFileRouter>
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          if (res) {
            setUploadedImageUrls(res.map((file) => file.url));
            for (const [index, file] of res.entries()) {
              append({
                url: file.url,
                order: index,
              });
            }
          }
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          console.log(error);
          alert(`ERROR! ${error.message}`);
        }}
      />
      {uploadedImageUrls ? (
        uploadedImageUrls.map((url, index) => (
          <Image
            key={url}
            src={url}
            alt={`Uploaded image ${index}`}
            width={256}
            height={256}
            className="py-1"
          />
        ))
      ) : (
        <p>No images uploaded</p>
      )}

      <p className="text-red-500">{errors.images?.message}</p>
    </>
  );
};
