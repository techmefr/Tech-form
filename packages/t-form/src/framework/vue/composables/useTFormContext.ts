import { inject } from 'vue'
import type { InjectionKey } from 'vue'
import type { IFormContext } from '../../../core/types'

export const TFORM_CONTEXT_KEY: InjectionKey<IFormContext> = Symbol('t-form')

export function useTFormContext(): IFormContext {
    const context = inject(TFORM_CONTEXT_KEY)
    if (!context) {
        throw new Error('useTFormContext must be called inside a TForm component')
    }
    return context
}
