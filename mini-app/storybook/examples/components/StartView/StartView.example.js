import Page from "@components/Page"
import SectionList from "@components/SectionList"
import StartView from "@components/StartView"

import { BackButton } from "@lib/twa"

const StartViewExample = () => (
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

export default StartViewExample
