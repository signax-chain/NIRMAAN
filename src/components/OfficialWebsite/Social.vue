<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <Youtube />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Youtube from "./Social/Youtube";

export default {
  name: "Social",
  components: {
    Youtube,
  },
};
</script>

<style>
</style>