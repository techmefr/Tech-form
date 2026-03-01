import type { IContract } from './types'

export function defineContract<const T extends IContract>(fields: T): T {
    return fields
}
