import { Component } from "react"
import PropTypes from "prop-types"

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    static getDerivedStateFromProps(props, state) {
        if (!state.hasError) return null
        const prev = state.resetKeys || []
        const next = props.resetKeys || []
        if (prev.length !== next.length) {
            return { hasError: false, resetKeys: next }
        }
        for (let i = 0; i < next.length; i++) {
            if (prev[i] !== next[i]) {
                return { hasError: false, resetKeys: next }
            }
        }
        return null
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback
        }

        return this.props.children
    }
}

ErrorBoundary.propTypes = {
    fallback: PropTypes.node,
    children: PropTypes.node,
    resetKeys: PropTypes.array,
}

export default ErrorBoundary
