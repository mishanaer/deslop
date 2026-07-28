import { useState } from "react"

const useModal = (modalKeys = {}) => {
    const initialState = Array.isArray(modalKeys)
        ? modalKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
        : modalKeys

    const [modals, setModals] = useState(initialState)

    const openModal = (modalId) => {
        setModals((prev) => ({ ...prev, [modalId]: true }))
    }

    const closeModal = (modalId) => {
        setModals((prev) => ({ ...prev, [modalId]: false }))
    }

    const toggleModal = (modalId) => {
        setModals((prev) => ({ ...prev, [modalId]: !prev[modalId] }))
    }

    const handlers = (() => {
        const result = {}
        Object.keys(initialState).forEach((modalId) => {
            result[modalId] = {
                open: () => openModal(modalId),
                close: () => closeModal(modalId),
                toggle: () => toggleModal(modalId),
                isOpen: !!modals[modalId],
            }
        })
        return result
    })()

    const isOpen = (modalId) => !!modals[modalId]

    return {
        modals,
        openModal,
        closeModal,
        toggleModal,
        isOpen,
        handlers,
    }
}

export default useModal
