<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <v-text-field
        v-model="customerStore.searchQuery"
        label="Search customers"
        prepend-inner-icon="mdi-magnify"
        clearable
        density="comfortable"
        hide-details
        class="mr-4"
      />
      <v-btn
        color="primary"
        @click="dialog = true"
        style="height: 50px; border-radius: 12px"
      >
        <v-icon left>mdi-plus</v-icon>
        Add New Customer
      </v-btn>
    </div>

    <div class="d-flex justify-end mb-4">
      <v-btn
        v-model="statusFilter"
        value="All"
        color="primary"
        class="mr-2"
        @click="statusFilter = 'All'"
      >
        All
      </v-btn>

      <v-btn
        v-model="statusFilter"
        value="Active"
        color="success"
        class="mr-2"
        @click="statusFilter = 'Active'"
      >
        Active
      </v-btn>

      <v-btn
        v-model="statusFilter"
        value="Blocked"
        color="error"
        class="mr-2"
        @click="statusFilter = 'Blocked'"
      >
        Blocked
      </v-btn>
    </div>

    <div class="d-flex justify-end mb-2" v-if="selected.length">
      <v-btn
        color="error"
        @click="confirmDeleteDialog = true"
        prepend-icon="mdi-delete"
      >
        Delete Selected ({{ selected.length }})
      </v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="paginatedCustomers"
      :items-per-page="pagination.itemsPerPage"
      v-model:items-per-page="pagination.itemsPerPage"
      v-model:page="pagination.page"
      v-model="selected"
      class="elevation-1 rounded-lg custom-table"
      item-value="id"
      show-select
    >
      <template #item.status="{ item }">
        <v-chip
          :color="item.isBlocked ? 'error' : 'primary'"
          text-color="white"
          variant="elevated"
          class="ma-1"
        >
          {{ item.isBlocked ? 'Blocked' : 'Active' }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex align-center">
          <v-btn
            icon
            size="small"
            color="primary"
            @click="editCustomer(item.id)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>

          <v-btn
            icon
            size="small"
            color="error"
            @click="removeCustomer(item.id)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>

    <v-dialog v-model="confirmDeleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete the selected customers?</v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="confirmDeleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="confirmDelete">Yes, Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <CustomerDialog v-model="dialog" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCustomerStore } from '../store/customers'
import CustomerDialog from '../components/Customers/CustomerDialog.vue'

const customerStore = useCustomerStore()
const dialog = ref(false)
const confirmDeleteDialog = ref(false)
const statusFilter = ref('All')
const pagination = ref({ page: 1, itemsPerPage: 10 })
const selected = ref([])

const totalPages = computed(() => {
  return Math.ceil(customerStore.filteredCustomers.length / pagination.value.itemsPerPage)
})

const filteredByStatus = computed(() => {
  if (statusFilter.value === 'Active') {
    return customerStore.filteredCustomers.filter(c => !c.isBlocked)
  } else if (statusFilter.value === 'Blocked') {
    return customerStore.filteredCustomers.filter(c => c.isBlocked)
  }
  return customerStore.filteredCustomers
})

const paginatedCustomers = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.itemsPerPage
  const end = start + pagination.value.itemsPerPage
  return filteredByStatus.value.slice(start, end)
})

const headers = [
  { title: 'First Name', key: 'firstName', class: 'text-black' },
  { title: 'Last Name', key: 'lastName', class: 'text-black' },
  { title: 'Email', value: 'email', class: 'text-black' },
  { title: 'Status', value: 'status', class: 'text-black' },
  { title: 'Actions', value: 'actions', sortable: false, class: 'text-black' }
]

const removeCustomer = (id) => {
  customerStore.removeCustomer(id)
}

const editCustomer = (id) => {
  console.log('Editing customer with id:', id)
}

const confirmDelete = () => {
  selected.value.forEach(customer => {
    customerStore.removeCustomer(customer.id)
  })
  selected.value = []
  confirmDeleteDialog.value = false
}
</script>
