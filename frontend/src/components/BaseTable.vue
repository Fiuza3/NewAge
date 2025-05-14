<template>
  <div class="base-table">
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      :items-per-page="itemsPerPage"
      :search="search"
      :sort-by="sortBy"
      class="na-table"
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData"></slot>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'BaseTable',
  props: {
    headers: {
      type: Array as PropType<Array<any>>,
      required: true
    },
    items: {
      type: Array as PropType<Array<any>>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
    search: {
      type: String,
      default: ''
    },
    sortBy: {
      type: Array as PropType<Array<any>>,
      default: () => []
    }
  }
})
</script>