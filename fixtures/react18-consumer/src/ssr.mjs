import assert from "node:assert/strict";

import { JSDOM } from "jsdom";
import React from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import {
  DropdownMenu,
  MiniAppProvider,
  ModalView,
  Tooltip,
  useSnackbar,
} from "@deslop/mini-app";

const h = React.createElement;
const errors = [];
const originalError = console.error;
console.error = (...args) => errors.push(args.join(" "));

let snackbarApi;

function SnackbarProbe() {
  snackbarApi = useSnackbar();
  return h("span", null, "Ready");
}

const createTree = (modalOpen = false) =>
  h(
    MiniAppProvider,
    null,
    h(
      "main",
      null,
      h(DropdownMenu, { items: ["Newest", "Oldest"] }),
      h(ModalView, { isOpen: modalOpen, onClose() {} }, "Modal"),
      h(Tooltip, { content: "Hint" }, h("span", null, "Info")),
      h(SnackbarProbe),
    ),
  );

const tree = createTree();

const html = renderToString(tree);
assert.match(html, /Newest/);
assert.match(html, /Info/);

const dom = new JSDOM(`<div id="root">${html}</div>`, {
  pretendToBeVisual: true,
  url: "http://localhost/",
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.location = dom.window.location;
globalThis.history = dom.window.history;
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator,
  configurable: true,
});
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Element = dom.window.Element;
globalThis.Node = dom.window.Node;
globalThis.SVGElement = dom.window.SVGElement;
globalThis.MutationObserver = dom.window.MutationObserver;
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.addEventListener = dom.window.addEventListener.bind(dom.window);
globalThis.removeEventListener = dom.window.removeEventListener.bind(
  dom.window,
);
globalThis.dispatchEvent = dom.window.dispatchEvent.bind(dom.window);
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = clearTimeout;
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
dom.window.matchMedia = () => ({
  matches: false,
  addEventListener() {},
  removeEventListener() {},
});

const root = hydrateRoot(document.getElementById("root"), tree);
await new Promise((resolve) => setTimeout(resolve, 50));

snackbarApi.show({ title: "Saved", duration: 0 });
const triggers = Array.from(document.querySelectorAll('[role="button"]'));
triggers.find((node) => node.textContent === "Newest")?.click();
triggers.find((node) => node.textContent === "Info")?.click();
root.render(createTree(true));
await new Promise((resolve) => setTimeout(resolve, 100));

console.error = originalError;
const hydrationErrors = errors.filter((message) =>
  /hydration|did not match|server html|error while hydrating|useLayoutEffect/i.test(
    message,
  ),
);
assert.deepEqual(hydrationErrors, []);
assert.match(document.body.textContent, /Oldest/);
assert.match(document.body.textContent, /Hint/);
assert.match(document.body.textContent, /Modal/);
assert.match(document.body.textContent, /Saved/);

root.unmount();
dom.window.close();

console.log(
  "Mini App portals pass React 18 SSR, hydration, and post-hydration opening.",
);
