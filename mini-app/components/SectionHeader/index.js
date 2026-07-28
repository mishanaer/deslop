import PropTypes from "prop-types"

import { cn } from "../../utils/cn"
import * as styles from "./SectionHeader.module.css"

import Text from "../Text"

function SectionHeader({ type, title, value, className, ...props }) {
    switch (type) {
        case "Headline":
            return (
                <div
                    className={cn(styles.root, styles.headline, className)}
                    {...props}
                >
                    <Text variant="title3" weight="bold">
                        {title}
                    </Text>
                    {value && (
                        <Text variant="title3" weight="bold">
                            {value}
                        </Text>
                    )}
                </div>
            )
        case "Footer":
            return (
                <div className={cn(styles.root, className)} {...props}>
                    <Text variant="footnote">{title}</Text>
                </div>
            )
        default:
            return (
                <div className={cn(styles.root, className)} {...props}>
                    <Text variant="body" weight="semibold">
                        {title}
                    </Text>
                    {value && <Text variant="footnote">{value}</Text>}
                </div>
            )
    }
}

SectionHeader.propTypes = {
    type: PropTypes.string,
    title: PropTypes.string.isRequired,
    value: PropTypes.string,
    className: PropTypes.string,
}
export default SectionHeader
