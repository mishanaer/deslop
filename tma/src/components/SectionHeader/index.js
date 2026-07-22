import PropTypes from "prop-types"

import { cn } from "@utils/cn"

import Text from "../Text"

const baseClassName =
    "flex justify-between gap-compact px-content py-10 text-section"

function SectionHeader({ type, title, value, ...props }) {
    switch (type) {
        case "Headline":
            return (
                <div
                    className={cn(baseClassName, "text-foreground")}
                    {...props}
                >
                    <Text variant="title3" weight="bold">
                        {title}
                    </Text>
                    {value && (
                        <Text variant="title3" weight="bold">
                            {value}
                        </Text>
                    )}
                </div>
            )
        case "Footer":
            return (
                <div className={baseClassName} {...props}>
                    <Text variant="footnote">{title}</Text>
                </div>
            )
        default:
            return (
                <div className={baseClassName} {...props}>
                    <Text variant="body" weight="semibold">
                        {title}
                    </Text>
                    {value && <Text variant="footnote">{value}</Text>}
                </div>
            )
    }
}

SectionHeader.propTypes = {
    type: PropTypes.string,
    title: PropTypes.string.isRequired,
    value: PropTypes.string,
}
export default SectionHeader
