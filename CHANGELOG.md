# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-03-01

Initial release of `@tech-sdk/t-form`.

### Added

#### Core

- `defineContract` — factory function that defines the source of truth for a form (field types, labels, validation rules, options, default values)
- `resolve(template, values)` — recursive pure function that walks a payload template and replaces all `t-<key>` markers with the matching form values; handles nested objects, arrays, and mixed structures
- `createResolver(contract)` — returns a resolver function pre-bound to a contract for reuse across a module
- `validateField(value, rules)` — runs a list of validation rules against a value and returns the first error message or `null`
- Validation rules: `required`, `email`, `min:N`, `max:N`, `minLength:N`, `maxLength:N`, `pattern:regex`

#### Registry

- `registerAdapter(name, components)` — registers a component map keyed by field type; first adapter registered becomes active automatically
- `setActiveAdapter(name)` — switches the globally active adapter
- `resolveComponent(fieldType, adapterName?)` — returns the component registered for a given field type and adapter
- `getActiveAdapterName()` — returns the name of the currently active adapter
- `createVuetifyAdapter(components)` — builds a component map from a Vuetify component set (`VTextField`, `VTextarea`, `VSelect`, `VCheckbox`, `VRadioGroup`, optional `VDateInput`)
- `createShadcnAdapter(components)` — builds a component map from a Shadcn component set (`Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`)

#### Vue framework (`@tech-sdk/t-form/vue`)

- `<TForm>` — context provider component; manages reactive field values, errors and touched state; validates on blur, re-validates on change for touched fields, validates all fields on submit; exposes `isSubmitting` as a scoped slot prop
- `<TInput>` — headless field component; resolves the rendering component from the registry based on the contract field type; passes `model-value`, `label`, `placeholder`, `error-messages`, `type` and `items` to the resolved component
- `<TView>` — read-only field display rendered as a `<dl>` list; formats booleans as `Yes` / `No`, null or missing values as `-`; supports a `fields` prop to render a subset of contract fields
- `useTFormContext()` — composable that injects the parent `TForm` context; throws if called outside a `TForm`

#### React framework (`@tech-sdk/t-form/react`)

- `useTForm(contract)` — hook that manages form state (values, errors, touched, isSubmitting); returns `getFieldValue`, `setFieldValue`, `touchField`, `getFieldError`, `handleSubmit`
- `useTField(name)` — hook that reads a single field's definition, value, error and resolved component from the nearest `TFormContext`
- `TFormContext` — React context used to share form state with field-level hooks

#### Entry point

- `createTForm(config)` — configures the global adapter at application startup; accepts an adapter name and component map

#### Examples

- `examples/vue-vuetify/` — full Vue 3 + Vuetify setup with contract, create and update payload templates, `UserForm.vue` and `UserView.vue`
- `examples/resolver/` — standalone resolver usage: basic flat mapping, deeply nested objects, batch mutations with multiple operations

#### Tests

- 73 unit and component tests across 7 suites covering all core functions, the registry store, and the Vue component layer (`TForm`, `TInput`, `TView`)
