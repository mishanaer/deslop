import PropTypes from "prop-types"
import StoryCardBadge from "./StoryCardBadge"
import { formatPrice } from "./formatPrice"
import styles from "./StoryCard.module.scss"
import storyBg from "./story-bg.jpg"

function formatTimestamp(isoString) {
    const date = new Date(isoString)
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const offset = -date.getTimezoneOffset() / 60
    const sign = offset >= 0 ? "+" : ""
    const time = `${hours}:${minutes} (UTC ${sign}${offset})`

    const day = date.getDate()
    const month = date.toLocaleString("en", { month: "short" })
    const year = date.getFullYear()

    return { time, date: `${day} ${month}, ${year}` }
}

export default function StoryCard({
    coinIcon,
    coinName,
    direction,
    leverage,
    pnlPercent,
    entryPrice,
    closePrice,
    timestamp,
}) {
    const isPositive = pnlPercent >= 0
    const formatted = formatTimestamp(timestamp)

    return (
        <div className={styles.card} data-story-card>
            <img
                className={styles.bg}
                src={storyBg}
                width={360}
                height={640}
                alt=""
                aria-hidden="true"
            />

            {coinIcon && (
                <img
                    className={styles.coinIcon}
                    src={coinIcon}
                    width={40}
                    height={40}
                    alt={coinName}
                />
            )}

            <div className={styles.timestamp}>
                <p>{formatted.time}</p>
                <p>{formatted.date}</p>
            </div>

            <div className={styles.train}>
                <span className={styles.coinName}>{coinName}</span>
                <StoryCardBadge>{direction}</StoryCardBadge>
                <StoryCardBadge>{leverage}×</StoryCardBadge>
            </div>

            <div className={styles.pnl} data-positive={isPositive}>
                {isPositive ? "+" : ""}
                {pnlPercent.toFixed(2)}%
            </div>

            <div className={styles.prices}>
                <div className={styles.priceCol}>
                    <span className={styles.priceLabel}>Entry Price</span>
                    <span className={styles.priceValue}>
                        {formatPrice(entryPrice)}
                    </span>
                </div>
                <div className={styles.priceCol}>
                    <span className={styles.priceLabel}>Close Price</span>
                    <span className={styles.priceValue}>
                        {formatPrice(closePrice)}
                    </span>
                </div>
            </div>
        </div>
    )
}

StoryCard.propTypes = {
    coinIcon: PropTypes.string,
    coinName: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(["Long", "Short"]).isRequired,
    leverage: PropTypes.string.isRequired,
    pnlPercent: PropTypes.number.isRequired,
    entryPrice: PropTypes.string.isRequired,
    closePrice: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
}
