import { forwardRef, type ComponentType, type SVGProps } from "react"
import ArrowDownPrimitive from "@deslop/primitives/icons/arrow-down.svg?react"
import ArrowLeftPrimitive from "@deslop/primitives/icons/arrow-left.svg?react"
import ArrowRightPrimitive from "@deslop/primitives/icons/arrow-right.svg?react"
import BellPrimitive from "@deslop/primitives/icons/bell.svg?react"
import CheckPrimitive from "@deslop/primitives/icons/check.svg?react"
import ChevronDownPrimitive from "@deslop/primitives/icons/chevron-down.svg?react"
import ChevronLeftPrimitive from "@deslop/primitives/icons/chevron-left.svg?react"
import ChevronRightPrimitive from "@deslop/primitives/icons/chevron-right.svg?react"
import ChevronSelectPrimitive from "@deslop/primitives/icons/chevron-select.svg?react"
import ChevronUpPrimitive from "@deslop/primitives/icons/chevron-up.svg?react"
import CircleAlertPrimitive from "@deslop/primitives/icons/circle-alert.svg?react"
import CircleCheckPrimitive from "@deslop/primitives/icons/circle-check.svg?react"
import CircleClosePrimitive from "@deslop/primitives/icons/circle-close.svg?react"
import CircleInfoPrimitive from "@deslop/primitives/icons/circle-info.svg?react"
import CircleMorePrimitive from "@deslop/primitives/icons/circle-more.svg?react"
import CirclePrimitive from "@deslop/primitives/icons/circle.svg?react"
import CrossPrimitive from "@deslop/primitives/icons/cross.svg?react"
import LoaderPrimitive from "@deslop/primitives/icons/loader.svg?react"
import MenuPrimitive from "@deslop/primitives/icons/menu.svg?react"
import MinusPrimitive from "@deslop/primitives/icons/minus.svg?react"
import MoonPrimitive from "@deslop/primitives/icons/moon.svg?react"
import PlusPrimitive from "@deslop/primitives/icons/plus.svg?react"
import SearchPrimitive from "@deslop/primitives/icons/search.svg?react"
import SidebarPrimitive from "@deslop/primitives/icons/sidebar.svg?react"
import SlidersPrimitive from "@deslop/primitives/icons/sliders.svg?react"
import SunPrimitive from "@deslop/primitives/icons/sun.svg?react"
import TerminalConsolePrimitive from "@deslop/primitives/icons/terminal-console.svg?react"

import { cn } from "./utils"

type SvgIcon = ComponentType<SVGProps<SVGSVGElement>>
type IconProps = SVGProps<SVGSVGElement>

function createPrimitiveIcon(SourceIcon: SvgIcon, displayName: string) {
  const Icon = forwardRef<SVGSVGElement, IconProps>(
    ({ className, ...props }, ref) => (
      <SourceIcon
        ref={ref}
        className={cn("ui-icon", className)}
        aria-hidden={props["aria-label"] ? undefined : true}
        focusable="false"
        {...props}
      />
    )
  )

  Icon.displayName = displayName
  return Icon
}

export const ArrowDownIcon = createPrimitiveIcon(ArrowDownPrimitive, "ArrowDownIcon")
export const ArrowLeft = createPrimitiveIcon(ArrowLeftPrimitive, "ArrowLeft")
export const ArrowRight = createPrimitiveIcon(ArrowRightPrimitive, "ArrowRight")
export const BellIcon = createPrimitiveIcon(BellPrimitive, "BellIcon")
export const CheckIcon = createPrimitiveIcon(CheckPrimitive, "CheckIcon")
export const ChevronDownIcon = createPrimitiveIcon(ChevronDownPrimitive, "ChevronDownIcon")
export const ChevronLeftIcon = createPrimitiveIcon(ChevronLeftPrimitive, "ChevronLeftIcon")
export const ChevronRight = createPrimitiveIcon(ChevronRightPrimitive, "ChevronRight")
export const ChevronRightIcon = createPrimitiveIcon(ChevronRightPrimitive, "ChevronRightIcon")
export const ChevronUpIcon = createPrimitiveIcon(ChevronUpPrimitive, "ChevronUpIcon")
export const ChevronsUpDownIcon = createPrimitiveIcon(ChevronSelectPrimitive, "ChevronsUpDownIcon")
export const CircleCheckIcon = createPrimitiveIcon(CircleCheckPrimitive, "CircleCheckIcon")
export const CircleIcon = createPrimitiveIcon(CirclePrimitive, "CircleIcon")
export const Code2Icon = createPrimitiveIcon(TerminalConsolePrimitive, "Code2Icon")
export const GripVerticalIcon = createPrimitiveIcon(SlidersPrimitive, "GripVerticalIcon")
export const InfoIcon = createPrimitiveIcon(CircleInfoPrimitive, "InfoIcon")
export const Loader2Icon = createPrimitiveIcon(LoaderPrimitive, "Loader2Icon")
export const MenuIcon = createPrimitiveIcon(MenuPrimitive, "MenuIcon")
export const MinusIcon = createPrimitiveIcon(MinusPrimitive, "MinusIcon")
export const MoonIcon = createPrimitiveIcon(MoonPrimitive, "MoonIcon")
export const MoreHorizontal = createPrimitiveIcon(CircleMorePrimitive, "MoreHorizontal")
export const MoreHorizontalIcon = createPrimitiveIcon(CircleMorePrimitive, "MoreHorizontalIcon")
export const OctagonXIcon = createPrimitiveIcon(CircleClosePrimitive, "OctagonXIcon")
export const PanelLeftIcon = createPrimitiveIcon(SidebarPrimitive, "PanelLeftIcon")
export const PlusIcon = createPrimitiveIcon(PlusPrimitive, "PlusIcon")
export const SearchIcon = createPrimitiveIcon(SearchPrimitive, "SearchIcon")
export const SunIcon = createPrimitiveIcon(SunPrimitive, "SunIcon")
export const TriangleAlertIcon = createPrimitiveIcon(CircleAlertPrimitive, "TriangleAlertIcon")
export const XIcon = createPrimitiveIcon(CrossPrimitive, "XIcon")
