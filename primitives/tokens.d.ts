export * from "./layout.js"

export interface AccentColor {
  name: string
  light: string
  dark: string
}

export interface NamedColor {
  name: string
  light: string
  dark: string
}

export interface AvatarGradient {
  name: string
  top: string
  bottom: string
}

export interface TypographyStyle {
  name: string
  fontSize: string
  lineHeight: string
  fontWeight: number
  letterSpacing: string
  caps?: boolean
}

export declare const accentColors: readonly AccentColor[]
export declare const avatarGradients: readonly AvatarGradient[]
export declare const baseColors: readonly NamedColor[]
export declare const elevationColors: readonly NamedColor[]
export declare const typographyStyles: readonly TypographyStyle[]
