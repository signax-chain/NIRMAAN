<template>
  <v-dialog persistent max-width="800" v-model="show"></v-dialog>
</template>

<script>
export default {
  name: "Edit",
  props: ["visible", "job"],
};
</script>

<style scoped>
</style>