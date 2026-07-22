import PropTypes from "prop-types"
import Text from "../../../Text"
import * as styles from "./CellText.module.css"

const CellText = ({ type, title, description, caption, bold }) => {
    const weight = bold ? "medium" : "regular"
    const name = `${styles.label} ${type === "Accent" ? styles.accent : ""}`

    return (
        <>
            <div className={name}>
                <Text variant="body" weight={weight}>
                    {title}
                </Text>
            </div>
            {description && (
                <div className={caption ? styles.description : styles.caption}>
                    <Text
                        variant={caption ? "subheadline1" : "subheadline2"}
                        weight="regular"
                    >
                        {description}
                    </Text>
                </div>
            )}
            {caption && (
                <div className={styles.caption}>
                    <Text variant="subheadline2" weight="regular">
                        {caption}
                    </Text>
                </div>
            )}
        </>
    )
}

CellText.propTypes = {
    type: PropTypes.string,
    title: PropTypes.node,
    description: PropTypes.node,
    caption: PropTypes.string,
    bold: PropTypes.bool,
}

export default CellText
