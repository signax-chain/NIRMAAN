<template>
  <v-skeleton-loader
    class="mx-auto"
    max-width="300"
    type="list-item-avatar-two-line@3"
  ></v-skeleton-loader>
</template>

<script>
export default {
  name: "NavigationItem",
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
};
</script>

<style scoped>
.v-skeleton-loader {
  max-width: 100% !important;
}
</style>