import { useState } from "react"
import PropTypes from "prop-types"

import ModalView from "@components/ModalView"
import PanelHeader from "@components/PanelHeader"
import SectionList from "@components/SectionList"
import Cell from "@components/Cells"
import ImageAvatar from "@components/ImageAvatar"

import { getAssetIcon } from "@utils/AssetsMap"
import { IconCross as XmarkIcon } from "@primitives/material-symbols-react"
import { MainButton } from "@lib/twa"
import {
    DEMO_ASSETS,
    AssetListPage,
    AssetDetailPage,
    AssetInfoPage,
} from "./DemoPages"

const Modals = ({ modals, handlers }) => {
    const [asset, setAsset] = useState(DEMO_ASSETS[0])

    return (
        <>
            <ModalView
                key="tray"
                isOpen={modals.tray}
                onClose={handlers.tray.close}
                style={{
                    backgroundColor: "var(--background)",
                }}
            >
                <ModalView.Page id="list">
                    <AssetListPage onSelect={setAsset} />
                </ModalView.Page>
                <ModalView.Page id="detail">
                    <AssetDetailPage asset={asset} />
                </ModalView.Page>
                <ModalView.Page id="info">
                    <AssetInfoPage asset={asset} />
                </ModalView.Page>
            </ModalView>
            <ModalView
                key="simple"
                isOpen={modals.simple}
                onClose={handlers.simple.close}
                style={{
                    backgroundColor: "var(--background)",
                }}
            >
                <PanelHeader
                    left={<XmarkIcon />}
                    onLeft={handlers.simple.close}
                >
                    Simple Modal
                </PanelHeader>
                <SectionList>
                    <SectionList.Item>
                        {DEMO_ASSETS.map((item) => (
                            <Cell
                                key={item.symbol}
                                start={
                                    <ImageAvatar
                                        src={getAssetIcon(item.symbol)}
                                    />
                                }
                            >
                                <Cell.Text
                                    title={item.name}
                                    description={item.amount}
                                    bold
                                />
                            </Cell>
                        ))}
                    </SectionList.Item>
                </SectionList>
                <MainButton text="Confirm" onClick={handlers.simple.close} />
            </ModalView>
        </>
    )
}

Modals.propTypes = {
    modals: PropTypes.shape({
        tray: PropTypes.bool,
        simple: PropTypes.bool,
    }),
    handlers: PropTypes.shape({
        tray: PropTypes.shape({
            close: PropTypes.func,
        }),
        simple: PropTypes.shape({
            close: PropTypes.func,
        }),
    }),
}

export default Modals
