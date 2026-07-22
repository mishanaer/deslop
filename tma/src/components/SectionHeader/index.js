import PropTypes from "prop-types"

import Text from "../Text"
import * as styles from "./SectionHeader.module.scss"

function SectionHeader({ type, title, value, ...props }) {
    switch (type) {
        case "Headline":
            return (
                <div className={`${styles.root} ${styles.Headline}`} {...props}>
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
                <div className={`${styles.root} ${styles.Footer}`} {...props}>
                    <Text variant="footnote">
                        {title}
                    </Text>
                </div>
            )
        default:
            return (
                <div className={`${styles.root}`} {...props}>
                    <Text variant="body" weight="semibold">
                        {title}
                    </Text>
                    {value && (
                        <Text variant="footnote">
                            {value}
                        </Text>
                    )}
                </div>
            )
    }
}

SectionHeader.propTypes = {
    type: PropTypes.string,
    title: PropTypes.string.isRequired,
    value: PropTypes.string,
}
export default SectionHeader
