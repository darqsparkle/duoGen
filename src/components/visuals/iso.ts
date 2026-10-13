/** Tiny isometric projection helpers for the SVG sculptures. */
export type Vec3 = [number, number, number];

export function makeIso(originX: number, originY: number) {
  const project = ([x, y, z]: Vec3): [number, number] => [
    originX + (x - y) * 0.866,
    originY + (x + y) * 0.5 - z,
  ];
  const points = (...corners: Vec3[]) =>
    corners
      .map((c) => project(c).map((n) => n.toFixed(1)).join(","))
      .join(" ");

  /** Visible faces of an axis-aligned box: top, front-left (+y), front-right (+x). */
  const box = (x: number, y: number, z: number, w: number, d: number, h: number) => ({
    top: points([x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]),
    left: points([x, y + d, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x, y + d, z]),
    right: points([x + w, y, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x + w, y, z]),
  });

  /** A circle of radius r on the ground plane at height z, as an ellipse. */
  const ring = (r: number, z: number) => {
    const [cx, cy] = project([0, 0, z]);
    return { cx, cy, rx: r * 1.2247, ry: r * 0.7071 };
  };

  return { project, points, box, ring };
}
