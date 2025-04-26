import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref([
    {
      id: "1",
      firstName: "Mena",
      lastName: "Youssef",
      email: "mena@example.com",
      mobile: "01012345678",
      address: [
        {
          id: "1",
          province: { id: "1", name: "Cairo" },
          city: { id: "1", provinceId: "1", name: "Nasr City" },
          text: "123 Some Street, Nasr City"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1990-05-12"),
      avatar: "",
      ordersCount: 3,
      lastOrderDate: new Date(),
      tags: ["VIP", "Active"],
      isBlocked: false,
      isHotCustomer: true,
      deletedAt: null
    },
    {
      id: "2",
      firstName: "Ahmed",
      lastName: "Mostafa",
      email: "ahmed@example.com",
      mobile: "01234567890",
      address: [
        {
          id: "2",
          province: { id: "2", name: "Alexandria" },
          city: { id: "2", provinceId: "2", name: "Roushdy" },
          text: "456 Another Street, Roushdy"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1985-11-20"),
      avatar: "",
      ordersCount: 0,
      lastOrderDate: null,
      tags: ["Inactive"],
      isBlocked: true,
      isHotCustomer: false,
      deletedAt: null
    },
    {
      id: "3",
      firstName: "Mena",
      lastName: "Youssef",
      email: "mena@example.com",
      mobile: "01012345678",
      address: [
        {
          id: "1",
          province: { id: "1", name: "Cairo" },
          city: { id: "1", provinceId: "1", name: "Nasr City" },
          text: "123 Some Street, Nasr City"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1990-05-12"),
      avatar: "",
      ordersCount: 3,
      lastOrderDate: new Date(),
      tags: ["VIP", "Active"],
      isBlocked: false,
      isHotCustomer: true,
      deletedAt: null
    },
    {
      id: "4",
      firstName: "Mena",
      lastName: "Youssef",
      email: "mena@example.com",
      mobile: "01012345678",
      address: [
        {
          id: "1",
          province: { id: "1", name: "Cairo" },
          city: { id: "1", provinceId: "1", name: "Nasr City" },
          text: "123 Some Street, Nasr City"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1990-05-12"),
      avatar: "",
      ordersCount: 3,
      lastOrderDate: new Date(),
      tags: ["VIP", "Active"],
      isBlocked: false,
      isHotCustomer: true,
      deletedAt: null
    },
    {
      id: "5",
      firstName: "Mena",
      lastName: "Youssef",
      email: "mena@example.com",
      mobile: "01012345678",
      address: [
        {
          id: "1",
          province: { id: "1", name: "Cairo" },
          city: { id: "1", provinceId: "1", name: "Nasr City" },
          text: "123 Some Street, Nasr City"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1990-05-12"),
      avatar: "",
      ordersCount: 3,
      lastOrderDate: new Date(),
      tags: ["VIP", "Active"],
      isBlocked: false,
      isHotCustomer: true,
      deletedAt: null
    },
    {
      id: "6",
      firstName: "Mena",
      lastName: "Youssef",
      email: "mena@example.com",
      mobile: "01012345678",
      address: [
        {
          id: "1",
          province: { id: "1", name: "Cairo" },
          city: { id: "1", provinceId: "1", name: "Nasr City" },
          text: "123 Some Street, Nasr City"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1990-05-12"),
      avatar: "",
      ordersCount: 3,
      lastOrderDate: new Date(),
      tags: ["VIP", "Active"],
      isBlocked: false,
      isHotCustomer: true,
      deletedAt: null
    },
    {
      id: "7",
      firstName: "Mena",
      lastName: "Youssef",
      email: "mena@example.com",
      mobile: "01012345678",
      address: [
        {
          id: "1",
          province: { id: "1", name: "Cairo" },
          city: { id: "1", provinceId: "1", name: "Nasr City" },
          text: "123 Some Street, Nasr City"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1990-05-12"),
      avatar: "",
      ordersCount: 3,
      lastOrderDate: new Date(),
      tags: ["VIP", "Active"],
      isBlocked: false,
      isHotCustomer: true,
      deletedAt: null
    },
    {
      id: "8",
      firstName: "Mena",
      lastName: "Youssef",
      email: "mena@example.com",
      mobile: "01012345678",
      address: [
        {
          id: "1",
          province: { id: "1", name: "Cairo" },
          city: { id: "1", provinceId: "1", name: "Nasr City" },
          text: "123 Some Street, Nasr City"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1990-05-12"),
      avatar: "",
      ordersCount: 3,
      lastOrderDate: new Date(),
      tags: ["VIP", "Active"],
      isBlocked: false,
      isHotCustomer: true,
      deletedAt: null
    },
    {
      id: "9",
      firstName: "Mena",
      lastName: "Youssef",
      email: "mena@example.com",
      mobile: "01012345678",
      address: [
        {
          id: "1",
          province: { id: "1", name: "Cairo" },
          city: { id: "1", provinceId: "1", name: "Nasr City" },
          text: "123 Some Street, Nasr City"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1990-05-12"),
      avatar: "",
      ordersCount: 3,
      lastOrderDate: new Date(),
      tags: ["VIP", "Active"],
      isBlocked: false,
      isHotCustomer: true,
      deletedAt: null
    },
    {
      id: "10",
      firstName: "Mena",
      lastName: "Youssef",
      email: "mena@example.com",
      mobile: "01012345678",
      address: [
        {
          id: "1",
          province: { id: "1", name: "Cairo" },
          city: { id: "1", provinceId: "1", name: "Nasr City" },
          text: "123 Some Street, Nasr City"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1990-05-12"),
      avatar: "",
      ordersCount: 3,
      lastOrderDate: new Date(),
      tags: ["VIP", "Active"],
      isBlocked: false,
      isHotCustomer: true,
      deletedAt: null
    },
    {
      id: "11",
      firstName: "Mena",
      lastName: "Youssef",
      email: "mena@example.com",
      mobile: "01012345678",
      address: [
        {
          id: "1",
          province: { id: "1", name: "Cairo" },
          city: { id: "1", provinceId: "1", name: "Nasr City" },
          text: "123 Some Street, Nasr City"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1990-05-12"),
      avatar: "",
      ordersCount: 3,
      lastOrderDate: new Date(),
      tags: ["VIP", "Active"],
      isBlocked: false,
      isHotCustomer: true,
      deletedAt: null
    },
    {
      id: "12",
      firstName: "Mena",
      lastName: "Youssef",
      email: "mena@example.com",
      mobile: "01012345678",
      address: [
        {
          id: "1",
          province: { id: "1", name: "Cairo" },
          city: { id: "1", provinceId: "1", name: "Nasr City" },
          text: "123 Some Street, Nasr City"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1990-05-12"),
      avatar: "",
      ordersCount: 3,
      lastOrderDate: new Date(),
      tags: ["VIP", "Active"],
      isBlocked: false,
      isHotCustomer: true,
      deletedAt: null
    },{
      id: "13",
      firstName: "Mena",
      lastName: "Youssef",
      email: "mena@example.com",
      mobile: "01012345678",
      address: [
        {
          id: "1",
          province: { id: "1", name: "Cairo" },
          city: { id: "1", provinceId: "1", name: "Nasr City" },
          text: "123 Some Street, Nasr City"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1990-05-12"),
      avatar: "",
      ordersCount: 3,
      lastOrderDate: new Date(),
      tags: ["VIP", "Active"],
      isBlocked: false,
      isHotCustomer: true,
      deletedAt: null
    },
    {
      id: "14",
      firstName: "Mena",
      lastName: "Youssef",
      email: "mena@example.com",
      mobile: "01012345678",
      address: [
        {
          id: "1",
          province: { id: "1", name: "Cairo" },
          city: { id: "1", provinceId: "1", name: "Nasr City" },
          text: "123 Some Street, Nasr City"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1990-05-12"),
      avatar: "",
      ordersCount: 3,
      lastOrderDate: new Date(),
      tags: ["VIP", "Active"],
      isBlocked: false,
      isHotCustomer: true,
      deletedAt: null
    },
    {
      id: "15",
      firstName: "Mena",
      lastName: "Youssef",
      email: "mena@example.com",
      mobile: "01012345678",
      address: [
        {
          id: "1",
          province: { id: "1", name: "Cairo" },
          city: { id: "1", provinceId: "1", name: "Nasr City" },
          text: "123 Some Street, Nasr City"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1990-05-12"),
      avatar: "",
      ordersCount: 3,
      lastOrderDate: new Date(),
      tags: ["VIP", "Active"],
      isBlocked: false,
      isHotCustomer: true,
      deletedAt: null
    },
    {
      id: "16",
      firstName: "Mena",
      lastName: "Youssef",
      email: "mena@example.com",
      mobile: "01012345678",
      address: [
        {
          id: "1",
          province: { id: "1", name: "Cairo" },
          city: { id: "1", provinceId: "1", name: "Nasr City" },
          text: "123 Some Street, Nasr City"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1990-05-12"),
      avatar: "",
      ordersCount: 3,
      lastOrderDate: new Date(),
      tags: ["VIP", "Active"],
      isBlocked: false,
      isHotCustomer: true,
      deletedAt: null
    },
    {
      id: "17",
      firstName: "Mena",
      lastName: "Youssef",
      email: "mena@example.com",
      mobile: "01012345678",
      address: [
        {
          id: "1",
          province: { id: "1", name: "Cairo" },
          city: { id: "1", provinceId: "1", name: "Nasr City" },
          text: "123 Some Street, Nasr City"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1990-05-12"),
      avatar: "",
      ordersCount: 3,
      lastOrderDate: new Date(),
      tags: ["VIP", "Active"],
      isBlocked: false,
      isHotCustomer: true,
      deletedAt: null
    },
    {
      id: "18",
      firstName: "Mena",
      lastName: "Youssef",
      email: "mena@example.com",
      mobile: "01012345678",
      address: [
        {
          id: "1",
          province: { id: "1", name: "Cairo" },
          city: { id: "1", provinceId: "1", name: "Nasr City" },
          text: "123 Some Street, Nasr City"
        }
      ],
      joinDate: new Date(),
      birthDate: new Date("1990-05-12"),
      avatar: "",
      ordersCount: 3,
      lastOrderDate: new Date(),
      tags: ["VIP", "Active"],
      isBlocked: false,
      isHotCustomer: true,
      deletedAt: null
    },
  ])

  const searchQuery = ref('')

  const filteredCustomers = computed(() => {
    return customers.value.filter(c =>
      `${c.firstName} ${c.lastName} ${c.email}`
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    )
  })

  function addCustomer(newCustomer) {
    customers.value.push({
      id: Date.now().toString(),
      ...newCustomer,
      ordersCount: newCustomer.ordersCount || 0,
      isBlocked: newCustomer.isBlocked || false,
      avatar: newCustomer.avatar || "",
      joinDate: new Date(),
      tags: newCustomer.tags || [],
      isHotCustomer: newCustomer.isHotCustomer || false,
      deletedAt: newCustomer.deletedAt || null
    })
  }

  function updateCustomer(id, updatedCustomer) {
    const index = customers.value.findIndex(customer => customer.id === id)
    if (index !== -1) {
      customers.value[index] = { ...customers.value[index], ...updatedCustomer }
    }
  }

  function removeCustomer(id) {
    customers.value = customers.value.filter(c => c.id !== id)
  }

  return {
    customers,
    searchQuery,
    filteredCustomers,
    addCustomer,
    updateCustomer,
    removeCustomer
  }
})
