<template>
  <v-container fluid :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <!-- Search and Filters -->
    <v-card class="mb-4" elevation="2">
      <v-card-text>
        <v-row :class="{ 'flex-row-reverse': locale === 'ar' }">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="customerStore.searchQuery"
              :label="t('searchCustomers')"
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
              :dir="locale"
            />
          </v-col>

          <v-col cols="6" md="2">
            <v-select
              v-model="customerStore.statusFilter"
              :items="statusOptions"
              :label="t('status')"
              clearable
              hide-details
              :dir="locale"
            />
          </v-col>

          <v-col cols="6" md="2">
            <v-select
              v-model="customerStore.tierFilter"
              :items="tierOptions"
              :label="t('tier')"
              clearable
              hide-details
              :dir="locale"
            />
          </v-col>

          <v-col cols="6" md="2">
            <v-select
              v-model="customerStore.sortBy"
              :items="sortOptions"
              :label="t('sortBy')"
              hide-details
              :dir="locale"
            />
          </v-col>

          <v-col cols="6" md="2" class="d-flex align-center">
            <v-btn
              color="secondary"
              class="pa-6"
              @click="customerStore.resetFilters"
              block
            >
              {{ t('reset') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    
    <!-- Action Toolbar -->
    <div class="d-flex align-center mb-4" :class="{ 'flex-row-reverse': locale === 'ar' }">
      <v-btn
        class="mr-3"
        variant="tonal"
        color="orange"
        :variant="selected.length ? 'flat' : 'outlined'"
      >
        {{ t('selected', { count: selected.length }) }}
      </v-btn>
      
      <v-menu :disabled="!selected.length">
        <template v-slot:activator="{ props }">
          <v-btn
            color="secondary"
            variant="tonal"
            v-bind="props"
            prepend-icon="mdi-tune"
            class="mr-2"
            :disabled="!selected.length"
          >
            {{ t('bulkActions') }}
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item
            @click="bulkUpdateStatus('active')"
            prepend-icon="mdi-account-check"
          >
            <v-list-item-title>{{ t('markAsActive') }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="bulkUpdateStatus('blocked')"
            prepend-icon="mdi-account-cancel"
          >
            <v-list-item-title>{{ t('markAsBlocked') }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="addTagsToSelected" prepend-icon="mdi-tag">
            <v-list-item-title>{{ t('addTags') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        color="error"
        variant="tonal"
        prepend-icon="mdi-delete"
        @click="deleteConfirmDialog.open()"
        :loading="isDeleting"
        :disabled="!selected.length"
      >
        {{ t('delete') }}
      </v-btn>
    </div>
    
    <!-- Main Data Table -->
    <v-data-table
      :headers="enhancedHeaders"
      :items="customerStore.filteredCustomers"
      :items-per-page="customerStore.itemsPerPage"
      v-model:page="customerStore.currentPage"
      v-model="selected"
      show-select
      item-value="id"
      class="elevation-1"
      @click:row="(event, { item }) => viewCustomerDetails(item.id)"
    >
      <template #item.fullname="{ item }">
        <div class="d-flex align-center" :class="{ 'flex-row-reverse': locale === 'ar' }">
          <v-avatar size="36" class="mr-2">
            <v-img :src="item.avatar || defaultAvatar" />
          </v-avatar>
          {{ item.firstName }} {{ item.lastName }}
        </div>
      </template>

      <template #item.tier="{ item }">
        <v-chip :color="getTierColor(item.tier)" size="small">
          {{ formatTier(item.tier) }}
        </v-chip>
      </template>

      <template #item.tags="{ item }">
        <v-chip
          v-for="tag in item.tags.slice(0, 2)"
          :key="tag"
          size="small"
          class="mr-1 mb-1"
        >
          {{ tag }}
          <v-tooltip activator="parent" location="top">
            {{ item.tags.join(', ') }}
          </v-tooltip>
        </v-chip>
        <v-chip v-if="item.tags.length > 2" size="small"
          >+{{ item.tags.length - 2 }}</v-chip
        >
      </template>

      <template #item.totalSpent="{ item }">
        {{ formatCurrency(item.totalSpent) }}
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex align-center" :class="{ 'flex-row-reverse': locale === 'ar' }">
          <v-btn
            icon
            size="small"
            color="info"
            class="mr-2"
            @click.stop="editCustomer(item)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            size="small"
            color="error"
            @click.stop="deleteSingleCustomer(item.id)"
            :loading="isDeleting && customerToDelete === item.id"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>

    <!-- Delete Confirmation -->
    <ConfirmDialog
      ref="deleteConfirmDialog"
      :title="t('confirmDeletion')"
      :message="deleteMessage"
      :confirm-text="t('delete')"
      confirm-color="error"
      @confirm="confirmDelete"
    />

    <!-- Bulk Tag Dialog -->
    <v-dialog v-model="tagDialog" max-width="500" :dir="locale">
      <v-card :dir="locale">
        <v-card-title>{{ t('addTagsToSelected') }}</v-card-title>
        <v-card-text>
          <v-combobox
            v-model="selectedTags"
            :label="t('tags')"
            multiple
            chips
            :items="commonTags"
            :dir="locale"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="tagDialog = false">{{ t('cancel') }}</v-btn>
          <v-btn color="primary" @click="applyTags">{{ t('apply') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Single Delete Confirmation -->
    <ConfirmDialog
      ref="singleDeleteDialog"
      :title="t('confirmDeletion')"
      :message="t('deleteCustomerConfirm', { count: 1 })"
      :confirm-text="t('delete')"
      confirm-color="error"
      @confirm="confirmSingleDelete"
    />
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCustomerStore } from '../store/customers'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfirmDialog from '../components/Shared/ConfirmDialog.vue'

const { t, locale } = useI18n()
const toast = useToast()
const router = useRouter()
const customerStore = useCustomerStore()

// Data
const selected = ref([])
const tagDialog = ref(false)
const selectedTags = ref([])
const customerToDelete = ref(null)
const isDeleting = ref(false)
const deleteConfirmDialog = ref(null)
const singleDeleteDialog = ref(null)

// Constants
const defaultAvatar = 'https://cdn.vuetifyjs.com/images/profiles/male1.jpg'
const statusOptions = ['active', 'blocked'].map(status => ({
  value: status,
  title: t(status)
}))
const tierOptions = ['basic', 'silver', 'gold', 'platinum'].map(tier => ({
  value: tier,
  title: t(tier)
}))
const sortOptions = [
  { value: 'name', title: t('name') },
  { value: 'joinDate', title: t('joinDate') },
  { value: 'totalSpent', title: t('totalSpent') },
  { value: 'lastOrder', title: t('lastOrder') }
]
const commonTags = ['VIP', 'Frequent Buyer', 'New', 'At Risk', 'Wholesale']

// Computed
const enhancedHeaders = computed(() => [
  { title: t('customer'), key: 'fullname', sortable: true },
  { title: t('email'), key: 'email' },
  { title: t('phone'), key: 'mobile' },
  { title: t('tier'), key: 'tier', sortable: true },
  { title: t('tags'), key: 'tags' },
  { title: t('totalSpent'), key: 'totalSpent', sortable: true },
  { title: t('orders'), key: 'ordersCount', sortable: true },
  { title: t('status'), key: 'status' },
  { title: t('actions'), key: 'actions', sortable: false }
])

const deleteMessage = computed(() => 
  t('deleteCustomerConfirm', { count: selected.value.length })
)

// Methods
const viewCustomerDetails = (id) => {
  router.push(`/customers/${id}`)
}

const editCustomer = (customer) => {
  router.push(`/customers/edit/${customer.id}`)
}

const deleteSingleCustomer = (id) => {
  customerToDelete.value = id
  singleDeleteDialog.value.open()
}

const confirmSingleDelete = async () => {
  isDeleting.value = true
  try {
    await customerStore.removeCustomers([customerToDelete.value])
    toast.success(t('customerDeleted'))
  } catch (error) {
    console.error('Failed to delete customer:', error)
    toast.error(t('deleteError'))
  } finally {
    isDeleting.value = false
    customerToDelete.value = null
  }
}

const confirmDelete = async () => {
  isDeleting.value = true
  try {
    const idsToDelete = selected.value.map((c) =>
      typeof c === 'object' ? c.id : c
    )
    await customerStore.removeCustomers(idsToDelete)
    toast.success(
      t('customersDeleted', { count: idsToDelete.length })
    )
    selected.value = []
  } catch (error) {
    console.error('Failed to delete customers:', error)
    toast.error(t('deleteError'))
  } finally {
    isDeleting.value = false
  }
}

const bulkUpdateStatus = async (status) => {
  try {
    const idsToUpdate = selected.value.map((c) =>
      typeof c === 'object' ? c.id : c
    )
    await customerStore.bulkUpdateStatus(idsToUpdate, status)
    toast.success(t('statusUpdated', { count: idsToUpdate.length }))
    selected.value = []
  } catch (error) {
    console.error('Failed to update status:', error)
    toast.error(t('updateError'))
  }
}

const addTagsToSelected = () => {
  selectedTags.value = []
  tagDialog.value = true
}

const applyTags = async () => {
  try {
    const idsToTag = selected.value.map((c) =>
      typeof c === 'object' ? c.id : c
    )
    for (const id of idsToTag) {
      await customerStore.addTag(id, ...selectedTags.value)
    }
    toast.success(t('tagsAdded', { count: idsToTag.length }))
    selected.value = []
    selectedTags.value = []
    tagDialog.value = false
  } catch (error) {
    console.error('Failed to add tags:', error)
    toast.error(t('tagsError'))
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString(locale.value)
}

const getTierColor = (tier) => {
  const colors = {
    basic: 'grey',
    silver: 'blue-grey',
    gold: 'amber',
    platinum: 'blue'
  }
  return colors[tier] || 'primary'
}

const formatTier = (tier) => {
  return tier.charAt(0).toUpperCase() + tier.slice(1)
}
</script>

<style scoped>
/* RTL Styles */
[dir="rtl"] .v-data-table-header th {
  text-align: right;
}

[dir="rtl"] .v-btn__prepend {
  margin-right: 0;
  margin-left: 8px;
}

.v-avatar {
  flex-shrink: 0;
}

/* Adjust menu items for RTL */
[dir="rtl"] .v-list-item__prepend {
  margin-right: 0;
  margin-left: 16px;
}

/* Adjust text fields for RTL */
[dir="rtl"] .v-text-field .v-input__control {
  direction: rtl;
}

[dir="rtl"] .v-text-field .v-label {
  right: 0;
  left: auto;
  transform-origin: top right;
}

/* Adjust select fields for RTL */
[dir="rtl"] .v-select .v-select__selection {
  direction: rtl;
  text-align: right;
}
</style>