<template>
  <v-dialog persistent max-width="800" v-model="show">
    <v-card>
      <v-card-title class="heading"></v-card-title>
      <v-card-text>
        <h2 class="text-center">{{ data.title }}</h2>
        <p class="text-center my-5">{{ data.descriptions }}</p>
        <img :src="srcObj" class="d-block mx-auto" :alt="data.title" />
        <v-btn
          color="traktor"
          dark
          class="d-block mt-5 mx-auto"
          v-if="data.isButton"
          @click="open(data.btnLink)"
          >Read more</v-btn
        >
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="show = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Preview",
  props: ["visible", "data", "srcObj"],
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
  methods: {
    open(link) {
      window.open(link, "_blank").focus();
    },
  },
};
</script>

<style scoped>
h2 {
  color: #3aa959;
}

img {
  width: 300px;
}
</style>