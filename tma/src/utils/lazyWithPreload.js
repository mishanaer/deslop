import { lazy } from "react"

export default function lazyWithPreload(factory) {
    const Component = lazy(factory)
    Component.preload = factory
    return Component
}
