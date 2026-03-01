import { describe, it, expect } from 'vitest'
import { defineContract } from '../contract'

describe('defineContract', () => {
    it('returns the exact same object reference', () => {
        const fields = { name: { type: 'text' as const, label: 'Name' } }
        expect(defineContract(fields)).toBe(fields)
    })

    it('preserves all field definitions', () => {
        const contract = defineContract({
            email: {
                type: 'email' as const,
                label: 'Email',
                rules: ['required', 'email'] as const,
            },
            role: {
                type: 'select' as const,
                label: 'Role',
                options: [{ label: 'Admin', value: 'admin' }],
            },
        })

        expect(contract.email.type).toBe('email')
        expect(contract.email.rules).toContain('required')
        expect(contract.role.options).toHaveLength(1)
        expect(contract.role.options?.[0].value).toBe('admin')
    })

    it('preserves defaultValue', () => {
        const contract = defineContract({
            status: { type: 'text' as const, label: 'Status', defaultValue: 'active' },
        })
        expect(contract.status.defaultValue).toBe('active')
    })
})
