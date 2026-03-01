import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TView from '../components/TView.vue'
import { defineContract } from '../../../core/contract'

const contract = defineContract({
    name: { type: 'text', label: 'Full name' },
    age: { type: 'number', label: 'Age' },
    active: { type: 'checkbox', label: 'Active' },
})

describe('TView', () => {
    it('renders a definition list', () => {
        const wrapper = mount(TView, { props: { contract, values: {} } })
        expect(wrapper.find('dl').exists()).toBe(true)
    })

    it('renders all contract fields by default', () => {
        const wrapper = mount(TView, {
            props: { contract, values: { name: 'Alice', age: 30, active: true } },
        })
        expect(wrapper.findAll('dt')).toHaveLength(3)
    })

    it('displays field labels from the contract', () => {
        const wrapper = mount(TView, { props: { contract, values: {} } })
        const labels = wrapper.findAll('dt').map(dt => dt.text())
        expect(labels).toContain('Full name')
        expect(labels).toContain('Age')
    })

    it('displays field values', () => {
        const wrapper = mount(TView, {
            props: { contract, values: { name: 'Alice', age: 30 } },
        })
        expect(wrapper.text()).toContain('Alice')
        expect(wrapper.text()).toContain('30')
    })

    it('shows - for null values', () => {
        const wrapper = mount(TView, { props: { contract, values: { name: null } } })
        expect(wrapper.findAll('dd')[0].text()).toBe('-')
    })

    it('shows - for missing values', () => {
        const wrapper = mount(TView, { props: { contract, values: {} } })
        expect(wrapper.findAll('dd')[0].text()).toBe('-')
    })

    it('formats true as Yes', () => {
        const wrapper = mount(TView, { props: { contract, values: { active: true } } })
        expect(wrapper.text()).toContain('Yes')
    })

    it('formats false as No', () => {
        const wrapper = mount(TView, { props: { contract, values: { active: false } } })
        expect(wrapper.text()).toContain('No')
    })

    it('respects the fields prop to filter visible fields', () => {
        const wrapper = mount(TView, {
            props: { contract, values: { name: 'Alice', age: 30 }, fields: ['name'] },
        })
        expect(wrapper.findAll('dt')).toHaveLength(1)
        expect(wrapper.findAll('dt')[0].text()).toBe('Full name')
    })
})
