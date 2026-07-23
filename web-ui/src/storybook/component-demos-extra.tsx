import { useState, type CSSProperties, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"

import {
  BellIcon,
  CheckIcon,
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "@/lib/icons"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { DirectionProvider } from "@/components/ui/direction"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"

function DemoFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-64 w-full items-center justify-center p-6 sm:p-10">
      {children}
    </div>
  )
}

function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return <DemoFrame><Calendar mode="single" selected={date} onSelect={setDate} /></DemoFrame>
}

function FormDemo() {
  const form = useForm<{ email: string }>({ defaultValues: { email: "" } })

  return (
    <DemoFrame>
      <Form {...form}>
        <form className="w-full max-w-sm space-y-4" onSubmit={form.handleSubmit(() => undefined)}>
          <FormField
            control={form.control}
            name="email"
            rules={{ required: "Enter an email address" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input placeholder="name@example.com" {...field} /></FormControl>
                <FormDescription>We will use it only for account notifications.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </DemoFrame>
  )
}

const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 273, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig

function ChartDemo() {
  return (
    <DemoFrame>
      <ChartContainer config={chartConfig} className="h-64 w-full max-w-xl">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" />
          <Bar dataKey="mobile" fill="var(--color-mobile)" />
        </BarChart>
      </ChartContainer>
    </DemoFrame>
  )
}

function SidebarDemo() {
  return (
    <DemoFrame>
      <SidebarProvider
        className="min-h-72 w-full max-w-2xl overflow-hidden rounded-xl border"
        style={{ "--sidebar-width": "12rem" } as CSSProperties}
      >
        <Sidebar collapsible="none" className="h-72 border-r">
          <SidebarHeader className="p-3 font-semibold">Workspace</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {['Overview', 'Projects', 'Settings'].map((label, index) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton isActive={index === 0}><span>{label}</span></SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="min-h-72 p-6">
          <SidebarTrigger />
          <h3 className="mt-8 text-xl font-semibold">Overview</h3>
          <p className="mt-2 text-sm text-muted-foreground">The sidebar and content share one responsive provider.</p>
        </SidebarInset>
      </SidebarProvider>
    </DemoFrame>
  )
}

function MessageScrollerDemo() {
  return (
    <DemoFrame>
      <MessageScrollerProvider>
        <MessageScroller className="h-72 w-full max-w-md rounded-xl border bg-card">
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-4 p-4">
              {Array.from({ length: 8 }, (_, index) => (
                <MessageScrollerItem key={index} scrollAnchor={index === 7}>
                  <div className="rounded-lg bg-muted p-3 text-sm">Message {index + 1}: a scrollable conversation item.</div>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </DemoFrame>
  )
}

export function ExtraComponentDemo({ slug }: { slug: string }) {
  switch (slug) {
    case "aspect-ratio":
      return <DemoFrame><div className="w-full max-w-md overflow-hidden rounded-xl border"><AspectRatio ratio={16 / 9}><div className="flex size-full items-center justify-center bg-muted text-sm font-medium">16:9 preview</div></AspectRatio></div></DemoFrame>
    case "attachment":
      return <DemoFrame><AttachmentGroup><Attachment><AttachmentMedia><BellIcon /></AttachmentMedia><AttachmentContent><AttachmentTitle>design-system.pdf</AttachmentTitle><AttachmentDescription>2.4 MB · Uploaded</AttachmentDescription></AttachmentContent><AttachmentActions><AttachmentAction aria-label="Remove attachment"><XIcon /></AttachmentAction></AttachmentActions></Attachment><Attachment state="uploading"><AttachmentMedia><PlusIcon /></AttachmentMedia><AttachmentContent><AttachmentTitle>components.zip</AttachmentTitle><AttachmentDescription>Uploading · 64%</AttachmentDescription></AttachmentContent></Attachment></AttachmentGroup></DemoFrame>
    case "bubble":
      return <DemoFrame><BubbleGroup className="w-full max-w-md"><Bubble variant="secondary"><BubbleContent>Can the components use our primitives?</BubbleContent></Bubble><Bubble align="end"><BubbleContent>Yes. Colors, type, spacing, radii, and icons are connected.</BubbleContent></Bubble></BubbleGroup></DemoFrame>
    case "calendar":
      return <CalendarDemo />
    case "carousel":
      return <DemoFrame><Carousel className="w-full max-w-xs"><CarouselContent>{[1, 2, 3].map((item) => <CarouselItem key={item}><div className="flex aspect-square items-center justify-center rounded-xl border bg-card text-3xl font-semibold">{item}</div></CarouselItem>)}</CarouselContent><CarouselPrevious /><CarouselNext /></Carousel></DemoFrame>
    case "chart":
      return <ChartDemo />
    case "combobox":
      return <DemoFrame><Combobox><ComboboxInput className="w-64" placeholder="Select framework" /><ComboboxContent><ComboboxEmpty>No framework found.</ComboboxEmpty><ComboboxList>{['Next.js', 'Vite', 'Astro'].map((framework) => <ComboboxItem key={framework} value={framework}>{framework}</ComboboxItem>)}</ComboboxList></ComboboxContent></Combobox></DemoFrame>
    case "command":
      return <DemoFrame><Command className="w-full max-w-md rounded-xl border"><CommandInput placeholder="Type a command..." /><CommandList><CommandEmpty>No results found.</CommandEmpty><CommandGroup heading="Suggestions"><CommandItem><SearchIcon /> Search documentation<CommandShortcut>⌘K</CommandShortcut></CommandItem><CommandItem><PlusIcon /> Create component<CommandShortcut>⌘N</CommandShortcut></CommandItem></CommandGroup></CommandList></Command></DemoFrame>
    case "context-menu":
      return <DemoFrame><ContextMenu><ContextMenuTrigger className="flex h-40 w-full max-w-md items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">Right-click this area</ContextMenuTrigger><ContextMenuContent><ContextMenuLabel>Actions</ContextMenuLabel><ContextMenuSeparator /><ContextMenuItem>Copy<kbd className="ml-auto text-xs text-muted-foreground">⌘C</kbd></ContextMenuItem><ContextMenuItem>Duplicate</ContextMenuItem><ContextMenuItem variant="destructive">Delete</ContextMenuItem></ContextMenuContent></ContextMenu></DemoFrame>
    case "direction":
      return <DemoFrame><DirectionProvider dir="rtl"><div dir="rtl" className="w-full max-w-md rounded-xl border bg-card p-5"><p className="font-medium">واجهة من اليمين إلى اليسار</p><p className="mt-2 text-sm text-muted-foreground">DirectionProvider changes component direction without changing the API.</p><Button className="mt-4">متابعة <ChevronRightIcon /></Button></div></DirectionProvider></DemoFrame>
    case "drawer":
      return <DemoFrame><Drawer><DrawerTrigger asChild><Button variant="outline">Open drawer</Button></DrawerTrigger><DrawerContent><DrawerHeader><DrawerTitle>Move goal</DrawerTitle><DrawerDescription>Choose where this goal should live.</DrawerDescription></DrawerHeader><DrawerFooter><Button>Move</Button><DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose></DrawerFooter></DrawerContent></Drawer></DemoFrame>
    case "empty":
      return <DemoFrame><Empty className="max-w-md"><EmptyHeader><EmptyMedia variant="icon"><SearchIcon /></EmptyMedia><EmptyTitle>No components found</EmptyTitle><EmptyDescription>Try another search or add a new component to Web UI.</EmptyDescription></EmptyHeader><EmptyContent><Button><PlusIcon /> Add component</Button></EmptyContent></Empty></DemoFrame>
    case "field":
      return <DemoFrame><FieldGroup className="max-w-sm"><Field><FieldLabel htmlFor="field-name">Project name</FieldLabel><Input id="field-name" defaultValue="Deslop Web UI" /><FieldDescription>This name is visible to everyone in the workspace.</FieldDescription></Field><Field orientation="horizontal"><FieldLabel htmlFor="field-public">Public project</FieldLabel><Checkbox id="field-public" /></Field></FieldGroup></DemoFrame>
    case "form":
      return <FormDemo />
    case "hover-card":
      return <DemoFrame><HoverCard><HoverCardTrigger asChild><Button variant="link">@deslop/web-ui</Button></HoverCardTrigger><HoverCardContent><div className="flex gap-3"><Avatar><AvatarFallback name="Web UI" userId={4} /></Avatar><div><p className="font-semibold">Web UI</p><p className="mt-1 text-sm text-muted-foreground">React components for Deslop web products.</p><p className="mt-3 text-xs text-muted-foreground">61 components</p></div></div></HoverCardContent></HoverCard></DemoFrame>
    case "input-group":
      return <DemoFrame><InputGroup className="max-w-md"><InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon><InputGroupInput placeholder="example.com" /><InputGroupAddon align="inline-end"><InputGroupButton><SearchIcon /> Check</InputGroupButton></InputGroupAddon></InputGroup></DemoFrame>
    case "item":
      return <DemoFrame><ItemGroup className="w-full max-w-md gap-2"><Item variant="outline"><ItemMedia variant="icon"><CheckIcon /></ItemMedia><ItemContent><ItemTitle>Primitives connected</ItemTitle><ItemDescription>Colors, typography, spacing, radii, and icons.</ItemDescription></ItemContent><ItemActions><Badge>Ready</Badge></ItemActions></Item><Item variant="outline"><ItemMedia variant="icon"><BellIcon /></ItemMedia><ItemContent><ItemTitle>Verification enabled</ItemTitle><ItemDescription>Local checks prevent palette and icon drift.</ItemDescription></ItemContent></Item></ItemGroup></DemoFrame>
    case "marker":
      return <DemoFrame><div className="w-full max-w-md space-y-5"><Marker variant="separator"><MarkerIcon><CheckIcon /></MarkerIcon><MarkerContent>Today</MarkerContent></Marker><Marker variant="border"><MarkerContent>3 components updated</MarkerContent></Marker></div></DemoFrame>
    case "menubar":
      return <DemoFrame><Menubar><MenubarMenu><MenubarTrigger>File</MenubarTrigger><MenubarContent><MenubarItem>New component<MenubarShortcut>⌘N</MenubarShortcut></MenubarItem><MenubarItem>Open story<MenubarShortcut>⌘O</MenubarShortcut></MenubarItem><MenubarSeparator /><MenubarItem>Export</MenubarItem></MenubarContent></MenubarMenu><MenubarMenu><MenubarTrigger>Edit</MenubarTrigger><MenubarContent><MenubarItem>Undo<MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem><MenubarItem>Redo<MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem></MenubarContent></MenubarMenu></Menubar></DemoFrame>
    case "message":
      return <DemoFrame><MessageGroup className="w-full max-w-md"><Message><MessageAvatar><Avatar className="size-8"><AvatarFallback name="Design Agent" userId={5} /></Avatar></MessageAvatar><MessageContent><MessageHeader>Design agent · now</MessageHeader><Bubble variant="secondary"><BubbleContent>The component now uses Deslop Primitives.</BubbleContent></Bubble><MessageFooter>Delivered</MessageFooter></MessageContent></Message><Message align="end"><MessageContent><Bubble align="end"><BubbleContent>Looks good. Add it to the library.</BubbleContent></Bubble></MessageContent></Message></MessageGroup></DemoFrame>
    case "message-scroller":
      return <MessageScrollerDemo />
    case "native-select":
      return <DemoFrame><NativeSelect defaultValue="vite"><NativeSelectOption value="next">Next.js</NativeSelectOption><NativeSelectOption value="vite">Vite</NativeSelectOption><NativeSelectOption value="astro">Astro</NativeSelectOption></NativeSelect></DemoFrame>
    case "navigation-menu":
      return <DemoFrame><NavigationMenu viewport={false}><NavigationMenuList><NavigationMenuItem><NavigationMenuTrigger>Products</NavigationMenuTrigger><NavigationMenuContent className="w-72"><NavigationMenuLink href="#"><span className="font-medium">Web UI</span><span className="text-muted-foreground">Components for web products</span></NavigationMenuLink><NavigationMenuLink href="#"><span className="font-medium">TMA</span><span className="text-muted-foreground">Components for Telegram Mini Apps</span></NavigationMenuLink></NavigationMenuContent></NavigationMenuItem><NavigationMenuItem><NavigationMenuLink href="#" className="px-4 py-2">Docs</NavigationMenuLink></NavigationMenuItem></NavigationMenuList></NavigationMenu></DemoFrame>
    case "resizable":
      return <DemoFrame><ResizablePanelGroup orientation="horizontal" className="h-64 w-full max-w-xl overflow-hidden rounded-xl border"><ResizablePanel defaultSize={45}><div className="flex size-full items-center justify-center p-6 text-sm font-medium">Navigation</div></ResizablePanel><ResizableHandle withHandle /><ResizablePanel><div className="flex size-full items-center justify-center bg-card p-6 text-sm font-medium">Content</div></ResizablePanel></ResizablePanelGroup></DemoFrame>
    case "scroll-area":
      return <DemoFrame><ScrollArea className="h-64 w-full max-w-sm rounded-xl border"><div className="p-4"><h4 className="mb-4 font-medium">Components</h4>{['Accordion', 'Alert', 'Button', 'Calendar', 'Dialog', 'Input', 'Select', 'Tabs', 'Tooltip'].map((component) => <div key={component} className="border-b py-3 text-sm last:border-0">{component}</div>)}</div></ScrollArea></DemoFrame>
    case "sheet":
      return <DemoFrame><Sheet><SheetTrigger asChild><Button variant="outline">Open settings</Button></SheetTrigger><SheetContent><SheetHeader><SheetTitle>Project settings</SheetTitle><SheetDescription>Update the public details for this project.</SheetDescription></SheetHeader><div className="grid gap-4 px-4"><Field><FieldLabel htmlFor="sheet-name">Name</FieldLabel><Input id="sheet-name" defaultValue="Web UI" /></Field><Button>Save changes</Button></div></SheetContent></Sheet></DemoFrame>
    case "sidebar":
      return <SidebarDemo />
    case "sonner":
      return <DemoFrame><Button variant="outline" onClick={() => toast.success("Component added to Web UI")}>Show toast</Button><Toaster position="top-center" /></DemoFrame>
    default:
      return <DemoFrame><p className="text-sm text-destructive">Demo not found.</p></DemoFrame>
  }
}
