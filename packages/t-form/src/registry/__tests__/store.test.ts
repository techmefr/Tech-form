import { describe, it, expect } from 'vitest'
import {
    registerAdapter,
    setActiveAdapter,
    resolveComponent,
    getActiveAdapterName,
} from '../store'

const mockText = { name: 'MockText' }
const mockSelect = { name: 'MockSelect' }

describe('getActiveAdapterName', () => {
    it('returns null when no adapter is registered', () => {
        expect(getActiveAdapterName()).toBeNull()
    })
})

describe('registerAdapter', () => {
    it('registers an adapter and sets it as active', () => {
        registerAdapter('first', { text: mockText })
        expect(getActiveAdapterName()).toBe('first')
    })

    it('does not replace the active adapter when a second one is added', () => {
        registerAdapter('second', { select: mockSelect })
        expect(getActiveAdapterName()).toBe('first')
    })
})

describe('setActiveAdapter', () => {
    it('switches the active adapter to an existing one', () => {
        setActiveAdapter('second')
        expect(getActiveAdapterName()).toBe('second')
    })

    it('throws for an unknown adapter name', () => {
        expect(() => setActiveAdapter('nonexistent')).toThrow(
            'Adapter "nonexistent" is not registered'
        )
    })
})

describe('resolveComponent', () => {
    it('returns the component for a given type and adapter name', () => {
        expect(resolveComponent('text', 'first')).toBe(mockText)
    })

    it('returns null for an unregistered field type', () => {
        expect(resolveComponent('checkbox', 'first')).toBeNull()
    })

    it('uses the active adapter when none is specified', () => {
        setActiveAdapter('second')
        expect(resolveComponent('select')).toBe(mockSelect)
    })

    it('returns null for an unknown adapter name', () => {
        expect(resolveComponent('text', 'unknown')).toBeNull()
    })
})
