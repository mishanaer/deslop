import Page from "../Page"
import SectionList from "../SectionList"
import { RegularButton } from "../Button"
import Skeleton from "../Skeleton"

// Matches the button-wrapper layout used by the showcase so the placeholder
// buttons line up exactly with the loaded screen.
const wrapperStyle = {
    padding: "12px var(--side-padding)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
}

// Loading placeholder for the Snackbar screen. The resting screen is three
// sections of trigger buttons; the snackbars themselves only appear on tap, so
// only the button stacks are mirrored. Section headers stay solid outside the
// Skeleton provider; each button's label redacts into a shimmer bar, with the
// real labels giving the varied widths of a genuine control list.
const SnackbarSkeleton = () => (
    <Page>
        <SectionList>
            <SectionList.Item header="Bottom">
                <Skeleton active>
                    <div style={wrapperStyle}>
                        <RegularButton variant="filled" label="Default" />
                        <RegularButton variant="filled" label="Hard" />
                        <RegularButton
                            variant="outlined"
                            label="Persistent (no timer)"
                        />
                    </div>
                </Skeleton>
            </SectionList.Item>

            <SectionList.Item header="Top">
                <Skeleton active>
                    <div style={wrapperStyle}>
                        <RegularButton variant="filled" label="From Top" />
                    </div>
                </Skeleton>
            </SectionList.Item>

            <SectionList.Item header="Type">
                <Skeleton active>
                    <div style={wrapperStyle}>
                        <RegularButton
                            variant="filled"
                            label="Success (haptic)"
                        />
                        <RegularButton
                            variant="filled"
                            label="Error (haptic + shake)"
                        />
                        <RegularButton
                            variant="outlined"
                            label="Warning (haptic)"
                        />
                    </div>
                </Skeleton>
            </SectionList.Item>
        </SectionList>
    </Page>
)

export default SnackbarSkeleton
