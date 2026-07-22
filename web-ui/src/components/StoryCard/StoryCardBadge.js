import PropTypes from "prop-types"
import styles from "./StoryCard.module.scss"

export default function StoryCardBadge({ children }) {
    return <span className={styles.badge}>{children}</span>
}

StoryCardBadge.propTypes = {
    children: PropTypes.node.isRequired,
}
