import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import InitialsAvatar from "../InitialsAvatar"
import Skeleton from "../Skeleton"

// Same names as InitialsAvatar.showcase.js so the placeholder rows line up
// with the real ones once the chunk loads. userId/name are still passed to
// satisfy the required props, but under the Skeleton provider the avatar
// redacts (its gradient and initials are hidden behind the shimmer square).
const names = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Brown",
    "Diana Prince",
    "Evan Rogers",
    "Fiona Apple",
    "George Lucas",
]

const InitialsAvatarSkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item header="Colors">
                <Skeleton active>
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
                </Skeleton>
            </SectionList.Item>

            <SectionList.Item header="Size">
                <Skeleton active>
                    <Cell
                        start={
                            <InitialsAvatar userId={0} name="Alice" size={24} />
                        }
                    >
                        <Cell.Text title="24px" />
                    </Cell>
                    <Cell start={<InitialsAvatar userId={1} name="Bob Smith" />}>
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
                </Skeleton>
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default InitialsAvatarSkeleton
