const priceFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
})

export function formatPrice(value) {
    const num = typeof value === "string" ? parseFloat(value) : value
    return `$${priceFormatter.format(Math.round(num))}`
}
