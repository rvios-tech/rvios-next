import { LOGO } from "@/lib/logo-paths";

/** The RVIOS Store mark, split into parts so each piece can be animated (speed lines, cart, bag, handle). */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg className={`lg ${className}`} viewBox="0 0 762.74 552.06" aria-hidden="true">
      <path className="sp s1" d={LOGO.s1} />
      <polyline className="sp s2" points={LOGO.s2} />
      <polyline className="sp s3" points={LOGO.s3} />
      <path className="cart" d={LOGO.cart} />
      <path className="handle" d={LOGO.handle} />
      <path className="bag" d={LOGO.bag} />
    </svg>
  );
}

export function Brand() {
  return (
    <span className="brand">
      <LogoMark />
      <span className="ya">
        RVIOS <small>Store</small>
      </span>
    </span>
  );
}
