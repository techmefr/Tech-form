import type { ValidationRule } from './types'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateField(value: unknown, rules: ValidationRule[]): string | null {
    for (const rule of rules) {
        const error = applyRule(value, rule)
        if (error !== null) return error
    }
    return null
}

function applyRule(value: unknown, rule: ValidationRule): string | null {
    if (rule === 'required') {
        if (value === null || value === undefined || value === '') {
            return 'This field is required'
        }
        return null
    }

    if (rule === 'email') {
        if (typeof value !== 'string' || !EMAIL_REGEX.test(value)) {
            return 'Invalid email address'
        }
        return null
    }

    if (rule.startsWith('min:')) {
        const min = Number(rule.slice(4))
        if (typeof value !== 'number' || value < min) {
            return `Minimum value is ${min}`
        }
        return null
    }

    if (rule.startsWith('max:')) {
        const max = Number(rule.slice(4))
        if (typeof value !== 'number' || value > max) {
            return `Maximum value is ${max}`
        }
        return null
    }

    if (rule.startsWith('minLength:')) {
        const min = Number(rule.slice('minLength:'.length))
        if (typeof value !== 'string' || value.length < min) {
            return `Minimum length is ${min} characters`
        }
        return null
    }

    if (rule.startsWith('maxLength:')) {
        const max = Number(rule.slice('maxLength:'.length))
        if (typeof value !== 'string' || value.length > max) {
            return `Maximum length is ${max} characters`
        }
        return null
    }

    if (rule.startsWith('pattern:')) {
        const pattern = rule.slice('pattern:'.length)
        const regex = new RegExp(pattern)
        if (typeof value !== 'string' || !regex.test(value)) {
            return 'Invalid format'
        }
        return null
    }

    return null
}
