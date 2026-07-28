import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import * as m from "motion/react-m"
import { useReducedMotion } from "motion/react"
import WebApp from "../../lib/twa"
import { SPRING } from "../../utils/animations"
import Snackbar, { triggerShape } from "./Snackbar"
import * as styles from "./Snackbar.module.css"

const DEFAULT_DURATION = 4000
const SWIPE_OFFSET_THRESHOLD = 100
const SWIPE_VELOCITY_THRESHOLD = 500
const TYPES = ["success", "error", "warning"]

const triggerHaptic = (type) => {
    if (!type) return
    try {
        WebApp.HapticFeedback?.notificationOccurred(type)
    } catch {
        // older clients may not support HapticFeedback
    }
}

const SnackbarItem = ({ item, onDismiss }) => {
    const {
        id,
        icon,
        title,
        description,
        link,
        action,
        position = "bottom",
        duration = DEFAULT_DURATION,
        type,
    } = item

    const reduceMotion = useReducedMotion()
    const [isDragging, setIsDragging] = useState(false)
    const [exitDirection, setExitDirection] = useState(0)

    const dismiss = () => onDismiss(id)

    useEffect(() => {
        triggerHaptic(type)
    }, [type])

    useEffect(() => {
        if (!duration || isDragging) return undefined
        const timer = setTimeout(dismiss, duration)
        return () => clearTimeout(timer)
    }, [duration, isDragging, dismiss])

    const slideOffset = position === "top" ? -32 : 32
    const isError = type === "error"

    const initial = reduceMotion
        ? { opacity: 0 }
        : { opacity: 0, y: slideOffset, scale: 0.96 }

    const animate = reduceMotion
        ? { opacity: 1 }
        : {
              opacity: 1,
              y: 0,
              scale: 1,
              x: isError ? [0, -10, 10, -7, 7, -3, 3, 0] : 0,
              transition: {
                  default: SPRING.SNACKBAR,
                  ...(isError && {
                      x: { duration: 0.45, ease: "easeOut", delay: 0.18 },
                  }),
              },
          }

    const exit = reduceMotion
        ? { opacity: 0, transition: { duration: 0.15 } }
        : {
              opacity: 0,
              x: exitDirection * 400,
              y: exitDirection === 0 ? slideOffset : 0,
              transition: { duration: 0.2, ease: "easeOut" },
          }

    const handleDragEnd = (_, info) => {
        setIsDragging(false)
        const offset = info.offset.x
        const velocity = info.velocity.x
        const shouldDismiss =
            Math.abs(offset) > SWIPE_OFFSET_THRESHOLD ||
            Math.abs(velocity) > SWIPE_VELOCITY_THRESHOLD
        if (shouldDismiss) {
            setExitDirection(offset >= 0 ? 1 : -1)
            dismiss()
        }
    }

    const wrapTrigger = (trigger) => {
        if (!trigger) return undefined
        return {
            ...trigger,
            onClick: () => {
                trigger.onClick?.()
                dismiss()
            },
        }
    }

    return (
        <m.div
            className={styles.item}
            initial={initial}
            animate={animate}
            exit={exit}
            layout
            drag={reduceMotion ? false : "x"}
            dragSnapToOrigin
            dragElastic={0.6}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
        >
            <Snackbar
                icon={icon}
                title={title}
                description={description}
                link={wrapTrigger(link)}
                action={wrapTrigger(action)}
            />
        </m.div>
    )
}

SnackbarItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        icon: PropTypes.node,
        title: PropTypes.node.isRequired,
        description: PropTypes.node,
        link: triggerShape,
        action: triggerShape,
        position: PropTypes.oneOf(["top", "bottom"]),
        duration: PropTypes.number,
        type: PropTypes.oneOf(TYPES),
    }).isRequired,
    onDismiss: PropTypes.func.isRequired,
}

export default SnackbarItem
