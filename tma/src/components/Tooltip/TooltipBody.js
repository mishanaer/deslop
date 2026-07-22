import PropTypes from "prop-types"

import Text from "../Text"

import * as styles from "./Tooltip.module.css"

const TooltipBody = ({ content, badge, compact }) => (
    <div
        className={[
            styles.body,
            compact ? styles.compact : "",
            badge && !compact ? styles.withBadge : "",
        ]
            .filter(Boolean)
            .join(" ")}
    >
        {badge && !compact && (
            <span className={styles.badge}>
                <Text
                    variant="caption2"
                    rounded
                    caps
                    weight="semibold"
                >
                    {badge}
                </Text>
            </span>
        )}
        <Text
            variant={compact ? "caption2" : "subheadline2"}
            weight={compact ? "medium" : "regular"}
        >
            {content}
        </Text>
    </div>
)

TooltipBody.propTypes = {
    content: PropTypes.node,
    badge: PropTypes.string,
    compact: PropTypes.bool,
}

export default TooltipBody
