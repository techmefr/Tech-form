import { resolve } from '@tech-sdk/t-form'

const payload = {
    mutate: [
        {
            operation: 'create',
            attributes: { name: 't-first_name', email: 't-email' },
        },
        {
            operation: 'attach',
            relation: 'roles',
            id: 't-role',
        },
    ],
}

const values = {
    first_name: 'Carol',
    email: 'carol@example.com',
    role: 42,
}

const result = resolve(payload, values)

console.log(JSON.stringify(result, null, 2))
