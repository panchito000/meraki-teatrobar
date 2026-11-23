type Props = {
  className?: string;
  color?: string;
};

export function MerakiMark({ className = "meraki-svg", color = "currentColor" }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M26 24H39L60 51L51 62L36 43V86H26V24Z" fill={color} />
      <path d="M94 24H81L64 46L73 57L84 43V52L94 40V24Z" fill={color} />
      <path d="M94 53L76 75V86H94V53Z" fill={color} />
      <path d="M18 16L25 23L22 26L15 19L18 16Z" fill={color} />
      <path d="M11 26L21 36L19 38L9 28L11 26Z" fill={color} />
      <path d="M16 42L24 50L22 52L14 44L16 42Z" fill={color} />
      <path d="M58 37L64 43L62 45L56 39L58 37Z" fill={color} />
      <path d="M68 62L74 68L72 70L66 64L68 62Z" fill={color} />
    </svg>
  );
}

export function MerakiLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-logo ${className}`}>
      <MerakiMark />
      <span className="brand-text">
        <span className="brand-title">MERAKI</span>
        <span className="brand-sub">TEATRO BAR</span>
      </span>
    </span>
  );
}
