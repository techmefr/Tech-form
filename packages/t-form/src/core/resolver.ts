import type { IContract } from './types'

const T_PREFIX = 't-'

export function resolve(template: unknown, values: Record<string, unknown>): unknown {
    if (Array.isArray(template)) {
        return template.map(item => resolve(item, values))
    }

    if (typeof template === 'object' && template !== null) {
        return Object.fromEntries(
            Object.entries(template as Record<string, unknown>).map(([k, v]) => [
                k,
                resolve(v, values),
            ])
        )
    }

    if (typeof template === 'string' && template.startsWith(T_PREFIX)) {
        const key = template.slice(T_PREFIX.length)
        return values[key] ?? null
    }

    return template
}

export function createResolver<C extends IContract>(_contract: C) {
    return (template: unknown, values: IContractValues<C>): unknown =>
        resolve(template, values as Record<string, unknown>)
}

type IContractValues<C extends IContract> = Partial<{ [K in keyof C]: unknown }>
