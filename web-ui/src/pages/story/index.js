import { useMemo } from "react"
import StoryCard from "../../components/StoryCard"
import { parseStoryParams } from "../../components/StoryCard/parseStoryParams"
import styles from "./StoryPage.module.scss"

export default function StoryPage() {
    const params = useMemo(() => parseStoryParams(), [])

    return (
        <div className={styles.wrapper}>
            <StoryCard {...params} />
        </div>
    )
}
