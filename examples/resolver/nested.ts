import { resolve } from '@tech-sdk/t-form'

const payload = {
    mutate: [
        {
            operation: 'create',
            attributes: {
                profile: {
                    full_name: 't-first_name',
                    contact: {
                        email: 't-email',
                    },
                },
                role_id: 't-role',
                meta: {
                    source: 'web',
                    version: 2,
                },
            },
        },
    ],
}

const values = {
    first_name: 'Bob',
    email: 'bob@example.com',
    role: 'editor',
}

const result = resolve(payload, values)

console.log(JSON.stringify(result, null, 2))
