import { useRef, Activity } from "react"
import PropTypes from "prop-types"

import { useColorScheme } from "../../hooks/useColorScheme"
import { useGradientCanvas } from "./hooks/useGradientCanvas"
import { usePatternCanvas } from "./hooks/usePatternCanvas"
import * as styles from "./GradientBackground.module.scss"

/**
 * Генерирует 4-цветный градиент на canvas как фоновое изображение
 * Основано на алгоритме градиентов Telegram
 */
function GradientBackground({
    colors,
    colorsDark = null,
    className = "",
    rotation = 0,
    intensity = 1,
    positions = null,
    patternUrl = null,
    patternIntensity = null,
    isDarkPattern = undefined,
    ...restProps
}) {
    const canvasRef = useRef(null)
    const patternCanvasRef = useRef(null)
    const containerRef = useRef(null)
    const colorScheme = useColorScheme()

    // Выбираем цвета в зависимости от темы
    const activeColors =
        colorScheme === "dark" && colorsDark ? colorsDark : colors

    // Автоматически определяем isDarkPattern на основе темы, если не указан явно
    const activeIsDarkPattern =
        isDarkPattern !== undefined ? isDarkPattern : colorScheme === "dark"

    useGradientCanvas({
        canvasRef,
        containerRef,
        activeColors,
        positions,
        rotation,
        intensity,
    })
    usePatternCanvas({
        patternCanvasRef,
        containerRef,
        patternUrl,
        activeIsDarkPattern,
    })

    const { style: restStyle, ...otherRestProps } = restProps

    // Вычисляем opacity согласно логике Telegram
    // В тёмной теме: паттерн работает как маска (destination-out), opacity применяется к градиенту
    // В светлой теме: паттерн смешивается через overlay, opacity применяется к паттерну
    const gradientOpacity =
        patternIntensity !== null && activeIsDarkPattern
            ? (() => {
                  const absIntensity = Math.abs(patternIntensity)
                  const opacityMax = Math.max(0.3, absIntensity * 0.5)
                  return opacityMax
              })()
            : null

    // В тёмной теме паттерн должен быть полностью непрозрачным (работает как маска)
    // В светлой теме opacity контролирует интенсивность паттерна
    const patternOpacity =
        patternIntensity !== null && !activeIsDarkPattern
            ? (() => {
                  const absIntensity = Math.abs(patternIntensity)
                  return absIntensity * 1
              })()
            : null

    return (
        <div
            ref={containerRef}
            className={`${styles.root} ${className}`}
            style={restStyle}
            {...otherRestProps}
        >
            <canvas
                ref={canvasRef}
                className={styles.canvas}
                style={
                    gradientOpacity !== null
                        ? {
                              "--opacity-max": gradientOpacity,
                              opacity: "var(--opacity-max)",
                          }
                        : undefined
                }
                aria-hidden="true"
            />
            <Activity mode={patternUrl ? "visible" : "hidden"}>
                <canvas
                    ref={patternCanvasRef}
                    className={`${styles.canvas} ${styles.patternCanvas} ${
                        !activeIsDarkPattern ? styles.blend : ""
                    }`}
                    style={
                        patternOpacity !== null
                            ? {
                                  "--opacity-max": patternOpacity,
                              }
                            : undefined
                    }
                    aria-hidden="true"
                />
            </Activity>
        </div>
    )
}

GradientBackground.propTypes = {
    /**
     * Массив из 4 цветов в формате hex (#RRGGBB) или rgb(r, g, b)
     * Порядок: [topRight, bottomRight, bottomLeft, topLeft]
     * Используется для светлой темы (или если colorsDark не указан)
     */
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    /**
     * Массив из 4 цветов для темной темы в формате hex (#RRGGBB) или rgb(r, g, b)
     * Порядок: [topRight, bottomRight, bottomLeft, topLeft]
     * Если не указано, используется colors для обеих тем
     */
    colorsDark: PropTypes.arrayOf(PropTypes.string),
    className: PropTypes.string,
    /**
     * Поворот градиента в градусах (0-360)
     */
    rotation: PropTypes.number,
    /**
     * Интенсивность градиента (0-1)
     */
    intensity: PropTypes.number,
    /**
     * Позиции цветов в нормализованных координатах (0-1)
     * Массив из 4 объектов с полями x и y
     * Порядок: [topRight, bottomRight, bottomLeft, topLeft]
     * Если не указано, используются значения по умолчанию из Telegram
     */
    positions: PropTypes.arrayOf(
        PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        })
    ),
    /**
     * URL изображения паттерна для наложения поверх градиента
     * Если указано, паттерн будет отрендерен на отдельном canvas поверх градиента
     */
    patternUrl: PropTypes.string,
    /**
     * Интенсивность паттерна (0-1)
     * Управляет opacity паттерна
     * Если не указано, используется 1 (полная непрозрачность)
     */
    patternIntensity: PropTypes.number,
    /**
     * Если true, паттерн работает как маска (темный режим)
     * Если false, применяется blend mode для смешивания с градиентом
     * Если не указано (undefined), автоматически определяется на основе текущей темы
     * (dark theme = true, light theme = false)
     */
    isDarkPattern: PropTypes.bool,
}

export default GradientBackground
