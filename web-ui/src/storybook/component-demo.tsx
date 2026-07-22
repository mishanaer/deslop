import { useState, type ReactNode } from "react"
import { BellIcon, ChevronsUpDownIcon, PlusIcon } from "@/lib/icons"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Kbd } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { ExtraComponentDemo } from "./component-demos-extra"

function DemoFrame({ children }: { children: ReactNode }) {
  return <div className="flex min-h-64 w-full items-center justify-center p-6 sm:p-10">{children}</div>
}

export function ComponentDemo({ slug }: { slug: string; title: string }) {
  const [collapsibleOpen, setCollapsibleOpen] = useState(false)

  switch (slug) {
    case "accordion":
      return (
        <DemoFrame>
          <Accordion type="single" collapsible className="w-full max-w-md">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>Yes. It follows the WAI-ARIA design pattern.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can it be customized?</AccordionTrigger>
              <AccordionContent>Yes. The source lives directly in Web UI.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoFrame>
      )
    case "alert":
      return (
        <DemoFrame>
          <Alert className="max-w-md">
            <BellIcon />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>You can add components to your app using the package.</AlertDescription>
          </Alert>
        </DemoFrame>
      )
    case "alert-dialog":
      return (
        <DemoFrame>
          <AlertDialog>
            <AlertDialogTrigger asChild><Button variant="outline">Show dialog</Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DemoFrame>
      )
    case "avatar":
      return <DemoFrame><Avatar className="size-12"><AvatarFallback>DS</AvatarFallback></Avatar></DemoFrame>
    case "badge":
      return <DemoFrame><div className="flex gap-2"><Badge>Badge</Badge><Badge variant="secondary">Secondary</Badge><Badge variant="outline">Outline</Badge></div></DemoFrame>
    case "breadcrumb":
      return (
        <DemoFrame>
          <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#">Docs</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Components</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
        </DemoFrame>
      )
    case "button":
      return <DemoFrame><div className="flex flex-wrap justify-center gap-3"><Button>Button</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button></div></DemoFrame>
    case "button-group":
      return <DemoFrame><ButtonGroup><Button variant="outline">Back</Button><Button variant="outline">Next</Button></ButtonGroup></DemoFrame>
    case "card":
      return (
        <DemoFrame>
          <Card className="w-full max-w-sm"><CardHeader><CardTitle>Create project</CardTitle><CardDescription>Deploy a new project in one click.</CardDescription></CardHeader><CardContent><Button className="w-full"><PlusIcon /> Create</Button></CardContent></Card>
        </DemoFrame>
      )
    case "checkbox":
      return <DemoFrame><div className="flex items-center gap-2"><Checkbox id="terms" /><Label htmlFor="terms">Accept terms and conditions</Label></div></DemoFrame>
    case "collapsible":
      return (
        <DemoFrame>
          <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen} className="w-full max-w-sm space-y-2"><div className="flex items-center justify-between"><span className="text-sm font-medium">3 repositories</span><CollapsibleTrigger asChild><Button variant="ghost" size="icon-sm"><ChevronsUpDownIcon /></Button></CollapsibleTrigger></div><div className="rounded-md border px-4 py-3 font-mono text-sm">@deslop/web-ui</div><CollapsibleContent className="space-y-2"><div className="rounded-md border px-4 py-3 font-mono text-sm">@deslop/tma</div><div className="rounded-md border px-4 py-3 font-mono text-sm">@deslop/primitives</div></CollapsibleContent></Collapsible>
        </DemoFrame>
      )
    case "dialog":
      return (
        <DemoFrame>
          <Dialog><DialogTrigger asChild><Button variant="outline">Edit profile</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Edit profile</DialogTitle><DialogDescription>Make changes to your profile here.</DialogDescription></DialogHeader><Input defaultValue="Deslop" /></DialogContent></Dialog>
        </DemoFrame>
      )
    case "dropdown-menu":
      return (
        <DemoFrame>
          <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline">Open</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuLabel>My Account</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem>Profile</DropdownMenuItem><DropdownMenuItem>Settings</DropdownMenuItem><DropdownMenuItem>Team</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
        </DemoFrame>
      )
    case "input":
      return <DemoFrame><Input className="max-w-sm" type="email" placeholder="Email" /></DemoFrame>
    case "input-otp":
      return <DemoFrame><InputOTP maxLength={6}><InputOTPGroup>{Array.from({ length: 6 }, (_, index) => <InputOTPSlot key={index} index={index} />)}</InputOTPGroup></InputOTP></DemoFrame>
    case "kbd":
      return <DemoFrame><div className="flex items-center gap-2 text-sm text-muted-foreground">Open search <Kbd>⌘</Kbd><Kbd>K</Kbd></div></DemoFrame>
    case "label":
      return <DemoFrame><div className="grid w-full max-w-sm gap-2"><Label htmlFor="email">Email</Label><Input id="email" placeholder="name@example.com" /></div></DemoFrame>
    case "pagination":
      return <DemoFrame><Pagination><PaginationContent><PaginationItem><PaginationPrevious href="#" /></PaginationItem><PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem><PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem><PaginationItem><PaginationNext href="#" /></PaginationItem></PaginationContent></Pagination></DemoFrame>
    case "popover":
      return <DemoFrame><Popover><PopoverTrigger asChild><Button variant="outline">Open popover</Button></PopoverTrigger><PopoverContent className="text-sm">Place content for the popover here.</PopoverContent></Popover></DemoFrame>
    case "progress":
      return <DemoFrame><Progress value={64} className="w-full max-w-sm" /></DemoFrame>
    case "radio-group":
      return <DemoFrame><RadioGroup defaultValue="comfortable"><div className="flex items-center gap-2"><RadioGroupItem value="default" id="r1" /><Label htmlFor="r1">Default</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="comfortable" id="r2" /><Label htmlFor="r2">Comfortable</Label></div></RadioGroup></DemoFrame>
    case "select":
      return <DemoFrame><Select><SelectTrigger className="w-44"><SelectValue placeholder="Select a fruit" /></SelectTrigger><SelectContent><SelectItem value="apple">Apple</SelectItem><SelectItem value="banana">Banana</SelectItem><SelectItem value="blueberry">Blueberry</SelectItem></SelectContent></Select></DemoFrame>
    case "separator":
      return <DemoFrame><div className="w-full max-w-sm"><div className="text-sm font-medium">Deslop Web UI</div><div className="text-sm text-muted-foreground">A component library.</div><Separator className="my-4" /><div className="flex h-5 items-center gap-4 text-sm"><span>Docs</span><Separator orientation="vertical" /><span>Components</span></div></div></DemoFrame>
    case "skeleton":
      return <DemoFrame><div className="flex items-center gap-4"><Skeleton className="size-12 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-48" /><Skeleton className="h-4 w-36" /></div></div></DemoFrame>
    case "slider":
      return <DemoFrame><Slider defaultValue={[48]} max={100} step={1} className="w-full max-w-sm" /></DemoFrame>
    case "spinner":
      return <DemoFrame><div className="flex items-center gap-2 text-sm"><Spinner /> Loading</div></DemoFrame>
    case "switch":
      return <DemoFrame><div className="flex items-center gap-2"><Switch id="airplane" /><Label htmlFor="airplane">Airplane mode</Label></div></DemoFrame>
    case "table":
      return <DemoFrame><div className="w-full max-w-lg rounded-md border"><Table><TableHeader><TableRow><TableHead>Package</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>@deslop/web-ui</TableCell><TableCell><Badge variant="secondary">Ready</Badge></TableCell></TableRow><TableRow><TableCell>@deslop/primitives</TableCell><TableCell><Badge variant="secondary">Connected</Badge></TableCell></TableRow></TableBody></Table></div></DemoFrame>
    case "tabs":
      return <DemoFrame><Tabs defaultValue="account" className="w-full max-w-sm"><TabsList><TabsTrigger value="account">Account</TabsTrigger><TabsTrigger value="password">Password</TabsTrigger></TabsList><TabsContent value="account" className="rounded-md border p-4 text-sm">Manage your account settings.</TabsContent><TabsContent value="password" className="rounded-md border p-4 text-sm">Change your password here.</TabsContent></Tabs></DemoFrame>
    case "textarea":
      return <DemoFrame><Textarea className="max-w-sm" placeholder="Type your message here." /></DemoFrame>
    case "toggle":
      return <DemoFrame><Toggle aria-label="Toggle bold" className="font-bold">B</Toggle></DemoFrame>
    case "toggle-group":
      return <DemoFrame><ToggleGroup type="single" defaultValue="center"><ToggleGroupItem value="left">Left</ToggleGroupItem><ToggleGroupItem value="center">Center</ToggleGroupItem><ToggleGroupItem value="right">Right</ToggleGroupItem></ToggleGroup></DemoFrame>
    case "tooltip":
      return <DemoFrame><Tooltip><TooltipTrigger asChild><Button variant="outline">Hover</Button></TooltipTrigger><TooltipContent>Add to library</TooltipContent></Tooltip></DemoFrame>
    default:
      return <ExtraComponentDemo slug={slug} />
  }
}
