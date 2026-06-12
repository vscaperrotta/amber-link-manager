export const APP_NAME = 'Amber';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'A smart new tab extension for Chrome.';
export const MAX_POPUP_LINKS = 20;
export const TAG_COLORS = [
  "#F28B8B", // rosa
  "#FFB570", // pesca
  "#FFE066", // giallo
  "#8FD694", // verde menta
  "#6FCF97", // verde salvia
  "#74C0FC", // azzurro
  "#91A7FF", // blu lavanda
  "#C77DFF", // lilla
  "#E599F7", // lavanda rosa
  "#B0B0B0"  // grigio
];
export const PHYSICS_DEFAULTS = {
  chargeStrength: -250,
  linkDistance: 135,
  velocityDecay: 0.3,
  alphaDecay: 0.02,
  centerStrength: 0.9,
  minSharedTags: 1,
};
export const SLIDERS = [
  {
    key: 'chargeStrength',
    label: 'graph.slider.chargeStrength',
    min: -500,
    max: -10,
    step: 10,
    format: v => v,
  },
  {
    key: 'linkDistance',
    label: 'graph.slider.linkDistance',
    min: 20,
    max: 300,
    step: 5,
    format: v => v,
  },
  {
    key: 'velocityDecay',
    label: 'graph.slider.velocityDecay',
    min: 0.1,
    max: 0.9,
    step: 0.05,
    format: v => v.toFixed(2),
  },
  {
    key: 'alphaDecay',
    label: 'graph.slider.alphaDecay',
    min: 0.001,
    max: 0.05,
    step: 0.001,
    format: v => v.toFixed(3),
  },
  {
    key: 'centerStrength',
    label: 'graph.slider.centerStrength',
    min: 0,
    max: 2,
    step: 0.1,
    format: v => v.toFixed(1),
  },
  {
    key: 'minSharedTags',
    label: 'graph.slider.minSharedTags',
    min: 1,
    max: 5,
    step: 1,
    format: v => v,
  },
];