export type FieldType =
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'date'

export type ValidationRule =
    | 'required'
    | 'email'
    | `min:${number}`
    | `max:${number}`
    | `minLength:${number}`
    | `maxLength:${number}`
    | `pattern:${string}`

export interface ISelectOption {
    label: string
    value: unknown
}

export interface IFieldDefinition {
    type: FieldType
    label: string
    rules?: ValidationRule[]
    dataSource?: string
    placeholder?: string
    defaultValue?: unknown
    options?: ISelectOption[]
}

export type IContract = Record<string, IFieldDefinition>

export type IContractValues<C extends IContract> = {
    [K in keyof C]?: unknown
}

export type IComponentMap = Record<FieldType, unknown>

export interface IFormContext {
    contract: IContract
    adapterName: string | null
    getFieldValue: (name: string) => unknown
    setFieldValue: (name: string, value: unknown) => void
    getFieldError: (name: string) => string | null
    touchField: (name: string) => void
}

export interface ITFormConfig {
    adapter: {
        name: string
        components: Partial<IComponentMap>
    }
}
