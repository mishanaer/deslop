export {
  layoutTokens,
  radiusPixels,
  radiusTokens,
  semanticSpacingPixels,
  semanticSpacingTokens,
  spacingPixels,
  spacingTokens,
} from "./layout.js";

export const accentColors = [
  { name: "Red", light: "#E36C5A", dark: "#E29183" },
  { name: "Red Background", light: "#FEF1EE", dark: "#31201D" },
  { name: "Brown", light: "#D79E57", dark: "#E8B577" },
  { name: "Brown Background", light: "#FBF3EA", dark: "#2E2317" },
  { name: "Yellow", light: "#E6BD1F", dark: "#E5C346" },
  { name: "Yellow Background", light: "#FDF7E4", dark: "#2A230F" },
  { name: "Green", light: "#5EC257", dark: "#76D76F" },
  { name: "Green Background", light: "#EFF7EE", dark: "#1E291D" },
  { name: "Teal", light: "#5CB8A0", dark: "#75CDB4" },
  { name: "Teal Background", light: "#EAF8F3", dark: "#172A24" },
  { name: "Cyan", light: "#59AFC7", dark: "#72C4DB" },
  { name: "Cyan Background", light: "#EAF7FB", dark: "#15282E" },
  { name: "Blue", light: "#4C92DE", dark: "#77A7DD" },
  { name: "Blue Background", light: "#EDF5FE", dark: "#1C2632" },
  { name: "Indigo", light: "#6D81DD", dark: "#8899DB" },
  { name: "Indigo Background", light: "#F0F4FF", dark: "#212433" },
  { name: "Pink", light: "#E45CD6", dark: "#E48CD8" },
  { name: "Pink Background", light: "#FBF1F9", dark: "#2D202B" },
];

export const baseColors = [
  { name: "Surface", light: "#F5F5F5", dark: "#111111" },
  { name: "Background", light: "#FFFFFF", dark: "#111111" },
  { name: "Elevation 1", light: "#FFFFFF", dark: "#1D1D1D" },
  { name: "Elevation 2", light: "#FFFFFF", dark: "#282828" },
  { name: "White", light: "#FFFFFF", dark: "#FFFFFF" },
  { name: "Black", light: "#111111", dark: "#111111" },
];

export const avatarGradients = [
  { name: "Red", top: "#FF885E", bottom: "#FF516A" },
  { name: "Orange", top: "#FFCD6A", bottom: "#FFA85C" },
  { name: "Purple", top: "#82B1FF", bottom: "#665FFF" },
  { name: "Green", top: "#A0DE7E", bottom: "#54CB68" },
  { name: "Cyan", top: "#53EDD6", bottom: "#28C9B7" },
  { name: "Blue", top: "#72D5FD", bottom: "#2A9EF1" },
  { name: "Pink", top: "#E0A2F3", bottom: "#D669ED" },
];

export const primaryColors = [
  { name: "Primary", light: "#111111", dark: "#FFFFFF" },
  { name: "Primary 90", light: "#111111E6", dark: "#FFFFFFE6" },
  { name: "Primary 80", light: "#111111CC", dark: "#FFFFFFCC" },
  { name: "Primary 70", light: "#111111B3", dark: "#FFFFFFB3" },
  { name: "Primary 60", light: "#11111199", dark: "#FFFFFF99" },
  { name: "Primary 50", light: "#11111180", dark: "#FFFFFF80" },
  { name: "Primary 40", light: "#11111166", dark: "#FFFFFF66" },
  { name: "Primary 30", light: "#1111114D", dark: "#FFFFFF4D" },
  { name: "Primary 20", light: "#11111133", dark: "#FFFFFF33" },
  { name: "Primary 10", light: "#1111111A", dark: "#FFFFFF1A" },
  { name: "Primary 8", light: "#11111114", dark: "#FFFFFF14" },
  { name: "Primary 5", light: "#1111110D", dark: "#FFFFFF0D" },
  { name: "Primary 4", light: "#1111110A", dark: "#FFFFFF0A" },
];

// Compatibility export for Mini Apps while they migrate to primaryColors.
export const elevationColors = primaryColors;

export const typographyStyles = [
  {
    name: "Title 67",
    fontSize: "67px",
    lineHeight: "60px",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  {
    name: "Title 52",
    fontSize: "52px",
    lineHeight: "50px",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  {
    name: "Title 40",
    fontSize: "40px",
    lineHeight: "40px",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  {
    name: "Title 32",
    fontSize: "32px",
    lineHeight: "32px",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  {
    name: "Title 24",
    fontSize: "24px",
    lineHeight: "28px",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  {
    name: "Title 20",
    fontSize: "20px",
    lineHeight: "24px",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  {
    name: "Body",
    fontSize: "16px",
    lineHeight: "20px",
    fontWeight: 400,
    letterSpacing: "0",
  },
  {
    name: "Subtitle",
    fontSize: "13px",
    lineHeight: "18px",
    fontWeight: 400,
    letterSpacing: "0",
  },
  {
    name: "Caption",
    fontSize: "11px",
    lineHeight: "13px",
    fontWeight: 400,
    letterSpacing: "0",
    caps: true,
  },
];
