import Image from "next/image";

export type ConsultantHeaderProps = {
  avatarSrc: string;
};

export default function ConsultantHeader({
  avatarSrc,
}: ConsultantHeaderProps) {
  return (
      <div className="flex h-[150px] rounded-full w-[150px] items-center justify-center bg-[#D7C0DD]">
        <Image
          src={avatarSrc}
          alt=""
          width={150}
          height={150}
          className="h-[150px] w-[150px]  object-cover"
        />
      </div>
  );
}

