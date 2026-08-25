/** Literal colors for the WebGL scene (three.js cannot read CSS tokens). */
export const forest3d = {
  light: {
    ground: "#E7E0CE",
    groundDark: "#D8D0BB",
    fog: "#FAF7F0",
    trunk: "#3A2E28",
    canopyDeep: "#1B3A2F",
    canopyMoss: "#5C8A6A",
    canopyDry: "#8C9A72",
    gold: "#E8C468",
    seed: "#8A7A66",
    pollen: "#EBD79A",
  },
  dark: {
    ground: "#16241D",
    groundDark: "#101B16",
    fog: "#0D1712",
    trunk: "#2A211C",
    canopyDeep: "#2E5C48",
    canopyMoss: "#5C8A6A",
    canopyDry: "#6E7A5C",
    gold: "#E8C468",
    seed: "#5E5445",
    pollen: "#E8C468",
  },
};

export type Forest3dPalette = typeof forest3d.light;
