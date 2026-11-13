import Link from "next/link";

type Variant = "pine" | "canyon" | "white" | "grey";

/** Figma "Button" (458:336): Accent=pine, Alt=canyon, Alt2=white, Secondary=grey. */
export function ButtonLink({
  href,
  variant = "pine",
  arrow = false,
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const light = variant === "pine" || variant === "canyon";
  return (
    <Link href={href} className={`btn btn--${variant} ${className}`}>
      {children}
      {arrow && (
        <img src={light ? "/brand/arrow-light.svg" : "/brand/arrow-dark.svg"} width={20} height={20} alt="" />
      )}
    </Link>
  );
}
