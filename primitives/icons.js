const iconModules = import.meta.glob("./icons/*.svg", {
  eager: true,
  import: "default",
  query: "?url",
});

export const icons = Object.fromEntries(
  Object.entries(iconModules).map(([path, url]) => [
    path.slice(path.lastIndexOf("/") + 1, -4),
    url,
  ]),
);

export const getIcon = (name) => icons[name];
