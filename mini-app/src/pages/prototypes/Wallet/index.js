import * as styles from "./Wallet.module.css"
import Page from "../../../components/Page"
import SectionList from "../../../components/SectionList"

import Balance from "./components/Balance"
import ActionButtons from "./components/ActionButtons"
import Assets from "./components/Assets"
import TransactionList from "./components/TransactionList"

function ImagePlayground() {
    return (
        <SectionList.Item header="Image Playground">
            <div className={styles.imagePlayground}></div>
        </SectionList.Item>
    )
}

function Spacer() {
    return <div className={styles.spacer}></div>
}

function Wallet() {
    return (
        <Page mode="primary">
            <div className={styles.wallet}>
                <Balance />
                <ActionButtons />
                <Spacer />
                <SectionList>
                    <Assets />
                    <TransactionList />
                    <ImagePlayground />
                </SectionList>
            </div>
        </Page>
    )
}

export default Wallet
