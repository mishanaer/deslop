import Text from "../Text"
import PropTypes from "prop-types"

import * as styles from "./StartView.module.scss"

const StartView = ({ title, description }) => {
    return (
        <div className={styles.root}>
            <Text variant="title1" weight="bold">
                {title}
            </Text>
            {description && (
                <Text variant="body" weight="regular">
                    {description}
                </Text>
            )}
        </div>
    )
}

StartView.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
}
export default StartView
