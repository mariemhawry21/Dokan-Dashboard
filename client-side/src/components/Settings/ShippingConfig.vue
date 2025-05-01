<template>
  <v-card class="mb-6">
    <v-card-title
      class="primary d-flex align-center"
      :class="{ 'flex-row-reverse': $i18n.locale === 'ar' }"
    >
      <v-icon
        class="mx-2"
        :left="$i18n.locale !== 'ar'"
        :right="$i18n.locale === 'ar'"
      >
        mdi-truck
      </v-icon>
      <span>{{ $t('shippingMethods') }}</span>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
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
              color="secondary"
              @click="openShippingDialog(null)"
              class="w-100"
            >
              <v-icon left>mdi-plus</v-icon>
              {{ $t('addMethod') }}
            </v-btn>
          </v-toolbar>
        </template>

        <template v-slot:header="{ headers }">
          <thead>
            <tr>
              <th v-for="header in headers" :key="header.value">
                {{ header.title }}
              </th>
            </tr>
          </thead>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon @click="openShippingDialog(item)" color="" class="mx-2"
            >mdi-pencil</v-icon
          >
          <v-icon @click="deleteShippingMethod(item.id)" color="red"
            >mdi-delete</v-icon
          >
        </template>

        <template v-slot:item.cost="{ item }">
          {{ formatCurrency(item.cost) }}
        </template>
      </v-data-table>

      <!-- Shipping Method Dialog -->
      <v-dialog v-model="shippingDialog" max-width="500px" persistent>
        <v-card class="p-3">
          <v-card-title>
            {{
              editingShipping
                ? $t('editShippingMethod')
                : $t('newShippingMethod')
            }}
          </v-card-title>
          <v-card-text>
            <v-form ref="shippingForm" @submit.prevent="saveShippingMethod">
              <v-text-field
                v-model="currentShipping.name"
                :label="$t('methodName')"
                :rules="nameRules"
                required
              ></v-text-field>
              <v-text-field
                v-model.number="currentShipping.cost"
                :label="$t('cost')"
                type="number"
                prefix="$"
                :rules="costRules"
                required
              ></v-text-field>
              <v-card-actions class="justify-end">
                <v-btn
                  :color="
                    $vuetify.theme.current.dark ? 'grey-ligthen-2' : 'secondary'
                  "
                  @click="closeShippingDialog"
                  class="mr-2"
                >
                  {{ $t('cancel') }}
                </v-btn>
                <v-btn
                  type="submit"
                  :color="
                    $vuetify.theme.current.dark ? 'dark-primary' : 'primary'
                  "
                  :disabled="!isFormValid"
                >
                  {{ $t('save') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script>
  import { useToast } from 'vue-toastification'
  import { useSettingsStore } from '../../store/useSettingsStore'

  export default {
    setup() {
      const settingsStore = useSettingsStore()
      const toast = useToast()
      return { settingsStore, toast }
    },
    data() {
      return {
        shippingMethods: [
          { id: 1, name: 'Standard Shipping', cost: 5.99 },
          { id: 2, name: 'Express Shipping', cost: 12.99 },
          { id: 3, name: 'International', cost: 24.99 }
        ],
        shippingDialog: false,
        currentShipping: { name: '', cost: 0 },
        editingShipping: false,
        nameRules: [
          (v) => !!v || 'Method name is required',
          (v) => (v && v.length <= 50) || 'Name must be less than 50 characters'
        ],
        costRules: [
          (v) => !!v || 'Cost is required',
          (v) => !isNaN(v) || 'Must be a valid number',
          (v) => v >= 0 || 'Cost cannot be negative'
        ],
        shippingToDelete: null
      }
    },
    computed: {
      shippingHeaders() {
        return [
          {
            title: this.$t('methodName'),
            value: 'name',
            sortable: true,
            align: 'start'
          },
          { title: this.$t('cost'), value: 'cost', sortable: true },
          { title: this.$t('actions'), value: 'actions', sortable: false }
        ]
      },
      isFormValid() {
        return (
          this.currentShipping.name.trim() !== '' &&
          this.currentShipping.cost !== null &&
          this.currentShipping.cost !== undefined &&
          !isNaN(this.currentShipping.cost) &&
          this.currentShipping.cost >= 0
        )
      }
    },
    methods: {
      openShippingDialog(item) {
        this.editingShipping = !!item
        this.currentShipping = item ? { ...item } : { name: '', cost: 0 }
        this.shippingDialog = true
        this.$nextTick(() => {
          if (this.$refs.shippingForm) {
            this.$refs.shippingForm.resetValidation()
          }
        })
      },

      closeShippingDialog() {
        this.shippingDialog = false
        if (this.$refs.shippingForm) {
          this.$refs.shippingForm.resetValidation()
        }
      },

      saveShippingMethod() {
        if (this.$refs.shippingForm.validate()) {
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
          this.toast.success(
            this.editingShipping
              ? this.$t('methodUpdated')
              : this.$t('methodAdded')
          )
        }
      },

      async confirmDelete(id) {
        this.shippingToDelete = id
        const confirmed = await this.showDeleteConfirmation()
        if (confirmed) {
          this.deleteShippingMethod()
        }
      },

      deleteShippingMethod(id) {
        console.log('deleted')

        const originalLength = this.shippingMethods.length
        this.shippingMethods = this.shippingMethods.filter((m) => m.id !== id)

        if (this.shippingMethods.length < originalLength) {
          this.toast.success(this.$t('methodDeleted'))
        } else {
          this.toast.error(this.$t('methodNotFound'))
        }
      },

      showDeleteConfirmation() {
        return new Promise((resolve) => {
          this.toast.warning(this.$t('confirmDelete'), {
            timeout: false,
            closeOnClick: false,
            draggable: false,
            buttons: [
              {
                text: this.$t('delete'),
                onClick: (_, toastObject) => {
                  toastObject.goAway(0)
                  resolve(true)
                },
                class: 'v-btn v-btn--flat v-btn--text error--text'
              },
              {
                text: this.$t('cancel'),
                onClick: (_, toastObject) => {
                  toastObject.goAway(0)
                  resolve(false)
                },
                class: 'v-btn v-btn--flat v-btn--text'
              }
            ]
          })
        })
      },

      formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: this.settingsStore.currency
        }).format(value)
      }
    }
  }
</script>

<style scoped>
  .hover-row:hover {
    background-color: rgba(0, 0, 0, 0.02);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .v-table {
    width: 100%;
  }

  .v-card-title {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  tr td {
    padding: 20px !important;
  }
  /* Apply only when dir="rtl" */
  [dir='rtl'] tr th {
    text-align: right !important;
  }

  /* Optional: Add other RTL-specific table styles */
  [dir='rtl'] .v-table td {
    text-align: right !important;
  }
  /* 
  [dir='rtl'] .v-data-table-header__content {
    justify-content: flex-end !important;
  } */
</style>
