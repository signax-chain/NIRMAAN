<template>
  <v-sheet
    :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
    class="pa-3"
  >
    <v-skeleton-loader
      class="mx-auto"
      max-width="300"
      type="table-heading, table-thead, table-tbody, table-row-divider, table-row"
    ></v-skeleton-loader>
  </v-sheet>
</template>

<script>
export default {
  name: "DataTable",
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