<template>
  <v-skeleton-loader
    class="mx-auto"
    max-width="300"
    type="text"
  ></v-skeleton-loader>
</template>

<script>
export default {
  name: "SkeletonText",
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