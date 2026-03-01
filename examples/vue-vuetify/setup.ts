import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { VTextField, VSelect, VTextarea, VCheckbox, VRadioGroup } from 'vuetify/components'
import { createTForm, createVuetifyAdapter } from '@tech-sdk/t-form'

const vuetify = createVuetify()

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

export { vuetify }
