import type { IComponentMap } from '../../core/types'

interface IVuetifyComponentSet {
    VTextField: unknown
    VTextarea: unknown
    VSelect: unknown
    VCheckbox: unknown
    VRadioGroup: unknown
    VDateInput?: unknown
}

export function createVuetifyAdapter(components: IVuetifyComponentSet): Partial<IComponentMap> {
    return {
        text: components.VTextField,
        email: components.VTextField,
        password: components.VTextField,
        number: components.VTextField,
        textarea: components.VTextarea,
        select: components.VSelect,
        checkbox: components.VCheckbox,
        radio: components.VRadioGroup,
        date: components.VDateInput ?? components.VTextField,
    }
}
