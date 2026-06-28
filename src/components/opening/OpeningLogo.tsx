import Image from "next/image";
import logoMark from "../../../assets/logo-mark.jpg";

type OpeningLogoProps = {
  className?: string;
  label?: string;
};

export function OpeningLogo({ className = "", label = "Zless" }: OpeningLogoProps) {
  return (
    <span className={`opening-logo ${className}`} aria-label={label}>
      <Image src={logoMark} alt="" fill priority sizes="96px" />
    </span>
  );
}
