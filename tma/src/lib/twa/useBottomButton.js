import { useEffect } from "react"
import WebApp from "./webApp"

const { button_color, button_text_color, bottom_bar_bg_color } =
    WebApp.themeParams

const defaultColors = {
    main: { color: button_color, text_color: button_text_color },
    secondary: { color: bottom_bar_bg_color, text_color: button_color },
}

const isButtonShown = { main: false, secondary: false }

const useBottomButton = ({
    type,
    text,
    onClick,
    disabled = false,
    progress = false,
    color,
    textColor,
    hasShineEffect = false,
    position,
    iconCustomEmojiId,
}) => {
    const button = type === "main" ? WebApp.MainButton : WebApp.SecondaryButton

    useEffect(() => {
        button.show()
        isButtonShown[type] = true
        return () => {
            isButtonShown[type] = false
            setTimeout(() => {
                if (!isButtonShown[type]) {
                    button.hide()
                }
            }, 10)
        }
    }, [type, button])

    useEffect(() => {
        if (progress) {
            button.showProgress()
            button.disable()
        } else {
            button.hideProgress()
        }

        if (disabled || progress) {
            button.disable()
        } else {
            button.enable()
        }

        return () => {
            button.hideProgress()
            button.enable()
        }
    }, [disabled, progress, button])

    useEffect(() => {
        const params = {
            color: color ?? defaultColors[type].color,
            text_color: textColor ?? defaultColors[type].text_color,
            has_shine_effect: hasShineEffect,
        }
        if (position !== undefined) params.position = position
        if (iconCustomEmojiId !== undefined)
            params.icon_custom_emoji_id = iconCustomEmojiId
        button.setParams(params)
    }, [
        color,
        textColor,
        hasShineEffect,
        position,
        iconCustomEmojiId,
        type,
        button,
    ])

    useEffect(() => {
        button.setText(text)
    }, [text, button])

    useEffect(() => {
        if (onClick) {
            button.onClick(onClick)
            return () => {
                button.offClick(onClick)
            }
        }
    }, [onClick, button])
}

export default useBottomButton
