import PropTypes from "prop-types"
import * as m from "motion/react-m"

import * as styles from "./Tab.module.css"

const Tab = ({ isActive, onClick, label, icon, className = "", ...rest }) => (
    <m.div
        layout
        transition={{ type: "spring", stiffness: 800, damping: 50 }}
        {...rest}
        className={`${styles.tab} ${isActive ? styles.active : ""} ${className}`.trim()}
        onClick={onClick}
    >
        <m.div layout className={styles.icon}>
            {icon}
        </m.div>
        <m.span layout style={{ display: "inline-block" }}>
            {label}
        </m.span>
    </m.div>
)

Tab.propTypes = {
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
    label: PropTypes.string,
    icon: PropTypes.node,
    className: PropTypes.string,
}

export default Tab
