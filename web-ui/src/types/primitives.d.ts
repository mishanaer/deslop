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

  export const baseColors: readonly {
    name: string
    light: string
    dark: string
  }[]

  export const primaryColors: readonly {
    name: string
    light: string
    dark: string
  }[]

  export const elevationColors: typeof primaryColors

  export const spacingTokens: Readonly<Record<string, string>>
  export const radiusTokens: Readonly<Record<string, string>>

  export const typographyStyles: readonly {
    name: string
    fontSize: string
    lineHeight: string
    fontWeight: number
    letterSpacing: string
    caps?: boolean
  }[]
}
