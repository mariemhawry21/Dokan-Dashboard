<template>
  <v-card class="mb-6">
    <v-card-title class="primary">
      <v-icon left>mdi-truck</v-icon>
      Shipping Methods
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="shippingHeaders"
        :items="shippingMethods"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar
            flat
            :color="$vuetify.theme.current.dark ? 'surface' : 'white'"
          >
            <v-btn
              :color="$vuetify.theme.current.dark ? 'dark-primary' : 'primary'"
              @click="openShippingDialog(null)"
            >
              <v-icon left>mdi-plus</v-icon>
              Add Method
            </v-btn>
          </v-toolbar>
        </template>
        <!-- Explicit header template -->
        <template v-slot:header="{ headers }">
          <thead>
            <tr>
              <th
                v-for="header in headers"
                :key="header.value"
                :class="['text-' + header.align || 'start']"
              >
                {{ header.title }}
              </th>
            </tr>
          </thead>
        </template>

        <!-- Your existing item templates -->
        <template v-slot:item.cost="{ item }">
          {{ formatCurrency(item.cost) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <!-- Your action buttons -->
        </template>
      </v-data-table>
      <!-- Shipping Method Dialog -->
      <v-dialog v-model="shippingDialog" max-width="500px">
        <v-card>
          <v-card-title>
            {{ editingShipping ? 'Edit' : 'New' }} Shipping Method
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="saveShippingMethod">
              <v-text-field
                v-model="currentShipping.name"
                label="Method Name"
                required
              ></v-text-field>
              <v-text-field
                v-model.number="currentShipping.cost"
                label="Cost"
                type="number"
                prefix="$"
                required
              ></v-text-field>
              <v-btn
                type="submit"
                :color="
                  $vuetify.theme.current.dark ? 'dark-primary' : 'primary'
                "
              >
                Save
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>
<script>
  import { useSettingsStore } from '../../store/useSettingsStore'

  export default {
    setup() {
      const settingsStore = useSettingsStore()
      return { settingsStore }
    },
    data() {
      return {
        // Shipping Methods
        shippingHeaders: [
          {
            title: 'Method', // Use 'title' instead of 'text'
            value: 'name',
            sortable: true,
            align: 'start'
          },
          {
            title: 'Cost',
            value: 'cost',
            sortable: true
          },
          {
            title: 'Actions',
            value: 'actions',
            sortable: false
          }
        ],
        shippingMethods: [
          { id: 1, name: 'Standard Shipping', cost: 5.99 },
          { id: 2, name: 'Express Shipping', cost: 12.99 },
          { id: 3, name: 'International', cost: 24.99 }
        ],
        shippingDialog: false,
        currentShipping: { name: '', cost: 0 },
        editingShipping: false
      }
    },
    methods: {
      // Shipping Methods
      openShippingDialog(item) {
        this.editingShipping = !!item
        this.currentShipping = item ? { ...item } : { name: '', cost: 0 }
        this.shippingDialog = true
      },

      saveShippingMethod() {
        if (this.editingShipping) {
          const index = this.shippingMethods.findIndex(
            (m) => m.id === this.currentShipping.id
          )
          this.shippingMethods.splice(index, 1, { ...this.currentShipping })
        } else {
          this.shippingMethods.push({
            ...this.currentShipping,
            id: Math.max(...this.shippingMethods.map((m) => m.id)) + 1
          })
        }
        this.shippingDialog = false
        this.$toast.success(
          `Shipping method ${this.editingShipping ? 'updated' : 'added'}`
        )
      },

      deleteShippingMethod(id) {
        if (confirm('Are you sure you want to delete this shipping method?')) {
          this.shippingMethods = this.shippingMethods.filter((m) => m.id !== id)
          this.$toast.success('Shipping method deleted')
        }
      },

      formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: this.settingsStore.currency // Changed from this.storeSettings to this.settingsStore
        }).format(value)
      }
    }
  }
</script>
