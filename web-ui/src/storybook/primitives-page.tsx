import {
  accentColors,
  baseColors,
  primaryColors,
  radiusTokens,
  spacingTokens,
  typographyStyles,
} from "@deslop/primitives/tokens"

const orderedPrimaryColors = [
  ...primaryColors.filter(({ name }) => name.startsWith("Primary ")).reverse(),
  ...primaryColors.filter(({ name }) => name === "Primary"),
]

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function formatColor(value: string) {
  const normalized = value.toUpperCase()
  const hex = normalized.slice(0, 7)
  const alpha = normalized.length === 9
    ? Math.round((Number.parseInt(normalized.slice(7), 16) / 255) * 100)
    : 100

  return `${hex} · ${alpha}%`
}

function ColorSwatch({
  name,
  light,
  dark,
  token,
}: {
  name: string
  light: string
  dark: string
  token: string
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div
        className="h-20 border-b transition-colors duration-200"
        style={{ backgroundColor: `var(${token})` }}
      />
      <div className="p-3">
        <p className="font-medium">{name}</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          <span className="dark:hidden">{formatColor(light)}</span>
          <span className="hidden dark:inline">{formatColor(dark)}</span>
        </p>
      </div>
    </div>
  )
}

export function PrimitivesPage() {
  return (
    <article className="min-w-0 py-12 lg:py-16">
      <h1 className="text-4xl font-bold tracking-tight">Primitives</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
        Foundation tokens shared by Web UI and Telegram Mini Apps.
      </p>

      <section className="mt-12 space-y-6">
        <SectionHeading title="Accent colors" description="The shared palette in the active color scheme." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {accentColors.map(({ name, light, dark }) => (
            <ColorSwatch
              key={name}
              name={name}
              light={light}
              dark={dark}
              token={`--accent-${name.toLowerCase()}`}
            />
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-6">
        <SectionHeading title="Base colors" description="Opaque canvas, foreground, and surface colors." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {baseColors.map(({ name, light, dark }) => (
            <ColorSwatch
              key={name}
              name={name}
              light={light}
              dark={dark}
              token={`--${name.toLowerCase().replaceAll(" ", "-")}`}
            />
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-6">
        <SectionHeading title="Primary colors" description="Theme-aware foreground colors and opacity levels." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {orderedPrimaryColors.map(({ name, light, dark }) => (
            <ColorSwatch
              key={name}
              name={name}
              light={light}
              dark={dark}
              token={`--${name.toLowerCase().replaceAll(" ", "-")}`}
            />
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-6">
        <SectionHeading title="Typography" description="SB Sans UI styles used across the component libraries." />
        <div className="divide-y overflow-hidden rounded-xl border bg-card">
          {typographyStyles.map((style) => (
            <div key={style.name} className="flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
              <div className="shrink-0 sm:w-28">
                <p className="text-sm font-medium">{style.name}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{style.fontSize} / {style.lineHeight}</p>
              </div>
              <p
                className="max-w-full"
                style={{
                  fontSize: style.fontSize,
                  fontWeight: style.fontWeight,
                  letterSpacing: style.letterSpacing,
                  lineHeight: style.lineHeight,
                  textTransform: style.caps ? "uppercase" : undefined,
                }}
              >
                Deslop
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16 grid gap-12 xl:grid-cols-2">
        <section className="space-y-6">
          <SectionHeading title="Spacing" description="The base spacing scale in pixels." />
          <div className="space-y-3 rounded-xl border bg-card p-5">
            {Object.entries(spacingTokens).map(([name, value]) => (
              <div key={name} className="flex items-center gap-4">
                <code className="w-10 shrink-0 text-xs text-muted-foreground">{name}</code>
                <div className="h-3 rounded-full bg-primary" style={{ width: value }} />
                <code className="text-xs text-muted-foreground">{value}</code>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading title="Radii" description="Corner radii available to components." />
          <div className="flex flex-wrap gap-4 rounded-xl border bg-card p-5">
            {Object.entries(radiusTokens).map(([name, value]) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div className="size-12 border-2 border-primary" style={{ borderRadius: value }} />
                <code className="text-xs text-muted-foreground">{name}</code>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  )
}
