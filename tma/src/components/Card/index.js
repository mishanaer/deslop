import PropTypes from "prop-types"
import * as styles from "./Card.module.scss"

function Card({ children, ...props }) {
    return (
        <div className={styles.root} {...props}>
            {children}
        </div>
    )
}

Card.propTypes = {
    children: PropTypes.node,
}
export default Card
