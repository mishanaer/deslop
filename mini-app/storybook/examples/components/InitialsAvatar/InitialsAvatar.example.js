import Page from "@components/Page"
import SectionList from "@components/SectionList"
import Cell from "@components/Cells"
import InitialsAvatar from "@components/InitialsAvatar"

import { BackButton } from "@lib/twa"

const names = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Brown",
    "Diana Prince",
    "Evan Rogers",
    "Fiona Apple",
    "George Lucas",
]

const InitialsAvatarExample = () => (
    <>
        <BackButton />
        <Page>
            <SectionList>
                <SectionList.Item header="Colors">
                    {names.map((name, i) => (
                        <Cell
                            key={name}
                            start={<InitialsAvatar userId={i} name={name} />}
                        >
                            <Cell.Text
                                title={name}
                                description={`userId: ${i}`}
                            />
                        </Cell>
                    ))}
                </SectionList.Item>

                <SectionList.Item header="Size">
                    <Cell
                        start={
                            <InitialsAvatar userId={0} name="Alice" size={24} />
                        }
                    >
                        <Cell.Text title="24px" />
                    </Cell>
                    <Cell
                        start={<InitialsAvatar userId={1} name="Bob Smith" />}
                    >
                        <Cell.Text title="40px" description="Default" />
                    </Cell>
                    <Cell
                        start={
                            <InitialsAvatar
                                userId={2}
                                name="Charlie Brown"
                                size={56}
                            />
                        }
                    >
                        <Cell.Text title="56px" />
                    </Cell>
                </SectionList.Item>
            </SectionList>
        </Page>
    </>
)

export default InitialsAvatarExample
