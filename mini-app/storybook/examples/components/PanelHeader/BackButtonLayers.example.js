import { useEffect, useState } from "react"
import PropTypes from "prop-types"

import { IconArrowBackIosNew as ArrowBackIosNewIcon } from "@primitives/material-symbols-react"

import { GlassBorder } from "@components/GlassEffect"
import Page from "@components/Page"
import Text from "@components/Text"
import { BackButton } from "@lib/twa"

import HeaderButton from "@components/PanelHeader/HeaderButton"
import * as appBarStyles from "@components/AppBar/AppBar.module.css"

const layers = [
    {
        number: "01",
        name: "Button frame",
        selector: ".button.icon",
        tokens: ["--ui-radius-22"],
        details: "44 × 44px · border 0 · padding 0",
        purpose: "Геометрия кнопки и её интерактивная область.",
        preview: "frame",
    },
    {
        number: "02",
        name: "Glass surface",
        selector: ".regular",
        tokens: ["--primary-5"],
        details: "background · backdrop-filter blur(8px)",
        purpose: "Полупрозрачная стеклянная подложка кнопки.",
        preview: "surface",
    },
    {
        number: "03",
        name: "Soft shadow",
        selector: ".regular",
        tokens: ["--primary-5"],
        details: "box-shadow 0 2px 10px 0",
        purpose: "Отделяет кнопку от контента страницы.",
        preview: "shadow",
    },
    {
        number: "04",
        name: "Glass rim",
        selector: ".glassBorder.muted",
        tokens: ["--primary-20"],
        details: "1px mask · linear-gradient(8deg) · normal blend",
        purpose: "Тонкий градиентный кант по краю стекла.",
        preview: "rim",
    },
    {
        number: "05",
        name: "Arrow icon",
        selector: ".content .backIcon",
        tokens: ["--primary"],
        details: "Material Symbols Rounded · 24 × 24px · translateX(-2px)",
        purpose: "Контент кнопки с оптической компенсацией стрелки.",
        preview: "icon",
    },
]

const readToken = (name) =>
    getComputedStyle(document.body).getPropertyValue(name).trim() ||
    getComputedStyle(document.documentElement).getPropertyValue(name).trim()

const useTokenValues = () => {
    const [values, setValues] = useState({})

    useEffect(() => {
        const update = () => {
            setValues(
                Object.fromEntries(
                    layers.flatMap((layer) => layer.tokens).map((token) => [
                        token,
                        readToken(token),
                    ])
                )
            )
        }

        update()
        const observer = new MutationObserver(update)
        observer.observe(document.documentElement, { attributes: true })
        observer.observe(document.body, { attributes: true })
        return () => observer.disconnect()
    }, [])

    return values
}

const buttonShape = {
    position: "relative",
    width: 44,
    height: 44,
    borderRadius: "var(--ui-radius-22)",
}

const LayerPreview = ({ type }) => (
    <div className="relative col-span-3 grid min-h-76 place-items-center overflow-visible rounded-16 bg-background max-md:col-span-11 max-md:col-start-2">
        {type === "frame" && (
            <div
                style={{
                    ...buttonShape,
                    border: "1px dashed var(--primary-20)",
                }}
            />
        )}
        {type === "surface" && (
            <div
                style={{
                    ...buttonShape,
                    background: "var(--primary-5)",
                    backdropFilter: "blur(8px)",
                }}
            />
        )}
        {type === "shadow" && (
            <div
                style={{
                    ...buttonShape,
                    background: "var(--primary-5)",
                    boxShadow: "0 2px 10px 0 var(--primary-5)",
                }}
            />
        )}
        {type === "rim" && (
            <div style={buttonShape}>
                <GlassBorder muted />
            </div>
        )}
        {type === "icon" && (
            <ArrowBackIosNewIcon
                size={24}
                style={{ color: "var(--primary)", transform: "translateX(-2px)" }}
            />
        )}
    </div>
)

LayerPreview.propTypes = {
    type: PropTypes.string,
}

const Token = ({ name, value }) => (
    <div className="inline-flex min-w-0 items-center gap-6 rounded-full bg-elevation-5 px-8 py-4 font-mono text-caption text-primary">
        <span
            className="shrink-0 rounded-full border border-separator"
            style={{ width: 10, height: 10, background: `var(${name})` }}
        />
        <code>{name}</code>
        <span className="text-elevation-50">{value || "—"}</span>
    </div>
)

Token.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
}

const BackButtonLayersExample = () => {
    const values = useTokenValues()

    return (
        <>
            <BackButton />
            <Page>
                <main className="flex flex-col gap-section p-content">
                    <section className="grid gap-16 rounded-section bg-elevation-1 p-20">
                        <div className="grid gap-6">
                            <Text variant="title2" weight="bold">
                                Back button, разобранный по слоям
                            </Text>
                            <Text variant="body" className="text-muted">
                                Реальная browser-кнопка из AppBar. Значения
                                токенов следуют за текущей темой.
                            </Text>
                        </div>
                        <div className="flex min-h-76 items-center justify-center rounded-16 bg-background">
                            <HeaderButton ariaLabel="Back preview" title="Back">
                                <ArrowBackIosNewIcon
                                    className={appBarStyles.backIcon}
                                />
                            </HeaderButton>
                        </div>
                    </section>

                    <section className="grid overflow-hidden rounded-section bg-elevation-1">
                        {layers.map((layer, index) => (
                            <article
                                className="grid grid-cols-12 items-stretch gap-16 px-20 py-16"
                                key={layer.number}
                                style={
                                    index === 0
                                        ? undefined
                                        : {
                                              borderTop:
                                                  "0.33px solid var(--primary-20)",
                                          }
                                }
                            >
                                <div className="col-span-1 self-start font-mono text-caption text-elevation-40">
                                    {layer.number}
                                </div>
                                <LayerPreview type={layer.preview} />
                                <div className="col-span-8 grid min-w-0 content-center gap-8 max-md:col-span-11 max-md:col-start-2">
                                    <div className="flex flex-wrap items-baseline gap-8">
                                        <Text variant="title3" weight="semibold">
                                            {layer.name}
                                        </Text>
                                        <code className="font-mono text-caption text-elevation-50">
                                            {layer.selector}
                                        </code>
                                    </div>
                                    <Text variant="body" className="text-muted">
                                        {layer.purpose}
                                    </Text>
                                    <div className="flex flex-wrap gap-6">
                                        {layer.tokens.map((token) => (
                                            <Token
                                                key={token}
                                                name={token}
                                                value={values[token]}
                                            />
                                        ))}
                                    </div>
                                    <code className="font-mono text-caption text-elevation-50">
                                        {layer.details}
                                    </code>
                                </div>
                            </article>
                        ))}
                    </section>
                </main>
            </Page>
        </>
    )
}

export default BackButtonLayersExample
