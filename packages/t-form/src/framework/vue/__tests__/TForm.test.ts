import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import TForm from '../components/TForm.vue'
import { defineContract } from '../../../core/contract'

const contractWithRules = defineContract({
    username: { type: 'text', label: 'Username', rules: ['required'] },
})

const contractNoRules = defineContract({
    name: { type: 'text', label: 'Name' },
})

const contractWithDefault = defineContract({
    status: { type: 'text', label: 'Status', defaultValue: 'active' },
})

describe('TForm', () => {
    it('renders a form element', () => {
        const wrapper = mount(TForm, {
            props: { contract: contractNoRules },
            slots: { default: '<button type="submit">Save</button>' },
        })
        expect(wrapper.find('form').exists()).toBe(true)
    })

    it('does not emit submit when a required field is empty', async () => {
        const wrapper = mount(TForm, {
            props: { contract: contractWithRules },
            slots: { default: '<button type="submit">Save</button>' },
        })
        await wrapper.find('form').trigger('submit')
        await flushPromises()
        expect(wrapper.emitted('submit')).toBeFalsy()
    })

    it('emits submit with field values when validation passes', async () => {
        const wrapper = mount(TForm, {
            props: { contract: contractNoRules },
            slots: { default: '<button type="submit">Save</button>' },
        })
        await wrapper.find('form').trigger('submit')
        await flushPromises()
        expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({ name: null })
    })

    it('initializes field values from defaultValue', async () => {
        const wrapper = mount(TForm, {
            props: { contract: contractWithDefault },
            slots: { default: '<button type="submit">Save</button>' },
        })
        await wrapper.find('form').trigger('submit')
        await flushPromises()
        expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({ status: 'active' })
    })

    it('exposes isSubmitting as a slot prop', () => {
        const wrapper = mount(TForm, {
            props: { contract: contractNoRules },
            slots: {
                default: ({ isSubmitting }: { isSubmitting: boolean }) =>
                    h('span', { 'data-testid': 'state' }, String(isSubmitting)),
            },
        })
        expect(wrapper.find('[data-testid="state"]').text()).toBe('false')
    })
})
