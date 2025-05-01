<script setup>
  import { onMounted, ref } from 'vue'
  import { useToast } from 'vue-toastification'
  import { useI18n } from 'vue-i18n' // Add this import
  import SkeletonLoader from '../components/Shared/SkeletonLoader.vue'

  const toast = useToast()
  const { t } = useI18n() // Initialize i18n

  // Static test data
  const loading = ref(true)
  const error = ref(null)
  const requests = ref([
    {
      _id: '1',
      fullName: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      _id: '2',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      _id: '3',
      fullName: 'Bob Johnson',
      email: 'bob@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    }
  ])

  // Initialize columns as a ref that can be updated
  const columns = ref([])

  const fetchRequests = () => {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 1500)
  }

  const approve = (id) => {
    const user = requests.value.find((u) => u._id === id)
    requests.value = requests.value.filter((u) => u._id !== id)
    toast.success(t('userApproved', { name: user.fullName }), {
      timeout: 3000
    })
  }

  const deny = (id) => {
    const user = requests.value.find((u) => u._id === id)
    requests.value = requests.value.filter((u) => u._id !== id)
    toast.error(t('userDenied', { name: user.fullName }), {
      timeout: 3000
    })
  }

  onMounted(() => {
    // Initialize translated columns after component mounts
    columns.value = [t('user'), t('email'), t('actions')]
    fetchRequests()
  })
</script>

<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card flat class="rounded-0">
          <v-card-title class="primary">
            <div
              class="d-flex pa-2"
              :class="{ 'flex-row-reverse': $i18n.locale === 'ar' }"
            >
              <v-icon
                class="mx-2"
                :left="$i18n.locale !== 'ar'"
                :right="$i18n.locale === 'ar'"
              >
                mdi-account-cog
              </v-icon>
              {{ $t('pendingUserRequests') }}
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="">
            <!-- Error state -->
            <v-alert v-if="error" type="error" variant="tonal" class="mb-6">
              {{ error }}
            </v-alert>

            <!-- Empty state -->
            <div
              v-else-if="!loading && requests.length === 0"
              class="text-center py-12"
            >
              <v-icon size="96" color="grey lighten-1">mdi-account-off</v-icon>
              <p class="text-h4 grey--text mt-4">
                {{ t('noPendingRequests') }}
              </p>
              <p class="text grey--text mt-4">
                {{ t('allRequestsProcessed') }}
              </p>
            </div>

            <!-- Skeleton Loading -->
            <skeleton-loader
              v-if="loading"
              :columns="columns"
              :rows="3"
              :loading="loading"
            />

            <!-- Requests list -->
            <v-table
              :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
              v-else-if="!loading && requests.length > 0"
              class="elevation-1"
            >
              <thead>
                <tr>
                  <th class="text-left text-h6">{{ t('user') }}</th>
                  <th class="text-left text-h6">{{ t('email') }}</th>
                  <th class="text-right text-h6">{{ t('actions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in requests" :key="user._id" class="hover-row">
                  <td>
                    <div class="d-flex align-center">
                      <v-avatar color="primary" size="48" class="mx-4">
                        <v-img :src="user.avatar" :alt="user.fullName" />
                      </v-avatar>
                      <span class="text-h6">{{ user.fullName }}</span>
                    </div>
                  </td>
                  <td class="text-h6">{{ user.email }}</td>
                  <td class="text-right">
                    <v-btn
                      color="success"
                      variant="tonal"
                      :class="[$i18n.locale === 'ar' ? 'ml-2' : 'mr-2']"
                      size="large"
                      @click="approve(user._id)"
                      :prepend-icon="
                        $i18n.locale === 'ar' ? undefined : 'mdi-check'
                      "
                      :append-icon="
                        $i18n.locale === 'ar' ? 'mdi-check' : undefined
                      "
                    >
                      {{ t('approve') }}
                    </v-btn>

                    <v-btn
                      color="error"
                      variant="tonal"
                      size="large"
                      @click="deny(user._id)"
                      :prepend-icon="
                        $i18n.locale === 'ar' ? undefined : 'mdi-close'
                      "
                      :append-icon="
                        $i18n.locale === 'ar' ? 'mdi-close' : undefined
                      "
                    >
                      {{ t('deny') }}
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
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

  [dir='rtl'] .v-data-table-header__content {
    justify-content: flex-end !important;
  }
</style>
