import WebApp from "../../../../lib/twa"
import DefaultAvatar from "../../../../icons/avatars/IlyaG.jpg"

export const useAvatarUrl = () => {
    try {
        const initData = new URLSearchParams(WebApp.initData)
        const userData = initData.get("user")

        return initData ? JSON.parse(userData).photo_url : DefaultAvatar
    } catch {
        return DefaultAvatar
    }
}
