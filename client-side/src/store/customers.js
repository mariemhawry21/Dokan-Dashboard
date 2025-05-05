import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

export const useCustomerStore = defineStore('customer', () => {
  const toast = useToast()

  // Sample provinces and cities data (unchanged)
  const provinces = ref([
    { id: '1', name: 'Cairo' },
    { id: '2', name: 'Alexandria' },
    { id: '3', name: 'Giza' },
    { id: '4', name: 'Sharqia' },
    { id: '5', name: 'Dakahlia' }
  ])

  const cities = ref([
    { id: '1', provinceId: '1', name: 'Nasr City' },
    { id: '2', provinceId: '1', name: 'Maadi' },
    { id: '3', provinceId: '1', name: 'Heliopolis' },
    { id: '4', provinceId: '2', name: 'Roushdy' },
    { id: '5', provinceId: '2', name: 'Smouha' },
    { id: '6', provinceId: '3', name: 'Dokki' },
    { id: '7', provinceId: '3', name: 'Haram' }
  ])

  // Sample customer data
  const customers = ref([
    {
      id: '1',
      firstName: 'Mohamed',
      lastName: 'Ahmed',
      fullName: 'Mohamed Ahmed',
      email: 'mohamed.ahmed@example.com',
      mobile: '01012345678',
      addresses: [
        {
          id: '1',
          province: { id: '1', name: 'Cairo' },
          city: { id: '1', name: 'Nasr City' },
          street: '123 Main Street',
          building: 'Building 5',
          floor: '3',
          apartment: '12',
          postalCode: '11511',
          isDefault: true
        }
      ],
      joinDate: new Date('2022-05-15'),
      birthDate: new Date('1990-08-20'),
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      ordersCount: 5,
      orders: [],
      totalSpent: 12500,
      lastOrderDate: new Date('2023-04-10'),
      tags: ['VIP', 'Frequent Buyer'],
      state: 'active',
      tier: 'gold',
      isBlocked: false,
      notes: 'Prefers evening deliveries',
      communicationPreferences: {
        email: true,
        sms: false,
        whatsapp: true
      },
      activityLog: []
    },
    {
      id: '2',
      firstName: 'Menna',
      lastName: 'Ahmed',
      fullName: 'Mohamed Ahmed',
      email: 'mohamed.ahmed@example.com',
      mobile: '01012345678',
      addresses: [
        {
          id: '1',
          province: { id: '1', name: 'Cairo' },
          city: { id: '1', name: 'Nasr City' },
          street: '123 Main Street',
          building: 'Building 5',
          floor: '3',
          apartment: '12',
          postalCode: '11511',
          isDefault: true
        }
      ],
      joinDate: new Date('2022-05-15'),
      birthDate: new Date('1990-08-20'),
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      ordersCount: 5,
      orders: [],
      totalSpent: 12500,
      lastOrderDate: new Date('2023-04-10'),
      tags: ['VIP', 'Frequent Buyer'],
      state: 'active',
      tier: 'gold',
      isBlocked: false,
      notes: 'Prefers evening deliveries',
      communicationPreferences: {
        email: true,
        sms: false,
        whatsapp: true
      },
      activityLog: []
    },
    {
      id: '3',
      firstName: 'Mariem',
      lastName: 'Ahmed',
      fullName: 'Mohamed Ahmed',
      email: 'mohamed.ahmed@example.com',
      mobile: '01012345678',
      addresses: [
        {
          id: '1',
          province: { id: '1', name: 'Cairo' },
          city: { id: '1', name: 'Nasr City' },
          street: '123 Main Street',
          building: 'Building 5',
          floor: '3',
          apartment: '12',
          postalCode: '11511',
          isDefault: true
        }
      ],
      joinDate: new Date('2022-05-15'),
      birthDate: new Date('1990-08-20'),
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      ordersCount: 5,
      orders: [],
      totalSpent: 12500,
      lastOrderDate: new Date('2023-04-10'),
      tags: ['VIP', 'Frequent Buyer'],
      state: 'active',
      tier: 'gold',
      isBlocked: false,
      notes: 'Prefers evening deliveries',
      communicationPreferences: {
        email: true,
        sms: false,
        whatsapp: true
      },
      activityLog: []
    }
  ])

  // Search and filter states
  const searchQuery = ref('')
  const statusFilter = ref('all')
  const tierFilter = ref('all')
  const sortBy = ref('name')
  const sortOrder = ref('asc')
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  // New state for selected customers (for bulk operations)
  const selectedCustomers = ref([])

  // Computed properties
  const filteredCustomers = computed(() => {
    let result = [...customers.value]

    // Apply search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter((c) =>
        `${c.firstName} ${c.lastName} ${c.email} ${c.mobile} ${c.tags?.join(' ')}`
          .toLowerCase()
          .includes(query)
      )
    }

    // Apply filters
    if (statusFilter.value !== 'all') {
      result = result.filter((c) => c.status === statusFilter.value)
    }

    if (tierFilter.value !== 'all') {
      result = result.filter((c) => c.tier === tierFilter.value)
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy.value) {
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          )
          break
        case 'joinDate':
          comparison = new Date(a.joinDate) - new Date(b.joinDate)
          break
        case 'lastOrder':
          comparison =
            new Date(a.lastOrderDate || 0) - new Date(b.lastOrderDate || 0)
          break
        case 'totalSpent':
          comparison = a.totalSpent - b.totalSpent
          break
      }
      return sortOrder.value === 'asc' ? comparison : -comparison
    })

    return result
  })

  // Paginated customers
  const paginatedCustomers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredCustomers.value.slice(start, end)
  })

  // Total pages for pagination
  const totalPages = computed(() =>
    Math.ceil(filteredCustomers.value.length / itemsPerPage.value)
  )

  // Enhanced customer stats
  const customerStats = computed(() => {
    const all = customers.value
    const active = all.filter((c) => c.status === 'active')
    const newCustomers = all.filter((c) => {
      const joinDate = new Date(c.joinDate)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return joinDate >= thirtyDaysAgo
    })

    return {
      total: all.length,
      active: active.length,
      new: newCustomers.length,
      vip: all.filter((c) => c.tier === 'platinum').length,
      blocked: all.filter((c) => c.isBlocked).length,
      totalSpent: all.reduce((sum, c) => sum + c.totalSpent, 0),
      avgOrderValue:
        all.length > 0
          ? all.reduce((sum, c) => sum + c.totalSpent, 0) /
            all.reduce((sum, c) => sum + c.ordersCount, 0)
          : 0
    }
  })

  // Methods for customer operations
  function addCustomer(newCustomer) {
    const customer = {
      id: Date.now().toString(),
      addresses: [],
      ordersCount: 0,
      totalSpent: 0,
      lastOrderDate: null,
      tags: [],
      status: 'active',
      tier: 'basic',
      isBlocked: false,
      notes: '',
      communicationPreferences: {
        email: true,
        sms: false,
        whatsapp: false
      },
      ...newCustomer
    }

    customers.value.push(customer)
    toast.success('Customer added successfully')
    return customer
  }

  function updateCustomer(id, updatedData) {
    const index = customers.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      customers.value[index] = {
        ...customers.value[index],
        ...updatedData
      }
      toast.success('Customer updated successfully')
      return true
    }
    toast.error('Customer not found')
    return false
  }

  function removeCustomer(id) {
    const initialLength = customers.value.length
    customers.value = customers.value.filter((c) => c.id !== id)
    if (customers.value.length < initialLength) {
      toast.success('Customer removed successfully')
      return true
    }
    toast.error('Customer not found')
    return false
  }

  function setDefaultAddress(customerId, addressId) {
    const customer = customers.value.find((c) => c.id === customerId)
    if (customer) {
      const address = customer.addresses.find((a) => a.id === addressId)
      if (address) {
        // Set all addresses to non-default first
        customer.addresses.forEach((addr) => {
          addr.isDefault = false
        })
        // Then set the selected address as default
        address.isDefault = true
        toast.success('Default address updated successfully')
        return true
      }
      toast.error('Address not found')
      return false
    }
    toast.error('Customer not found')
    return false
  }

  function getCustomerActivityLog(customerId) {
    // In a real app, this would come from an API
    // Here we're generating sample activity data
    const customer = getCustomerById(customerId)
    if (!customer) return []

    const activities = [
      {
        type: 'login',
        date: new Date(),
        description: 'Logged in to the website',
        ipAddress: '192.168.1.1'
      },
      {
        type: 'purchase',
        date: new Date(Date.now() - 86400000), // 1 day ago
        description: `Placed order #${Math.floor(1000 + Math.random() * 9000)}`,
        ipAddress: '192.168.1.1'
      },
      {
        type: 'contact',
        date: new Date(Date.now() - 172800000), // 2 days ago
        description: 'Contacted customer support',
        ipAddress: '192.168.1.2'
      }
    ]

    // Add more activities based on customer data
    if (customer.lastOrderDate) {
      activities.push({
        type: 'purchase',
        date: new Date(customer.lastOrderDate),
        description: `Placed order #${Math.floor(1000 + Math.random() * 9000)}`,
        ipAddress: '192.168.1.3'
      })
    }

    return activities.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  function getCustomerOrders(customerId) {
    // In a real app, this would come from an API
    // Here we're generating sample order data
    const customer = getCustomerById(customerId)
    if (!customer) return []

    const statuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled'
    ]
    const orders = []

    for (let i = 0; i < customer.ordersCount; i++) {
      const daysAgo = Math.floor(Math.random() * 30)
      const orderDate = new Date(Date.now() - daysAgo * 86400000)
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const total = Math.floor(100 + Math.random() * 900)

      orders.push({
        id: `ORD-${1000 + i}`,
        orderDate,
        status,
        total,
        items: Math.floor(1 + Math.random() * 5)
      })
    }

    return orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
  }

  // Enhanced bulk operations
  function removeCustomers(ids) {
    const initialLength = customers.value.length
    customers.value = customers.value.filter((c) => !ids.includes(c.id))
    const removedCount = initialLength - customers.value.length
    if (removedCount > 0) {
      toast.success(`Removed ${removedCount} customers`)
      selectedCustomers.value = []
      return removedCount
    }
    toast.error('No customers were removed')
    return 0
  }

  function toggleBlockStatus(id) {
    const customer = customers.value.find((c) => c.id === id)
    if (customer) {
      customer.isBlocked = !customer.isBlocked
      const action = customer.isBlocked ? 'blocked' : 'unblocked'
      toast.success(`Customer ${action} successfully`)
      return true
    }
    toast.error('Customer not found')
    return false
  }

  function bulkUpdateStatus(ids, status) {
    let updatedCount = 0
    customers.value.forEach((customer) => {
      if (ids.includes(customer.id)) {
        customer.status = status
        updatedCount++
      }
    })

    if (updatedCount > 0) {
      toast.success(`Updated status for ${updatedCount} customers`)
      selectedCustomers.value = []
      return updatedCount
    }
    toast.error('No customers were updated')
    return 0
  }

  // Address operations
  function addAddress(customerId, newAddress) {
    const customer = customers.value.find((c) => c.id === customerId)
    if (customer) {
      // Set as default if first address or explicitly set
      if (customer.addresses.length === 0 || newAddress.isDefault) {
        customer.addresses.forEach((addr) => {
          addr.isDefault = false
        })
        newAddress.isDefault = true
      }

      newAddress.id = Date.now().toString()
      customer.addresses.push(newAddress)
      toast.success('Address added successfully')
      return newAddress
    }
    toast.error('Customer not found')
    return null
  }

  function updateAddress(customerId, addressId, updatedData) {
    const customer = customers.value.find((c) => c.id === customerId)
    if (customer) {
      const address = customer.addresses.find((a) => a.id === addressId)
      if (address) {
        if (updatedData.isDefault) {
          customer.addresses.forEach((addr) => {
            addr.isDefault = addr.id === addressId
          })
        }
        Object.assign(address, updatedData)
        toast.success('Address updated successfully')
        return true
      }
    }
    toast.error('Address not found')
    return false
  }

  function deleteAddress(customerId, addressId) {
    const customer = customers.value.find((c) => c.id === customerId)
    if (customer) {
      const initialLength = customer.addresses.length
      customer.addresses = customer.addresses.filter((a) => a.id !== addressId)

      // If we deleted the default address and there are others left
      if (
        initialLength > customer.addresses.length &&
        customer.addresses.length > 0 &&
        !customer.addresses.some((a) => a.isDefault)
      ) {
        customer.addresses[0].isDefault = true
      }

      toast.success('Address deleted successfully')
      return true
    }
    toast.error('Customer not found')
    return false
  }

  // Tag operations
  function addTag(customerId, tag) {
    const customer = customers.value.find((c) => c.id === customerId)
    if (customer) {
      if (!customer.tags.includes(tag)) {
        customer.tags.push(tag)
        toast.success('Tag added successfully')
        return true
      }
      toast.warning('Customer already has this tag')
      return false
    }
    toast.error('Customer not found')
    return false
  }

  function removeTag(customerId, tag) {
    const customer = customers.value.find((c) => c.id === customerId)
    if (customer) {
      const initialLength = customer.tags.length
      customer.tags = customer.tags.filter((t) => t !== tag)
      if (customer.tags.length < initialLength) {
        toast.success('Tag removed successfully')
        return true
      }
      toast.warning('Tag not found')
      return false
    }
    toast.error('Customer not found')
    return false
  }

  // New methods for additional functionality
  function getCustomerById(id) {
    return customers.value.find((c) => parseInt(c.id) === parseInt(id))
  }

  function searchCustomers(query) {
    searchQuery.value = query
    currentPage.value = 1 // Reset to first page when searching
  }

  function resetFilters() {
    searchQuery.value = ''
    statusFilter.value = 'all'
    tierFilter.value = 'all'
    sortBy.value = 'name'
    sortOrder.value = 'asc'
    currentPage.value = 1
  }

  // Export functionality
  function exportCustomers(format = 'csv') {
    // This would be implemented with actual export logic
    console.log(`Exporting customers in ${format} format`)
    toast.info(`Preparing ${format} export...`)
    // In a real app, this would generate a file download
    return filteredCustomers.value
  }

  // State for segments
  const segments = ref([
    {
      id: '1',
      name: 'High Value',
      criteria: {
        totalSpent: { $gt: 1000 },
        status: 'active'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Frequent Buyers',
      criteria: {
        ordersCount: { $gt: 5 },
        status: 'active'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Inactive',
      criteria: {
        lastOrderDate: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'New Customers',
      criteria: {
        joinDate: { $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])

  // Computed property for segment statistics
  const segmentStats = computed(() => {
    return segments.value.map((segment) => {
      const customersInSegment = getCustomersInSegment(segment.id)
      return {
        id: segment.id,
        name: segment.name,
        customerCount: customersInSegment.length,
        totalSpent: customersInSegment.reduce(
          (sum, c) => sum + c.totalSpent,
          0
        ),
        avgOrderValue:
          customersInSegment.length > 0
            ? customersInSegment.reduce((sum, c) => sum + c.totalSpent, 0) /
              customersInSegment.reduce((sum, c) => sum + c.ordersCount, 0)
            : 0
      }
    })
  })

  // Methods for segmentation
  function createSegment(name, criteria) {
    const newSegment = {
      id: Date.now().toString(),
      name,
      criteria,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    segments.value.push(newSegment)
    toast.success('Segment created successfully')
    return newSegment
  }

  function updateSegment(segmentId, updates) {
    const segment = segments.value.find((s) => s.id === segmentId)
    if (segment) {
      Object.assign(segment, updates, { updatedAt: new Date() })
      toast.success('Segment updated successfully')
      return true
    }
    toast.error('Segment not found')
    return false
  }

  function deleteSegment(segmentId) {
    const initialLength = segments.value.length
    segments.value = segments.value.filter((s) => s.id !== segmentId)
    if (segments.value.length < initialLength) {
      toast.success('Segment deleted successfully')
      return true
    }
    toast.error('Segment not found')
    return false
  }

  function getCustomersInSegment(segmentId) {
    const segment = segments.value.find((s) => s.id === segmentId)
    if (!segment) return []

    return customers.value.filter((customer) => {
      return Object.entries(segment.criteria).every(([key, condition]) => {
        if (typeof condition === 'object') {
          // Handle comparison operators
          if (condition.$gt !== undefined) return customer[key] > condition.$gt
          if (condition.$lt !== undefined) return customer[key] < condition.$lt
          if (condition.$gte !== undefined)
            return customer[key] >= condition.$gte
          if (condition.$lte !== undefined)
            return customer[key] <= condition.$lte
          if (condition.$ne !== undefined)
            return customer[key] !== condition.$ne
          if (condition.$in) return condition.$in.includes(customer[key])
          if (condition.$nin) return !condition.$nin.includes(customer[key])
        }
        // Simple equality check
        return customer[key] === condition
      })
    })
  }
  function evaluateCustomerForSegments(customerId) {
    const customer = getCustomerById(customerId)
    if (!customer) return []

    return segments.value
      .filter((segment) => {
        return Object.entries(segment.criteria).every(([key, condition]) => {
          if (typeof condition === 'object') {
            if (condition.$gt !== undefined)
              return customer[key] > condition.$gt
            if (condition.$lt !== undefined)
              return customer[key] < condition.$lt
            if (condition.$gte !== undefined)
              return customer[key] >= condition.$gte
            if (condition.$lte !== undefined)
              return customer[key] <= condition.$lte
            if (condition.$ne !== undefined)
              return customer[key] !== condition.$ne
            if (condition.$in) return condition.$in.includes(customer[key])
            if (condition.$nin) return !condition.$nin.includes(customer[key])
          }
          return customer[key] === condition
        })
      })
      .map((segment) => segment.id)
  }

  return {
    // State
    provinces,
    cities,
    customers,
    searchQuery,
    statusFilter,
    tierFilter,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    selectedCustomers,

    // Computed
    filteredCustomers,
    paginatedCustomers,
    totalPages,
    customerStats,

    // Methods
    addCustomer,
    updateCustomer,
    removeCustomer,
    toggleBlockStatus,
    addAddress,
    updateAddress,
    deleteAddress,
    addTag,
    removeTag,
    removeCustomers,
    bulkUpdateStatus,
    getCustomerById,
    searchCustomers,
    resetFilters,
    exportCustomers,
    setDefaultAddress,
    getCustomerActivityLog,
    getCustomerOrders,
    deleteSegment,
    updateSegment,
    createSegment,
    evaluateCustomerForSegments,
    getCustomersInSegment
  }
})
