import { useEffect } from "react"
import AppRouter from "../storybook/router"
import {
    initializeViewTransitions,
    cleanupViewTransitions,
} from "./utils/viewTransition"
import WebApp from "./lib/twa"

import "./index.css"

// Патч BackButton с ref-counting для корректной работы при переходах страниц
const patchBackButton = () => {
    const original = {
        show: WebApp.BackButton.show.bind(WebApp.BackButton),
        hide: WebApp.BackButton.hide.bind(WebApp.BackButton),
    }
    let count = 0

    WebApp.BackButton.show = () => {
        count++
        if (count === 1) {
            original.show()
        }
    }

    WebApp.BackButton.hide = () => {
        count = Math.max(0, count - 1)
        if (count === 0) {
            original.hide()
        }
    }
}

patchBackButton()

function App() {
    useEffect(() => {
        initializeViewTransitions()

        return () => {
            cleanupViewTransitions()
        }
    }, [])

    return <AppRouter />
}

export default App
