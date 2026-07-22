import { useState, useEffect } from "react"
import WebApp from "../../../../lib/twa"

export const useSegmentNavigation = () => {
    const [activeSegment, setActiveSegment] = useState(0)
    const [view, setView] = useState("wallet")

    useEffect(() => {
        if (WebApp.initData) {
            WebApp.onEvent("backButtonClicked", () => {
                WebApp.setHeaderColor("secondary_bg_color")
                WebApp.setBackgroundColor("secondary_bg_color")
            })
        }
    }, [])

    const handleSegmentChange = (index) => {
        const newView = index === 1 ? "tonwallet" : "wallet"

        setView(newView)
        setActiveSegment(index)

        WebApp.HapticFeedback.selectionChanged()
    }

    return { activeSegment, view, handleSegmentChange }
}
