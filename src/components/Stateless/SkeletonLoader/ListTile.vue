<template>
  <v-skeleton-loader
    class="mx-auto"
    max-width="300"
    type="list-item-avatar-three-line@6"
  ></v-skeleton-loader>
</template>

<script>
export default {
  name: "ListTile",
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