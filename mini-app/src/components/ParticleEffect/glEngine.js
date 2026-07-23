import { linkProgram, resolveColor, setupGl } from "./glUtils"
import { renderTextMask } from "./textMask"

// Simulation tuning for the "text" (text = 1) mode of the dkaraush particle
// system, matching the demo defaults at dkaraush.github.io/particles.
const SIM = {
    noiseScale: 22,
    noiseSpeed: 0.6,
    forceMult: 0.6,
    velocityMult: 1,
    dampingMult: 0.9999,
    maxVelocity: 6,
    longevity: 1.4,
    noiseMovement: 4,
    timeScale: 1,
}
const DPR_MAX = 2
const FADE_OUT_MS = 400
// Particles per CSS px^2 of the WHOLE (padded) canvas, matching the demo's areal
// density: ~7000 particles over its ~500css square = 7000 / 500^2.
const PARTICLE_DENSITY = 0.028
const PARTICLE_MIN = 300
const PARTICLE_MAX = 8000
const STRIDE = 28 // 7 floats * 4 bytes
const ATTRIBS = [[0, 2, 0], [1, 2, 8], [2, 1, 16], [3, 1, 20], [4, 1, 24]]

const UNIFORMS = [
    "time", "deltaTime", "size", "reset", "r", "seed", "noiseScale",
    "noiseSpeed", "dampingMult", "velocityMult", "forceMult", "longevity",
    "maxVelocity", "noiseMovement", "color", "fadeOut", "fadeOutXY", "text",
    "textTexture",
]

/**
 * Builds the WebGL2 particle engine over a canvas, sized to a content element.
 * Particles spawn on the rasterized text mask (text mode), so the cloud is
 * shaped like the content. Runs only while covering or during the reveal
 * fade-out; idles once fully revealed. cover() captures the (frozen) content
 * into the mask and spawns; reveal(origin) bursts the cloud from the pointer;
 * reveal() before any cover() is a no-op.
 */
export function createEngine({
    gl,
    canvas,
    content,
    color,
    radius,
    padding,
    maskDilation = 0.3,
}) {
    const program = linkProgram(gl)
    const loc = {}
    for (const name of UNIFORMS) loc[name] = gl.getUniformLocation(program, name)

    const maskCanvas = document.createElement("canvas")
    const maskCtx = maskCanvas.getContext("2d")
    const texture = setupGl(gl, program, loc)

    const e = {
        buffer: null,
        bufferIndex: 0,
        count: 0,
        w: 0,
        h: 0,
        dpr: 1,
        radius: 0,
        color: [1, 1, 1],
        seed: Math.random() * 10,
        time: 0,
        lastDraw: 0,
        reset: false,
        fadeOut: false,
        fadeOutTime: 0,
        fadeOutXY: [0, 0],
        covered: false,
        text: 1, // 1 = particles spawn on the glyph mask, 0 = block fallback
        pad: 0,
        active: false, // covering or mid-reveal (the loop should run)
        onscreen: true, // paused by an IntersectionObserver when scrolled away
        raf: 0,
    }

    const genBuffer = () => {
        if (e.buffer) {
            gl.deleteBuffer(e.buffer[0])
            gl.deleteBuffer(e.buffer[1])
        }
        e.buffer = [gl.createBuffer(), gl.createBuffer()]
        for (let i = 0; i < 2; ++i) {
            gl.bindBuffer(gl.ARRAY_BUFFER, e.buffer[i])
            gl.bufferData(gl.ARRAY_BUFFER, e.count * STRIDE, gl.DYNAMIC_DRAW)
        }
        e.bufferIndex = 0
    }

    const updateMask = () => {
        if (e.w <= 0 || e.h <= 0) return
        maskCanvas.width = e.w
        maskCanvas.height = e.h
        e.text =
            renderTextMask(content, maskCtx, e.dpr, e.pad, maskDilation) > 0
                ? 1
                : 0
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, maskCanvas,
        )
        gl.generateMipmap(gl.TEXTURE_2D)
    }

    const bindAttribs = () => {
        for (const [index, size, offset] of ATTRIBS) {
            gl.vertexAttribPointer(index, size, gl.FLOAT, false, STRIDE, offset)
            gl.enableVertexAttribArray(index)
        }
    }

    const resize = () => {
        const rect = content.getBoundingClientRect()
        if (rect.width <= 0 || rect.height <= 0) return
        e.dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX)
        // Headroom around the content so particles have room to billow (shader
        // motion scales with the canvas's short side). The demo runs a ~500css
        // square over ~48css text rows, so default to ~1x the content height
        // per side; callers can override with the `padding` prop.
        e.pad = padding != null ? padding : Math.round(rect.height)
        const cssW = rect.width + 2 * e.pad
        const cssH = rect.height + 2 * e.pad
        // Canvas overflows the content box equally on every side.
        canvas.style.left = canvas.style.top = `${-e.pad}px`
        canvas.style.width = `${cssW}px`
        canvas.style.height = `${cssH}px`
        e.w = canvas.width = Math.floor(cssW * e.dpr)
        e.h = canvas.height = Math.floor(cssH * e.dpr)
        e.radius = (radius || 1.6) * e.dpr
        e.count = Math.max(
            PARTICLE_MIN,
            Math.min(PARTICLE_MAX, Math.round(cssW * cssH * PARTICLE_DENSITY)),
        )
        e.color = resolveColor(color, content)
        genBuffer()
        updateMask()
        e.reset = true
    }

    const frame = () => {
        const now = window.performance.now()
        const dt = Math.min((now - e.lastDraw) / 1000, 1) * SIM.timeScale
        e.lastDraw = now
        e.time += dt
        if (e.fadeOut) e.fadeOutTime += (dt * 1000) / FADE_OUT_MS
        const fadeOutT = Math.min(e.fadeOutTime, 1)

        gl.viewport(0, 0, e.w, e.h)
        gl.clear(gl.COLOR_BUFFER_BIT)
        if (fadeOutT >= 1) {
            e.raf = 0 // reveal finished: idle the loop
            e.active = false
            return
        }

        gl.useProgram(program)
        gl.uniform1f(loc.reset, e.reset ? 1 : 0)
        if (e.reset) {
            e.time = 0
            e.reset = false
        }
        gl.uniform1f(loc.time, e.time)
        gl.uniform1f(loc.deltaTime, dt)
        gl.uniform2f(loc.size, e.w, e.h)
        gl.uniform1f(loc.seed, e.seed)
        gl.uniform1f(loc.r, e.radius)
        // SIM keys map 1:1 to float uniforms of the same name (timeScale has none).
        for (const key in SIM) if (loc[key]) gl.uniform1f(loc[key], SIM[key])
        gl.uniform3f(loc.color, e.color[0], e.color[1], e.color[2])
        gl.uniform1f(loc.fadeOut, fadeOutT)
        gl.uniform2f(loc.fadeOutXY, e.fadeOutXY[0], e.fadeOutXY[1])
        gl.uniform1f(loc.text, e.text)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texture)

        gl.bindBuffer(gl.ARRAY_BUFFER, e.buffer[e.bufferIndex])
        bindAttribs()
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, e.buffer[1 - e.bufferIndex])
        bindAttribs()
        gl.beginTransformFeedback(gl.POINTS)
        gl.drawArrays(gl.POINTS, 0, e.count)
        gl.endTransformFeedback()
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null)
        e.bufferIndex = 1 - e.bufferIndex

        e.raf = requestAnimationFrame(frame)
    }

    const run = () => {
        if (e.raf || !e.onscreen) return
        e.lastDraw = window.performance.now()
        e.raf = requestAnimationFrame(frame)
    }

    return {
        resize,
        cover() {
            e.covered = true
            e.active = true
            e.fadeOut = false
            e.fadeOutTime = 0
            updateMask()
            e.reset = true
            run()
        },
        reveal(origin) {
            if (!e.covered) return
            e.covered = false
            e.active = true
            e.fadeOut = true
            e.fadeOutTime = 0
            e.fadeOutXY = origin
                ? [(origin.x + e.pad) * e.dpr, e.h - (origin.y + e.pad) * e.dpr]
                : [e.w / 2, e.h / 2]
            run()
        },
        // Pause the loop while scrolled off-screen, resume if still active.
        setOnscreen(onscreen) {
            if (onscreen === e.onscreen) return
            e.onscreen = onscreen
            if (!onscreen) {
                if (e.raf) {
                    cancelAnimationFrame(e.raf)
                    e.raf = 0
                }
            } else if (e.active) {
                run()
            }
        },
        destroy() {
            if (e.raf) cancelAnimationFrame(e.raf)
            if (e.buffer) {
                gl.deleteBuffer(e.buffer[0])
                gl.deleteBuffer(e.buffer[1])
            }
            gl.deleteTexture(texture)
            gl.deleteProgram(program)
        },
    }
}
