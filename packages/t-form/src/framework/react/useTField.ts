import { useContext } from 'react'
import { TFormContext } from './context'
import type { IFieldDefinition } from '../../core/types'
import { resolveComponent } from '../../registry/store'

interface IUseTFieldReturn {
    fieldDef: IFieldDefinition | null
    value: unknown
    error: string | null
    component: unknown
    onChange: (value: unknown) => void
    onBlur: () => void
}

export function useTField(name: string): IUseTFieldReturn {
    const context = useContext(TFormContext)
    if (!context) {
        throw new Error('useTField must be used inside a TForm component')
    }

    const fieldDef = context.contract[name] ?? null
    const value = context.getFieldValue(name)
    const error = context.getFieldError(name)
    const component = fieldDef ? resolveComponent(fieldDef.type, context.adapterName) : null

    function onChange(value: unknown): void {
        context.setFieldValue(name, value)
    }

    function onBlur(): void {
        context.touchField(name)
    }

    return { fieldDef, value, error, component, onChange, onBlur }
}
