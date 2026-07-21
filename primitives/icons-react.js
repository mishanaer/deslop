const iconComponentModules = import.meta.glob("./icons/*.svg", {
  eager: true,
  import: "default",
  query: "?react",
});

export const iconComponents = Object.fromEntries(
  Object.entries(iconComponentModules).map(([path, Icon]) => [
    path.slice(path.lastIndexOf("/") + 1, -4),
    Icon,
  ]),
);

export const getIconComponent = (name) => iconComponents[name];
