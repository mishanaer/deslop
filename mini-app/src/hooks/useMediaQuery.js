import { useEffect, useState } from "react"

const getMatch = (query) => {
    if (typeof window === "undefined" || !window.matchMedia) return false
    return window.matchMedia(query).matches
}

// Generic CSS media-query subscription. Returns whether `query` currently matches
// and re-renders the consumer when it flips.
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => getMatch(query))

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return
        const list = window.matchMedia(query)
        const handleChange = () => setMatches(list.matches)
        handleChange()
        list.addEventListener("change", handleChange)
        return () => list.removeEventListener("change", handleChange)
    }, [query])

    return matches
}

export default useMediaQuery
