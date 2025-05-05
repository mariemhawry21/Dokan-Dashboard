<template>
  <v-container>
    <!-- Back Button -->
    <v-btn color="primary" class="mb-4" @click="$router.push('/customers')">
      <v-icon left>mdi-arrow-left</v-icon>
      Back to Customers List
    </v-btn>

    <!-- Loading State -->
    <v-skeleton-loader v-if="loading" type="card"></v-skeleton-loader>

    <!-- Main Content -->
    <template v-else>
      <!-- Customer Not Found -->
      <v-alert v-if="!customer" type="error" class="mb-4">
        Customer not found
      </v-alert>

      <!-- Customer Details -->
      <v-card v-else elevation="4" class="rounded-lg">
        <v-card-title
          class="d-flex justify-space-between align-center bg-primary py-4"
        >
          <div class="d-flex align-center">
            <v-avatar size="40" class="mr-3">
              <v-img
                :src="
                  customer.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'
                "
              />
            </v-avatar>
            <div>
              <h1 class="text-h5 text-white mb-1">{{ customer.fullName }}</h1>
              <div class="d-flex align-center">
                <v-chip
                  :color="customer.isBlocked ? 'error' : 'success'"
                  small
                  class="mr-2"
                >
                  {{ customer.isBlocked ? 'Blocked' : 'Active' }}
                </v-chip>
                <span class="text-caption text-white">{{
                  customer.email
                }}</span>
              </div>
            </div>
          </div>
          <v-chip :color="getTierColor(customer.tier)" dark>
            <v-icon left>{{ getTierIcon(customer.tier) }}</v-icon>
            {{ formatTier(customer.tier) }}
          </v-chip>
        </v-card-title>

        <!-- Tabs -->
        <v-tabs v-model="tab" bg-color="primary" grow>
          <v-tab value="overview">
            <v-icon left>mdi-information</v-icon>
            Overview
          </v-tab>
          <v-tab value="orders">
            <v-icon left>mdi-shopping</v-icon>
            Orders ({{ customer.ordersCount }})
          </v-tab>
          <v-tab value="addresses">
            <v-icon left>mdi-map-marker</v-icon>
            Addresses ({{ customer.addresses.length }})
          </v-tab>
          <v-tab value="activity">
            <v-icon left>mdi-history</v-icon>
            Activity
          </v-tab>
        </v-tabs>

        <!-- Tab Content -->
        <v-window v-model="tab">
          <!-- Overview -->
          <v-window-item value="overview">
            <v-row class="ma-2">
              <v-col cols="12" md="4">
                <v-card class="pa-4" elevation="2">
                  <div class="text-center">
                    <v-avatar size="150" class="mb-4">
                      <v-img
                        :src="
                          customer.avatar ||
                          'https://cdn.vuetifyjs.com/images/john.jpg'
                        "
                      />
                    </v-avatar>
                    <h2 class="text-h5">{{ customer.fullName }}</h2>
                    <v-chip
                      class="mt-2"
                      :color="getTierColor(customer.tier)"
                      dark
                    >
                      <v-icon left>{{ getTierIcon(customer.tier) }}</v-icon>
                      {{ formatTier(customer.tier) }}
                    </v-chip>
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <v-list density="compact">
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon>mdi-email</v-icon>
                      </template>
                      <v-list-item-title>{{
                        customer.email
                      }}</v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon>mdi-phone</v-icon>
                      </template>
                      <v-list-item-title>{{
                        customer.mobile
                      }}</v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon>mdi-calendar</v-icon>
                      </template>
                      <v-list-item-title>
                        Join Date: {{ formatDate(customer.joinDate) }}
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item v-if="customer.birthDate">
                      <template v-slot:prepend>
                        <v-icon>mdi-cake</v-icon>
                      </template>
                      <v-list-item-title>
                        Birth Date: {{ formatDate(customer.birthDate) }} (Age:
                        {{ calculateAge(customer.birthDate) }})
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>

              <v-col cols="12" md="8">
                <!-- Customer Statistics -->
                <v-card class="mb-4" elevation="2">
                  <v-card-title class="bg-primary-lighten-1">
                    <v-icon left>mdi-chart-bar</v-icon>
                    Customer Statistics
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="6" sm="3">
                        <div
                          class="text-center pa-4"
                          style="border-left: 4px solid #4caf50"
                        >
                          <div class="text-h5 font-weight-bold">
                            {{ customer.ordersCount }}
                          </div>
                          <div class="text-caption">Total Orders</div>
                        </div>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <div
                          class="text-center pa-4"
                          style="border-left: 4px solid #2196f3"
                        >
                          <div class="text-h5 font-weight-bold">
                            {{ formatCurrency(customer.totalSpent) }}
                          </div>
                          <div class="text-caption">Total Spent</div>
                        </div>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <div
                          class="text-center pa-4"
                          style="border-left: 4px solid #ffc107"
                        >
                          <div class="text-h5 font-weight-bold">
                            {{
                              formatCurrency(
                                customer.ordersCount > 0
                                  ? customer.totalSpent / customer.ordersCount
                                  : 0
                              )
                            }}
                          </div>
                          <div class="text-caption">Average Order</div>
                        </div>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <div
                          class="text-center pa-4"
                          style="border-left: 4px solid #9c27b0"
                        >
                          <div class="text-h5 font-weight-bold">
                            {{
                              customer.lastOrderDate
                                ? formatDate(customer.lastOrderDate)
                                : '--'
                            }}
                          </div>
                          <div class="text-caption">Last Order</div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text> </v-card
                ><v-card class="mb-4" elevation="2">
                  <v-card-title class="bg-primary-lighten-1">
                    <v-icon left>mdi-chart-bar</v-icon>
                    Customer Statistics
                  </v-card-title>
                  <v-card-text class="pa-0">
                    <v-row no-gutters>
                      <v-col
                        v-for="(stat, i) in customerStats"
                        :key="i"
                        cols="6"
                        sm="3"
                      >
                        <div class="stat-card" :class="`stat-${i}`">
                          <div class="stat-value">{{ stat.value }}</div>
                          <div class="stat-label">{{ stat.label }}</div>
                          <v-icon class="stat-icon">{{ stat.icon }}</v-icon>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

                <!-- Communication Preferences -->
                <v-card class="mb-4" elevation="2">
                  <v-card-title class="bg-primary-lighten-1">
                    <v-icon left>mdi-bell</v-icon>
                    Communication Preferences
                  </v-card-title>
                  <v-card-text>
                    <v-chip-group>
                      <v-chip
                        v-for="(
                          enabled, method
                        ) in customer.communicationPreferences"
                        :key="method"
                        :color="enabled ? 'primary' : 'grey'"
                        :variant="enabled ? 'elevated' : 'outlined'"
                      >
                        <v-icon left>{{ getCommunicationIcon(method) }}</v-icon>
                        {{ formatCommunicationMethod(method) }}
                      </v-chip>
                    </v-chip-group>
                  </v-card-text>
                </v-card>

                <!-- Notes -->
                <v-card elevation="2">
                  <v-card-title class="bg-primary-lighten-1">
                    <v-icon left>mdi-note</v-icon>
                    Notes
                  </v-card-title>
                  <v-card-text>
                    <div v-if="customer.notes" class="text-body-1">
                      {{ customer.notes }}
                    </div>
                    <div v-else class="text-grey">No notes available</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Orders -->
          <v-window-item value="orders">
            <v-card class="ma-2" elevation="2">
              <v-card-title class="bg-primary-lighten-1">
                <v-icon left>mdi-shopping</v-icon>
                Order History
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="orderHeaders"
                  :items="customerOrders"
                  :items-per-page="5"
                  class="elevation-1"
                  :loading="ordersLoading"
                >
                  <template v-slot:item.orderDate="{ item }">
                    {{ formatDate(item.orderDate) }}
                  </template>
                  <template v-slot:item.total="{ item }">
                    {{ formatCurrency(item.total) }}
                  </template>
                  <template v-slot:item.status="{ item }">
                    <v-chip :color="getOrderStatusColor(item.status)" small>
                      {{ formatOrderStatus(item.status) }}
                    </v-chip>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn
                      icon
                      size="small"
                      color="primary"
                      @click="viewOrderDetails(item)"
                    >
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-window-item>

          <!-- Addresses -->
          <v-window-item value="addresses">
            <v-card class="ma-2" elevation="2">
              <v-card-title class="bg-primary-lighten-1">
                <v-icon left>mdi-map-marker</v-icon>
                Customer Addresses
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col
                    v-for="(address, index) in customer.addresses"
                    :key="index"
                    cols="12"
                    md="6"
                  >
                    <v-card
                      :class="{ 'border-primary': address.isDefault }"
                      border
                    >
                      <v-card-title>
                        Address {{ index + 1 }}
                        <v-chip
                          v-if="address.isDefault"
                          color="info"
                          small
                          class="ml-2"
                        >
                          Default
                        </v-chip>
                      </v-card-title>
                      <v-card-text>
                        <v-list density="compact">
                          <v-list-item>
                            <v-list-item-title>Street:</v-list-item-title>
                            <v-list-item-subtitle>{{
                              address.street
                            }}</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-title>City:</v-list-item-title>
                            <v-list-item-subtitle>{{
                              address.city.name
                            }}</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-title>Province:</v-list-item-title>
                            <v-list-item-subtitle>{{
                              address.province.name
                            }}</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-title>Postal Code:</v-list-item-title>
                            <v-list-item-subtitle>{{
                              address.postalCode
                            }}</v-list-item-subtitle>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                      <v-card-actions style="display: flex; gap: 30px">
                        <v-btn
                          color="error"
                          variant="text"
                          @click="confirmDeleteAddress(address)"
                        >
                          Delete
                        </v-btn>
                        <v-btn
                          v-if="!address.isDefault"
                          color="secondary"
                          variant="text"
                          @click="setDefaultAddress(address)"
                        >
                          Set as Default
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-window-item>

          <!-- Activity -->
          <v-window-item value="activity">
            <v-card class="ma-2" elevation="2">
              <v-card-title class="bg-primary-lighten-1">
                <v-icon left>mdi-history</v-icon>
                Activity Log
              </v-card-title>
              <v-card-text>
                <v-timeline side="end" align="start">
                  <v-timeline-item
                    v-for="(activity, index) in customerActivity"
                    :key="index"
                    :dot-color="getActivityColor(activity.type)"
                    :icon="getActivityIcon(activity.type)"
                    size="small"
                  >
                    <v-card>
                      <v-card-text>
                        <div class="d-flex justify-space-between">
                          <strong>{{
                            formatActivityType(activity.type)
                          }}</strong>
                          <span class="text-caption">{{
                            formatDateTime(activity.date)
                          }}</span>
                        </div>
                        <div>{{ activity.description }}</div>
                        <div
                          v-if="activity.ipAddress"
                          class="text-caption mt-1"
                        >
                          <v-icon small>mdi-ip</v-icon> {{ activity.ipAddress }}
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>

        <!-- Action Buttons -->
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="tonal" @click="editCustomer">
            <v-icon left>mdi-pencil</v-icon>
            Edit Customer
          </v-btn>
          <v-btn
            :color="customer.isBlocked ? 'success' : 'error'"
            variant="tonal"
            @click="toggleBlockStatus"
          >
            <v-tooltip activator="parent" location="top">
              {{
                customer.isBlocked
                  ? 'Unblock this customer'
                  : 'Block this customer'
              }}
            </v-tooltip>
            <v-icon left>{{
              customer.isBlocked ? 'mdi-lock-open' : 'mdi-lock'
            }}</v-icon>
            {{ customer.isBlocked ? 'Unblock' : 'Block' }}
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- Add Address Dialog -->
      <v-dialog v-model="addAddressDialog" max-width="600">
        <v-card>
          <v-card-title>Add New Address</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="saveAddress">
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="newAddress.province"
                    :items="provinces"
                    item-title="name"
                    item-value="id"
                    label="Province"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="newAddress.city"
                    :items="filteredCities"
                    item-title="name"
                    item-value="id"
                    label="City"
                    required
                    :disabled="!newAddress.province"
                  ></v-select>
                </v-col>
              </v-row>
              <v-text-field
                v-model="newAddress.street"
                label="Street"
                required
              ></v-text-field>
              <v-text-field
                v-model="newAddress.postalCode"
                label="Postal Code"
                required
              ></v-text-field>
              <v-checkbox
                v-model="newAddress.isDefault"
                label="Set as default address"
              ></v-checkbox>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" @click="addAddressDialog = false"
              >Cancel</v-btn
            >
            <v-btn color="primary" @click="saveAddress">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Confirm Delete Address Dialog -->
      <ConfirmDialog
        ref="deleteAddressDialog"
        title="Confirm Delete"
        message="Are you sure you want to delete this address?"
        confirm-text="Delete"
        confirm-color="error"
        type="error"
        @confirm="deleteAddress"
      />
      <ConfirmDialog
        ref="blockStatusDialog"
        :title="customer?.isBlocked ? 'Confirm Unblock' : 'Confirm Block'"
        :message="
          customer?.isBlocked
            ? 'Are you sure you want to unblock this customer?'
            : 'Are you sure you want to block this customer?'
        "
        confirm-text="Confirm"
        confirm-color="error"
        :type="customer?.isBlocked ? 'warning' : 'error'"
        @confirm="confirmToggleBlockStatus"
      />
    </template>
  </v-container>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useCustomerStore } from '../store/customers'
  import { useToast } from 'vue-toastification'
  import ConfirmDialog from '../components/Shared/ConfirmDialog.vue'

  const route = useRoute()
  const router = useRouter()
  const customerStore = useCustomerStore()
  const toast = useToast()

  // State
  const loading = ref(true)
  const tab = ref('overview')
  const addAddressDialog = ref(false)
  const addressToDelete = ref(null)
  const ordersLoading = ref(false)
  const deleteAddressDialog = ref(null)
  const blockStatusDialog = ref(null)

  // New address data
  const newAddress = ref({
    province: null,
    city: null,
    street: '',
    postalCode: '',
    isDefault: false
  })

  // Table headers
  const orderHeaders = [
    { title: 'Order ID', key: 'id' },
    { title: 'Date', key: 'orderDate' },
    { title: 'Total', key: 'total' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions', sortable: false }
  ]

  // Computed
  const customer = computed(() =>
    customerStore.getCustomerById(route.params.id)
  )
  const provinces = computed(() => customerStore.provinces)
  const filteredCities = computed(() => {
    if (!newAddress.value.province) return []
    return customerStore.cities.filter(
      (c) => c.provinceId === newAddress.value.province
    )
  })
  const customerOrders = computed(() =>
    customerStore.getCustomerOrders(route.params.id)
  )
  const customerActivity = computed(() =>
    customerStore.getCustomerActivityLog(route.params.id)
  )


  onMounted(async () => {
  loading.value = true
  customer.value = await customerStore.getCustomerById(route.params.id)
  loading.value = false
})

  // Lifecycle
  onMounted(async () => {
    try {
      loading.value = true
      // In a real app, you would fetch customer data here
      // await customerStore.fetchCustomer(route.params.id)

      // Load orders when component mounts if on orders tab
      if (route.query.tab === 'orders') {
        tab.value = 'orders'
      }
    } finally {
      loading.value = false
    }
  })

  // Formatting functions
  const formatDate = (date) => {
    if (!date) return '--'
    return new Date(date).toLocaleDateString()
  }

  const formatDateTime = (date) => {
    if (!date) return '--'
    return new Date(date).toLocaleString()
  }

  const formatCurrency = (amount) => {
    return parseFloat(amount || 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })
  }

  const calculateAge = (birthDate) => {
    if (!birthDate) return '--'
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const formatCommunicationMethod = (method) => {
    const methods = {
      email: 'Email',
      sms: 'SMS',
      whatsapp: 'WhatsApp'
    }
    return methods[method] || method
  }

  const getCommunicationIcon = (method) => {
    const icons = {
      email: 'mdi-email',
      sms: 'mdi-message-text',
      whatsapp: 'mdi-whatsapp'
    }
    return icons[method] || 'mdi-bell'
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

  const getTierIcon = (tier) => {
    const icons = {
      basic: 'mdi-account',
      silver: 'mdi-account-star',
      gold: 'mdi-account-supervisor',
      platinum: 'mdi-account-tie'
    }
    return icons[tier] || 'mdi-account'
  }

  const formatTier = (tier) => {
    const tiers = {
      basic: 'Basic',
      silver: 'Silver',
      gold: 'Gold',
      platinum: 'Platinum'
    }
    return tiers[tier] || tier
  }

  const getOrderStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      processing: 'blue',
      shipped: 'teal',
      delivered: 'green',
      cancelled: 'red',
      refunded: 'purple'
    }
    return colors[status.toLowerCase()] || 'primary'
  }

  const formatOrderStatus = (status) => {
    const statuses = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded'
    }
    return statuses[status.toLowerCase()] || status
  }

  const getActivityColor = (type) => {
    const colors = {
      login: 'blue',
      purchase: 'green',
      contact: 'teal',
      review: 'amber',
      complaint: 'orange',
      refund: 'red'
    }
    return colors[type] || 'primary'
  }

  const getActivityIcon = (type) => {
    const icons = {
      login: 'mdi-login',
      purchase: 'mdi-cart',
      contact: 'mdi-email',
      review: 'mdi-star',
      complaint: 'mdi-alert',
      refund: 'mdi-cash-refund'
    }
    return icons[type] || 'mdi-help'
  }

  const formatActivityType = (type) => {
    const types = {
      login: 'Login',
      purchase: 'Purchase',
      contact: 'Contact',
      review: 'Review',
      complaint: 'Complaint',
      refund: 'Refund'
    }
    return types[type] || type
  }

  // Methods
  const editCustomer = () => {
    router.push(`/customers/edit/${customer.value.id}`)
  }

  const toggleBlockStatus = () => {
    blockStatusDialog.value.open()
  }
  const confirmToggleBlockStatus = async () => {
    try {
      await customerStore.toggleBlockStatus(customer.value.id)
      toast.success(
        `Customer ${customer.value.isBlocked ? 'unblocked' : 'blocked'} successfully`
      )
    } catch (error) {
      toast.error('Error updating customer status')
    }
  }

  const viewOrderDetails = (order) => {
    router.push(`/orders/${order.id}`)
  }

  const editAddress = (address) => {
    // Implement edit logic
    toast.info('Address editing will be implemented in the future')
  }

  const confirmDeleteAddress = (address) => {
    addressToDelete.value = address
    deleteAddressDialog.value.open()
  }

  const deleteAddress = async () => {
    try {
      await customerStore.deleteAddress(
        customer.value.id,
        addressToDelete.value.id
      )
      toast.success('Address deleted successfully')
      // No need to manually close the dialog, it's handled by the ConfirmDialog component
    } catch (error) {
      toast.error('Error deleting address')
    }
  }

  const setDefaultAddress = async (address) => {
    try {
      await customerStore.setDefaultAddress(customer.value.id, address.id)
      toast.success('Default address set successfully')
    } catch (error) {
      toast.error('Error setting default address')
    }
  }

  const saveAddress = async () => {
    try {
      const addressData = {
        ...newAddress.value,
        province: customerStore.provinces.find(
          (p) => p.id === newAddress.value.province
        ),
        city: filteredCities.value.find((c) => c.id === newAddress.value.city)
      }

      await customerStore.addAddress(customer.value.id, addressData)
      toast.success('Address added successfully')
      addAddressDialog.value = false
      newAddress.value = {
        province: null,
        city: null,
        street: '',
        postalCode: '',
        isDefault: false
      }
    } catch (error) {
      toast.error('Error adding address')
    }
  }
</script>

<style scoped>
  .border-primary {
    border: 2px solid var(--v-primary-base);
  }

  .bg-primary-lighten-1 {
    background-color: var(--v-primary-lighten1);
  }
  .stat-card {
    padding: 16px;
    position: relative;
    overflow: hidden;
    height: 100%;
    border-left: 4px solid;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: -20px;
    right: -20px;
    width: 60px;
    height: 60px;
    opacity: 0.1;
    background-color: currentColor;
    border-radius: 50%;
  }

  .stat-0 {
    border-color: #4caf50;
    color: #4caf50;
  }
  .stat-1 {
    border-color: #2196f3;
    color: #2196f3;
  }
  .stat-2 {
    border-color: #ffc107;
    color: #ffc107;
  }
  .stat-3 {
    border-color: #9c27b0;
    color: #9c27b0;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.2;
  }

  .stat-label {
    font-size: 0.875rem;
    opacity: 0.8;
  }

  .stat-icon {
    position: absolute;
    bottom: 8px;
    right: 8px;
    opacity: 0.3;
    font-size: 2.5rem;
  }
</style>
