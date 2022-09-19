<template>
  <v-skeleton-loader
    class="mx-auto"
    max-width="300"
    type="text, article, actions"
  ></v-skeleton-loader>
</template>

<script>
export default {
  name: "NotesSkeleton",
};
</script>

<style scoped>
.v-skeleton-loader {
  max-width: 100% !important;
}
</style>