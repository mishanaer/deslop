import { Suspense, useEffect } from "react"
import PropTypes from "prop-types"
import { Router, Switch, Route } from "wouter"
import { useHashLocation } from "wouter/use-hash-location"
import { useLocation } from "wouter"
import PageTransition from "../../src/components/PageTransition"
import { useFrozenLocation } from "../../src/components/PageTransition/context"
import PageSkeleton from "../../src/components/PageSkeleton"
import ErrorBoundary from "../../src/components/ErrorBoundary"
import RouteErrorFallback from "./RouteErrorFallback"

import SplitView from "../../src/components/SplitView"
import SplitViewPlaceholder from "../../src/components/SplitView/Placeholder"
import CatalogList from "../components/CatalogList"
import useSplitView from "../../src/hooks/useSplitView"

import Page from "../../src/components/Page"
import config from "../config"
import { flattenRoutes, isSplitEligible } from "../configHelpers"
import CatalogPage from "../components/CatalogPage"
import StorybookAppBar from "../components/StorybookAppBar"

const routes = flattenRoutes(config)
const CATALOG_TITLE = "Storybook"

function Redirect({ to }) {
    const [, navigate] = useLocation()
    useEffect(() => {
        navigate(to)
    }, [navigate, to])
    return null
}

Redirect.propTypes = {
    to: PropTypes.string,
}

const Routes = () => {
    const [liveLocation] = useLocation()
    // Inside PageTransition, match against the screen's frozen location: the
    // exiting copy must keep rendering ITS route during the crossfade instead
    // of snapping to the new one.
    const location = useFrozenLocation() ?? liveLocation
    return (
        <ErrorBoundary fallback={<RouteErrorFallback />} resetKeys={[location]}>
            <Switch location={location}>
                <Route path="/">
                    <StorybookAppBar title={CATALOG_TITLE} back={false} />
                    <CatalogPage />
                </Route>
                {routes.map(
                    ({
                        path,
                        component: Component,
                        skeleton: Fallback,
                        title,
                        header,
                    }) => (
                        <Route key={path} path={path}>
                            <StorybookAppBar title={title} header={header} />
                            <Suspense
                                fallback={
                                    Fallback ? <Fallback /> : <PageSkeleton />
                                }
                            >
                                <Component />
                            </Suspense>
                        </Route>
                    )
                )}
                <Route>
                    <Redirect to="/" />
                </Route>
            </Switch>
        </ErrorBoundary>
    )
}

function AppRoutes() {
    const [location] = useLocation()
    const isWide = useSplitView()

    const stack = (contained) => (
        <PageTransition contained={contained}>
            <Routes />
        </PageTransition>
    )

    // Narrow viewport: keep the single-column stack (also a safety net for any
    // route that opts out of split-view via isSplitEligible).
    if (!isWide || !isSplitEligible(location)) {
        return stack(false)
    }

    // Shell owns the TWA chrome in split mode; detail-pane <Page>s defer to it.
    // The chrome <Page> is a sibling keyed on location so it re-asserts the
    // shell header/background on every navigation (resetting anything a detail
    // demo mutated directly, e.g. NavigationBar's color picker) without
    // remounting SplitView or the sidebar.
    return (
        <>
            <Page mode="secondary" key={location} />
            <SplitView>
                <SplitView.Sidebar>
                    <StorybookAppBar title={CATALOG_TITLE} back={false} />
                    <CatalogList />
                </SplitView.Sidebar>
                <SplitView.Detail>
                    {location === "/" ? <SplitViewPlaceholder /> : stack(true)}
                </SplitView.Detail>
            </SplitView>
        </>
    )
}

export default function AppRouter() {
    return (
        <Router hook={useHashLocation}>
            <AppRoutes />
        </Router>
    )
}
