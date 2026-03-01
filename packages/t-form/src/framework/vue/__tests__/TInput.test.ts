import { describe, it, expect, beforeAll } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import TForm from '../components/TForm.vue'
import TInput from '../components/TInput.vue'
import { defineContract } from '../../../core/contract'
import { registerAdapter } from '../../../registry/store'

const MockField = defineComponent({
    name: 'MockField',
    props: ['modelValue', 'label', 'errorMessages'],
    emits: ['update:modelValue', 'blur'],
    render() {
        return h('div', [
            h('input', { value: this.modelValue, 'data-label': this.label }),
            this.errorMessages?.length
                ? h('span', { 'data-testid': 'error' }, this.errorMessages[0])
                : null,
        ])
    },
})

beforeAll(() => {
    registerAdapter('test-input', { text: MockField })
})

const contract = defineContract({
    username: { type: 'text', label: 'Username', rules: ['required'] },
})

function mountWithForm() {
    return mount(TForm, {
        props: { contract, adapter: 'test-input' },
        slots: { default: h(TInput, { name: 'username' }) },
    })
}

describe('TInput', () => {
    it('renders the component registered in the adapter', () => {
        const wrapper = mountWithForm()
        expect(wrapper.findComponent(MockField).exists()).toBe(true)
    })

    it('passes the label from the contract to the component', () => {
        const wrapper = mountWithForm()
        expect(wrapper.find('input').attributes('data-label')).toBe('Username')
    })

    it('shows no error before any interaction', () => {
        const wrapper = mountWithForm()
        expect(wrapper.find('[data-testid="error"]').exists()).toBe(false)
    })

    it('shows a validation error after blur on an empty required field', async () => {
        const wrapper = mountWithForm()
        await wrapper.findComponent(MockField).vm.$emit('blur')
        await flushPromises()
        expect(wrapper.find('[data-testid="error"]').text()).toBe('This field is required')
    })

    it('updates the value when the component emits update:modelValue', async () => {
        const wrapper = mountWithForm()
        await wrapper.findComponent(MockField).vm.$emit('update:modelValue', 'alice')
        await flushPromises()
        expect(wrapper.findComponent(MockField).props('modelValue')).toBe('alice')
    })

    it('clears the error after valid input once the field is touched', async () => {
        const wrapper = mountWithForm()
        await wrapper.findComponent(MockField).vm.$emit('blur')
        await wrapper.findComponent(MockField).vm.$emit('update:modelValue', 'alice')
        await flushPromises()
        expect(wrapper.find('[data-testid="error"]').exists()).toBe(false)
    })
})
