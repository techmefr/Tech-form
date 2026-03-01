<script setup lang="ts">
import { TView } from '@tech-sdk/t-form/vue'
import { UserContract } from './user.contract'

defineProps<{
    user: Record<string, unknown>
    fields?: string[]
}>()
</script>

<template>
    <TView :contract="UserContract" :values="user" :fields="fields" />
</template>
