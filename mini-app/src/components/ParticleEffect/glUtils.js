import VERTEX_SHADER from "./vertex.glsl?raw"
import FRAGMENT_SHADER from "./fragment.glsl?raw"
import { getMiniAppColor } from "../../theme/colors"

const FEEDBACK_VARYINGS = [
    "outPosition",
    "outVelocity",
    "outTime",
    "outDuration",
    "outAlpha",
]

function compile(gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader))
    }
    return shader
}

export function linkProgram(gl) {
    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.transformFeedbackVaryings(program, FEEDBACK_VARYINGS, gl.INTERLEAVED_ATTRIBS)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program))
    }
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    return program
}

// One-time GL setup: creates the mask texture (unit 0, mipmapped, clamped),
// points the sampler at it, and configures alpha blending. Returns the texture.
export function setupGl(gl, program, loc) {
    const texture = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.useProgram(program)
    gl.uniform1i(loc.textTexture, 0)
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    return texture
}

// Resolves any CSS color (or the element's computed text color) to [r,g,b] 0..1.
export function resolveColor(input, fallbackEl) {
    const value =
        input ||
        (fallbackEl
            ? getComputedStyle(fallbackEl).color
            : getMiniAppColor("static-white"))
    const c = document.createElement("canvas")
    c.width = c.height = 1
    const ctx = c.getContext("2d")
    ctx.fillStyle = value
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    return [r / 255, g / 255, b / 255]
}
