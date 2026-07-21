export const getUiColor = (token) => {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--ui-${token}`)
    .trim();
};
