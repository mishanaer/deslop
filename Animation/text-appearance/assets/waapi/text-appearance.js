const HOST_CLASS = "text-appearance"
const UNIT_CLASS = "text-appearance__unit"

const DEFAULTS = Object.freeze({
    enterDuration: 504,
    enterStagger: 17,
    enterEasing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    enterY: 18.56,
    exitDuration: 302,
    exitStagger: 10,
    exitEasing: "cubic-bezier(0.7, 0, 0.84, 0)",
    exitY: -13.92,
    hold: 550,
    gap: 320,
    initialDelay: [0, 400],
})

function getPhrases(element, value) {
    const phrases = value === undefined
        ? [element.textContent ?? ""]
        : Array.isArray(value)
            ? value
            : [value]

    if (phrases.length === 0) {
        throw new TypeError("textAppearance requires at least one phrase")
    }

    return phrases.map(String)
}

function splitGraphemes(value) {
    if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
        const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" })
        return Array.from(segmenter.segment(value), ({ segment }) => segment)
    }

    return Array.from(value)
}

function transform(y) {
    return `translate3d(0, ${y}px, 0) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1)`
}

function applyFrame(unit, frame) {
    unit.style.opacity = String(frame.opacity)
    unit.style.transform = transform(frame.y)
}

function resolveDelay(value) {
    if (!Array.isArray(value)) {
        return Math.max(0, Number(value) || 0)
    }

    const [rawMin = 0, rawMax = rawMin] = value
    const min = Math.max(0, Number(rawMin) || 0)
    const max = Math.max(min, Number(rawMax) || min)
    return Math.round(min + Math.random() * (max - min))
}

function prefersReducedMotion(element) {
    return element.ownerDocument.defaultView
        ?.matchMedia?.("(prefers-reduced-motion: reduce)")
        .matches === true
}

/**
 * Applies the exact Pixel Point per-character-rise timing to a DOM element.
 *
 * @param {Element} element
 * @param {{
 *   phrases?: string|string[],
 *   loop?: boolean,
 *   autoplay?: boolean,
 *   respectReducedMotion?: boolean,
 *   initialDelay?: number|[number, number],
 *   hold?: number,
 *   gap?: number,
 *   enterDuration?: number,
 *   enterStagger?: number,
 *   enterEasing?: string,
 *   enterY?: number,
 *   exitDuration?: number,
 *   exitStagger?: number,
 *   exitEasing?: string,
 *   exitY?: number
 * }} options
 */
export function textAppearance(element, options = {}) {
    if (!element || typeof element.replaceChildren !== "function") {
        throw new TypeError("textAppearance requires a DOM element")
    }

    const phrases = getPhrases(element, options.phrases)
    const settings = {
        ...DEFAULTS,
        ...options,
        loop: options.loop ?? phrases.length > 1,
        autoplay: options.autoplay ?? true,
        respectReducedMotion: options.respectReducedMotion ?? true,
    }
    const originalNodes = Array.from(element.childNodes)
    const originalAriaLabel = element.getAttribute("aria-label")
    const originallyHadHostClass = element.classList.contains(HOST_CLASS)
    const activeAnimations = new Set()
    let playbackController = null
    let playbackTask = Promise.resolve()
    let currentPhraseIndex = 0
    let currentUnits = []
    let destroyed = false

    element.classList.add(HOST_CLASS)

    function renderPhrase(phrase, frame) {
        const fragment = element.ownerDocument.createDocumentFragment()
        const units = []

        for (const grapheme of splitGraphemes(phrase)) {
            if (grapheme === "\n") {
                const lineBreak = element.ownerDocument.createElement("br")
                lineBreak.setAttribute("aria-hidden", "true")
                fragment.append(lineBreak)
                continue
            }

            const unit = element.ownerDocument.createElement("span")
            unit.className = UNIT_CLASS
            unit.setAttribute("aria-hidden", "true")
            unit.textContent = grapheme
            applyFrame(unit, frame)
            units.push(unit)
            fragment.append(unit)
        }

        element.setAttribute("aria-label", phrase)
        element.replaceChildren(fragment)
        currentUnits = units
        return units
    }

    function renderStatic(phrase) {
        element.setAttribute("aria-label", phrase)
        element.textContent = phrase
        currentUnits = []
    }

    function wait(milliseconds, signal) {
        if (milliseconds <= 0) {
            return Promise.resolve(!signal.aborted)
        }

        return new Promise((resolve) => {
            let timer

            const finish = (completed) => {
                clearTimeout(timer)
                signal.removeEventListener("abort", abort)
                resolve(completed)
            }
            const abort = () => finish(false)

            timer = setTimeout(() => finish(true), milliseconds)
            signal.addEventListener("abort", abort, { once: true })
        })
    }

    async function animateUnits(units, from, to, duration, stagger, easing, signal) {
        if (signal.aborted) return false

        for (const unit of units) applyFrame(unit, from)

        const animations = units.map((unit, index) => {
            const animation = unit.animate(
                [
                    { opacity: from.opacity, transform: transform(from.y) },
                    { opacity: to.opacity, transform: transform(to.y) },
                ],
                {
                    delay: index * stagger,
                    duration,
                    easing,
                    fill: "forwards",
                },
            )
            activeAnimations.add(animation)
            return animation
        })

        await Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)))
        if (signal.aborted) return false

        for (const [index, unit] of units.entries()) {
            applyFrame(unit, to)
            animations[index].cancel()
            activeAnimations.delete(animations[index])
        }

        return true
    }

    function cancelPlayback(renderCurrentPhrase) {
        playbackController?.abort()
        playbackController = null

        for (const animation of activeAnimations) animation.cancel()
        activeAnimations.clear()

        if (renderCurrentPhrase && !destroyed) {
            renderStatic(phrases[currentPhraseIndex])
        }
    }

    async function run(signal) {
        const reducedMotion = settings.respectReducedMotion
            && prefersReducedMotion(element)
        const supportsWaapi = typeof element.animate === "function"

        if (reducedMotion || !supportsWaapi) {
            renderStatic(phrases[0])
            return
        }

        if (!await wait(resolveDelay(settings.initialDelay), signal)) return

        currentPhraseIndex = 0
        let units = renderPhrase(phrases[currentPhraseIndex], {
            opacity: 0,
            y: settings.enterY,
        })
        const entered = await animateUnits(
            units,
            { opacity: 0, y: settings.enterY },
            { opacity: 1, y: 0 },
            settings.enterDuration,
            settings.enterStagger,
            settings.enterEasing,
            signal,
        )

        if (!entered || !settings.loop) return
        if (!await wait(settings.hold, signal)) return

        while (!signal.aborted) {
            const exited = await animateUnits(
                currentUnits,
                { opacity: 1, y: 0 },
                { opacity: 0, y: settings.exitY },
                settings.exitDuration,
                settings.exitStagger,
                settings.exitEasing,
                signal,
            )
            if (!exited) return

            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length
            units = renderPhrase(phrases[currentPhraseIndex], {
                opacity: 0,
                y: settings.enterY,
            })

            const nextEntered = await animateUnits(
                units,
                { opacity: 0, y: settings.enterY },
                { opacity: 1, y: 0 },
                settings.enterDuration,
                settings.enterStagger,
                settings.enterEasing,
                signal,
            )
            if (!nextEntered || !await wait(settings.gap, signal)) return
        }
    }

    const controls = {
        play() {
            if (destroyed) {
                throw new Error("Cannot play a destroyed textAppearance instance")
            }

            cancelPlayback(false)
            currentPhraseIndex = 0
            playbackController = new AbortController()
            playbackTask = run(playbackController.signal)
            playbackTask.catch(() => undefined)
            return controls
        },

        stop() {
            cancelPlayback(true)
            return controls
        },

        destroy() {
            if (destroyed) return
            cancelPlayback(false)
            destroyed = true

            if (!originallyHadHostClass) element.classList.remove(HOST_CLASS)
            if (originalAriaLabel === null) element.removeAttribute("aria-label")
            else element.setAttribute("aria-label", originalAriaLabel)
            element.replaceChildren(...originalNodes)
        },

        get finished() {
            return playbackTask
        },
    }

    if (settings.autoplay) controls.play()
    return controls
}

export default textAppearance
