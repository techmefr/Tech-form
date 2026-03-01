<script setup lang="ts">
import { provide, ref } from 'vue'
import type { IContract, IFormContext } from '../../../core/types'
import { TFORM_CONTEXT_KEY } from '../composables/useTFormContext'
import { validateField } from '../../../core/validator'
import { getActiveAdapterName } from '../../../registry/store'

const props = defineProps<{
    contract: IContract
    adapter?: string
}>()

const emit = defineEmits<{
    submit: [values: Record<string, unknown>]
}>()

const values = ref<Record<string, unknown>>(
    Object.fromEntries(
        Object.entries(props.contract).map(([key, field]) => [key, field.defaultValue ?? null])
    )
)

const errors = ref<Record<string, string | null>>(
    Object.fromEntries(Object.keys(props.contract).map(key => [key, null]))
)

const touched = ref<Record<string, boolean>>(
    Object.fromEntries(Object.keys(props.contract).map(key => [key, false]))
)

const isSubmitting = ref(false)

function getFieldValue(name: string): unknown {
    return values.value[name] ?? null
}

function setFieldValue(name: string, value: unknown): void {
    values.value[name] = value
    if (touched.value[name]) {
        runFieldValidation(name)
    }
}

function touchField(name: string): void {
    touched.value[name] = true
    runFieldValidation(name)
}

function getFieldError(name: string): string | null {
    return errors.value[name] ?? null
}

function runFieldValidation(name: string): void {
    const field = props.contract[name]
    if (!field) return
    errors.value[name] = validateField(values.value[name], field.rules ?? [])
}

function validateAll(): boolean {
    let isValid = true
    for (const [name, field] of Object.entries(props.contract)) {
        const error = validateField(values.value[name], field.rules ?? [])
        errors.value[name] = error
        touched.value[name] = true
        if (error !== null) isValid = false
    }
    return isValid
}

async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault()
    if (!validateAll()) return

    isSubmitting.value = true
    try {
        emit('submit', { ...values.value })
    } finally {
        isSubmitting.value = false
    }
}

const context: IFormContext = {
    contract: props.contract,
    adapterName: props.adapter ?? getActiveAdapterName(),
    getFieldValue,
    setFieldValue,
    getFieldError,
    touchField,
}

provide(TFORM_CONTEXT_KEY, context)
</script>

<template>
    <form @submit="handleSubmit">
        <slot :is-submitting="isSubmitting" />
    </form>
</template>
