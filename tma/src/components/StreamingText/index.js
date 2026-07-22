import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import * as m from "motion/react-m"
import { useReducedMotion } from "motion/react"

import * as styles from "./StreamingText.module.css"

const SPEED_PRESETS = {
    slow: 0.08,
    normal: 0.035,
    fast: 0.015,
}

const TYPE_PER_CHAR = {
    slow: 0.02,
    normal: 0.007,
    fast: 0.007 / 1.5,
}

const GRAPHEME_SEGMENTER = new Intl.Segmenter()

const splitGraphemes = (text) =>
    Array.from(GRAPHEME_SEGMENTER.segment(text), (s) => s.segment)

const tokenizeWords = (text) =>
    text.split("\n").map((line) =>
        line
            .split(/(\s+)/)
            .filter(Boolean)
            .map((piece) => ({
                content: piece,
                animated: !/^\s+$/.test(piece),
            }))
    )

const wordVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
    },
}

const reducedWordVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
}

const WordReveal = ({ children, speed, delay, onComplete }) => {
    const reduceMotion = useReducedMotion()
    const stagger = SPEED_PRESETS[speed] ?? SPEED_PRESETS.normal

    const lines = tokenizeWords(children)

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: reduceMotion ? 0 : stagger,
                delayChildren: delay / 1000,
            },
        },
    }

    const variants = reduceMotion ? reducedWordVariants : wordVariants

    return (
        <m.span
            className={styles.root}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            onAnimationComplete={onComplete}
        >
            {lines.map((tokens, lineIdx) => (
                <span key={lineIdx} className={styles.line}>
                    {tokens.map((token, tokenIdx) => {
                        if (!token.animated) {
                            return <span key={tokenIdx}>{token.content}</span>
                        }
                        return (
                            <m.span
                                key={tokenIdx}
                                className={styles.token}
                                variants={variants}
                            >
                                {token.content}
                            </m.span>
                        )
                    })}
                </span>
            ))}
        </m.span>
    )
}

WordReveal.propTypes = {
    children: PropTypes.string.isRequired,
    speed: PropTypes.string,
    delay: PropTypes.number,
    onComplete: PropTypes.func,
}

const TypewriterReveal = ({ children, speed, delay, onComplete }) => {
    const reduceMotion = useReducedMotion()
    const perChar = TYPE_PER_CHAR[speed] ?? TYPE_PER_CHAR.normal
    const graphemes = splitGraphemes(children)
    const total = graphemes.length
    const [progress, setProgress] = useState(() =>
        reduceMotion ? { whole: total, frac: 0 } : { whole: 0, frac: 0 }
    )

    useEffect(() => {
        if (reduceMotion) {
            setProgress({ whole: total, frac: 0 })
            onComplete?.()
            return undefined
        }
        const start = performance.now() + delay
        const charDurationMs = perChar * 1000
        let raf
        const tick = (now) => {
            const elapsed = now - start
            if (elapsed < 0) {
                raf = requestAnimationFrame(tick)
                return
            }
            const reveal = elapsed / charDurationMs
            const whole = Math.min(total, Math.floor(reveal))
            const frac = whole < total ? Math.min(1, reveal - whole) : 0
            setProgress({ whole, frac })
            if (whole < total) {
                raf = requestAnimationFrame(tick)
            } else {
                onComplete?.()
            }
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [children, perChar, delay, reduceMotion])

    const { whole, frac } = progress
    const leadingChar = whole < total ? graphemes[whole] : null

    return (
        <span className={styles.typewriter}>
            <span className={styles.typewriterGhost} aria-hidden="true">
                {children}
            </span>
            <span>
                {graphemes.slice(0, whole).join("")}
                {leadingChar !== null && (
                    <span style={{ opacity: frac }}>{leadingChar}</span>
                )}
            </span>
        </span>
    )
}

TypewriterReveal.propTypes = {
    children: PropTypes.string.isRequired,
    speed: PropTypes.string,
    delay: PropTypes.number,
    onComplete: PropTypes.func,
}

const StreamingText = ({
    children,
    speed = "fast",
    mode = "word",
    delay = 0,
    replayKey,
    onComplete,
}) => {
    const Component = mode === "char" ? TypewriterReveal : WordReveal
    return (
        <Component
            key={replayKey}
            speed={speed}
            delay={delay}
            onComplete={onComplete}
        >
            {children}
        </Component>
    )
}

StreamingText.propTypes = {
    children: PropTypes.string.isRequired,
    speed: PropTypes.oneOf(["slow", "normal", "fast"]),
    mode: PropTypes.oneOf(["word", "char"]),
    delay: PropTypes.number,
    replayKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onComplete: PropTypes.func,
}

export default StreamingText
