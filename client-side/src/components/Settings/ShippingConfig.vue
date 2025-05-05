<template>
  <v-card class="mb-6">
    <v-card-title
      class="primary d-flex align-center"
      :class="{ 'flex-row-reverse': $i18n.locale === 'ar' }"
    >
      <v-icon
        class="mx-2"
        :left="$i18n.locale !== 'ar'"
        :right="$i18n.locale === 'ar'"
      >
        mdi-truck
      </v-icon>
      <span>{{ $t('shippingMethods') }}</span>
    </v-card-title>
    <v-card-text>
      <SkeletonLoader
        v-if="isLoading"
        :columns="['Method Name', 'Cost', 'Actions']"
        :rows="5"
        :loading="isLoading"
      />
      <v-data-table
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
        :headers="shippingHeaders"
        :items="shippingStore.shippingMethods"
        class="elevation-1"
        hide-default-footer
        :page.sync="shippingStore.pagination.page"
        :items-per-page="shippingStore.pagination.limit"
        :server-items-length="shippingStore.pagination.total"
      >
        <template v-slot:top>
          <v-toolbar
            flat
            :color="$vuetify.theme.current.dark ? 'surface' : 'white'"
          >
            <v-btn
              color="secondary"
              @click="openShippingDialog(null)"
              class="w-100"
            >
              <v-icon left>mdi-plus</v-icon>
              {{ $t('addMethod') }}
            </v-btn>
          </v-toolbar>
        </template>

        <template v-slot:header="{ headers }">
          <thead>
            <tr>
              <th v-for="header in headers" :key="header.value">
                {{ header.title }}
              </th>
            </tr>
          </thead>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon @click="openShippingDialog(item)" color="" class="mx-2"
            >mdi-pencil</v-icon
          >
          <v-icon @click="confirmDelete(item._id)" color="red"
            >mdi-delete</v-icon
          >
        </template>

        <template v-slot:item.cost="{ item }">
          {{ formatCurrency(item.cost) }}
        </template>

        <template v-slot:loading>
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            class="ma-auto"
          ></v-progress-circular>
        </template>

        <template v-slot:no-data>
          <div class="text-center py-12">
            <v-icon size="96" color="grey lighten-1">mdi-truck-off</v-icon>
            <p class="text-h4 grey--text mt-4">
              {{ $t('noShippingMethods') }}
            </p>
          </div>
        </template>
      </v-data-table>

      <PaginationControls
        v-model:page="shippingStore.pagination.page"
        v-model:itemsPerPage="shippingStore.pagination.limit"
        :total-items="shippingStore.pagination.total"
        @update:page="handlePageChange"
        @update:itemsPerPage="handleItemsPerPageChange"
        class="mt-4"
      />

      <!-- Shipping Method Dialog -->
      <v-dialog v-model="shippingDialog" max-width="500px" persistent>
        <v-card class="p-3">
          <v-card-title>
            {{
              editingShipping
                ? $t('editShippingMethod')
                : $t('newShippingMethod')
            }}
          </v-card-title>
          <v-card-text>
            <v-form ref="shippingForm" @submit.prevent="saveShippingMethod">
              <v-text-field
                v-model="currentShipping.name"
                :label="$t('methodName')"
                :rules="nameRules"
                required
              ></v-text-field>
              <v-text-field
                v-model.number="currentShipping.cost"
                :label="$t('cost')"
                type="number"
                prefix="$"
                :rules="costRules"
                required
              ></v-text-field>
              <v-card-actions class="justify-end">
                <v-btn
                  :color="
                    $vuetify.theme.current.dark ? 'grey-ligthen-2' : 'secondary'
                  "
                  @click="closeShippingDialog"
                  class="mr-2"
                >
                  {{ $t('cancel') }}
                </v-btn>
                <v-btn
                  type="submit"
                  color="success"
                  :disabled="!isFormValid"
                  :loading="shippingStore.loading"
                >
                  {{ $t('save') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Delete Confirmation Dialog -->
      <ConfirmDialog
        ref="deleteConfirmDialog"
        :title="$t('confirmDeleteTitle')"
        :message="$t('confirmDeleteMessage')"
        :confirm-text="$t('delete')"
        :cancel-text="$t('cancel')"
        confirm-color="error"
        type="warning"
        @confirm="onDeleteConfirmed"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useToast } from 'vue-toastification'
  import { useI18n } from 'vue-i18n'
  import { useShippingStore } from '../../store/useShippingStore'
  import { useCurrencyStore } from '../../store/useCurrencyStore'
  import PaginationControls from '../Shared/PaginationControls.vue'
  import ConfirmDialog from '../Shared/ConfirmDialog.vue'
  import SkeletonLoader from '../Shared/SkeletonLoader.vue'

  const { t } = useI18n()
  const shippingStore = useShippingStore()
  const currencyStore = useCurrencyStore()
  const toast = useToast()
  const isLoading = ref(true)

  // Dialog state
  const shippingDialog = ref(false)
  const editingShipping = ref(false)
  const shippingForm = ref(null)
  const deleteConfirmDialog = ref(null)
  const currentShipping = ref({
    name: '',
    cost: 0
  })

  // Form validation
  const nameRules = [
    (v) => !!v || t('fieldRequired'),
    (v) => (v && v.length <= 50) || t('nameTooLong')
  ]

  const costRules = [
    (v) => !!v || t('fieldRequired'),
    (v) => !isNaN(v) || t('mustBeNumber'),
    (v) => v >= 0 || t('mustBePositive')
  ]

  // Table headers
  const shippingHeaders = computed(() => [
    {
      title: t('methodName'),
      value: 'name',
      sortable: true,
      align: 'start'
    },
    { title: t('cost'), value: 'cost', sortable: true },
    { title: t('actions'), value: 'actions', sortable: false }
  ])

  const isFormValid = computed(() => {
    return (
      currentShipping.value.name.trim() !== '' &&
      currentShipping.value.cost !== null &&
      !isNaN(currentShipping.value.cost) &&
      currentShipping.value.cost >= 0
    )
  })

  // Pagination handlers
const handlePageChange = async (newPage) => {
  try {
    isLoading.value = true
    await shippingStore.fetchShippingMethods(newPage, shippingStore.pagination.limit)
  } catch (error) {
    toast.error(t('error.fetchMethods'))
  } finally {
    isLoading.value = false
  }
}

const handleItemsPerPageChange = async (newSize) => {
  try {
    isLoading.value = true
    await shippingStore.fetchShippingMethods(1, newSize)
  } catch (error) {
    toast.error(t('error.fetchMethods'))
  } finally {
    isLoading.value = false
  }
}
  // Dialog methods
  const openShippingDialog = (item = null) => {
    editingShipping.value = !!item
    currentShipping.value = item ? { ...item } : { name: '', cost: 0 }
    shippingDialog.value = true
  }

  const closeShippingDialog = () => {
    shippingDialog.value = false
    if (shippingForm.value) {
      shippingForm.value.resetValidation()
    }
  }

  // CRUD operations
  const saveShippingMethod = async () => {
    if (!shippingForm.value.validate()) return

    try {
      if (editingShipping.value) {
        await shippingStore.updateShippingMethod(currentShipping.value)
        toast.success(t('methodUpdated'))
      } else {
        await shippingStore.addShippingMethod(currentShipping.value)
        toast.success(t('methodAdded'))
      }
      closeShippingDialog()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const confirmDelete = (id) => {
    shippingStore.setItemToDelete(id)
    deleteConfirmDialog.value.open()
  }

  const onDeleteConfirmed = async () => {
    try {
      await shippingStore.deleteShippingMethod(shippingStore.itemToDelete)
      toast.success(t('methodDeleted'))
      await shippingStore.fetchShippingMethods({
        page: shippingStore.pagination.page,
        limit: shippingStore.pagination.limit
      })
    } catch (error) {
      toast.error(t('error.deleteMethod'))
    }
  }

  // Currency formatting
  const formatCurrency = (value) => {
    return `${currencyStore.symbol}${(value * currencyStore.rate).toFixed(2)}`
  }

  // Initial load
  onMounted(async() => {
   try {
    isLoading.value = true
    await shippingStore.fetchShippingMethods()
  } catch (error) {
    toast.error(t('error.fetchMethods'))
  } finally {
    isLoading.value = false
  }
  })
</script>

<style scoped>
  .hover-row:hover {
    background-color: rgba(0, 0, 0, 0.02);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .v-table {
    width: 100%;
  }

  .v-card-title {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  tr td {
    padding: 20px !important;
  }

  /* Apply only when dir="rtl" */
  [dir='rtl'] tr th {
    text-align: right !important;
  }

  /* Optional: Add other RTL-specific table styles */
  [dir='rtl'] .v-table td {
    text-align: right !important;
  }
</style>
