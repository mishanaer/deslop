import Page from "../../../components/Page"
import SectionList from "../../../components/SectionList"

import Profile from "./components/Profile"
import Assets from "./components/Assets"
import Staking from "./components/Staking"
import Collectibles from "./components/Collectibles"
import Activity from "./components/Activity"
import FAQ from "./components/FAQ"

function TONWallet() {
    return (
        <Page headerColor="131314" backgroundColor="131314">
            <div className="ton-space">
                <Profile />
                <SectionList>
                    <Assets />
                    <Staking />
                    <Collectibles />
                    <Activity />
                    <FAQ />
                </SectionList>
            </div>
        </Page>
    )
}

export default TONWallet
