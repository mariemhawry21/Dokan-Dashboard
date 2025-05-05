<template>
  <v-container>
    <v-form @submit.prevent="updateProduct">
      <div class="form-section">
        <h3>General Information</h3>
        <v-text-field
          v-model="editedProduct.Product"
          label="Product Name"
          required
        ></v-text-field>
        <v-textarea
          v-model="editedProduct.Description"
          label="Description"
        ></v-textarea>
      </div>

      <div class="form-section">
        <h3>Category</h3>
        <v-select
          v-model="editedProduct.category"
          :items="categories"
          label="Product Category"
        ></v-select>
        <v-row>
          <v-col cols="12" sm="6">
            <v-select
              v-model="editedProduct.status"
              :items="statuses"
              label="Product Status"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="editedProduct.ProductTags"
              label="Product Tags"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>

      <div class="form-section">
        <h3>Pricing</h3>
        <v-text-field
          v-model="editedProduct.price"
          label="Base Price"
          type="number"
        ></v-text-field>
        <v-row>
          <v-col cols="12" sm="6">
            <v-select
              v-model="editedProduct.DiscountType"
              :items="discountTypes"
              label="Discount Type"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="editedProduct.DiscountValue"
              label="Discount Value"
              type="number"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>

      <div class="form-section">
        <h3>Inventory</h3>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="editedProduct.stock"
              label="Quantity"
              type="number"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="editedProduct.sku"
              label="SKU"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>
      </div>

      <div class="form-section">
        <h3>Product Image</h3>
        <v-row>
          <v-col cols="12">
            <v-img
              v-if="editedProduct.image"
              :src="editedProduct.image"
              max-height="120"
              class="mb-2 rounded"
            ></v-img>
            <v-file-input
              v-if="!editedProduct.image"
              label="Choose Product Image"
              accept="image/*"
              @change="handleImageUpload"
            ></v-file-input>
          </v-col>
        </v-row>
        <v-btn
          v-if="editedProduct.image"
          size="small"
          @click="removeImage"
          color="red-lighten-1"
          class="mb-2"
          >Remove Image</v-btn
        >
      </div>

      <div class="d-flex flex-wrap mt-4">
        <v-btn type="submit" color="primary">Update Product</v-btn>
        <v-btn class="ml-2" @click="goBack" color="grey-lighten-1">Cancel</v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductStore } from "../store/product";

const router = useRouter();
const route = useRoute();
const productStore = useProductStore();

const productSku = ref(route.params.sku);
const editedProduct = ref({});
const categories = ref(['Electronics', 'Clothing', 'Books']);
const statuses = ref(['Draft', 'Published', 'Out of Stock']);
const discountTypes = ref(['Percentage', 'Fixed Amount']);

onMounted(() => {
  loadProductDetails();
});

const loadProductDetails = () => {
  const product = productStore.products.find(p => p.sku === productSku.value);
  if (product) {
    editedProduct.value = { ...product };
  } else {
    console.error('Product not found with SKU:', productSku.value);
    router.push('/products');
  }
};

const updateProduct = () => {
  productStore.updateProduct(editedProduct.value);
  router.push('/products');
};

const goBack = () => {
  router.go(-1);
};

const handleImageUpload = (file) => {
  editedProduct.value.image = URL.createObjectURL(file);
};

const removeImage = () => {
  editedProduct.value.image = null;
};
</script>

<style scoped>
.form-section {
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #eee;
}

h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 6px;
  margin-bottom: 16px;
}

.v-text-field,
.v-select,
.v-textarea,
.v-file-input {
  margin-bottom: 16px;
}

.v-btn {
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
  padding: 10px 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.v-btn + .v-btn {
  margin-left: 12px;
}

@media (max-width: 600px) {
  h3 {
    font-size: 16px;
  }

  .v-btn {
    width: 100%;
    margin-bottom: 8px;
  }

  .v-btn + .v-btn {
    margin-left: 0;
  }
}
</style>
