<script setup lang="ts">
import { computed } from 'vue'
import { useTFormContext } from '../composables/useTFormContext'
import { resolveComponent } from '../../../registry/store'
import type { FieldType } from '../../../core/types'

const props = defineProps<{
    name: string
}>()

const context = useTFormContext()

const fieldDef = computed(() => context.contract[props.name])

const resolvedComponent = computed(() => {
    if (!fieldDef.value) return null
    return resolveComponent(fieldDef.value.type as FieldType, context.adapterName)
})

const value = computed(() => context.getFieldValue(props.name))

const error = computed(() => context.getFieldError(props.name))

function handleUpdate(newValue: unknown): void {
    context.setFieldValue(props.name, newValue)
}

function handleBlur(): void {
    context.touchField(props.name)
}
</script>

<template>
    <component
        :is="resolvedComponent"
        v-if="resolvedComponent && fieldDef"
        :model-value="value"
        :label="fieldDef.label"
        :placeholder="fieldDef.placeholder ?? undefined"
        :error-messages="error ? [error] : []"
        :type="fieldDef.type !== 'select' && fieldDef.type !== 'textarea' ? fieldDef.type : undefined"
        :items="fieldDef.options ?? []"
        :item-title="'label'"
        :item-value="'value'"
        @update:model-value="handleUpdate"
        @blur="handleBlur"
    />
</template>
