import { useEffect, useState } from "react"
import PropTypes from "prop-types"

import {
    IconChart as ChartIcon,
    IconWallet as WalletIcon,
} from "@primitives/material-symbols-react"

import Page from "@components/Page"
import Text from "@components/Text"
import TabBar from "@components/TabBar"
import { useAppearance } from "@hooks/useColorScheme"
import { BackButton } from "@lib/twa"

const tabs = [
    { label: "Wallet", icon: <WalletIcon /> },
    { label: "Trade", icon: <ChartIcon /> },
]

const layers = [
    {
        number: "01",
        name: "Page fade",
        selector: ".gradient",
        tokens: ["--page-background", "--background"],
        details: "linear-gradient · opacity 0 → 0.9",
        purpose: "Растворяет TabBar в фоне страницы снизу.",
        preview: "fade",
    },
    {
        number: "02",
        name: "Base surface",
        selector: ".root",
        tokens: ["--white"],
        details:
            "opacity 10% · blur(16px) · shadow 0 8px 20px primary-20 (light only)",
        purpose: "Основная стеклянная капсула компонента.",
        preview: "surface",
    },
    {
        number: "03",
        name: "Active segment",
        selector: ".clipPathContainer",
        tokens: ["--primary-8"],
        details: "clip-path · animated spring",
        purpose: "Движущаяся подложка выбранного таба.",
        preview: "selection",
    },
    {
        number: "04",
        name: "Inactive content",
        selector: ".tab",
        tokens: ["--primary-90"],
        details: "color + fill",
        purpose: "Иконка и подпись невыбранного таба.",
        preview: "inactive",
    },
    {
        number: "05",
        name: "Active content",
        selector: ".tab.active",
        tokens: ["--accent-orange"],
        details: "multiply (light) · normal (dark)",
        purpose: "Акцентные иконка и подпись выбранного таба.",
        preview: "active",
    },
]

const exampleAccentStyle = {
    "--tab-bar-active-color": "var(--accent-orange)",
}

const fixedTabBarStyle = {
    ...exampleAccentStyle,
    height: "calc(106px + env(safe-area-inset-bottom))",
}

const capsuleStyle = {
    position: "absolute",
    inset: "18px var(--ui-space-8)",
    borderRadius: "var(--ui-radius-full)",
}

const previewStyle = {
    minHeight: 76,
}

const readToken = (name) =>
    getComputedStyle(document.body).getPropertyValue(name).trim() ||
    getComputedStyle(document.documentElement).getPropertyValue(name).trim()

const useTokenValues = () => {
    const [values, setValues] = useState({})

    useEffect(() => {
        const update = () => {
            const next = {}
            for (const layer of layers) {
                for (const token of layer.tokens) next[token] = readToken(token)
            }
            setValues(next)
        }

        update()
        const observer = new MutationObserver(update)
        observer.observe(document.documentElement, { attributes: true })
        observer.observe(document.body, { attributes: true })
        return () => observer.disconnect()
    }, [])

    return values
}

const LayerPreview = ({ type }) => {
    const { colorScheme } = useAppearance()
    const isContent = type === "inactive" || type === "active"
    const containerStyle =
        type === "fade"
            ? {
                  ...previewStyle,
                  background:
                      "linear-gradient(to bottom, transparent, var(--background))",
              }
            : previewStyle

    return (
        <div
            className={`relative col-span-3 self-center overflow-hidden rounded-16 bg-background max-md:col-span-11 max-md:col-start-2 ${isContent ? "grid place-items-center" : ""}`}
            style={containerStyle}
        >
            {type === "surface" && (
                <div
                    style={{
                        ...capsuleStyle,
                        backdropFilter: "saturate(300%) blur(16px)",
                        boxShadow:
                            colorScheme === "dark"
                                ? "none"
                                : "0 8px 20px var(--primary-20)",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "inherit",
                            background: "var(--white)",
                            opacity: 0.1,
                        }}
                    />
                </div>
            )}
            {type === "selection" && (
                <div
                    style={{
                        ...capsuleStyle,
                        right: "50%",
                        background: "var(--primary-8)",
                    }}
                />
            )}
            {isContent && (
                <div
                    className="grid justify-items-center gap-2 text-caption"
                    style={{
                        color:
                            type === "active"
                                ? "var(--tab-bar-active-color, var(--accent-green))"
                                : "var(--primary-90)",
                        mixBlendMode:
                            type === "active" ? "multiply" : "normal",
                    }}
                >
                    {type === "active" ? (
                        <ChartIcon size={28} />
                    ) : (
                        <WalletIcon size={28} />
                    )}
                    <span>{type === "active" ? "Trade" : "Wallet"}</span>
                </div>
            )}
        </div>
    )
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

const TabBarLayersExample = () => {
    const values = useTokenValues()

    return (
        <>
            <BackButton />
            <Page>
                <main
                    className="flex flex-col gap-section p-content"
                    style={exampleAccentStyle}
                >
                    <section className="overflow-hidden rounded-section bg-elevation-1">
                        <div className="grid gap-6 p-20">
                            <Text variant="title2" weight="bold">
                                TabBar, разобранный по слоям
                            </Text>
                            <Text variant="body" className="text-muted">
                                Слои перечислены от фона страницы к активному
                                контенту. Значения токенов следуют за текущей
                                темой.
                            </Text>
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
            <div
                className="pointer-events-none fixed inset-x-0 bottom-0 z-100"
                style={fixedTabBarStyle}
            >
                <div className="pointer-events-auto">
                    <TabBar tabs={tabs} />
                </div>
            </div>
        </>
    )
}

LayerPreview.propTypes = {
    type: PropTypes.string.isRequired,
}

Token.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
}

export default TabBarLayersExample
