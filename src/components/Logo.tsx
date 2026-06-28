import Image from "next/image";
import logoMark from "../../assets/logo-mark.jpg";

export default function Logo({ size = 96 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size, position: "relative" }}
      aria-label="Zless logo"
    >
      <Image
        src={logoMark}
        alt="Zless"
        fill
        style={{ objectFit: "contain", mixBlendMode: "screen" }}
        priority
      />
    </div>
  );
}
