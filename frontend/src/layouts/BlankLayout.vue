<template>
  <div class="blank-layout">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BlankLayout'
})
</script>

<style lang="scss" scoped>
.blank-layout {
  height: 100%;
  width: 100%;
}
</style>