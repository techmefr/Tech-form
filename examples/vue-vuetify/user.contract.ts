import { defineContract } from '@tech-sdk/t-form'

export const UserContract = defineContract({
    first_name: {
        type: 'text',
        label: 'First name',
        rules: ['required', 'minLength:2'],
    },
    last_name: {
        type: 'text',
        label: 'Last name',
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
            { label: 'Viewer', value: 'viewer' },
        ],
    },
    age: {
        type: 'number',
        label: 'Age',
        rules: ['required', 'min:18', 'max:120'],
    },
})
