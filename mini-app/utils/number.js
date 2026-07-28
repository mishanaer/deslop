export function formatToTwoDecimals(number) {
    return Number(number.toFixed(2))
}

export function generateRandomBalance(max = 2000) {
    return (Math.random() * max).toFixed(2)
}

export function formatPercentage(percentage) {
    return `${percentage?.toFixed(2)}%`
}

// Cents from $1, four significant digits below (micro-cap prices).
export function formatPrice(price) {
    if (typeof price !== "number") return price
    const options =
        price >= 1
            ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            : { maximumSignificantDigits: 4 }
    return price.toLocaleString("en-US", options)
}

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
