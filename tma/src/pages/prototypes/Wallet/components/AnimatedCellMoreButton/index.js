import PropTypes from "prop-types"
import * as m from "motion/react-m"
import * as cellStyles from "../../../../../components/Cells/Cell.module.css"
import Text from "../../../../../components/Text"
import { useSkin } from "../../../../../hooks/DeviceProvider"
import { getAssetIcon } from "../../../../../utils/AssetsMap"
import { TRANSITIONS } from "../../../../../utils/animations"
import EyeOffIcon from "@deslop/primitives/icons/eye-off.svg?react"

export default function AnimatedCellMoreButton({ onClick, state }) {
    const { isApple } = useSkin()
    const transition = TRANSITIONS.MATERIAL_STANDARD

    const iconSize = isApple ? 40 : 42
    const jettonsSize = isApple
        ? { position: "relative", width: "40px", height: "40px" }
        : {
              position: "relative",
              width: "42px",
              height: "42px",
              marginLeft: "-6px",
          }

    // HMSTR иконка — при expanded исчезает
    const hmstrStyles = isApple
        ? {
              collapsed: { scale: 0.6, top: "-6px", left: "-6px", opacity: 1 },
              expanded: { scale: 1, top: 0, left: 0, opacity: 0 },
          }
        : {
              collapsed: { scale: 0.6, top: "-6px", left: 0, opacity: 1 },
              expanded: { scale: 1, top: 0, left: "6px", opacity: 0 },
          }

    // NOT иконка — при expanded исчезает
    const notStyles = isApple
        ? {
              collapsed: { scale: 0.6, top: "6px", left: "6px", opacity: 1 },
              expanded: { scale: 0, top: 0, left: 0, opacity: 0 },
          }
        : {
              collapsed: { scale: 0.6, top: "6px", left: "12px", opacity: 1 },
              expanded: { scale: 0, top: 0, left: "18px", opacity: 0 },
          }

    const jettons = [
        { src: getAssetIcon("HMSTR"), styles: hmstrStyles, zIndex: 2 },
        { src: getAssetIcon("NOT"), styles: notStyles, zIndex: 1 },
    ]

    const variants = {
        TextMoreAssets: {
            collapsed: { opacity: 1, top: "calc(50% - 11px)" },
            expanded: { opacity: 0, top: "calc(50% - 20px)" },
        },
        TextHideLowBalances: {
            collapsed: { opacity: 0, top: "calc(50% - 20px)" },
            expanded: { opacity: 1, top: "calc(50% - 11px)" },
        },
    }

    return (
        <m.div onClick={onClick}>
            <div className={cellStyles.root}>
                <div className={cellStyles.start}>
                    <div className="assetIcon" style={jettonsSize}>
                        <EyeOffIcon
                            className={cellStyles.image}
                            style={{
                                position: "absolute",
                                zIndex: 3,
                                width: 24,
                                height: 24,
                                top: state ? 8 : 2,
                                left: isApple
                                    ? state
                                        ? 8
                                        : 2
                                    : state
                                      ? 9
                                      : 3,
                                opacity: state ? 1 : 0,
                                transform: `scale(${state ? 1 : 0.6})`,
                                transition: "all 0.3s ease",
                            }}
                        />
                        {jettons.map((jetton, index) => {
                            const s = state
                                ? jetton.styles.expanded
                                : jetton.styles.collapsed
                            return (
                                <img
                                    src={jetton.src}
                                    alt=""
                                    className={cellStyles.image}
                                    style={{
                                        position: "absolute",
                                        zIndex: jetton.zIndex,
                                        width: iconSize,
                                        height: iconSize,
                                        top: s.top,
                                        left: s.left,
                                        opacity: s.opacity,
                                        transform: `scale(${s.scale})`,
                                        transition: "all 0.3s ease",
                                    }}
                                    key={`stack-asset-${index}`}
                                />
                            )
                        })}
                    </div>
                </div>
                <div
                    className={cellStyles.body}
                    style={{ position: "relative" }}
                >
                    <m.div
                        variants={variants.TextMoreAssets}
                        transition={transition}
                        animate={state ? "expanded" : "collapsed"}
                        style={{
                            transformOrigin: "0% 50%",
                            position: "absolute",
                        }}
                    >
                        <Text variant="body" weight="medium">
                            More Assets
                        </Text>
                    </m.div>
                    <m.div
                        variants={variants.TextHideLowBalances}
                        transition={transition}
                        animate={state ? "expanded" : "collapsed"}
                        initial={false}
                        style={{
                            transformOrigin: "0% 50%",
                            position: "absolute",
                        }}
                    >
                        <Text variant="body" weight="medium">
                            Hide Low Balances
                        </Text>
                    </m.div>
                </div>
            </div>
        </m.div>
    )
}

AnimatedCellMoreButton.propTypes = {
    onClick: PropTypes.func,
    state: PropTypes.bool,
}
