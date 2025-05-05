<template>
  <div class="d-flex align-center justify-space-between mt-4 pa-3">
    <div class="d-flex align-center">
      <span class="text-caption mr-2">{{ t('itemsPerPage') }}:</span>
      <v-select
        v-model="internalItemsPerPage"
        :items="pageSizeOptions"
        density="compact"
        variant="outlined"
        hide-details
        style="max-width: 100px"
        @update:model-value="handleItemsPerPageChange"
      ></v-select>
    </div>

    <v-pagination
      v-model="internalPage"
      :length="totalPages"
      :total-visible="7"
      @update:model-value="handlePageChange"
    ></v-pagination>

    <div class="text-caption">
      {{
        t('showingItems', {
          from: showingFrom,
          to: showingTo,
          total: totalItems
        })
      }}
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps({
    page: {
      type: Number,
      default: 1
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
    totalItems: {
      type: Number,
      default: 0
    },
    pageSizeOptions: {
      type: Array,
      default: () => [5, 10, 20, 50]
    }
  })

  const emit = defineEmits(['update:page', 'update:itemsPerPage'])

  const internalPage = ref(props.page)
  const internalItemsPerPage = ref(props.itemsPerPage)

  // Computed properties
  const totalPages = computed(() => {
    return Math.ceil(props.totalItems / internalItemsPerPage.value) || 1
  })

  const showingFrom = computed(() => {
    return (internalPage.value - 1) * internalItemsPerPage.value + 1
  })

  const showingTo = computed(() => {
    return Math.min(
      internalPage.value * internalItemsPerPage.value,
      props.totalItems
    )
  })

  // Watchers
  watch(
    () => props.page,
    (newVal) => {
      internalPage.value = newVal
    }
  )

  watch(
    () => props.itemsPerPage,
    (newVal) => {
      internalItemsPerPage.value = newVal
    }
  )

  // Event handlers
  const handlePageChange = (newPage) => {
    emit('update:page', newPage)
  }

  const handleItemsPerPageChange = (newSize) => {
    emit('update:itemsPerPage', newSize)
    // Reset to first page when changing page size
    emit('update:page', 1)
  }
</script>
