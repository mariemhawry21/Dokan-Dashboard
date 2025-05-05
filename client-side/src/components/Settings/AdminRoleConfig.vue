<template>
  <v-dialog v-model="internalDialog" max-width="800" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <v-card :dir="locale === 'ar' ? 'rtl' : 'ltr'">
      <v-card-title
        class="text-h5 font-weight-bold"
        :class="{ 'flex-row-reverse': locale === 'ar' }"
      >
        {{ props.mode === 'add' ? t('addCustomer') : t('editCustomer') }}
      </v-card-title>

      <v-card-subtitle class="mb-4" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
        {{ t('customerInformation') }}
      </v-card-subtitle>

      <v-card-text>
        <v-row :class="{ 'flex-row-reverse': locale === 'ar' }">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.firstName"
              :label="t('firstName')"
              :rules="[required]"
              :dir="locale === 'ar' ? 'rtl' : 'ltr'"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.lastName"
              :label="t('lastName')"
              :rules="[required]"
              :dir="locale === 'ar' ? 'rtl' : 'ltr'"
            />
          </v-col>
        </v-row>

        <v-text-field
          v-model="form.email"
          :label="t('email')"
          type="email"
          :rules="[required, emailRule]"
          :dir="locale === 'ar' ? 'rtl' : 'ltr'"
        />

        <div class="d-flex align-center" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
          <v-select
            v-model="form.countryCode"
            :items="countries"
            item-title="label"
            item-value="code"
            :label="t('country')"
            dense
            style="max-width: 150px"
            :rules="[required]"
            :dir="locale === 'ar' ? 'rtl' : 'ltr'"
          />
          <v-text-field
            v-model="form.mobile"
            :label="t('mobileNumber')"
            class="ml-3"
            style="flex: 1"
            :prefix="form.countryCode || ''"
            :rules="[required]"
            :dir="locale === 'ar' ? 'rtl' : 'ltr'"
          />
        </div>

        <v-switch
          v-model="form.isBlocked"
          :label="t('blockCustomer')"
          color="error"
          class="mt-4"
          :dir="locale === 'ar' ? 'rtl' : 'ltr'"
          :class="{ 'v-switch--reversed': locale === 'ar' }"
        />

        <v-switch
          v-model="showAddress"
          :label="t('addAddress')"
          color="primary"
          class="mt-4"
          :dir="locale === 'ar' ? 'rtl' : 'ltr'"
          :class="{ 'v-switch--reversed': locale === 'ar' }"
        />

        <div v-if="showAddress">
          <v-subheader class="pl-0" :dir="locale === 'ar' ? 'rtl' : 'ltr'">{{ t('customerAddress') }}</v-subheader>
          <v-text-field 
            v-model="form.address.street" 
            :label="t('street')" 
            :dir="locale === 'ar' ? 'rtl' : 'ltr'" 
          />
          <v-text-field 
            v-model="form.address.city" 
            :label="t('city')" 
            :dir="locale === 'ar' ? 'rtl' : 'ltr'" 
          />
          <v-text-field 
            v-model="form.address.state" 
            :label="t('state')" 
            :dir="locale === 'ar' ? 'rtl' : 'ltr'" 
          />
          <v-text-field 
            v-model="form.address.zipCode" 
            :label="t('zipCode')" 
            :dir="locale === 'ar' ? 'rtl' : 'ltr'" 
          />

          <v-switch
            v-model="sameAsCustomer"
            :label="t('sameBillingAddress')"
            color="secondary"
            class="mt-3"
            :dir="locale === 'ar' ? 'rtl' : 'ltr'"
            :class="{ 'v-switch--reversed': locale === 'ar' }"
          />

          <div v-if="!sameAsCustomer">
            <v-divider class="my-3" />
            <v-subheader class="pl-0" :dir="locale === 'ar' ? 'rtl' : 'ltr'">{{ t('billingAddress') }}</v-subheader>
            <v-text-field 
              v-model="form.billingAddress.street" 
              :label="t('street')" 
              :dir="locale === 'ar' ? 'rtl' : 'ltr'" 
            />
            <v-text-field 
              v-model="form.billingAddress.city" 
              :label="t('city')" 
              :dir="locale === 'ar' ? 'rtl' : 'ltr'" 
            />
            <v-text-field 
              v-model="form.billingAddress.state" 
              :label="t('state')" 
              :dir="locale === 'ar' ? 'rtl' : 'ltr'" 
            />
            <v-text-field 
              v-model="form.billingAddress.zipCode" 
              :label="t('zipCode')" 
              :dir="locale === 'ar' ? 'rtl' : 'ltr'" 
            />
          </div>
        </div>
      </v-card-text>

      <v-card-actions 
        :class="[
          'd-flex',
          'justify-start',
          locale === 'ar' ? 'flex-row-reverse' : ''
        ]"
      >
        <v-btn
          variant="tonal"
          color="primary"
          @click="handleSubmit"
          :disabled="!isFormValid"
          style="height: 50px; border-radius: 12px;"
        >
          {{ props.mode === 'add' ? t('add') : t('save') }}
        </v-btn>
        <v-btn
          variant="outlined"
          color="primary"
          @click="handleCancel"
          class="ml-2"
          style="height: 50px; border-radius: 12px;"
        >
          {{ t('cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

const { t, locale } = useI18n()
const toast = useToast()

const props = defineProps({
  modelValue: Boolean,
  mode: {
    type: String,
    default: 'add',
    validator: value => ['add', 'edit'].includes(value)
  },
  customer: Object
})

const emit = defineEmits(['update:modelValue', 'save'])

const internalDialog = ref(props.modelValue)
watch(internalDialog, val => emit('update:modelValue', val))
watch(() => props.modelValue, val => (internalDialog.value = val))

const countries = [
  { label: 'Egypt +20', code: '+20' },
  { label: 'Saudi Arabia +966', code: '+966' },
  { label: 'UAE +971', code: '+971' },
  { label: 'USA +1', code: '+1' },
  { label: 'UK +44', code: '+44' }
]

const showAddress = ref(false)
const sameAsCustomer = ref(true)

const form = ref({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  countryCode: '+20',
  mobile: '',
  isBlocked: false,
  address: { street: '', city: '', state: '', zipCode: '' },
  billingAddress: { street: '', city: '', state: '', zipCode: '' }
})

watch(() => props.customer, (customer) => {
  if (customer) {
    form.value = {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      countryCode: customer.mobile?.startsWith('+') 
        ? customer.mobile.substring(0, 3) 
        : '+20',
      mobile: customer.mobile?.startsWith('+') 
        ? customer.mobile.substring(3) 
        : customer.mobile,
      isBlocked: customer.isBlocked || false,
      address: customer.address?.[0]?.text 
        ? { 
            street: customer.address[0].text,
            city: customer.address[0].city?.name || '',
            state: customer.address[0].province?.name || '',
            zipCode: ''
          }
        : { street: '', city: '', state: '', zipCode: '' },
      billingAddress: { street: '', city: '', state: '', zipCode: '' }
    }
    showAddress.value = !!customer.address?.[0]?.text
  }
}, { immediate: true })

const required = v => !!v || t('requiredField')
const emailRule = v => /.+@.+\..+/.test(v) || t('invalidEmail')

const isFormValid = computed(() => {
  return form.value.firstName &&
         form.value.lastName &&
         form.value.email &&
         form.value.countryCode &&
         form.value.mobile
})

function reset() {
  form.value = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+20',
    mobile: '',
    isBlocked: false,
    address: { street: '', city: '', state: '', zipCode: '' },
    billingAddress: { street: '', city: '', state: '', zipCode: '' }
  }
  showAddress.value = false
  sameAsCustomer.value = true
}

function handleCancel() {
  internalDialog.value = false
  reset()
}

function handleSubmit() {
  const customerData = {
    ...form.value,
    mobile: form.value.countryCode + form.value.mobile
  }

  if (!showAddress.value) {
    delete customerData.address
    delete customerData.billingAddress
  } else if (sameAsCustomer.value) {
    customerData.billingAddress = { ...customerData.address }
  }

  emit('save', customerData)

  toast.success(props.mode === 'add' ? t('customerAdded') : t('customerUpdated'))

  handleCancel()
}
</script>

<style scoped>
/* تعديلات خاصة بالاتجاه RTL */
[dir="rtl"] .v-input__control {
  direction: rtl;
  text-align: right;
}

[dir="rtl"] .v-label {
  right: 0;
  left: auto;
}

.v-switch--reversed :deep(.v-selection-control) {
  flex-direction: row-reverse;
  justify-content: flex-end;
}

.v-switch--reversed :deep(.v-label) {
  padding-left: 0;
  padding-right: 12px;
}
</style>