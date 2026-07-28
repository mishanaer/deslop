export const EASING = {
    MATERIAL_STANDARD: [0.26, 0.08, 0.25, 1],
    QUINT_OUT: [0.23, 1, 0.32, 1],
    LINEAR: "linear",
    EASE_IN_OUT: "easeInOut",
}

export const DURATION = {
    FAST: 150,
    NORMAL: 200,
    SLOW: 350,
    BALANCE_ANIMATION: 850,
    OPACITY: 200,
}
export const SPRING = {
    APPLE: {
        type: "spring",
        stiffness: 640,
        damping: 40,
    },
    MATERIAL: {
        type: "spring",
        stiffness: 800,
        damping: 60,
        mass: 1,
    },
    DROPDOWN: {
        type: "spring",
        stiffness: 500,
        damping: 32,
    },
    SNAP: {
        type: "spring",
        stiffness: 120,
        damping: 20,
    },
    GENTLE: {
        type: "spring",
        stiffness: 500,
        damping: 40,
    },
    SNACKBAR: {
        type: "spring",
        stiffness: 280,
        damping: 26,
    },
    MODAL: {
        type: "spring",
        stiffness: 250,
        damping: 30,
    },
}

export const POPOVER_VARIANTS = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: SPRING.DROPDOWN },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.25 } },
}

export const TRANSITIONS = {
    MATERIAL_STANDARD: {
        ease: EASING.MATERIAL_STANDARD,
        duration: DURATION.NORMAL / 1000,
    },
    MORPH: {
        duration: 0.25,
        type: "spring",
        bounce: 0,
        opacity: {
            duration: 0.35,
            type: "spring",
            bounce: 0,
        },
    },
}

export const COMPLEX_EASING =
    "linear(0, 0.0013 0.5%, 0.0062 1.11%, 0.0233 2.21%, 0.0518 3.42%, 0.0951 4.82%, 0.1855 7.23%, 0.4176 12.76%, 0.525 15.47%, 0.6247, 0.7105 21.1%, 0.7844, 0.8439 26.92%, 0.8695 28.43%, 0.8934, 0.9139, 0.9314, 0.9463 34.86%, 0.9595 36.57%, 0.9709 38.37%, 0.9805 40.28%, 0.9884 42.29%, 0.9948 44.5%, 1.003 49.42%, 1.0048 53.01%, 1.0051 55.01%, 1.0048 57.01%, 1.0036 59.51%, 1.0016 62.01%, 0.9995 64.01%, 0.9977 66.01%, 0.9972 67.01%, 0.9975 68.01%, 0.9984 68.01%)"
