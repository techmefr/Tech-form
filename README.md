# T-Form

Headless, framework-agnostic form engine. Manages UI rendering, validation, and payload transformation — independently of both the component library and the backend API shape.

Part of the [Tech-SDK](https://github.com/techmefr/Tech-SDK) ecosystem.

---

## Overview

T-Form separates three concerns that are typically entangled in form code:

| Layer | Role |
|-------|------|
| **Contract** | Source of truth — defines fields, types, labels and validation rules |
| **Registry** | UI adapter — maps field types to real components (Vuetify, Shadcn, etc.) |
| **Resolver** | Payload engine — transforms form values into the JSON shape your API expects |

The form component never knows about the API. The payload template never knows about the UI. The contract drives both.

---

## Installation

```bash
pnpm add @tech-sdk/t-form
```

Vue and React are optional peer dependencies. Install whichever you use:

```bash
pnpm add vue          # for Vue 3
pnpm add react        # for React 18+
```

---

## Setup

Register your UI adapter once at application startup using `createTForm`:

```ts
// main.ts
import { createTForm, createVuetifyAdapter } from '@tech-sdk/t-form'
import { VTextField, VTextarea, VSelect, VCheckbox, VRadioGroup } from 'vuetify/components'

createTForm({
    adapter: {
        name: 'vuetify',
        components: createVuetifyAdapter({
            VTextField,
            VTextarea,
            VSelect,
            VCheckbox,
            VRadioGroup,
        }),
    },
})
```

---

## Usage

### Step 1 — Define a contract

The contract is the single source of truth for your form. It describes every field: its type, label, validation rules and optional metadata.

```ts
// user.contract.ts
import { defineContract } from '@tech-sdk/t-form'

export const UserContract = defineContract({
    first_name: {
        type: 'text',
        label: 'First name',
        rules: ['required', 'minLength:2'],
    },
    email: {
        type: 'email',
        label: 'Email address',
        rules: ['required', 'email'],
    },
    role: {
        type: 'select',
        label: 'Role',
        rules: ['required'],
        options: [
            { label: 'Administrator', value: 'admin' },
            { label: 'Editor', value: 'editor' },
        ],
    },
})
```

### Step 2 — Define a payload template

The payload template describes the JSON your API expects. Use `t-<fieldName>` to reference a contract field. Static values are passed through as-is.

```ts
// user.payload.ts
export const CreateUserPayload = {
    mutate: [{
        operation: 'create',
        attributes: {
            name: 't-first_name',   // replaced by the value of first_name
            email: 't-email',        // replaced by the value of email
            role_id: 't-role',       // replaced by the value of role
        },
    }],
}
```

### Step 3 — Build the form

```vue
<!-- UserForm.vue -->
<script setup lang="ts">
import { TForm, TInput } from '@tech-sdk/t-form/vue'
import { resolve } from '@tech-sdk/t-form'
import { UserContract } from './user.contract'
import { CreateUserPayload } from './user.payload'

async function handleSubmit(values: Record<string, unknown>): Promise<void> {
    const payload = resolve(CreateUserPayload, values)
    await api.post('/users', payload)
}
</script>

<template>
    <TForm :contract="UserContract" @submit="handleSubmit" v-slot="{ isSubmitting }">
        <TInput name="first_name" />
        <TInput name="email" />
        <TInput name="role" />
        <button type="submit" :disabled="isSubmitting">Save</button>
    </TForm>
</template>
```

### Read-only view

Use `TView` to display form data without any input components:

```vue
<script setup lang="ts">
import { TView } from '@tech-sdk/t-form/vue'
import { UserContract } from './user.contract'

defineProps<{ user: Record<string, unknown> }>()
</script>

<template>
    <TView :contract="UserContract" :values="user" />
</template>
```

Pass a `fields` array to show only a subset of fields:

```vue
<TView :contract="UserContract" :values="user" :fields="['first_name', 'email']" />
```

---

## Resolver

`resolve(template, values)` is a recursive pure function. It walks the template and replaces every `t-<key>` string with the matching value. Everything else is returned as-is.

```ts
import { resolve } from '@tech-sdk/t-form'

const result = resolve(
    {
        mutate: [
            { operation: 'create', attributes: { name: 't-first_name', role_id: 't-role' } },
            { operation: 'attach', relation: 'teams', id: 't-team' },
        ],
    },
    { first_name: 'Alice', role: 1, team: 4 }
)

// {
//   mutate: [
//     { operation: 'create', attributes: { name: 'Alice', role_id: 1 } },
//     { operation: 'attach', relation: 'teams', id: 4 },
//   ]
// }
```

For reuse across a module, bind the resolver to a contract with `createResolver`:

```ts
import { createResolver } from '@tech-sdk/t-form'
import { UserContract } from './user.contract'

const resolveUser = createResolver(UserContract)

const payload = resolveUser(CreateUserPayload, values)
```

---

## Validation rules

Rules are declared as strings in the `rules` array of each field definition.

| Rule | Description |
|------|-------------|
| `required` | Value must not be `null`, `undefined`, or `""` |
| `email` | Value must be a valid email address |
| `min:N` | Numeric value must be greater than or equal to N |
| `max:N` | Numeric value must be less than or equal to N |
| `minLength:N` | String length must be greater than or equal to N |
| `maxLength:N` | String length must be less than or equal to N |
| `pattern:regex` | String must match the given regular expression |

Rules are evaluated in order. The first failure stops the chain and returns its error message.

---

## Field definition

```ts
interface IFieldDefinition {
    type: 'text' | 'email' | 'password' | 'number' | 'textarea'
         | 'select' | 'checkbox' | 'radio' | 'date'
    label: string
    rules?: ValidationRule[]
    placeholder?: string
    defaultValue?: unknown
    options?: { label: string; value: unknown }[]   // for select / radio
    dataSource?: string                              // for dynamic options (e.g. 'api.roles')
}
```

---

## Vue API

### `<TForm>`

| Prop | Type | Description |
|------|------|-------------|
| `contract` | `IContract` | Required. The field definitions for this form |
| `adapter` | `string` | Optional. Override the active adapter for this form |

| Event | Payload | Description |
|-------|---------|-------------|
| `submit` | `Record<string, unknown>` | Emitted after successful validation with all field values |

| Slot prop | Type | Description |
|-----------|------|-------------|
| `isSubmitting` | `boolean` | True while the submit handler is running |

Validation runs on blur (lazy) and re-runs on change for touched fields. All fields are validated on submit.

### `<TInput>`

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Required. Must match a key in the parent `TForm` contract |

Looks up the field type in the contract, resolves the component from the active registry adapter, and passes `model-value`, `label`, `placeholder`, `error-messages`, `type` and `items` to it.

### `<TView>`

| Prop | Type | Description |
|------|------|-------------|
| `contract` | `IContract` | Required |
| `values` | `Record<string, unknown>` | Required. The data to display |
| `fields` | `string[]` | Optional. Subset of fields to render |

Renders a `<dl>` list. Boolean values display as `Yes` / `No`. Null or missing values display as `-`.

### `useTFormContext()`

Access the form context from any component rendered inside `<TForm>`:

```ts
import { useTFormContext } from '@tech-sdk/t-form/vue'

const { contract, getFieldValue, setFieldValue, getFieldError, touchField } = useTFormContext()
```

---

## React API

```tsx
import { useTForm, useTField, TFormContext } from '@tech-sdk/t-form/react'
import { UserContract } from './user.contract'

function UserForm() {
    const form = useTForm(UserContract)

    return (
        <TFormContext.Provider value={{
            contract: UserContract,
            adapterName: 'shadcn',
            getFieldValue: form.getFieldValue,
            setFieldValue: form.setFieldValue,
            getFieldError: form.getFieldError,
            touchField: form.touchField,
        }}>
            <form onSubmit={form.handleSubmit(async (values) => {
                const payload = resolve(CreateUserPayload, values)
                await api.post('/users', payload)
            })}>
                <UserField name="first_name" />
                <button type="submit" disabled={form.isSubmitting}>Save</button>
            </form>
        </TFormContext.Provider>
    )
}

function UserField({ name }: { name: string }) {
    const { fieldDef, value, error, onChange, onBlur } = useTField(name)
    if (!fieldDef) return null

    return (
        <div>
            <label>{fieldDef.label}</label>
            <input value={String(value ?? '')} onChange={e => onChange(e.target.value)} onBlur={onBlur} />
            {error && <span>{error}</span>}
        </div>
    )
}
```

---

## Adapters

### Vuetify

```ts
import { createVuetifyAdapter } from '@tech-sdk/t-form'
import { VTextField, VTextarea, VSelect, VCheckbox, VRadioGroup } from 'vuetify/components'

const adapter = createVuetifyAdapter({ VTextField, VTextarea, VSelect, VCheckbox, VRadioGroup })
```

Supports an optional `VDateInput` for the `date` field type. Falls back to `VTextField` if not provided.

### Shadcn

```ts
import { createShadcnAdapter } from '@tech-sdk/t-form'
import { Input, Textarea, Select, Checkbox, RadioGroup } from '@/components/ui'

const adapter = createShadcnAdapter({ Input, Textarea, Select, Checkbox, RadioGroup })
```

### Custom adapter

Register any component map directly:

```ts
import { registerAdapter, setActiveAdapter } from '@tech-sdk/t-form'

registerAdapter('my-ui', {
    text: MyTextInput,
    select: MySelect,
    checkbox: MyCheckbox,
})

setActiveAdapter('my-ui')
```

The component must accept `model-value` (or `value`), `label`, `error-messages`, `type` and `items` as props, and emit `update:model-value` and `blur`.

---

## Project structure

```
packages/t-form/
├── src/
│   ├── core/
│   │   ├── contract.ts      defineContract factory
│   │   ├── resolver.ts      resolve / createResolver
│   │   ├── validator.ts     validateField
│   │   └── types.ts         shared interfaces
│   ├── registry/
│   │   ├── store.ts         registerAdapter / resolveComponent
│   │   └── adapters/
│   │       ├── vuetify.ts   createVuetifyAdapter
│   │       └── shadcn.ts    createShadcnAdapter
│   ├── framework/
│   │   ├── vue/             TForm, TInput, TView, useTFormContext
│   │   └── react/           useTForm, useTField, TFormContext
│   └── index.ts             createTForm + all exports
└── examples/
    ├── vue-vuetify/         Full Vue + Vuetify example
    └── resolver/            Resolver usage (basic, nested, batch)
```

---

## License

MIT
