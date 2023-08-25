import Image from "next/image";

export type SocialLinkProps = {
  link: string;
  imageUrl: string;
  alt: string;
  className?: string;
};

export const SocialLink = ({
  link,
  imageUrl,
  alt,
  className,
}: SocialLinkProps) => (
  <a
    className={`${className} relative h-12 w-12 bg-transparent opacity-90 xs:scale-125 sm:h-14 sm:w-14`}
    rel="noopener noreferrer"
    target="_blank"
    href={link}
  >
    <Image src={imageUrl} fill={true} alt={alt} />
  </a>
);
