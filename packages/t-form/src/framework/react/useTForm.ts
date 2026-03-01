import { useState, useCallback } from 'react'
import type { FormEvent } from 'react'
import type { IContract } from '../../core/types'
import { validateField } from '../../core/validator'

interface IUseTFormReturn {
    values: Record<string, unknown>
    errors: Record<string, string | null>
    isSubmitting: boolean
    getFieldValue: (name: string) => unknown
    setFieldValue: (name: string, value: unknown) => void
    touchField: (name: string) => void
    getFieldError: (name: string) => string | null
    handleSubmit: (onSubmit: (values: Record<string, unknown>) => Promise<void>) => (event: FormEvent) => void
}

export function useTForm(contract: IContract): IUseTFormReturn {
    const [values, setValues] = useState<Record<string, unknown>>(
        Object.fromEntries(
            Object.entries(contract).map(([key, field]) => [key, field.defaultValue ?? null])
        )
    )

    const [errors, setErrors] = useState<Record<string, string | null>>(
        Object.fromEntries(Object.keys(contract).map(key => [key, null]))
    )

    const [touched, setTouched] = useState<Record<string, boolean>>(
        Object.fromEntries(Object.keys(contract).map(key => [key, false]))
    )

    const [isSubmitting, setIsSubmitting] = useState(false)

    const runFieldValidation = useCallback(
        (name: string, currentValues: Record<string, unknown>) => {
            const field = contract[name]
            if (!field) return null
            return validateField(currentValues[name], field.rules ?? [])
        },
        [contract]
    )

    const setFieldValue = useCallback(
        (name: string, value: unknown) => {
            setValues(prev => {
                const next = { ...prev, [name]: value }
                if (touched[name]) {
                    const error = runFieldValidation(name, next)
                    setErrors(e => ({ ...e, [name]: error }))
                }
                return next
            })
        },
        [touched, runFieldValidation]
    )

    const touchField = useCallback(
        (name: string) => {
            setTouched(prev => ({ ...prev, [name]: true }))
            setValues(prev => {
                const error = runFieldValidation(name, prev)
                setErrors(e => ({ ...e, [name]: error }))
                return prev
            })
        },
        [runFieldValidation]
    )

    const getFieldValue = useCallback((name: string): unknown => values[name] ?? null, [values])

    const getFieldError = useCallback((name: string): string | null => errors[name] ?? null, [errors])

    const handleSubmit = useCallback(
        (onSubmit: (values: Record<string, unknown>) => Promise<void>) =>
            (event: FormEvent) => {
                event.preventDefault()

                let isValid = true
                const nextErrors: Record<string, string | null> = {}
                const nextTouched: Record<string, boolean> = {}

                for (const [name, field] of Object.entries(contract)) {
                    const error = validateField(values[name], field.rules ?? [])
                    nextErrors[name] = error
                    nextTouched[name] = true
                    if (error !== null) isValid = false
                }

                setErrors(nextErrors)
                setTouched(nextTouched)

                if (!isValid) return

                setIsSubmitting(true)
                onSubmit({ ...values }).finally(() => setIsSubmitting(false))
            },
        [contract, values]
    )

    return { values, errors, isSubmitting, getFieldValue, setFieldValue, touchField, getFieldError, handleSubmit }
}
