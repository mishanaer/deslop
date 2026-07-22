import PropTypes from "prop-types"
import * as m from "motion/react-m"
import { AnimatePresence } from "motion/react"
import { TRANSITIONS } from "../../utils/animations"

function Morph({ children }) {
    function generateKeys(text) {
        const charCount = {}
        return text.split("").map((char, index) => {
            if (!charCount[char]) {
                charCount[char] = 0
            }
            const key = `${char}-${charCount[char]}-${index}`
            charCount[char]++
            return { char, key }
        })
    }

    const textToDisplay = generateKeys(children)

    return (
        <AnimatePresence mode="popLayout" initial={false}>
            {textToDisplay.map(({ char, key }) => (
                <m.span
                    key={key}
                    layoutId={key}
                    style={{ display: "inline-block" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={TRANSITIONS.MORPH}
                >
                    {char === " " ? "\u00A0" : char}
                </m.span>
            ))}
        </AnimatePresence>
    )
}

Morph.propTypes = {
    children: PropTypes.string.isRequired,
}

export default Morph
