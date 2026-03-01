import type { FieldType, IComponentMap } from '../core/types'

const adapters = new Map<string, Partial<IComponentMap>>()
let activeAdapterName: string | null = null

export function registerAdapter(name: string, components: Partial<IComponentMap>): void {
    adapters.set(name, components)
    if (activeAdapterName === null) {
        activeAdapterName = name
    }
}

export function setActiveAdapter(name: string): void {
    if (!adapters.has(name)) {
        throw new Error(`Adapter "${name}" is not registered`)
    }
    activeAdapterName = name
}

export function getActiveAdapterName(): string | null {
    return activeAdapterName
}

export function resolveComponent(fieldType: FieldType, adapterName?: string | null): unknown {
    const name = adapterName ?? activeAdapterName
    if (name === null) return null

    const adapter = adapters.get(name)
    if (!adapter) return null

    return adapter[fieldType] ?? null
}
