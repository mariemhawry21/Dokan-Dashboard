<template>
  <v-dialog v-model="internalDialog" max-width="800">
    <v-card>
      <v-card-title class="text-h5 font-weight-bold">
        Add a New Customer
      </v-card-title>
      <v-card-subtitle class="mb-4">Customer Information</v-card-subtitle>

      <v-card-text>
        <v-text-field
          v-model="form.name"
          label="Customer Name"
          :rules="[nameRequired]"
        />
        <v-text-field
          v-model="form.email"
          label="Customer Email"
          :rules="[emailRequired]"
        />

        <div class="d-flex align-center">
          <v-select
            v-model="form.country"
            :items="countries"
            item-title="label"
            item-value="code"
            label="Country"
            return-object
            dense
            style="max-width: 150px"
            :rules="[countryRequired]"
          />
          <v-text-field
            v-model="form.mobile"
            label="Mobile Number"
            class="ml-3"
            style="flex: 1"
            :prefix="form.country?.code || ''"
          />
        </div>

        <v-switch
          v-model="showAddress"
          label="Add Address"
          color="primary"
          class="mt-4"
        />

        <div v-if="showAddress">
          <v-subheader class="pl-0">Customer Address</v-subheader>
          <v-text-field v-model="form.address.street" label="Street" />
          <v-text-field v-model="form.address.city" label="City" />
          <v-text-field v-model="form.address.state" label="State" />
          <v-text-field v-model="form.address.zipCode" label="Zip Code" />

          <v-switch
            v-model="sameAsCustomer"
            label="Billing address same as customer address"
            color="secondary"
            class="mt-3"
          />

          <div v-if="!sameAsCustomer">
            <v-divider class="my-3" />
            <v-subheader class="pl-0">Billing Address</v-subheader>
            <v-text-field v-model="form.billingAddress.street" label="Street" />
            <v-text-field v-model="form.billingAddress.city" label="City" />
            <v-text-field v-model="form.billingAddress.state" label="State" />
            <v-text-field
              v-model="form.billingAddress.zipCode"
              label="Zip Code"
            />
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="d-flex justify-start">
        <v-btn
          variant="tonal"
          color="primary"
          @click="handleSubmit"
          :disabled="!isFormValid"
          style="height: 50px; border-radius: 12px;"
        >
          Add
        </v-btn>
        <v-btn
          variant="outlined"
          color="primary"
          @click="handleCancel"
          class="ml-2"
          style="height: 50px; border-radius: 12px;"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'
import { useCustomerStore } from '../../store/customers'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])

const internalDialog = ref(props.modelValue)
watch(internalDialog, val => emit('update:modelValue', val))
watch(() => props.modelValue, val => (internalDialog.value = val))

const customerStore = useCustomerStore()

const form = ref({
  name: '',
  email: '',
  country: { label: 'Egypt +20', code: '+20' },
  mobile: '',
  address: { street: '', city: '', state: '', zipCode: '' },
  billingAddress: { street: '', city: '', state: '', zipCode: '' }
})
const showAddress = ref(false)
const sameAsCustomer = ref(true)

const countries = [
  { label: 'Egypt +20', code: '+20' },
  { label: 'Saudi Arabia +966', code: '+966' },
  { label: 'UAE +971', code: '+971' },
  { label: 'USA +1', code: '+1' },
  { label: 'UK +44', code: '+44' }
]

const nameRequired = v => !!v || 'Name is required'
const emailRequired = v => !!v || 'Email is required'
const countryRequired = v => !!v || 'Country is required'

const isFormValid = computed(
  () => form.value.name && form.value.email && form.value.country
)

function reset() {
  form.value = {
    name: '',
    email: '',
    country: countries[0],
    mobile: '',
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
  const customer = { ...form.value }
  if (!showAddress.value) {
    delete customer.address
    delete customer.billingAddress
  } else if (sameAsCustomer.value) {
    customer.billingAddress = { ...customer.address }
  }
  customerStore.addCustomer(customer)
  handleCancel()
}
</script>
