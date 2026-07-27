declare module "@deslop/primitives/icons/*.svg?react" {
  import type { ComponentType, SVGProps } from "react"

  const Icon: ComponentType<SVGProps<SVGSVGElement>>
  export default Icon
}

declare module "@deslop/primitives/tokens" {
  export const accentColors: readonly {
    name: string
    light: string
    dark: string
  }[]
}
