<template>
    <div>
      <v-toolbar flat color="white">
        <router-link to="/addproducts" class="ml-auto">
  <v-btn class="mb-2 bg-blue text-white">
    <v-icon start>mdi-plus</v-icon>
    Add a product
  </v-btn>
</router-link>
      </v-toolbar>
      <v-data-table
        :key="componentKey"
        :headers="headers"
        :items="products"
        class="elevation-1"
        hide-default-footer
      >
      <template v-slot:[`item.Product`]="{ item }">
  <div class="d-flex align-center product-cell">
    <div style="width: 40px; flex-shrink: 0; margin-right: 8px;">
      <v-checkbox
        v-model="item.selected"
        hide-details
      ></v-checkbox>
    </div>
    <v-avatar
      v-if="item.image"
      size="30"
      class="image-container  mr-2"
      rounded="0"
    >
      <v-img v-if="item.image" :src="`https://cdn.vuetifyjs.com/docs/images/graphics/gpus/${item.image}`" :alt="item.Product"></v-img>
    </v-avatar>
    <span class="product-name ml-1">{{ item.Product }}</span>
  </div>
</template>

        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="statusColor(item.status)"
            dark
          >
            {{ item.status }}
          </v-chip>
        </template>
        <template v-slot:[`item.action`]="{ item }">
  <div class="d-flex align-center gap-2">
    <v-icon
      small
      class="mr-2"
      @click="editItem(item)"
    >
      mdi-pencil
    </v-icon>

    <v-icon
      small
      @click="deleteItemHandler(item)"
    >
      mdi-delete
    </v-icon>
  </div>
</template>

      </v-data-table>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from "../store/product.js";
const router = useRouter();
const productStore = useProductStore();
const componentKey = ref(0);
  const headers = ref([
    { title: 'Product', key: 'Product' },
    { title: 'SKU', key: 'sku' },
    { title: 'Category', key: 'category' },
    { title: 'Stock', key: 'stock' },
    { title: 'Price', key: 'price' },
    { title: 'Status', key: 'status' },
    { title: 'Added', key: 'added' },
    { title: 'Action', key: 'action', sortable: false },
  ]);
  const products = computed(() => productStore.products);

  
  const editItem = (item) => {
    router.push(`/editproducts/${item.sku}`);
  };
  
//   const deleteItem = (item) => {
//    const index=products.value.findIndex(product=>product.sku===item.sku) // find index byrga3 -1 lw ml2ash el product
//    if(index!==-1){
//     products.value.splice(index,1)
//    }else{
//     console.log("item not found")
//    }
//   };
const deleteItemHandler = (item) => {
  productStore.deleteProduct(item.sku);
};
  
  const statusColor = (status) => {
    if (status === 'Published') return 'success';
    if (status === 'Draft') return 'warning';
    if (status === 'Low Stock') return 'error';
    return 'info';
  };
  </script>
<style scoped>


.v-toolbar {
  padding: 0 16px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 16px;
}

.v-btn {
  font-weight: 500;
  letter-spacing: 0.5px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.v-data-table .v-data-table__td {
  vertical-align: middle;
  padding: 12px;
}

.product-name {
  font-weight: 500;
  color: #333;
}

.v-data-table .v-data-table__tr:hover {
  background-color: #f0f4ff;
  transition: background-color 0.3s;
}
</style>