import Image from "next/image";

export function AnimatedCeloHTLogo() {
  const logoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/celoht-logo.png`;

  return <Image src={logoSrc} alt="" width={998} height={1000} priority className="cinematic-logo" aria-hidden="true" />;
}
