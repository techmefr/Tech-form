<script setup lang="ts">
import { computed } from 'vue'
import type { IContract } from '../../../core/types'

const props = defineProps<{
    contract: IContract
    values: Record<string, unknown>
    fields?: string[]
}>()

const visibleFields = computed(() => props.fields ?? Object.keys(props.contract))

function formatValue(value: unknown): string {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    return String(value)
}
</script>

<template>
    <dl>
        <div v-for="key in visibleFields" :key="key">
            <dt>{{ contract[key]?.label ?? key }}</dt>
            <dd>{{ formatValue(values[key]) }}</dd>
        </div>
    </dl>
</template>
