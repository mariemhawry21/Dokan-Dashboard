<script setup>
  import { onMounted, ref, computed } from 'vue'
  import { useToast } from 'vue-toastification'
  import { useI18n } from 'vue-i18n'
  import SkeletonLoader from '../components/Shared/SkeletonLoader.vue'
  import { useAuthStore } from '../store/auth'
  import { useRequestsStore } from '../store/useRequestsStore'

  const toast = useToast()
  const { t } = useI18n()
  const authStore = useAuthStore()
  const requestsStore = useRequestsStore()
  const initialLoading = ref(true)

  // Reactive data
  const page = ref(1)
  const itemsPerPage = ref(10)
  const columns = ref([])
  const error = ref(null)
  const loadingUsers = ref({})

  // Computed properties
  const isSuperAdmin = computed(() => authStore.userRole === 'super_admin')
  const totalPages = computed(() =>
    Math.ceil(requestsStore.total / itemsPerPage.value)
  )
  const showingFrom = computed(() => (page.value - 1) * itemsPerPage.value + 1)
  const showingTo = computed(() =>
    Math.min(page.value * itemsPerPage.value, requestsStore.total)
  )

  // Methods
  const fetchRequests = async () => {
    try {
      initialLoading.value = true

      await requestsStore.fetchRequests({
        page: page.value,
        limit: itemsPerPage.value
      })
    } catch (err) {
      error.value = err.message || t('error.fetchingRequests')
      toast.error(error.value)
    } finally {
      initialLoading.value = false
    }
  }

  const approve = async (user) => {
    loadingUsers.value[user._id] = true
    try {
      await requestsStore.approveRequest(user._id)
      toast.success(t('userApproved', { name: user.username }))
      fetchRequests()
    } catch (err) {
      error.value = err.message || t('error.approvingUser')
      toast.error(error.value)
    } finally {
      loadingUsers.value[user._id] = false
    }
  }

  const deny = async (user) => {
    loadingUsers.value[user._id] = true
    try {
      await requestsStore.denyRequest(user._id)
      toast.success(t('userDenied', { name: user.username }))
      fetchRequests()
    } catch (err) {
      error.value = err.message || t('error.denyingUser')
      toast.error(error.value)
    } finally {
      loadingUsers.value[user._id] = false
    }
  }

  const changePage = (newPage) => {
    page.value = newPage
    fetchRequests()
  }

  const changeItemsPerPage = (newSize) => {
    itemsPerPage.value = newSize
    page.value = 1 // Reset to first page when changing page size
    fetchRequests()
  }

  onMounted(() => {
    columns.value = [t('user'), t('email'), t('actions')]
    fetchRequests()
  })
</script>

<template>
  <v-container v-if="isSuperAdmin" fluid>
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

          <v-card-text style="padding: 0">
            <!-- Error state -->
            <v-alert v-if="error" type="error" variant="tonal" class="mb-6">
              {{ error }}
            </v-alert>

            <!-- Empty state -->
            <div
              v-else-if="
                !requestsStore.loading && requestsStore.requests.length === 0
              "
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
              v-if="
                initialLoading ||
                (requestsStore.loading && requestsStore.requests.length === 0)
              "
              :columns="columns"
              :rows="3"
            />

            <!-- Requests list -->
            <template v-else>
              <v-table
                :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
                class="elevation-1 mb-4"
                style="width: 100%"
              >
                <thead>
                  <tr>
                    <th class="text-left text-h6">{{ t('user') }}</th>
                    <th class="text-left text-h6">{{ t('email') }}</th>
                    <th class="text-left text-h6">{{ t('actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="user in requestsStore.requests"
                    :key="user._id"
                    class="hover-row"
                  >
                    <td>
                      <div class="d-flex align-center">
                        <v-avatar color="primary" size="48" class="mx-4">
                          <v-img :src="user.avatar" :alt="user.username" />
                        </v-avatar>
                        <span class="text-h6">{{ user.username }}</span>
                      </div>
                    </td>
                    <td class="text-h6">{{ user.email }}</td>
                    <td class="text-right">
                      <v-btn
                        color="success"
                        variant="tonal"
                        :class="[$i18n.locale === 'ar' ? 'ml-2' : 'mr-2']"
                        size="large"
                        @click="approve(user)"
                        :prepend-icon="
                          $i18n.locale === 'ar' ? undefined : 'mdi-check'
                        "
                        :append-icon="
                          $i18n.locale === 'ar' ? 'mdi-check' : undefined
                        "
                        :loading="loadingUsers[user._id]"
                      >
                        {{ t('approve') }}
                      </v-btn>

                      <v-btn
                        color="error"
                        variant="tonal"
                        size="large"
                        @click="deny(user)"
                        :prepend-icon="
                          $i18n.locale === 'ar' ? undefined : 'mdi-close'
                        "
                        :append-icon="
                          $i18n.locale === 'ar' ? 'mdi-close' : undefined
                        "
                        :loading="loadingUsers[user._id]"
                      >
                        {{ t('deny') }}
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <!-- Pagination Controls -->
              <div class="d-flex align-center justify-space-between mt-4 pa-3">
                <div class="d-flex align-center">
                  <span class="text-caption mr-2"
                    >{{ t('itemsPerPage') }}:</span
                  >
                  <v-select
                    v-model="itemsPerPage"
                    :items="[5, 10, 20, 50]"
                    density="compact"
                    variant="outlined"
                    hide-details
                    style="max-width: 100px"
                    @update:model-value="changeItemsPerPage"
                  ></v-select>
                </div>

                <v-pagination
                  v-model="page"
                  :length="totalPages"
                  :total-visible="7"
                  @update:model-value="changePage"
                ></v-pagination>

                <div class="text-caption">
                  {{
                    t('showingItems', {
                      from: showingFrom,
                      to: showingTo,
                      total: requestsStore.total
                    })
                  }}
                </div>
              </div>
            </template>
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

  .v-pagination {
    margin: 0;
  }

  [dir='rtl'] .v-pagination {
    direction: ltr; /* Keep pagination LTR even in RTL languages */
  }
</style>
