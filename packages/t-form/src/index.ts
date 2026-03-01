import type { ITFormConfig } from './core/types'
import { registerAdapter, setActiveAdapter } from './registry/store'

export function createTForm(config: ITFormConfig): void {
    registerAdapter(config.adapter.name, config.adapter.components)
    setActiveAdapter(config.adapter.name)
}

export { defineContract } from './core/contract'
export { resolve, createResolver } from './core/resolver'
export { validateField } from './core/validator'
export { registerAdapter, setActiveAdapter, resolveComponent, getActiveAdapterName } from './registry/store'
export { createVuetifyAdapter } from './registry/adapters/vuetify'
export { createShadcnAdapter } from './registry/adapters/shadcn'

export type {
    IContract,
    IFieldDefinition,
    ISelectOption,
    IFormContext,
    IContractValues,
    IComponentMap,
    ITFormConfig,
    FieldType,
    ValidationRule,
} from './core/types'
