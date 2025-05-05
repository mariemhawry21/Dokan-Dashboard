<template>
  <v-container fluid>
    <!-- Search and Filters -->
    <v-card class="mb-4" elevation="2">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="customerStore.searchQuery"
              label="Search customers"
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
            />
          </v-col>

          <v-col cols="6" md="2">
            <v-select
              v-model="customerStore.statusFilter"
              :items="statusOptions"
              label="state"
              clearable
              hide-details
            />
          </v-col>

          <v-col cols="6" md="2">
            <v-select
              v-model="customerStore.tierFilter"
              :items="tierOptions"
              label="Tier"
              clearable
              hide-details
            />
          </v-col>

          <v-col cols="6" md="2">
            <v-select
              v-model="customerStore.sortBy"
              :items="sortOptions"
              label="Sort By"
              hide-details
            />
          </v-col>

          <v-col cols="6" md="2" class="d-flex align-center">
            <v-btn
              color="secondary"
              class="pa-6"
              @click="customerStore.resetFilters"
              block
            >
              Reset
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- Action Toolbar -->
    <div class="d-flex align-center mb-4">
      <v-btn
        class="mr-3"
        variant="tonal"
        color="orange"
        :variant="selected.length ? 'flat' : 'outlined'"
      >
        {{ selected.length }} selected
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
            Bulk Actions
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item
            @click="bulkUpdateStatus('active')"
            prepend-icon="mdi-account-check"
          >
            <v-list-item-title>Mark as Active</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="bulkUpdateStatus('blocked')"
            prepend-icon="mdi-account-cancel"
          >
            <v-list-item-title>Mark as Blocked</v-list-item-title>
          </v-list-item>
          <v-list-item @click="addTagsToSelected" prepend-icon="mdi-tag">
            <v-list-item-title>Add Tags</v-list-item-title>
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
        Delete
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
        <div class="d-flex align-center">
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
  <div class="d-flex align-center">
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
      title="Confirm Deletion"
      :message="deleteMessage"
      confirm-text="Delete"
      confirm-color="error"
      @confirm="confirmDelete"
    />

    <!-- Bulk Tag Dialog -->
    <v-dialog v-model="tagDialog" max-width="500">
      <v-card>
        <v-card-title>Add Tags to Selected Customers</v-card-title>
        <v-card-text>
          <v-combobox
            v-model="selectedTags"
            label="Tags"
            multiple
            chips
            :items="commonTags"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="tagDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="applyTags">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Single Delete Confirmation -->
    <ConfirmDialog
      ref="singleDeleteDialog"
      title="Confirm Deletion"
      message="Are you sure you want to delete this customer? This action cannot be undone."
      confirm-text="Delete"
      confirm-color="error"
      @confirm="confirmSingleDelete"
    />
  </v-container>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useCustomerStore } from '../store/customers'
  import { useRouter } from 'vue-router'
  import ConfirmDialog from '../components/Shared/ConfirmDialog.vue'

  const router = useRouter()
  const customerStore = useCustomerStore()

  // Data

  const selected = ref([])
  const tagDialog = ref(false)
  const selectedTags = ref([])
  const customerToDelete = ref(null) // To store the ID of the customer to be deleted

  // Refs for dialog components
  const deleteConfirmDialog = ref(null)
  const singleDeleteDialog = ref(null)
  // Constants
  const defaultAvatar = 'https://cdn.vuetifyjs.com/images/profiles/male1.jpg'
  const statusOptions = ['active', 'blocked']
  const tierOptions = ['basic', 'silver', 'gold', 'platinum']
  const sortOptions = [
    { value: 'name', title: 'Name' },
    { value: 'joinDate', title: 'Join Date' },
    { value: 'totalSpent', title: 'Total Spent' },
    { value: 'lastOrder', title: 'Last Order' }
  ]
  const commonTags = ['VIP', 'Frequent Buyer', 'New', 'At Risk', 'Wholesale']

  // Computed
  const enhancedHeaders = computed(() => [
    { title: 'Customer', key: 'fullname', sortable: true },
    { title: 'Email', key: 'email' },
    { title: 'Phone', key: 'mobile' },
    { title: 'Tier', key: 'tier', sortable: true },
    { title: 'Tags', key: 'tags' },
    { title: 'Total Spent', key: 'totalSpent', sortable: true },
    { title: 'Orders', key: 'ordersCount', sortable: true },
    { title: 'state', key: 'state' },
    { title: 'Actions', key: 'actions', sortable: false }
  ])
  const deleteMessage = computed(
    () =>
      `Are you sure you want to delete ${selected.value.length} selected ${selected.value.length === 1 ? 'customer' : 'customers'}? This action cannot be undone.`
  )
  // Methods
  const viewCustomerDetails = (id) => {
    router.push(`/customers/${id}`)
  }
  const deleteSingleCustomer = (id) => {
    customerToDelete.value = id
    singleDeleteDialog.value.open()
  }

  const confirmSingleDelete = async () => {
    isDeleting.value = true
    try {
      await customerStore.removeCustomers([customerToDelete.value])
      // Optional: Show success notification
    } catch (error) {
      console.error('Failed to delete customer:', error)
      // Optional: Show error notification
    } finally {
      isDeleting.value = false
      customerToDelete.value = null
    }
  }
  const editCustomer = (customer) => {
    router.push(`/customers/edit/${customer.id}`)
  }

  const isDeleting = ref(false)

  const confirmDelete = async () => {
    isDeleting.value = true
    try {
      const idsToDelete = selected.value.map((c) =>
        typeof c === 'object' ? c.id : c
      )
      await customerStore.removeCustomers(idsToDelete)
      toast.success(
        `Deleted ${idsToDelete.length} ${idsToDelete.length === 1 ? 'customer' : 'customers'}`
      )
      selected.value = []
    } catch (error) {
      console.error('Failed to delete customers:', error)
      toast.error('Failed to delete customers')
    } finally {
      isDeleting.value = false
    }
  }

  const bulkUpdateStatus = async (status) => {
    try {
      // Get IDs from selected items (handles both string IDs and objects)
      const idsToUpdate = selected.value.map((c) =>
        typeof c === 'object' ? c.id : c
      )

      // Call store method to update status
      await customerStore.bulkUpdateStatus(idsToUpdate, status)

      // Show success message
      toast.success(`Updated status for ${idsToUpdate.length} customers`)

      // Clear selection after operation
      selected.value = []
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Failed to update customer status')
    }
  }

  // Fixed applyTags method
  const applyTags = async () => {
    try {
      // Get IDs from selected items
      const idsToTag = selected.value.map((c) =>
        typeof c === 'object' ? c.id : c
      )

      // Call store method to add tags to each customer
      for (const id of idsToTag) {
        await customerStore.addTag(id, ...selectedTags.value)
      }

      // Show success message
      toast.success(`Added tags to ${idsToTag.length} customers`)

      // Clear selection and close dialog
      selected.value = []
      selectedTags.value = []
      tagDialog.value = false
    } catch (error) {
      console.error('Failed to add tags:', error)
      toast.error('Failed to add tags to customers')
    }
  }

  const addTagsToSelected = () => {
    selectedTags.value = []
    tagDialog.value = true
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString()
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
  .v-avatar {
    flex-shrink: 0;
  }
</style>
