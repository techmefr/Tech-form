export const CreateUserPayload = {
    mutate: [
        {
            operation: 'create',
            attributes: {
                name: 't-first_name',
                surname: 't-last_name',
                email: 't-email',
                role_id: 't-role',
                age: 't-age',
            },
        },
    ],
}

export const UpdateUserPayload = {
    mutate: [
        {
            operation: 'update',
            attributes: {
                name: 't-first_name',
                surname: 't-last_name',
                email: 't-email',
                role_id: 't-role',
                age: 't-age',
            },
        },
    ],
}
