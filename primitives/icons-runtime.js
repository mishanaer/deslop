import { createElement, forwardRef, useId } from "react";
import { iconData } from "./icons-data.js";

function renderNode([tag, attributes, children], scope, key) {
  const props = { ...attributes, key };
  if (props.id) props.id = `${scope}-${props.id}`;
  if (props.clipPath) {
    props.clipPath = props.clipPath.replace(/url\(#([^)]*)\)/g, `url(#${scope}-$1)`);
  }
  return createElement(tag, props, ...children.map((child, index) => renderNode(child, scope, index)));
}

export const Icon = /* @__PURE__ */ forwardRef(function Icon({
  name,
  size = 24,
  shape = "round",
  variant,
  fill = false,
  // Accepted for compatibility with the former variable font API.
  weight: _weight,
  grade: _grade,
  opticalSize: _opticalSize,
  className,
  style,
  title,
  children: _children,
  ...props
}, ref) {
  const scope = `deslop-icon-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const resolvedVariant = variant ?? (fill === true || fill === 1 ? "solid" : "line");
  const nodes = iconData[name]?.[`${shape}/${resolvedVariant}`];
  if (!nodes) return null;
  const labelled = Boolean(title || props["aria-label"] || props["aria-labelledby"]);
  return createElement("svg", {
    ...props,
    ref,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    focusable: props.focusable ?? "false",
    className: ["deslop-icon", className].filter(Boolean).join(" "),
    role: props.role ?? (labelled ? "img" : undefined),
    "aria-label": props["aria-label"] ?? (props["aria-labelledby"] ? undefined : title),
    "aria-hidden": props["aria-hidden"] ?? (labelled ? undefined : true),
    style: { width: size, height: size, flex: "none", ...style },
  }, title ? createElement("title", null, title) : null,
  ...nodes.map((node, index) => renderNode(node, scope, index)));
});
Icon.displayName = "Icon";

export function createIcon(name, displayName) {
  const Component = forwardRef(function DeslopIcon(props, ref) {
    return createElement(Icon, { ...props, name, ref });
  });
  Component.displayName = displayName ?? `Icon(${name})`;
  return Component;
}
