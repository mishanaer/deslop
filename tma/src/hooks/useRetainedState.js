import { useEffect, useState } from "react"
import {
    getScreenState,
    setScreenState,
    currentScreenPath,
} from "../utils/screenState"

// useState that survives unmount: the value is mirrored into the screen
// state registry under the path the component mounted at, and seeds the
// initial state when the same screen mounts again.
export default function useRetainedState(subKey, initialValue) {
    const [path] = useState(currentScreenPath)
    const [value, setValue] = useState(() => {
        const saved = getScreenState(path, subKey)
        return saved === undefined ? initialValue : saved
    })

    useEffect(() => {
        setScreenState(path, subKey, value)
    }, [path, subKey, value])

    return [value, setValue]
}
