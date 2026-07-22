import { useState, useRef } from "react"
import * as m from "motion/react-m"
import { AnimatePresence } from "motion/react"
import WebApp from "../../../../../lib/twa"

import * as styles from "./Assets.module.scss"
import SectionList from "../../../../../components/SectionList"
import Cell from "../../../../../components/Cells"
import ImageAvatar from "../../../../../components/ImageAvatar"
import { getAssetIcon } from "../../../../../utils/AssetsMap"
import { formatToTwoDecimals } from "../../../../../utils/number"
import AnimatedCellMoreButton from "../AnimatedCellMoreButton"
import assets from "../../data/assets.json"

export default function Assets() {
    const AssetsRef = useRef(null)
    const [showSmallAssets, setShowSmallAssets] = useState(false)

    const priorityAssets = assets.filter(
        (asset) => asset.id === 0 || asset.id === 1
    )
    const otherAssets = assets.filter(
        (asset) => asset.id !== 0 && asset.id !== 1
    )

    const largeAssets = [
        ...priorityAssets,
        ...otherAssets
            .values()
            .filter((asset) => asset.rate * asset.value >= 1)
            .toArray()
            .toSorted((a, b) => b.rate * b.value - a.rate * a.value),
    ]

    const smallAssets = otherAssets
        .values()
        .filter((asset) => asset.rate * asset.value < 1)
        .toArray()
        .toSorted((a, b) => b.rate * b.value - a.rate * a.value)

    return (
        <SectionList.Item ref={AssetsRef}>
            {largeAssets.map((asset, index) => (
                <Cell
                    start={<ImageAvatar src={getAssetIcon(asset.ticker)} />}
                    end={
                        <Cell.Text
                            title={`$${formatToTwoDecimals(asset.rate * asset.value)}`}
                            description={`${asset.value} ${asset.ticker}`}
                        />
                    }
                    key={`asset-${index}`}
                >
                    <Cell.Text
                        title={asset.name}
                        description={`$${asset.rate}`}
                        bold
                    />
                </Cell>
            ))}

            {smallAssets.length > 0 && (
                <>
                    <AnimatePresence inherit={false}>
                        {showSmallAssets && (
                            <m.div
                                initial={{ height: 0, opacity: 0, scale: 0.97 }}
                                animate={{
                                    height: "auto",
                                    opacity: 1,
                                    scale: 1,
                                }}
                                exit={{ height: 0, opacity: 0, scale: 0.97 }}
                                transition={{
                                    duration: 0.25,
                                    ease: [0.26, 0.08, 0.25, 1],
                                }}
                                className={styles.smallAssets}
                            >
                                {smallAssets.map((asset, index) => (
                                    <Cell
                                        start={
                                            <Cell.Start
                                                type="Image"
                                                src={getAssetIcon(asset.ticker)}
                                            />
                                        }
                                        end={
                                            <Cell.Text
                                                title={`$${formatToTwoDecimals(asset.rate * asset.value)}`}
                                                description={`${asset.value} ${asset.ticker}`}
                                            />
                                        }
                                        key={`asset-${index}`}
                                    >
                                        <Cell.Text
                                            title={asset.name}
                                            description={`$${asset.rate}`}
                                            bold
                                        />
                                    </Cell>
                                ))}
                            </m.div>
                        )}
                    </AnimatePresence>
                    <AnimatedCellMoreButton
                        state={showSmallAssets}
                        onClick={() =>
                            setShowSmallAssets((s) => {
                                WebApp.HapticFeedback.selectionChanged()
                                return !s
                            })
                        }
                    />
                </>
            )}
        </SectionList.Item>
    )
}
