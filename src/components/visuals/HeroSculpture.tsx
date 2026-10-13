import { LogoGradients, LogoRibbons } from "@/components/navigation/Logo";
import { makeIso } from "./iso";

const iso = makeIso(300, 360);

const modules = [26, 86, 146].map((z) => ({ z, ...iso.box(-55, -55, z, 110, 110, 50) }));
const platform = iso.box(-150, -150, 0, 300, 300, 14);
const cap = iso.box(-50, -50, 214, 100, 100, 24);
const [capX, capY] = iso.project([0, 0, 238]);
// Lays the 132×88 logo flat on the cap's top face: horizontal stays horizontal,
// depth is foreshortened by the isometric factor.
const LOGO_SCALE = 0.56;
const logoMatrix = `matrix(${1.2247 * LOGO_SCALE} 0 0 ${0.7071 * LOGO_SCALE} ${capX - 66 * 1.2247 * LOGO_SCALE} ${capY - 44 * 0.7071 * LOGO_SCALE})`;

const cubes = [
  { box: iso.box(81, -81, 160, 22, 22, 22), delay: "-3s", glass: false },
  { box: iso.box(-96, 77, 170, 18, 18, 18), delay: "0s", glass: true },
  { box: iso.box(200, 60, 120, 20, 20, 20), delay: "-1.5s", glass: false },
  { box: iso.box(215, 65, 30, 26, 26, 26), delay: "-5s", glass: true },
  { box: iso.box(34, 207, 30, 22, 22, 22), delay: "-2.2s", glass: false },
  { box: iso.box(140, -160, 150, 16, 16, 16), delay: "-4.4s", glass: true },
  { box: iso.box(-142, 123, 150, 14, 14, 14), delay: "-6s", glass: false },
];

const groundRing = iso.ring(130, 14);
const midRing = iso.ring(100, 110);
const topRing = iso.ring(82, 186);

// Deterministic particle field (no Math.random, so server and client match).
const particles = Array.from({ length: 22 }, (_, i) => ({
  cx: 40 + ((i * 97) % 520),
  cy: 30 + ((i * 61) % 480),
  r: 0.8 + (i % 3) * 0.6,
  delay: `${-(i % 7) * 0.6}s`,
}));

/** Draws the back (upper) and front (lower) halves of an ellipse separately. */
function halfRing(r: { cx: number; cy: number; rx: number; ry: number }, half: "back" | "front") {
  const { cx, cy, rx, ry } = r;
  return half === "back"
    ? `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`
    : `M ${cx + rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy}`;
}

/** Panel on a vertical plane for the glass screens behind the tower. */
const backPanel = iso.points([-160, -175, 30], [80, -175, 30], [80, -175, 180], [-160, -175, 180]);
const sidePanel = iso.points([-175, -160, 30], [-175, 80, 30], [-175, 80, 170], [-175, -160, 170]);
const backPanelLines = [60, 90, 120, 150].map((z, i) => {
  const [x1, y1] = iso.project([-140, -175, z]);
  const [x2, y2] = iso.project([i % 2 ? 0 : 50, -175, z]);
  return { x1, y1, x2, y2 };
});
const sideBars = [0, 1, 2, 3, 4].map((i) => {
  const y = -140 + i * 42;
  const height = 30 + ((i * 37) % 80);
  return iso.points([-175, y, 45], [-175, y + 24, 45], [-175, y + 24, 45 + height], [-175, y, 45 + height]);
});

export function HeroSculpture() {
  return (
    <svg viewBox="0 0 600 600" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="hs-bloom" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7CFFB2" stopOpacity="0.38" />
          <stop offset="45%" stopColor="#7CFFB2" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#7CFFB2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hs-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2b3672" />
          <stop offset="100%" stopColor="#141a3c" />
        </linearGradient>
        <linearGradient id="hs-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141b45" />
          <stop offset="100%" stopColor="#090d27" />
        </linearGradient>
        <linearGradient id="hs-right" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c2558" />
          <stop offset="100%" stopColor="#0e1435" />
        </linearGradient>
        <linearGradient id="hs-mint" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2FFF7" />
          <stop offset="55%" stopColor="#B7FFCE" />
          <stop offset="100%" stopColor="#7CFFB2" />
        </linearGradient>
        <linearGradient id="hs-mint-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7CFFB2" />
          <stop offset="100%" stopColor="#2fbf78" />
        </linearGradient>
        <linearGradient id="hs-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
        </linearGradient>
        <LogoGradients greenId="hs-dg-a" blueId="hs-dg-b" />
        <linearGradient id="hs-cap-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#26306a" />
          <stop offset="100%" stopColor="#0c1132" />
        </linearGradient>
        <radialGradient id="hs-cap-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7CFFB2" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7CFFB2" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient bloom */}
      <circle cx="300" cy="250" r="280" fill="url(#hs-bloom)" />

      {/* Particles */}
      <g className="hidden sm:inline">
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill="#B7FFCE"
            className="animate-twinkle"
            style={{ animationDelay: p.delay }}
          />
        ))}
      </g>

      {/* Glass interface panels behind the structure */}
      <g>
        <polygon points={backPanel} fill="url(#hs-glass)" stroke="#7CFFB2" strokeOpacity="0.28" />
        {backPanelLines.map((l, i) => (
          <line key={i} {...l} stroke="#DDFBE8" strokeOpacity={i === 0 ? 0.7 : 0.3} strokeWidth={i === 0 ? 3 : 2} strokeLinecap="round" />
        ))}
        <polygon points={sidePanel} fill="url(#hs-glass)" stroke="#7CFFB2" strokeOpacity="0.22" />
        {sideBars.map((pts, i) => (
          <polygon key={i} points={pts} fill="#7CFFB2" fillOpacity={0.12 + i * 0.07} />
        ))}
      </g>

      {/* Platform */}
      <polygon points={platform.left} fill="url(#hs-left)" />
      <polygon points={platform.right} fill="url(#hs-right)" />
      <polygon points={platform.top} fill="#0f1536" stroke="#7CFFB2" strokeOpacity="0.25" />

      {/* Ground ring */}
      {/* Glow comes from stacked translucent strokes: SVG blur filters would repaint every frame. */}
      <ellipse {...groundRing} fill="none" stroke="#7CFFB2" strokeOpacity="0.06" strokeWidth="22" />
      <ellipse {...groundRing} fill="none" stroke="#7CFFB2" strokeOpacity="0.14" strokeWidth="8" />
      <ellipse {...groundRing} fill="none" stroke="#B7FFCE" strokeWidth="1.5" strokeOpacity="0.9" />

      {/* Back halves of the orbit rings */}
      <path d={halfRing(midRing, "back")} fill="none" stroke="#7CFFB2" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="3 9" className="animate-dash" />
      <path d={halfRing(topRing, "back")} fill="none" stroke="#B7FFCE" strokeOpacity="0.3" strokeWidth="1.5" />

      {/* Tower modules */}
      {modules.map((m, i) => (
        <g key={m.z}>
          <polygon points={m.left} fill="url(#hs-left)" stroke="#7CFFB2" strokeOpacity="0.12" />
          <polygon points={m.right} fill="url(#hs-right)" stroke="#7CFFB2" strokeOpacity="0.12" />
          <polygon points={m.top} fill="url(#hs-top)" stroke="#7CFFB2" strokeOpacity="0.45" />
          {/* LED strip on the right face */}
          <line
            x1={iso.project([55, -40, m.z + 25])[0]}
            y1={iso.project([55, -40, m.z + 25])[1]}
            x2={iso.project([55, 40, m.z + 25])[0]}
            y2={iso.project([55, 40, m.z + 25])[1]}
            stroke="#7CFFB2"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="animate-twinkle"
            style={{ animationDelay: `${-i * 1.2}s` }}
          />
          {/* Status dots on the left face */}
          {[0, 1, 2].map((d) => {
            const [cx, cy] = iso.project([-35 + d * 16, 55, m.z + 25]);
            return <circle key={d} cx={cx} cy={cy} r="2.2" fill={d === 0 ? "#7CFFB2" : "#DDFBE8"} fillOpacity={d === 0 ? 1 : 0.4} />;
          })}
        </g>
      ))}

      {/* Floating glowing cap */}
      <g className="animate-float-slow">
        <ellipse cx={iso.project([0, 0, 232])[0]} cy={iso.project([0, 0, 232])[1]} rx="90" ry="60" fill="url(#hs-cap-glow)" />
        <polygon points={cap.left} fill="url(#hs-left)" stroke="#7CFFB2" strokeOpacity="0.5" />
        <polygon points={cap.right} fill="url(#hs-right)" stroke="#7CFFB2" strokeOpacity="0.5" />
        <polygon points={cap.top} fill="url(#hs-cap-top)" stroke="#7CFFB2" strokeOpacity="0.14" strokeWidth="8" strokeLinejoin="round" />
        <polygon points={cap.top} fill="none" stroke="#B7FFCE" strokeWidth="1.5" strokeLinejoin="round" />
        <g transform={logoMatrix}>
          <LogoRibbons greenId="hs-dg-a" blueId="hs-dg-b" />
        </g>
      </g>

      {/* Front halves of the orbit rings */}
      <path d={halfRing(midRing, "front")} fill="none" stroke="#7CFFB2" strokeOpacity="0.12" strokeWidth="8" />
      <path d={halfRing(midRing, "front")} fill="none" stroke="#7CFFB2" strokeWidth="2" strokeDasharray="3 9" className="animate-dash" />
      <path d={halfRing(topRing, "front")} fill="none" stroke="#B7FFCE" strokeOpacity="0.12" strokeWidth="7" />
      <path d={halfRing(topRing, "front")} fill="none" stroke="#B7FFCE" strokeOpacity="0.85" strokeWidth="1.5" />

      {/* Floating mint cubes */}
      {cubes.map((c, i) => (
        <g key={i} className="animate-float" style={{ animationDelay: c.delay }}>
          {c.glass ? (
            <>
              <polygon points={c.box.left} fill="#7CFFB2" fillOpacity="0.18" stroke="#7CFFB2" strokeOpacity="0.8" />
              <polygon points={c.box.right} fill="#7CFFB2" fillOpacity="0.28" stroke="#7CFFB2" strokeOpacity="0.8" />
              <polygon points={c.box.top} fill="#B7FFCE" fillOpacity="0.4" stroke="#DDFBE8" />
            </>
          ) : (
            <>
              <polygon points={c.box.left} fill="url(#hs-mint-side)" />
              <polygon points={c.box.right} fill="#B7FFCE" />
              <polygon points={c.box.top} fill="url(#hs-mint)" />
            </>
          )}
        </g>
      ))}
    </svg>
  );
}
