import PropTypes from "prop-types"
import Text from "../Text"
import Tappable from "../Tappable"

import CellText from "./components/CellText"
import CellPart from "./components/CellPart"
import EditableCell from "./components/EditableCell"
import SwitchCell from "./components/SwitchCell"

import * as styles from "./Cell.module.css"

/**
 * List row. Compound: Cell.Start / Cell.End / Cell.Part / Cell.Text /
 * Cell.Editable / Cell.Switch. Press feedback turns on automatically when the
 * row is interactive (has onClick or a non-div `as`); `tappable` forces it.
 * @param {import("react").ElementType} [props.as="div"] Root element (a, button...).
 * @param {import("react").ReactNode} [props.start] Leading slot (icon/avatar).
 * @param {import("react").ReactNode} [props.end]   Trailing slot (label/chevron).
 * @example
 * <Cell as="button" onClick={open} end={<Chevron />}>
 *   <Cell.Text title="Wallet" />
 * </Cell>
 */
const CellComponent = ({
    as: Component = "div",
    start,
    children,
    end,
    onClick,
    tappable,
    ...props
}) => {
    // A cell shows press feedback only when it does something: it has an
    // onClick or renders as an interactive element (a link/button via `as`).
    // `tappable` forces it on or off explicitly.
    const interactive =
        tappable ?? (onClick != null || Component !== "div")

    const content = (
        <>
            {start && <div className={styles.start}>{start}</div>}
            <div className={styles.body}>{children}</div>
            {end && <div className={styles.end}>{end}</div>}
        </>
    )

    if (!interactive) {
        return (
            <Component className={styles.root} onClick={onClick} {...props}>
                {content}
            </Component>
        )
    }

    return (
        <Tappable
            as={Component}
            className={styles.root}
            onClick={onClick}
            {...props}
        >
            {content}
        </Tappable>
    )
}

const CellStart = ({ type, src = null, iconType = null }) => {
    let content

    switch (type) {
        case "Image":
            content = <img src={src} alt="" className={styles.image} />
            break
        case "Icon":
            content = <div className={styles.icon}>{iconType}</div>
            break
        default:
            content = null
            break
    }

    return <>{content}</>
}

const CellEnd = ({ label, caption }) => (
    <>
        <div className={styles.label}>
            <Text variant="body" weight="regular">
                {label}
            </Text>
        </div>
        {caption && (
            <div className={styles.caption}>
                <Text variant="subheadline2" weight="regular">
                    {caption}
                </Text>
            </div>
        )}
    </>
)

CellComponent.propTypes = {
    as: PropTypes.elementType,
    start: PropTypes.node,
    children: PropTypes.node,
    end: PropTypes.node,
    onClick: PropTypes.func,
    tappable: PropTypes.bool,
}

CellStart.propTypes = {
    type: PropTypes.string,
    src: PropTypes.string,
    iconType: PropTypes.node,
}

CellEnd.propTypes = {
    label: PropTypes.string,
    caption: PropTypes.string,
}

export const Cell = Object.assign(CellComponent, {
    Start: CellStart,
    End: CellEnd,
    Part: CellPart,
    Text: CellText,
    Editable: EditableCell,
    Switch: SwitchCell,
})

export default Cell
