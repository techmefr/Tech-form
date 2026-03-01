import type { IComponentMap } from '../../core/types'

interface IShadcnComponentSet {
    Input: unknown
    Textarea: unknown
    Select: unknown
    Checkbox: unknown
    RadioGroup: unknown
}

export function createShadcnAdapter(components: IShadcnComponentSet): Partial<IComponentMap> {
    return {
        text: components.Input,
        email: components.Input,
        password: components.Input,
        number: components.Input,
        date: components.Input,
        textarea: components.Textarea,
        select: components.Select,
        checkbox: components.Checkbox,
        radio: components.RadioGroup,
    }
}
