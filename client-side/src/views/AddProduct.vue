<template>
  <v-container>
    <v-form @submit.prevent="addProduct">
      <div class="form-section">
        <h3>General Information</h3>
        <v-text-field
          v-model="newProduct.Product"
          label="Product Name"
          required
        ></v-text-field>
        <v-textarea
          v-model="newProduct.Description"
          label="Description"
        ></v-textarea>
      </div>

      <div class="form-section">
        <h3>Category</h3>
        <v-select
          v-model="newProduct.ProductCategory"
          :items="['Electronics', 'Clothing', 'Books']"
          label="Product Category"
        ></v-select>
        <v-row>
          <v-col cols="12" sm="6">
            <v-select
              v-model="newProduct.ProductStatus"
              :items="['Draft', 'Published', 'Out of Stock']"
              label="Product Status"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="newProduct.ProductTags"
              label="Product Tags"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>

      <div class="form-section">
        <h3>Pricing</h3>
        <v-text-field
          v-model="newProduct.BasePrice"
          label="Base Price"
          type="number"
        ></v-text-field>
        <v-row>
          <v-col cols="12" sm="6">
            <v-select
              v-model="newProduct.DiscountType"
              :items="['Percentage', 'Fixed Amount']"
              label="Discount Type"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="newProduct.DiscountValue"
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
              v-model="newProduct.SKU"
              label="SKU"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="newProduct.Quantity"
              label="Quantity"
              type="number"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>

      <div class="form-section">
        <h3>Media</h3>
        <v-file-input
          v-model="newProduct.imageFile"
          label="Product Image"
          accept="image/*"
          :rules="[rules.required, rules.image]"
          show-size
        ></v-file-input>
      </div>

      <div class="d-flex flex-wrap mt-4">
        <v-btn type="submit" color="primary">Add Product</v-btn>
        <v-btn class="ml-2" @click="goBack" color="grey-lighten-1">Cancel</v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from "../store/product";

const router = useRouter();
const productStore = useProductStore();

const newProduct = ref({
  Product: "",
  Description: "",
  ProductCategory: null,
  ProductTags: "",
  ProductStatus: "Draft",
  BasePrice: null,
  DiscountType: null,
  DiscountValue: null,
  SKU: "",
  Quantity: null,
  imageFile: null,
});

const rules = ref({
  required: (value) => !!value || "Required.",
  image: (value) =>
    !value || value.size < 2000000 || "Image must be under 2 MB",
});

const addProduct = () => {
  const productToAdd = {
    Product: newProduct.value.Product,
    sku: newProduct.value.SKU,
    category: newProduct.value.ProductCategory,
    stock: newProduct.value.Quantity,
    price: newProduct.value.BasePrice,
    status: newProduct.value.ProductStatus,
    image: newProduct.value.imageFile ? newProduct.value.imageFile.name : null,
  };
  productStore.addProduct(productToAdd);
  router.push("/products");
};

const goBack = () => {
  router.go(-1);
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
