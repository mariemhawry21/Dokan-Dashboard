<template>
  <v-form>
    <v-container>
      <v-row class="d-flex align-center" no-gutters>
        <v-col cols="8" lg="10" sm="9" xs="8">
          <v-text-field
            placeholder="Search order..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            density="comfortable"
            color="#ccc"
          ></v-text-field>
        </v-col>

        <v-col cols="4" lg="2" sm="3" xs="4" class="d-flex justify-end">
          <v-btn
            prepend-icon="mdi-plus"
            style="
              background-color: #3b82f6;
              height: 48px;
              text-transform: capitalize;
            "
            class="text-white"
          >
            Add Order
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>

  <v-card>
    <v-container>
      <v-data-table
        :headers="headers"
        :items="ordersStore.orders"
        item-value="id"
        class="elevation-0"
        hide-default-footer
      >
        <template #item.product="{ item }">
          <div
            v-for="(orderItem, index) in item.orderItems"
            :key="index"
            class="d-flex align-center ga-5"
          >
            <div class="product-image-wrapper">
              <v-img :src="orderItem.image" alt="Product Image" cover />
            </div>
            <div>{{ orderItem.name }}</div>
          </div>
        </template>

        <template #item.user="{ item }">
          <div>{{ item.user.firstName }} {{ item.user.lastName }}</div>
        </template>

        <template #item.total="{ item }"> ${{ item.total }} </template>

        <template #item.date="{ item }"> {{ item.createdAt }} </template>

        <template #item.payment="{ item }">
          <div>{{ item.paymentMethod }}</div>
        </template>

        <template #item.status="{ item }">
          <v-chip :color="statusColor(item.status)" variant="tonal" small>
            {{ item.status }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            @click="openEditDialog(item)"
            size="small"
            variant="text"
          />
          <v-btn
            icon="mdi-eye"
            @click="orderDetails(item)"
            size="small"
            variant="text"
          />
          <v-btn
            icon="mdi-delete"
            @click="deleteItem(item)"
            size="small"
            variant="text"
          />
        </template>
      </v-data-table>
    </v-container>
  </v-card>

  <!-- Dialog -->
  <v-dialog
    v-model="dialog"
    max-width="420"
    transition="dialog-bottom-transition"
    persistent
  >
    <v-card class="rounded-xl elevation-10 pa-4">
      <v-card-title class="justify-center text-h6 font-weight-bold mb-3">
        <v-icon class="mr-2">mdi-pencil</v-icon>
        {{ t('orderDialog.title') }}
      </v-card-title>

      <v-card-text class="pt-0">
        <v-select
          v-model="selectedStatus"
          :items="
            statuses.map((status) => ({
              title: t(`orderStatus.${status}`),
              value: status
            }))
          "
          :label="t('orderDialog.selectStatus')"
          variant="outlined"
          density="comfortable"
          class="rounded-md"
          hide-details
          clearable
        />
      </v-card-text>

      <v-card-actions class="justify-center pt-4">
        <v-btn
          color="grey-darken-1"
          variant="text"
          class="rounded-pill px-5"
          @click="dialog = false"
        >
          {{ t('orderDialog.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          class="rounded-pill px-5"
          @click="saveStatus"
        >
          {{ t('orderDialog.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { onMounted, ref, computed } from 'vue'
  import { useOrderStore } from '../store/order'
  import router from '../router'
  const ordersStore = useOrderStore()
  onMounted(() => {
    // const saveOrders = localStorage.getItem('orders')
    // if (saveOrders) {
    //   filteredItems.value = JSON.parse(saveOrders)
    // } else {
    //   filteredItems.value = [...items.value]
    // }
    ordersStore.getOrders()
  })

  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const headers = computed(() => [
    {
      title: t('orderHeaders.orderNumber'),
      value: 'orderNumber',
      align: 'center'
    },
    { title: t('orderHeaders.product'), value: 'product', align: 'center' },
    { title: t('orderHeaders.date'), value: 'date', align: 'center' },
    { title: t('orderHeaders.user'), value: 'user', align: 'center' },
    { title: t('orderHeaders.total'), value: 'total', align: 'center' },
    { title: t('orderHeaders.payment'), value: 'payment', align: 'center' },
    { title: t('orderHeaders.status'), value: 'status', align: 'center' },
    { title: t('orderHeaders.actions'), value: 'actions', align: 'center' }
  ])
  /*
  const items = ref([
    {
      id: 1,
      image: 'src/assets/bmw.jpg',
      product: 'Handmade Pouch',
      variants: 3,
      date: '29 Dec 2022',
      customer: 'John Bushmill',
      total: '$121.00',
      payment: 'Mastercard',
      status: 'Processing'
    },
    {
      id: 2,
      image: 'src/assets/bmw.jpg',
      product: 'Smartwatch E2',
      variants: 2,
      date: '24 Dec 2022',
      customer: 'Linda Blair',
      total: '$590.00',
      payment: 'Visa',
      status: 'Delivered'
    },
    {
      id: 3,
      image: 'src/assets/bmw.jpg',
      product: 'Smartwatch E2',
      variants: 2,
      date: '24 Dec 2022',
      customer: 'Linda Blair',
      total: '$590.00',
      payment: 'Visa',
      status: 'Cancelled'
    },
    {
      id: 4,
      image: 'src/assets/bmw.jpg',
      product: 'Handmade Pouch',
      variants: 3,
      date: '29 Dec 2022',
      customer: 'John Bushmill',
      total: '$121.00',
      payment: 'Mastercard',
      status: 'Processing'
    },
    {
      id: 5,
      image: 'src/assets/bmw.jpg',
      product: 'Smartwatch E2',
      variants: 2,
      date: '24 Dec 2022',
      customer: 'Linda Blair',
      total: '$590.00',
      payment: 'Visa',
      status: 'Delivered'
    },
    {
      id: 6,
      image: 'src/assets/bmw.jpg',
      product: 'Smartwatch E2',
      variants: 2,
      date: '24 Dec 2022',
      customer: 'Linda Blair',
      total: '$590.00',
      payment: 'Visa',
      status: 'Cancelled'
    },
    {
      id: 7,
      image: 'src/assets/bmw.jpg',
      product: 'Handmade Pouch',
      variants: 3,
      date: '29 Dec 2022',
      customer: 'John Bushmill',
      total: '$121.00',
      payment: 'Mastercard',
      status: 'Processing'
    },
    {
      id: 8,
      image: 'src/assets/bmw.jpg',
      product: 'Smartwatch E2',
      variants: 2,
      date: '24 Dec 2022',
      customer: 'Linda Blair',
      total: '$590.00',
      payment: 'Visa',
      status: 'Delivered'
    },
    {
      id: 9,
      image: 'src/assets/bmw.jpg',
      product: 'Smartwatch E2',
      variants: 2,
      date: '24 Dec 2022',
      customer: 'Linda Blair',
      total: '$590.00',
      payment: 'Visa',
      status: 'Cancelled'
    },
    {
      id: 10,
      image: 'src/assets/bmw.jpg',
      product: 'Handmade Pouch',
      variants: 3,
      date: '29 Dec 2022',
      customer: 'John Bushmill',
      total: '$121.00',
      payment: 'Mastercard',
      status: 'Processing'
    },
    {
      id: 11,
      image: 'src/assets/bmw.jpg',
      product: 'Smartwatch E2',
      variants: 2,
      date: '24 Dec 2022',
      customer: 'Linda Blair',
      total: '$590.00',
      payment: 'Visa',
      status: 'Delivered'
    },
    {
      id: 12,
      image: 'src/assets/bmw.jpg',
      product: 'Smartwatch E2',
      variants: 2,
      date: '24 Dec 2022',
      customer: 'Linda Blair',
      total: '$590.00',
      payment: 'Visa',
      status: 'Cancelled'
    }
  ])

  const filteredItems = ref([...items.value])
  */

  const statusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'teal-lighten-1'
      case 'Processing':
        return 'orange-lighten-1'
      case 'Shipped':
        return 'purple-lighten-1'
      case 'Delivered':
        return 'green-lighten-1'
      case 'Cancelled':
        return 'red-lighten-2'
      default:
        return 'grey-lighten-2'
    }
  }

  const dialog = ref(false)
  const selectedStatus = ref('')
  const currentItem = ref(null)
  const statuses = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
  ]

  function openEditDialog(item) {
    selectedStatus.value = item.status
    currentItem.value = item
    dialog.value = true
  }

  async function saveStatus() {
    if (currentItem.value) {
      // currentItem.value.status = selectedStatus.value
      await ordersStore.updateOrderStatus(
        currentItem.value.id,
        selectedStatus.value
      )
      dialog.value = false
    }
  }

  async function orderDetails(item) {
    console.log(item.id)
    router.push({ name: 'order-details', params: { id: item.id } })
  }

  async function deleteItem(item) {
    // filteredItems.value = filteredItems.value.filter(
    //   (deletedItem) => item.id !== deletedItem.id
    // )
    // localStorage.setItem('orders', JSON.stringify(filteredItems.value))
    try {
      await ordersStore.softDeleteOrder(item.id)
      ordersStore.orders = ordersStore.orders.filter(
        (order) => item.id !== order.id
      )
    } catch (err) {
      console.log(err)
    }
  }
</script>

<style scoped>
  .product-image-wrapper {
    width: 45px;
    height: 40px;
    overflow: hidden;
  }
  .product-image-wrapper .v-img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
  }
  .item-style {
    margin-bottom: 8px; /* مثال للمارجن السفلي */
    background-color: #f5f5f5; /* مثال للباكجراوند كولو الرمادي الفاتح */
    padding: 8px; /* ممكن تضيف padding عشان الشكل يكون أحسن */
    border-radius: 4px; /* عشان الأطراف تكون مدورة شوية */
  }
</style>
