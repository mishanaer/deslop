import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const avatarGradientNames = [
  "red",
  "orange",
  "purple",
  "green",
  "cyan",
  "blue",
  "pink",
] as const

function avatarGradient(userId: number) {
  const normalizedId = Number.isFinite(userId) ? Math.trunc(userId) : 0
  const index =
    ((normalizedId % avatarGradientNames.length) + avatarGradientNames.length) %
    avatarGradientNames.length

  return `var(--avatar-${avatarGradientNames[index]}-gradient)`
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/u).filter(Boolean)
  const first = parts.at(0)?.charAt(0) ?? ""
  const last = parts.length > 1 ? (parts.at(-1)?.charAt(0) ?? "") : ""
  const isLetterOrNumber = (character: string) => /[\p{L}\p{N}]/u.test(character)

  return [first, last]
    .filter(isLetterOrNumber)
    .join("")
    .toLocaleUpperCase()
}

function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-10 shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-14 data-[size=sm]:size-6",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  children,
  className,
  name,
  style,
  userId = 0,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & {
  name?: string
  userId?: number
}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full font-sans text-sm font-bold text-avatar-foreground group-data-[size=lg]/avatar:text-xl group-data-[size=sm]/avatar:text-xs",
        className
      )}
      style={{ backgroundImage: avatarGradient(userId), ...style }}
      {...props}
    >
      {name ? initialsFromName(name) : children}
    </AvatarPrimitive.Fallback>
  )
}

type IconAvatarProps = React.ComponentProps<"div"> & {
  shape?: "circle" | "rounded"
  size?: "default" | "sm" | "lg"
}

const IconAvatar = React.forwardRef<HTMLDivElement, IconAvatarProps>(
  (
    {
      children,
      className,
      shape = "circle",
      size = "default",
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      data-slot="icon-avatar"
      data-shape={shape}
      data-size={size}
      className={cn(
        "flex aspect-square size-10 shrink-0 items-center justify-center overflow-hidden bg-muted text-foreground select-none data-[size=lg]:size-14 data-[size=sm]:size-6 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6 data-[size=lg]:[&_svg:not([class*='size-'])]:size-8 data-[size=sm]:[&_svg:not([class*='size-'])]:size-4",
        shape === "circle" ? "rounded-full" : "rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
IconAvatar.displayName = "IconAvatar"

type ImageAvatarProps = Omit<React.ComponentProps<"div">, "children"> & {
  alt?: string
  shape?: "circle" | "rounded"
  size?: number
  src?: string
}

const ImageAvatar = React.forwardRef<HTMLDivElement, ImageAvatarProps>(
  (
    {
      alt = "",
      className,
      shape = "circle",
      size = 40,
      src,
      style,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      data-slot="image-avatar"
      data-shape={shape}
      className={cn(
        "relative shrink-0 overflow-hidden bg-muted",
        shape === "circle" ? "rounded-full" : "rounded-md",
        className
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {src ? (
        <img
          alt={alt}
          src={src}
          className="block size-full rounded-[inherit] object-cover"
        />
      ) : null}
    </div>
  )
)
ImageAvatar.displayName = "ImageAvatar"

type InitialsAvatarProps = Omit<React.ComponentProps<"div">, "children"> & {
  name: string
  size?: number
  userId: number
}

function InitialsAvatar({
  className,
  name,
  size = 40,
  style,
  userId,
  ...props
}: InitialsAvatarProps) {
  return (
    <div
      data-slot="initials-avatar"
      role="img"
      aria-label={name}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-sans font-bold text-avatar-foreground select-none",
        className
      )}
      style={{
        width: size,
        height: size,
        backgroundImage: avatarGradient(userId),
        fontSize: Math.round(size / 2.2),
        lineHeight: 1,
        ...style,
      }}
      {...props}
    >
      {initialsFromName(name)}
    </div>
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-3 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3.5 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-14 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  IconAvatar,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
  ImageAvatar,
  InitialsAvatar,
}
