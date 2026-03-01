import { describe, it, expect } from 'vitest'
import { validateField } from '../validator'

describe('validateField', () => {
    describe('no rules', () => {
        it('returns null for any value', () => {
            expect(validateField(null, [])).toBeNull()
            expect(validateField('', [])).toBeNull()
            expect(validateField(0, [])).toBeNull()
        })
    })

    describe('required', () => {
        it('returns error for null', () => {
            expect(validateField(null, ['required'])).toBe('This field is required')
        })

        it('returns error for undefined', () => {
            expect(validateField(undefined, ['required'])).toBe('This field is required')
        })

        it('returns error for empty string', () => {
            expect(validateField('', ['required'])).toBe('This field is required')
        })

        it('returns null for a non-empty string', () => {
            expect(validateField('hello', ['required'])).toBeNull()
        })

        it('returns null for zero', () => {
            expect(validateField(0, ['required'])).toBeNull()
        })

        it('returns null for false', () => {
            expect(validateField(false, ['required'])).toBeNull()
        })
    })

    describe('email', () => {
        it('returns null for a valid email', () => {
            expect(validateField('user@example.com', ['email'])).toBeNull()
        })

        it('returns error for a string without @', () => {
            expect(validateField('notanemail', ['email'])).toBe('Invalid email address')
        })

        it('returns error for a non-string value', () => {
            expect(validateField(42, ['email'])).toBe('Invalid email address')
        })
    })

    describe('min', () => {
        it('returns null when value equals the minimum', () => {
            expect(validateField(18, ['min:18'])).toBeNull()
        })

        it('returns null when value exceeds the minimum', () => {
            expect(validateField(20, ['min:18'])).toBeNull()
        })

        it('returns error when value is below the minimum', () => {
            expect(validateField(17, ['min:18'])).toBe('Minimum value is 18')
        })

        it('returns error for a non-number value', () => {
            expect(validateField('17', ['min:18'])).toBe('Minimum value is 18')
        })
    })

    describe('max', () => {
        it('returns null when value equals the maximum', () => {
            expect(validateField(100, ['max:100'])).toBeNull()
        })

        it('returns null when value is below the maximum', () => {
            expect(validateField(50, ['max:100'])).toBeNull()
        })

        it('returns error when value exceeds the maximum', () => {
            expect(validateField(101, ['max:100'])).toBe('Maximum value is 100')
        })

        it('returns error for a non-number value', () => {
            expect(validateField('50', ['max:100'])).toBe('Maximum value is 100')
        })
    })

    describe('minLength', () => {
        it('returns null when string meets the minimum length', () => {
            expect(validateField('hello', ['minLength:3'])).toBeNull()
        })

        it('returns null when string equals the minimum length exactly', () => {
            expect(validateField('hi!', ['minLength:3'])).toBeNull()
        })

        it('returns error when string is too short', () => {
            expect(validateField('hi', ['minLength:3'])).toBe('Minimum length is 3 characters')
        })

        it('returns error for a non-string value', () => {
            expect(validateField(123, ['minLength:3'])).toBe('Minimum length is 3 characters')
        })
    })

    describe('maxLength', () => {
        it('returns null when string is within the maximum length', () => {
            expect(validateField('hello', ['maxLength:10'])).toBeNull()
        })

        it('returns error when string exceeds the maximum length', () => {
            expect(validateField('hello world', ['maxLength:5'])).toBe(
                'Maximum length is 5 characters'
            )
        })
    })

    describe('pattern', () => {
        it('returns null when string matches the pattern', () => {
            expect(validateField('ABC', ['pattern:^[A-Z]+$'])).toBeNull()
        })

        it('returns error when string does not match the pattern', () => {
            expect(validateField('abc', ['pattern:^[A-Z]+$'])).toBe('Invalid format')
        })

        it('returns error for a non-string value', () => {
            expect(validateField(123, ['pattern:^[A-Z]+$'])).toBe('Invalid format')
        })
    })

    describe('multiple rules', () => {
        it('stops and returns the first failing rule error', () => {
            expect(validateField('', ['required', 'email'])).toBe('This field is required')
        })

        it('returns null when all rules pass', () => {
            expect(validateField('test@example.com', ['required', 'email'])).toBeNull()
        })

        it('reports the second rule when the first passes', () => {
            expect(validateField('notanemail', ['required', 'email'])).toBe(
                'Invalid email address'
            )
        })
    })
})
