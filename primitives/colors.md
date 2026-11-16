# Colors

Accent pairs use English color names. `accent-{color}` is the foreground color;
`accent-{color}-background` is its paired background. Each has light and dark variants.

```yaml
accent-colors:
  red:
    light: "#E36C5A"
    dark: "#E29183"

  red-background:
    light: "#FEF1EE"
    dark: "#31201D"

  brown:
    light: "#D79E57"
    dark: "#E8B577"

  brown-background:
    light: "#FBF3EA"
    dark: "#2E2317"

  yellow:
    light: "#E6BD1F"
    dark: "#E5C346"

  yellow-background:
    light: "#FDF7E4"
    dark: "#2A230F"

  green:
    light: "#5EC257"
    dark: "#76D76F"

  green-background:
    light: "#EFF7EE"
    dark: "#1E291D"

  teal:
    light: "#5CB8A0"
    dark: "#75CDB4"

  teal-background:
    light: "#EAF8F3"
    dark: "#172A24"

  cyan:
    light: "#59AFC7"
    dark: "#72C4DB"

  cyan-background:
    light: "#EAF7FB"
    dark: "#15282E"

  blue:
    light: "#4C92DE"
    dark: "#77A7DD"

  blue-background:
    light: "#EDF5FE"
    dark: "#1C2632"

  indigo:
    light: "#6D81DD"
    dark: "#8899DB"

  indigo-background:
    light: "#F0F4FF"
    dark: "#212433"

  pink:
    light: "#E45CD6"
    dark: "#E48CD8"

  pink-background:
    light: "#FBF1F9"
    dark: "#2D202B"

base-colors:
  surface:
    light: "#F5F5F5"
    dark: "#111111"

  background:
    light: "#FFFFFF"
    dark: "#111111"

  elevation-1:
    light: "#FFFFFF"
    dark: "#1D1D1D"

  elevation-2:
    light: "#FFFFFF"
    dark: "#282828"

  white:
    light: "#FFFFFF"
    dark: "#FFFFFF"

  black:
    light: "#111111"
    dark: "#111111"

avatar-gradients:
  red:
    top: "#FF885E"
    bottom: "#FF516A"

  orange:
    top: "#FFCD6A"
    bottom: "#FFA85C"

  purple:
    top: "#82B1FF"
    bottom: "#665FFF"

  green:
    top: "#A0DE7E"
    bottom: "#54CB68"

  cyan:
    top: "#53EDD6"
    bottom: "#28C9B7"

  blue:
    top: "#72D5FD"
    bottom: "#2A9EF1"

  pink:
    top: "#E0A2F3"
    bottom: "#D669ED"

primary-colors:
  primary:
    light: "#111111"
    dark: "#FFFFFF"

  primary-90:
    light: "#111111E6"
    dark: "#FFFFFFE6"

  primary-80:
    light: "#111111CC"
    dark: "#FFFFFFCC"

  primary-70:
    light: "#111111B3"
    dark: "#FFFFFFB3"

  primary-60:
    light: "#11111199"
    dark: "#FFFFFF99"

  primary-50:
    light: "#11111180"
    dark: "#FFFFFF80"

  primary-40:
    light: "#11111166"
    dark: "#FFFFFF66"

  primary-30:
    light: "#1111114D"
    dark: "#FFFFFF4D"

  primary-20:
    light: "#11111133"
    dark: "#FFFFFF33"

  primary-10:
    light: "#1111111A"
    dark: "#FFFFFF1A"

  primary-8:
    light: "#11111114"
    dark: "#FFFFFF14"

  primary-5:
    light: "#1111110D"
    dark: "#FFFFFF0D"

  primary-4:
    light: "#1111110A"
    dark: "#FFFFFF0A"
warm-colors:
  warm:
    light: "#12110F"
    dark: "#F6F4EF"

  warm-90:
    light: "#121110E6"
    dark: "#F6F4EFE6"

  warm-80:
    light: "#100F0ECC"
    dark: "#F6F4EFCC"

  warm-70:
    light: "#11100EB3"
    dark: "#F6F4EFB3"

  warm-60:
    light: "#12110F99"
    dark: "#F6F4EF99"

  warm-50:
    light: "#1E1A1480"
    dark: "#F6F4EF80"

  warm-40:
    light: "#30281C66"
    dark: "#F6F4EF66"

  warm-30:
    light: "#4F462E4D"
    dark: "#F6F4EF4D"

  warm-20:
    light: "#96825533"
    dark: "#F6F4EF33"

  warm-10:
    light: "#A793621A"
    dark: "#F6F4EF1A"

  warm-8:
    light: "#A68C6614"
    dark: "#F6F4EF14"

  warm-5:
    light: "#B19D890D"
    dark: "#F6F4EF0D"

  warm-4:
    light: "#B3997F0A"
    dark: "#F6F4EF0A"

```

## Warm

Warm is an optional neutral ramp with the same steps and alpha bytes as Primary.
It does not replace Primary or define product semantic roles. Read it through
`warmColors` from `tokens.js` or `--warm-*` from `colors.css`; theme selection
works the same way as Primary (system preference or `data-color-scheme`).

Only three light-theme targets are pinned, inspired by [Family](https://family.co/):

| Token | Composite on white | Suggested role |
| --- | --- | --- |
| `--warm-5` | `#FBFAF9` | Panel |
| `--warm-10` | `#F6F4EF` | Secondary button |
| `--warm-20` | `#EAE6DD` | Secondary button hover |

Other steps are proposed, not extracted from Family. Light RGB varies by step:
using one near-black base at low opacity would lose the pinned warm surfaces.
The suffix still denotes opacity, rounded to the same 8-bit alpha as Primary.
On another background, or when translucent layers overlap, the result changes.
The hex values above describe the flattened result, not the raw CSS token.

The remaining light ramp uses OKLab interpolation between the three pinned
surfaces, white at step 0, the Primary-like warm ink composites at 60 and 90,
and `#12110F` at 100. Each target is converted to an alpha color over white.
The dark ramp independently uses cream `#F6F4EF` with Primary alpha steps
over the existing dark background; it is not a Family dark palette.

Contrast must be checked for the actual product foreground/background pair;
a shared opacity number does not guarantee the same contrast as Primary.
