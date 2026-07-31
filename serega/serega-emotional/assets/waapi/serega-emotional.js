const HOST_CLASS = "serega-emotional"
const UNIT_CLASS = "serega-emotional__unit"
const WORD_CLASS = "serega-emotional__word"

const DEFAULTS = Object.freeze({
    frameRate: 60,
    staggerFrames: 1.5,
    linearDuration: 180,
    settleDuration: 680,
    frequency: 1,
    decay: 10,
    positionY: 32,
    scaleY: 0.78,
    rotation: 12,
    maxBlur: 10,
    sampleRate: 60,
})

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value))
}

function splitGraphemes(value) {
    if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
        const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" })
        return Array.from(segmenter.segment(value), ({ segment }) => segment)
    }

    return Array.from(value)
}

function appendGroupedUnits(fragment, value, createUnit) {
    const units = []
    let word = null
    let followsWhitespace = false

    const startWord = () => {
        word = fragment.ownerDocument.createElement("span")
        word.className = WORD_CLASS
        fragment.append(word)
    }

    for (const grapheme of splitGraphemes(value)) {
        if (grapheme === "\n" || grapheme === "\r" || grapheme === "\r\n") {
            const lineBreak = fragment.ownerDocument.createElement("br")
            lineBreak.setAttribute("aria-hidden", "true")
            fragment.append(lineBreak)
            word = null
            followsWhitespace = false
            continue
        }

        const isWhitespace = /^\s+$/u.test(grapheme)
        if (!word || (!isWhitespace && followsWhitespace)) startWord()

        const unit = createUnit(grapheme)
        units.push(unit)
        word.append(unit)
        followsWhitespace = isWhitespace
    }

    return units
}

function prefersReducedMotion(element) {
    return element.ownerDocument.defaultView
        ?.matchMedia?.("(prefers-reduced-motion: reduce)")
        .matches === true
}

/**
 * Returns the normalized After Effects Expression Selector amount.
 * A value of 1 applies the full starting deformation; 0 is the natural state.
 *
 * @param {number} localTimeMs
 * @param {{linearDuration?: number, frequency?: number, decay?: number}} options
 */
export function seregaEmotionalSelectorAmount(localTimeMs, options = {}) {
    const linearDuration = Math.max(1, options.linearDuration ?? DEFAULTS.linearDuration) / 1000
    const frequency = Math.max(Number.EPSILON, options.frequency ?? DEFAULTS.frequency)
    const decay = Math.max(0, options.decay ?? DEFAULTS.decay)
    const time = localTimeMs / 1000

    if (time <= 0) return 1
    if (time < linearDuration) return 1 - time / linearDuration

    const springTime = time - linearDuration
    const angularFrequency = frequency * Math.PI * 2
    return (-1 / linearDuration)
        * Math.sin(springTime * angularFrequency)
        / (Math.exp(decay * springTime) * angularFrequency)
}

function frameFromAmount(amount, settings) {
    const positiveAmount = Math.max(0, amount)
    const y = settings.positionY * amount
    const scaleY = 1 + (settings.scaleY - 1) * amount
    const rotation = settings.rotation * amount
    const opacity = clamp(1 - amount, 0, 1)
    const blur = settings.maxBlur * positiveAmount

    return {
        opacity,
        filter: `blur(${blur}px)`,
        transform: `translate3d(0, ${y}px, 0) rotate(${rotation}deg) scale(1, ${scaleY})`,
    }
}

function buildKeyframes(settings) {
    const sampleCount = Math.max(
        2,
        Math.round(settings.settleDuration * settings.sampleRate / 1000),
    )
    const frames = []

    for (let index = 0; index <= sampleCount; index += 1) {
        const offset = index / sampleCount
        const localTime = settings.settleDuration * offset
        const amount = index === sampleCount
            ? 0
            : seregaEmotionalSelectorAmount(localTime, settings)

        frames.push({
            offset,
            ...frameFromAmount(amount, settings),
        })
    }

    return frames
}

function applyFinalFrame(unit, settings) {
    const frame = frameFromAmount(0, settings)
    unit.style.opacity = String(frame.opacity)
    unit.style.filter = frame.filter
    unit.style.transform = frame.transform
}

/**
 * Reproduces the supplied After Effects per-character spring reveal.
 *
 * @param {Element} element
 * @param {{
 *   text?: string,
 *   autoplay?: boolean,
 *   respectReducedMotion?: boolean,
 *   frameRate?: number,
 *   staggerFrames?: number,
 *   linearDuration?: number,
 *   settleDuration?: number,
 *   frequency?: number,
 *   decay?: number,
 *   positionY?: number,
 *   scaleY?: number,
 *   rotation?: number,
 *   maxBlur?: number,
 *   sampleRate?: number
 * }} options
 */
export function seregaEmotional(element, options = {}) {
    if (!element || typeof element.replaceChildren !== "function") {
        throw new TypeError("seregaEmotional requires a DOM element")
    }

    const text = String(options.text ?? element.textContent ?? "")
    const settings = {
        ...DEFAULTS,
        ...options,
        frameRate: Math.max(1, options.frameRate ?? DEFAULTS.frameRate),
        staggerFrames: Math.max(0, options.staggerFrames ?? DEFAULTS.staggerFrames),
        settleDuration: Math.max(
            options.linearDuration ?? DEFAULTS.linearDuration,
            options.settleDuration ?? DEFAULTS.settleDuration,
        ),
        maxBlur: Math.max(0, options.maxBlur ?? DEFAULTS.maxBlur),
        sampleRate: Math.max(1, options.sampleRate ?? DEFAULTS.sampleRate),
        autoplay: options.autoplay ?? true,
        respectReducedMotion: options.respectReducedMotion ?? true,
    }
    const originalNodes = Array.from(element.childNodes)
    const originalAriaLabel = element.getAttribute("aria-label")
    const originallyHadHostClass = element.classList.contains(HOST_CLASS)
    const activeAnimations = new Set()
    let playbackController = null
    let playbackTask = Promise.resolve()
    let destroyed = false

    element.classList.add(HOST_CLASS)

    function renderUnits() {
        const fragment = element.ownerDocument.createDocumentFragment()
        const units = appendGroupedUnits(fragment, text, (grapheme) => {
            const unit = element.ownerDocument.createElement("span")
            unit.className = UNIT_CLASS
            unit.setAttribute("aria-hidden", "true")
            unit.textContent = grapheme
            return unit
        })

        element.setAttribute("aria-label", text)
        element.replaceChildren(fragment)
        return units
    }

    function renderStatic() {
        element.setAttribute("aria-label", text)
        element.textContent = text
    }

    function cancelPlayback(renderStaticText) {
        playbackController?.abort()
        playbackController = null

        for (const animation of activeAnimations) animation.cancel()
        activeAnimations.clear()

        if (renderStaticText && !destroyed) renderStatic()
    }

    async function run(signal) {
        const reducedMotion = settings.respectReducedMotion
            && prefersReducedMotion(element)
        const supportsWaapi = typeof element.animate === "function"

        if (reducedMotion || !supportsWaapi) {
            renderStatic()
            return
        }

        const units = renderUnits()
        const keyframes = buildKeyframes(settings)
        const stagger = settings.staggerFrames * 1000 / settings.frameRate
        const animations = units.map((unit, index) => {
            const animation = unit.animate(keyframes, {
                delay: (index + 1) * stagger,
                duration: settings.settleDuration,
                easing: "linear",
                fill: "both",
            })
            activeAnimations.add(animation)
            return animation
        })

        await Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)))
        if (signal.aborted) return

        for (const [index, unit] of units.entries()) {
            applyFinalFrame(unit, settings)
            animations[index].cancel()
            activeAnimations.delete(animations[index])
        }
    }

    const controls = {
        play() {
            if (destroyed) {
                throw new Error("Cannot play a destroyed seregaEmotional instance")
            }

            cancelPlayback(false)
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

export default seregaEmotional
