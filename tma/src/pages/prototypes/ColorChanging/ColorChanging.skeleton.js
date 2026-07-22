import { RegularButton } from "../../../components/Button"
import Skeleton from "../../../components/Skeleton"

import * as styles from "./ColorChanging.module.scss"

// ColorChanging (catalog title "Background Tests") renders no <Page> — just a
// full-height centered filled button. Reuse the real button so the placeholder
// keeps its exact shape (fill, radius, height); the Skeleton provider redacts
// only its label into a shimmer bar, matching the Button showcase skeleton.
const BackgroundTestsSkeleton = () => (
    <Skeleton active>
        <div className={styles.root}>
            <RegularButton variant="filled" label="Change Color" />
        </div>
    </Skeleton>
)

export default BackgroundTestsSkeleton
