import PropTypes from "prop-types"

import Page from "../../../src/components/Page"
import SectionList from "../../../src/components/SectionList"
import Cell from "../../../src/components/Cells"
import { BackButton } from "../../../src/lib/twa"
import {
    accentColors,
    avatarGradients,
    elevationColors,
    semanticColors,
} from "@deslop/primitives/tokens"
import "@deslop/primitives/colors.css"

import * as styles from "./Colors.module.css"

const ThemeSwatch = ({ light, dark }) => (
    <div
        className={styles.themeSwatch}
        style={{ "--swatch-light": light, "--swatch-dark": dark }}
        aria-hidden="true"
    >
        <span className={styles.light} />
        <span className={styles.dark} />
    </div>
)

const GradientSwatch = ({ top, bottom }) => (
    <div
        className={styles.gradientSwatch}
        style={{ "--gradient-top": top, "--gradient-bottom": bottom }}
        aria-hidden="true"
    />
)

ThemeSwatch.propTypes = {
    light: PropTypes.string.isRequired,
    dark: PropTypes.string.isRequired,
}

GradientSwatch.propTypes = {
    top: PropTypes.string.isRequired,
    bottom: PropTypes.string.isRequired,
}

const ColorsShowcase = () => (
    <>
        <BackButton />
        <Page>
            <SectionList>
                <SectionList.Item header="Accent Colors">
                    {accentColors.map(({ name, light, dark }) => (
                        <Cell
                            key={name}
                            start={<ThemeSwatch light={light} dark={dark} />}
                        >
                            <Cell.Text
                                title={name}
                                description={`${light} · ${dark}`}
                            />
                        </Cell>
                    ))}
                </SectionList.Item>

                <SectionList.Item header="Avatar Gradients">
                    {avatarGradients.map(({ name, top, bottom }) => (
                        <Cell
                            key={name}
                            start={<GradientSwatch top={top} bottom={bottom} />}
                        >
                            <Cell.Text
                                title={name}
                                description={`${top} → ${bottom}`}
                            />
                        </Cell>
                    ))}
                </SectionList.Item>

                <SectionList.Item header="Elevation Colors">
                    {elevationColors.map(({ name, light, dark }) => (
                        <Cell
                            key={name}
                            start={<ThemeSwatch light={light} dark={dark} />}
                        >
                            <Cell.Text
                                title={name}
                                description={`${light} · ${dark}`}
                            />
                        </Cell>
                    ))}
                </SectionList.Item>

                <SectionList.Item header="Semantic Colors">
                    {semanticColors.map(({ name, light, dark }) => (
                        <Cell
                            key={name}
                            start={<ThemeSwatch light={light} dark={dark} />}
                        >
                            <Cell.Text
                                title={name}
                                description={`${light} · ${dark}`}
                            />
                        </Cell>
                    ))}
                </SectionList.Item>
            </SectionList>
        </Page>
    </>
)

export default ColorsShowcase
