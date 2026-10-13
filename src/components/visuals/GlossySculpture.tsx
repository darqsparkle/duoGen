import { cn } from "@/lib/cn";
import { makeIso } from "./iso";

type Variant = "studio" | "services" | "contact";

const settings: Record<
  Variant,
  { ringTilt: number; flip: boolean; sphereTint: string; showPill: boolean; showCube: boolean }
> = {
  studio: { ringTilt: -18, flip: false, sphereTint: "#E8E9FF", showPill: true, showCube: true },
  services: { ringTilt: 22, flip: true, sphereTint: "#DDFBE8", showPill: true, showCube: true },
  contact: { ringTilt: -32, flip: false, sphereTint: "#DDFBE8", showPill: false, showCube: true },
};

const cube = makeIso(0, 0).box(-26, -26, 0, 52, 52, 52);

/**
 * Glossy, iridescent abstract sculpture for the light editorial scenes:
 * a pearl sphere wrapped in a translucent ring, a chrome capsule, and a mint
 * cube, with soft green–lavender reflections.
 */
export function GlossySculpture({
  variant = "studio",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const s = settings[variant];
  const id = (name: string) => `gs-${variant}-${name}`;
  const url = (name: string) => `url(#${id(name)})`;

  const ringBack = `M 130 300 A 200 64 0 0 1 530 300`;
  const ringFront = `M 530 300 A 200 64 0 0 1 130 300`;

  return (
    <svg
      viewBox="0 0 660 600"
      aria-hidden
      className={cn("h-full w-full overflow-visible", className)}
      style={s.flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <defs>
        <radialGradient id={id("pearl")} cx="36%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="28%" stopColor={s.sphereTint} />
          <stop offset="62%" stopColor="#C9CCF7" />
          <stop offset="86%" stopColor="#A9F5CB" />
          <stop offset="100%" stopColor="#7d84c7" />
        </radialGradient>
        <linearGradient id={id("iris")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7CFFB2" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="75%" stopColor="#B9A8FF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7CFFB2" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id={id("ring")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B7FFCE" />
          <stop offset="30%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#9DB4FF" />
          <stop offset="80%" stopColor="#7CFFB2" />
          <stop offset="100%" stopColor="#E8E9FF" />
        </linearGradient>
        <linearGradient id={id("chrome")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#b8bbd8" />
          <stop offset="52%" stopColor="#f7f7ff" />
          <stop offset="70%" stopColor="#8b90b8" />
          <stop offset="100%" stopColor="#dfe2ef" />
        </linearGradient>
        <linearGradient id={id("mint")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4FFF8" />
          <stop offset="100%" stopColor="#7CFFB2" />
        </linearGradient>
        <radialGradient id={id("orb")} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#B7FFCE" />
          <stop offset="100%" stopColor="#42d58a" />
        </radialGradient>
        <radialGradient id={id("soft-green")}>
          <stop offset="0%" stopColor="#7CFFB2" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#7CFFB2" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("soft-shadow")}>
          <stop offset="0%" stopColor="#5b5f9a" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#5b5f9a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("spec-white")}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("spec-green")}>
          <stop offset="0%" stopColor="#7CFFB2" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7CFFB2" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient tint + floor shadow */}
      <circle cx="340" cy="290" r="290" fill={url("soft-green")} />
      <ellipse cx="340" cy="548" rx="220" ry="34" fill={url("soft-shadow")} />

      <g className="animate-float-slow">
        <g transform={`rotate(${s.ringTilt} 330 300)`}>
          {/* Back half of the ring sits behind the sphere */}
          <path d={ringBack} fill="none" stroke={url("ring")} strokeWidth="30" strokeLinecap="round" opacity="0.75" />
        </g>

        {/* Pearl sphere */}
        <circle cx="330" cy="290" r="160" fill={url("pearl")} />
        <circle cx="330" cy="290" r="160" fill={url("iris")} />
        <ellipse cx="270" cy="210" rx="80" ry="50" fill={url("spec-white")} transform="rotate(-30 270 210)" />
        <ellipse cx="400" cy="400" rx="90" ry="26" fill={url("spec-green")} transform="rotate(-30 400 400)" />

        <g transform={`rotate(${s.ringTilt} 330 300)`}>
          {/* Front half wraps over the sphere */}
          <path d={ringFront} fill="none" stroke={url("ring")} strokeWidth="30" strokeLinecap="round" />
          <path d={ringFront} fill="none" stroke="#ffffff" strokeWidth="3" strokeOpacity="0.9" transform="translate(0 -9)" />
        </g>
      </g>

      {s.showPill && (
        <g className="animate-float" style={{ animationDelay: "-2s" }}>
          <g transform="rotate(38 120 470)">
            <rect x="40" y="440" width="170" height="62" rx="31" fill={url("chrome")} />
            <rect x="58" y="448" width="120" height="12" rx="6" fill="#ffffff" opacity="0.85" />
          </g>
        </g>
      )}

      {s.showCube && (
        <g transform="translate(560 120)">
          <g className="animate-float" style={{ animationDelay: "-4s" }}>
            <polygon points={cube.left} fill="#7CFFB2" />
            <polygon points={cube.right} fill="#B7FFCE" />
            <polygon points={cube.top} fill={url("mint")} stroke="#ffffff" strokeOpacity="0.8" />
          </g>
        </g>
      )}

      <g className="animate-float" style={{ animationDelay: "-6s" }}>
        <circle cx="560" cy="470" r="34" fill={url("orb")} />
        <ellipse cx="550" cy="458" rx="16" ry="10" fill={url("spec-white")} />
      </g>
    </svg>
  );
}
