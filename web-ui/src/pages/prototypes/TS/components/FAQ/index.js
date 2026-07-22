import Cell from "../../../../../components/Cells"
import SectionList from "../../../../../components/SectionList"

export default function FAQ() {
    const questions = [
        "What is Crypto Wallet Earn? How does it work?",
        "How are rewards assigned? Can I withdraw them early?",
        "Can I withdraw only a part of my USDT from Crypto Wallet Earn and continue to use it?",
    ]

    return (
        <SectionList.Item>
            {questions.map((question, index) => (
                <Cell end={<Cell.Part type="Chevron" />} key={`tx-${index}`}>
                    <Cell.Text title={question} />
                </Cell>
            ))}
            <Cell>
                <Cell.Text type="Accent" title="Learn More" />
            </Cell>
        </SectionList.Item>
    )
}
