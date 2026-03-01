<script setup lang="ts">
import { TForm, TInput } from '@tech-sdk/t-form/vue'
import { resolve } from '@tech-sdk/t-form'
import { UserContract } from './user.contract'
import { CreateUserPayload } from './user.payload'

async function handleSubmit(values: Record<string, unknown>): Promise<void> {
    const payload = resolve(CreateUserPayload, values)
    console.log('Payload sent to API:', payload)
}
</script>

<template>
    <TForm :contract="UserContract" @submit="handleSubmit" v-slot="{ isSubmitting }">
        <TInput name="first_name" />
        <TInput name="last_name" />
        <TInput name="email" />
        <TInput name="role" />
        <TInput name="age" />
        <button type="submit" :disabled="isSubmitting">Save</button>
    </TForm>
</template>
