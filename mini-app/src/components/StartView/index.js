import Text from "../Text"
import PropTypes from "prop-types"

const StartView = ({ title, description }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-12 px-start-view-inline py-start-view-block text-center text-foreground">
            <Text variant="title1" weight="bold">
                {title}
            </Text>
            {description && (
                <Text variant="body" weight="regular">
                    {description}
                </Text>
            )}
        </div>
    )
}

StartView.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
}
export default StartView
