<template>
  <v-dialog persistent max-width="700" v-model="show">
    <v-card>
      <v-card-title class="heading">
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="show = false">Close</v-btn>
      </v-card-title>
      <v-card-text>
        <img class="d-block mx-auto" :src="data.photoURL" :alt="data.name" />
        <h3 class="text-center my-3">{{ data.name }}</h3>
        <p>{{ data.description }}</p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AboutModal",
  props: ["visible", "data"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) return this.$emit("close");
      },
    },
  },
};
</script>

<style scoped>
h3 {
  color: #3aa959;
}

img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}
</style>