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

  <div>order details</div>
</template>

<!-- <script>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const orderId = ref([route.params.id])
</script> -->
