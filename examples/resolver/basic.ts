import { resolve } from '@tech-sdk/t-form'

const payload = {
    mutate: [
        {
            operation: 'create',
            attributes: {
                name: 't-first_name',
                email: 't-email',
                role_id: 't-role',
            },
        },
    ],
}

const values = {
    first_name: 'Alice',
    email: 'alice@example.com',
    role: 'admin',
}

const result = resolve(payload, values)

console.log(JSON.stringify(result, null, 2))
