import { describe, it, expect } from 'vitest'
import { resolve, createResolver } from '../resolver'
import { defineContract } from '../contract'

describe('resolve', () => {
    it('returns a static string unchanged', () => {
        expect(resolve('hello', {})).toBe('hello')
    })

    it('returns a static number unchanged', () => {
        expect(resolve(42, {})).toBe(42)
    })

    it('returns null unchanged', () => {
        expect(resolve(null, {})).toBeNull()
    })

    it('replaces a t- string with the matching value', () => {
        expect(resolve('t-name', { name: 'Alice' })).toBe('Alice')
    })

    it('returns null for a t- key not present in values', () => {
        expect(resolve('t-missing', {})).toBeNull()
    })

    it('resolves a flat object with mixed static and dynamic fields', () => {
        const result = resolve(
            { operation: 'create', name: 't-name', role: 't-role' },
            { name: 'Bob', role: 'admin' }
        )
        expect(result).toEqual({ operation: 'create', name: 'Bob', role: 'admin' })
    })

    it('resolves a nested object recursively', () => {
        const result = resolve(
            { user: { name: 't-name', email: 't-email' } },
            { name: 'Carol', email: 'carol@test.com' }
        )
        expect(result).toEqual({ user: { name: 'Carol', email: 'carol@test.com' } })
    })

    it('resolves an array by mapping over items', () => {
        const result = resolve(
            [{ op: 'create', name: 't-name' }, { op: 'attach', id: 't-role' }],
            { name: 'Dave', role: 7 }
        )
        expect(result).toEqual([
            { op: 'create', name: 'Dave' },
            { op: 'attach', id: 7 },
        ])
    })

    it('resolves a deeply nested structure combining objects and arrays', () => {
        const result = resolve(
            {
                mutate: [
                    { operation: 'create', attributes: { name: 't-first_name' } },
                    { operation: 'attach', id: 't-role' },
                ],
            },
            { first_name: 'Eve', role: 42 }
        )
        expect(result).toEqual({
            mutate: [
                { operation: 'create', attributes: { name: 'Eve' } },
                { operation: 'attach', id: 42 },
            ],
        })
    })
})

describe('createResolver', () => {
    it('returns a bound resolver that replaces t- keys', () => {
        const contract = defineContract({ name: { type: 'text', label: 'Name' } })
        const resolveFor = createResolver(contract)
        expect(resolveFor('t-name', { name: 'Alice' })).toBe('Alice')
    })

    it('returns null for a missing key', () => {
        const contract = defineContract({ name: { type: 'text', label: 'Name' } })
        const resolveFor = createResolver(contract)
        expect(resolveFor('t-name', {})).toBeNull()
    })
})
