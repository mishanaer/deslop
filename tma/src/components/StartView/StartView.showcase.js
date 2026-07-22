import Page from "../Page"
import SectionList from "../SectionList"
import StartView from "../StartView"

import { BackButton } from "../../lib/twa"

const StartViewShowcase = () => (
    <>
        <BackButton />
        <Page>
            <SectionList>
                <SectionList.Item header="Title Only">
                    <StartView title="Welcome to Wallet" />
                </SectionList.Item>

                <SectionList.Item header="Title & Description">
                    <StartView
                        title="Set Up Your Wallet"
                        description="Create a new wallet or import an existing one to get started with secure transactions."
                    />
                </SectionList.Item>
            </SectionList>
        </Page>
    </>
)

export default StartViewShowcase
