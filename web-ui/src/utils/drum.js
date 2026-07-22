const PERSPECTIVE = 1000

// Maps a linear offset (arc length from the drum center) onto a cylinder of
// the given radius. Returns null when the point is past 90 degrees, i.e. on
// the back of the drum. perspective() is baked into each item's transform
// because scroll and overflow containers flatten any shared 3D context.
export function drumTransform(offset, radius, orientation = "vertical") {
    const angle = offset / radius
    if (Math.abs(angle) >= Math.PI / 2) return null

    const shift = (radius * Math.sin(angle) - offset).toFixed(2)
    const depth = (radius * (Math.cos(angle) - 1)).toFixed(2)
    const degrees = ((angle * 180) / Math.PI).toFixed(2)

    if (orientation === "horizontal") {
        return (
            `perspective(${PERSPECTIVE}px) ` +
            `translateX(${shift}px) ` +
            `translateZ(${depth}px) ` +
            `rotateY(${degrees}deg)`
        )
    }

    return (
        `perspective(${PERSPECTIVE}px) ` +
        `translateY(${shift}px) ` +
        `translateZ(${depth}px) ` +
        `rotateX(${-degrees}deg)`
    )
}
