import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react"
import {
  CheckIcon,
  ChevronRightIcon,
  Code2Icon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  XIcon,
} from "@/lib/icons"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import {
  areaCharts,
  blocks,
  componentCategories,
  components,
  getBlock,
  getComponent,
} from "./catalog"
import { ComponentDemo } from "./component-demo"
import { AreaChartPreview, BlockPreview } from "./section-demos"

const searchEntries = [
  ...components.map((component) => ({
    title: component.title,
    category: component.category,
    href: `/docs/components/${component.slug}`,
  })),
  ...blocks.map((block) => ({
    title: block.title,
    category: "Blocks",
    href: `/blocks/${block.slug}`,
  })),
  ...areaCharts.map((chart) => ({
    title: `Area Chart — ${chart.title}`,
    category: "Charts",
    href: "/charts/area",
  })),
]

function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  const navigate = (path: string) => {
    if (path === window.location.pathname) return
    window.history.pushState({}, "", path)
    setPathname(path)
    window.scrollTo({ top: 0, behavior: "instant" })
  }

  return { pathname, navigate }
}

function AppLink({
  href,
  navigate,
  children,
  className,
}: {
  href: string
  navigate: (path: string) => void
  children: ReactNode
  className?: string
}) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(href)
  }

  return <a href={href} onClick={onClick} className={className}>{children}</a>
}

function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    localStorage.getItem("web-ui-theme") === "dark" ||
    (!localStorage.getItem("web-ui-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  )

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    document.documentElement.dataset.colorScheme = dark ? "dark" : "light"
    localStorage.setItem("web-ui-theme", dark ? "dark" : "light")
  }, [dark])

  return (
    <Button variant="ghost" size="icon-sm" onClick={() => setDark((value) => !value)} aria-label="Toggle theme">
      {dark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}

function SearchDialog({ navigate }: { navigate: (path: string) => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const results = useMemo(
    () => searchEntries.filter((entry) => entry.title.toLowerCase().includes(query.toLowerCase())),
    [query]
  )

  const select = (href: string) => {
    navigate(href)
    setOpen(false)
    setQuery("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" className="h-8 w-40 justify-start gap-2 px-3 text-muted-foreground xl:w-64" onClick={() => setOpen(true)}>
        <SearchIcon className="size-4" />
        <span className="flex-1 text-left text-xs">Search documentation...</span>
        <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </Button>
      <DialogContent className="top-[20%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0" showCloseButton={false}>
        <DialogTitle className="sr-only">Search documentation</DialogTitle>
        <div className="flex items-center gap-2 border-b px-4">
          <SearchIcon className="size-4 text-muted-foreground" />
          <Input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type a component name..." className="h-12 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent" />
          <Button variant="ghost" size="icon-xs" onClick={() => setOpen(false)}><XIcon /></Button>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {results.map((entry) => (
            <button key={entry.href} onClick={() => select(entry.href)} className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-accent">
              <span>{entry.title}</span>
              <span className="text-xs text-muted-foreground">{entry.category}</span>
            </button>
          ))}
          {results.length === 0 && <p className="px-3 py-8 text-center text-sm text-muted-foreground">No results found.</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Header({ navigate }: { navigate: (path: string) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-4 lg:px-8">
        <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={() => setMobileOpen((value) => !value)}><MenuIcon /></Button>
        <AppLink href="/docs/components" navigate={navigate} className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-6 grid-cols-2 gap-0.5 rounded-sm bg-foreground p-1"><span className="bg-background" /><span className="bg-background" /><span className="col-span-2 bg-background" /></span>
          <span>web/ui</span>
        </AppLink>
        <nav className="hidden items-center gap-5 text-sm lg:flex">
          <AppLink href="/docs/components" navigate={navigate} className="text-muted-foreground transition-colors hover:text-foreground">Components</AppLink>
          <AppLink href="/blocks" navigate={navigate} className="text-muted-foreground transition-colors hover:text-foreground">Blocks</AppLink>
          <AppLink href="/charts/area" navigate={navigate} className="text-muted-foreground transition-colors hover:text-foreground">Charts</AppLink>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block"><SearchDialog navigate={navigate} /></div>
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <Button variant="ghost" size="icon-sm" asChild><a href="https://github.com/mishanaer/deslop" target="_blank" rel="noreferrer" aria-label="GitHub"><Code2Icon /></a></Button>
          <Separator orientation="vertical" className="h-4" />
          <ThemeToggle />
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t p-4 lg:hidden"><nav className="flex flex-col gap-1"><AppLink href="/docs/components" navigate={(path) => { navigate(path); setMobileOpen(false) }} className="rounded-md px-3 py-2 text-sm hover:bg-accent">Components</AppLink><AppLink href="/blocks" navigate={(path) => { navigate(path); setMobileOpen(false) }} className="rounded-md px-3 py-2 text-sm hover:bg-accent">Blocks</AppLink><AppLink href="/charts/area" navigate={(path) => { navigate(path); setMobileOpen(false) }} className="rounded-md px-3 py-2 text-sm hover:bg-accent">Charts</AppLink></nav></div>
      )}
    </header>
  )
}

function Sidebar({ pathname, navigate }: { pathname: string; navigate: (path: string) => void }) {
  const sectionLinks = [
    { title: "Components", href: "/docs/components" },
    { title: "Blocks", href: "/blocks" },
    { title: "Area Charts", href: "/charts/area" },
  ]

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r px-4 py-8 lg:block">
      <div className="mb-8">
        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Sections</p>
        <nav className="space-y-0.5">
          {sectionLinks.map((item) => (
            <AppLink key={item.href} href={item.href} navigate={navigate} className={cn("block rounded-md px-2 py-1.5 text-sm", pathname === item.href ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}>{item.title}</AppLink>
          ))}
        </nav>
      </div>
      {pathname.startsWith("/docs/components") ? <div>
        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Components</p>
        <nav className="space-y-0.5">
          {components.map((component) => {
            const href = `/docs/components/${component.slug}`
            return <AppLink key={component.slug} href={href} navigate={navigate} className={cn("block rounded-md px-2 py-1.5 text-sm", pathname === href ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}>{component.title}</AppLink>
          })}
        </nav>
      </div> : null}
      {pathname.startsWith("/blocks") ? <div>
        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Blocks</p>
        <nav className="space-y-0.5">
          {blocks.map((block) => {
            const href = `/blocks/${block.slug}`
            return <AppLink key={block.slug} href={href} navigate={navigate} className={cn("block rounded-md px-2 py-1.5 text-sm", pathname === href ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}>{block.title}</AppLink>
          })}
        </nav>
      </div> : null}
      {pathname.startsWith("/charts") ? <div>
        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Charts</p>
        <nav className="space-y-0.5">
          <AppLink href="/charts/area" navigate={navigate} className="block rounded-md bg-accent px-2 py-1.5 text-sm font-medium text-foreground">Area Charts</AppLink>
        </nav>
      </div> : null}
    </aside>
  )
}

function ComponentsPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <article className="py-12 lg:py-16">
      <h1 className="text-4xl font-bold tracking-tight">Components</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Accessible building blocks copied from shadcn/ui and owned by Web UI.</p>
      <div className="mt-10 space-y-10">
        {componentCategories.map((category) => (
          <section key={category}>
            <h2 className="mb-4 text-sm font-medium text-muted-foreground">{category}</h2>
            <div className="grid gap-px overflow-hidden rounded-xl border bg-background sm:grid-cols-2 xl:grid-cols-3">
              {components.filter((component) => component.category === category).map((component) => (
                <AppLink key={component.slug} href={`/docs/components/${component.slug}`} navigate={navigate} className="ui-background-elevation-5 ui-hover-elevation-5 group flex min-h-28 items-start justify-between gap-4 p-5 transition-colors"><div><h3 className="font-medium">{component.title}</h3><p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{component.description}</p></div><ChevronRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></AppLink>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}

function BlocksPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <article className="py-12 lg:py-16">
      <h1 className="text-4xl font-bold tracking-tight">Blocks</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Ready-made product layouts composed from Web UI components and Deslop Primitives.</p>
      <div className="mt-10 space-y-14">
        {blocks.map((block) => (
          <section key={block.slug} id={block.slug}>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{block.category}</p>
                <h2 className="mt-1 text-2xl font-semibold">{block.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{block.description}</p>
              </div>
              <Button variant="outline" asChild><AppLink href={`/blocks/${block.slug}`} navigate={navigate}>View block</AppLink></Button>
            </div>
            <div className="overflow-hidden rounded-section border bg-background p-3 sm:p-5">
              <BlockPreview slug={block.slug} />
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}

function BlockPage({ slug }: { slug: string }) {
  const block = getBlock(slug)
  if (!block) return <NotFound />

  const source = `import { ${block.exportName} } from "@deslop/web-ui/blocks/${block.module}"\n\nexport function Page() {\n  return <${block.exportName} />\n}`

  return (
    <article className="min-w-0 py-12 lg:py-16">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><span>Blocks</span><ChevronRightIcon className="size-3.5" /><span>{block.category}</span></div>
      <h1 className="text-4xl font-bold tracking-tight">{block.title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{block.description}</p>
      <section id="preview" className="mt-10">
        <Tabs defaultValue="preview">
          <div className="flex items-center justify-between"><TabsList className="h-9"><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList><span className="text-xs text-muted-foreground">Primitives</span></div>
          <TabsContent value="preview" className="mt-4 overflow-hidden rounded-section border bg-background p-3 sm:p-5"><BlockPreview slug={block.slug} /></TabsContent>
          <TabsContent value="code" className="mt-4"><pre className="overflow-x-auto rounded-section border bg-muted p-5 text-sm leading-6"><code>{source}</code></pre></TabsContent>
        </Tabs>
      </section>
      <section id="installation" className="mt-12"><h2 className="text-2xl font-semibold tracking-tight">Installation</h2><p className="mt-3 text-muted-foreground">Import the block from Web UI.</p><pre className="mt-4 overflow-x-auto rounded-section border bg-muted p-5 text-sm"><code>{`import { ${block.exportName} } from "@deslop/web-ui/blocks/${block.module}"`}</code></pre></section>
      <section id="source" className="mt-12"><h2 className="text-2xl font-semibold tracking-tight">Source</h2><p className="mt-3 leading-7 text-muted-foreground">The implementation is stored in <code className="rounded bg-muted px-1.5 py-1 text-sm text-foreground">src/components/blocks/{block.module}.tsx</code>.</p></section>
    </article>
  )
}

function AreaChartsPage() {
  return (
    <article className="min-w-0 py-12 lg:py-16">
      <h1 className="text-4xl font-bold tracking-tight">Area Charts</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Ready-to-use Recharts compositions connected to Deslop color and typography tokens.</p>
      <div className="mt-10 space-y-14">
        {areaCharts.map((chart) => {
          const source = `import { ${chart.exportName} } from "@deslop/web-ui/charts/area"\n\nexport function Example() {\n  return <${chart.exportName} />\n}`
          return (
            <section key={chart.slug} id={chart.slug}>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold">{chart.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{chart.description}</p>
              </div>
              <Tabs defaultValue="preview">
                <TabsList className="h-9"><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList>
                <TabsContent value="preview" className="mt-4"><AreaChartPreview slug={chart.slug} /></TabsContent>
                <TabsContent value="code" className="mt-4"><pre className="overflow-x-auto rounded-section border bg-muted p-5 text-sm leading-6"><code>{source}</code></pre></TabsContent>
              </Tabs>
            </section>
          )
        })}
      </div>
    </article>
  )
}

function ComponentPage({ slug }: { slug: string }) {
  const component = getComponent(slug)
  if (!component) return <NotFound />

  const componentName = component.title.replaceAll(" ", "")
  const importNames =
    component.slug === "avatar" ? "ImageAvatar, InitialsAvatar" : componentName
  const example =
    component.slug === "avatar"
      ? '<InitialsAvatar userId={0} name="Alice Johnson" />'
      : component.slug === "badge"
        ? '<Badge variant="filled">Badge</Badge>'
      : `<${componentName} />`
  const source = `import { ${importNames} } from "@deslop/web-ui/components/${component.slug}"\n\nexport function Example() {\n  return ${example}\n}`

  return (
    <article className="min-w-0 py-12 lg:py-16">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><span>Docs</span><ChevronRightIcon className="size-3.5" /><span>Components</span></div>
      <h1 className="text-4xl font-bold tracking-tight">{component.title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{component.description}</p>
      <section id="preview" className="mt-10">
        <Tabs defaultValue="preview">
          <div className="flex items-center justify-between"><TabsList className="h-9"><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList><span className="text-xs text-muted-foreground">Primitives</span></div>
          <TabsContent value="preview" className="mt-4 overflow-hidden rounded-xl border bg-card"><ComponentDemo slug={component.slug} title={component.title} /></TabsContent>
          <TabsContent value="code" className="mt-4"><pre className="overflow-x-auto rounded-xl border bg-muted p-5 text-sm leading-6"><code>{source}</code></pre></TabsContent>
        </Tabs>
      </section>
      <section id="installation" className="mt-12"><h2 className="text-2xl font-semibold tracking-tight">Installation</h2><p className="mt-3 text-muted-foreground">Import the component from Web UI.</p><pre className="mt-4 overflow-x-auto rounded-xl border bg-muted p-5 text-sm"><code>{`import { ${importNames} } from "@deslop/web-ui/components/${component.slug}"`}</code></pre></section>
      <section id="source" className="mt-12"><h2 className="text-2xl font-semibold tracking-tight">Source</h2><p className="mt-3 leading-7 text-muted-foreground">The implementation is stored in <code className="rounded bg-muted px-1.5 py-1 text-sm text-foreground">src/components/ui/{component.slug}.tsx</code>.</p></section>
    </article>
  )
}

function NotFound() {
  return <div className="py-20"><p className="text-sm text-muted-foreground">404</p><h1 className="mt-2 text-3xl font-semibold">Page not found</h1></div>
}

export function StorybookApp() {
  const { pathname, navigate } = usePathname()
  const componentMatch = pathname.match(/^\/docs\/components\/([^/]+)$/)
  const blockMatch = pathname.match(/^\/blocks\/([^/]+)$/)

  let page: ReactNode
  if (pathname === "/" || pathname === "/docs") page = <ComponentsPage navigate={navigate} />
  else if (pathname === "/docs/components") page = <ComponentsPage navigate={navigate} />
  else if (componentMatch) page = <ComponentPage slug={componentMatch[1]} />
  else if (pathname === "/blocks") page = <BlocksPage navigate={navigate} />
  else if (blockMatch) page = <BlockPage slug={blockMatch[1]} />
  else if (pathname === "/charts" || pathname === "/charts/area") page = <AreaChartsPage />
  else page = <NotFound />

  const showDetailNavigation = Boolean(componentMatch || blockMatch)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header navigate={navigate} />
        <div className="mx-auto flex max-w-[1440px]">
          <Sidebar pathname={pathname} navigate={navigate} />
          <main className="min-w-0 flex-1 px-5 sm:px-8 lg:px-12 xl:px-16">{page}</main>
          {showDetailNavigation ? <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-52 shrink-0 px-8 py-16 xl:block"><p className="mb-3 text-xs font-medium">On This Page</p><nav className="space-y-2 text-sm text-muted-foreground"><a href="#preview" className="block hover:text-foreground">Preview</a><a href="#installation" className="block hover:text-foreground">Installation</a><a href="#source" className="block hover:text-foreground">Source</a></nav></aside> : null}
        </div>
      </div>
    </TooltipProvider>
  )
}
