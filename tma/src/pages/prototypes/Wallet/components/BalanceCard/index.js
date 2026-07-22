import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Calligraph } from "calligraph"
import * as m from "motion/react-m"
import { AnimatePresence } from "motion/react"

import Train from "../../../../../components/Train"
import Text from "../../../../../components/Text"
import Badge from "../../../../../components/Text/Badge"
import ParticleEffect from "../../../../../components/ParticleEffect"
import { generateRandomBalance } from "../../../../../utils/number"

import * as styles from "./BalanceCard.module.css"

const CHANGE_DATA = {
    today: {
        value: "+0.82",
        percent: "0.11%",
        label: "Today",
        arrowDirection: "up",
    },
    allTime: {
        value: "+124.56",
        percent: "12.34%",
        label: "All Time",
        arrowDirection: "up",
    },
}

const crossFadeTransition = {
    duration: 0.1,
    ease: [0.32, 0, 0.67, 0],
}

/**
 * BalanceCard - универсальный компонент для отображения баланса
 *
 * @param {string} label - Текст лейбла (например, "Balance" или "TON Wallet Balance")
 * @param {string} initialBalance - Начальное значение баланса
 * @param {"default" | "overlay"} variant - Визуальный вариант: default (светлый фон) или overlay (для тёмного фона)
 * @param {React.ReactNode} actions - Кнопки действий (опционально)
 * @param {string} className - Дополнительные CSS классы
 */
export default function BalanceCard({
    label,
    initialBalance = "0.00",
    variant = "default",
    actions,
    className,
}) {
    const [balance, setBalance] = useState(initialBalance)
    const [hidden, setHidden] = useState(false)
    const [isToday, setIsToday] = useState(true)

    const changeData = isToday ? CHANGE_DATA.today : CHANGE_DATA.allTime

    useEffect(() => {
        const updateBalance = () => {
            if (!hidden) {
                const randomBalance = generateRandomBalance()
                setBalance(randomBalance)
            }
        }

        const interval = setInterval(updateBalance, 1000)

        return () => clearInterval(interval)
    }, [hidden])

    const variantClass =
        variant === "overlay" ? styles.cardOverlay : styles.cardDefault

    return (
        <div
            className={[styles.card, variantClass, className]
                .filter(Boolean)
                .join(" ")}
        >
            <div className={styles.data}>
                <Text
                    variant="subheadline2"
                    weight="semibold"
                    className={styles.label}
                >
                    {label}
                </Text>
                <ParticleEffect
                    className={styles.amount}
                    hidden={hidden}
                    color={
                        variant === "overlay"
                            ? "var(--ui-static-white)"
                            : undefined
                    }
                    onClick={() => setHidden((s) => !s)}
                >
                    <span className={styles.prefix}>$</span>
                    <Calligraph variant="number" animation="smooth">
                        {balance}
                    </Calligraph>
                </ParticleEffect>
                <Train
                    divider="space"
                    onClick={() => setIsToday((prev) => !prev)}
                    style={{ cursor: "pointer" }}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <m.span
                            key={`value-${isToday}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={crossFadeTransition}
                        >
                            <Text
                                variant="subheadline2"
                                weight="semibold"
                                style={{ color: "var(--text-confirm-color)" }}
                            >
                                {changeData.value}
                            </Text>
                        </m.span>
                    </AnimatePresence>
                    <AnimatePresence mode="wait" initial={false}>
                        <m.span
                            key={`percent-${isToday}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={crossFadeTransition}
                        >
                            <Badge
                                textVariant="subheadline2"
                                weight="semibold"
                                arrow={{
                                    direction: changeData.arrowDirection,
                                }}
                                variant="tinted"
                                circled
                                style={{
                                    color: "var(--text-confirm-color)",
                                }}
                            >
                                {changeData.percent}
                            </Badge>
                        </m.span>
                    </AnimatePresence>
                    <AnimatePresence mode="wait" initial={false}>
                        <m.span
                            key={`label-${isToday}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={crossFadeTransition}
                        >
                            <Text
                                variant="subheadline2"
                                weight="semibold"
                                style={{
                                    color: "var(--tg-theme-subtitle-text-color)",
                                }}
                            >
                                {changeData.label}
                            </Text>
                        </m.span>
                    </AnimatePresence>
                </Train>
            </div>
            {actions && <div className={styles.actions}>{actions}</div>}
        </div>
    )
}

BalanceCard.propTypes = {
    label: PropTypes.string.isRequired,
    initialBalance: PropTypes.string,
    variant: PropTypes.oneOf(["default", "overlay"]),
    actions: PropTypes.node,
    className: PropTypes.string,
}
