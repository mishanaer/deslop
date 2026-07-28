import "@deslop/mini-app/styles.css";
import "@deslop/primitives/material-symbols.css";

import { GradientBackground, MiniAppProvider } from "@deslop/mini-app";
import { MaterialSymbol } from "@deslop/primitives/material-symbols-react";

export function App() {
  return (
    <MiniAppProvider>
      <main>
        <GradientBackground
          colors={["#0088ff", "#34c759", "#ffcc00", "#ff3b30"]}
        />
        <MaterialSymbol name="search" aria-label="Поиск" size={24} />
      </main>
    </MiniAppProvider>
  );
}
