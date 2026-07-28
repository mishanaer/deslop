import { forwardRef } from "react"

import { useSkin } from "../../hooks/DeviceProvider"

import { AppleTextField } from "./AppleTextField"
// import { MaterialTextField } from "./MaterialTextField"

export const TextField = forwardRef((props, ref) => {
    const { isApple } = useSkin()
    if (isApple) {
        return <AppleTextField {...props} ref={ref} />
    }

    // return <MaterialTextField {...props} ref={ref} />
    return <AppleTextField {...props} ref={ref} />
})

TextField.propTypes = {
    // Пропсы пробрасываются, можно уточнить при необходимости
}
export default TextField
