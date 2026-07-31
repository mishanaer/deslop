import { softAppearance } from "../soft-appearance/assets/waapi/soft-appearance.js"
import { springAppearance } from "../spring-appearance/assets/waapi/spring-appearance.js"

const STORIES = [
    {
        id: "soft-appearance",
        engine: "soft",
        options: {},
    },
    {
        id: "spring-appearance",
        engine: "spring",
        options: {},
    },
]

const activeStories = new Map()
const themeToggle = document.querySelector("#theme-toggle")

async function createStory(story) {
    const elements = document.querySelectorAll(`[data-story="${story.id}"]`)

    return Array.from(elements, (element) => {
        const text = element.innerText ?? element.textContent ?? ""

        if (story.engine === "soft") {
            return softAppearance(element, {
                ...story.options,
                phrases: [text],
                autoplay: false,
            })
        }

        return springAppearance(element, {
            ...story.options,
            text,
            autoplay: false,
        })
    })
}

async function start() {
    const results = await Promise.allSettled(STORIES.map(createStory))

    for (const [index, result] of results.entries()) {
        if (result.status !== "fulfilled") {
            console.error(`Could not start ${STORIES[index].id}`, result.reason)
            continue
        }

        const story = STORIES[index]
        const controls = result.value
        activeStories.set(story.id, controls)
        document.querySelector(`[data-replay="${story.id}"]`).disabled = false
        for (const control of controls) control.play()
    }
}

for (const button of document.querySelectorAll("[data-replay]")) {
    button.addEventListener("click", () => {
        for (const control of activeStories.get(button.dataset.replay) ?? []) {
            control.play()
        }
    })
}

themeToggle.addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme !== "dark"
    document.documentElement.dataset.theme = dark ? "dark" : "light"
    themeToggle.setAttribute("aria-pressed", String(dark))
    themeToggle.textContent = dark ? "Светлая тема" : "Тёмная тема"
})

window.addEventListener("pagehide", () => {
    for (const controls of activeStories.values()) {
        for (const control of controls) control.destroy()
    }
})

start()
