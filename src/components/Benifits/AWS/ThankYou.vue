<template>
  <v-card elevation="0" class="px-5 py-10">
    <div class="thankyou">
      <img src="../../../assets/images/thankyou.svg" alt="" width="250px"/>
      <h1>Your Application is under review</h1>
      <span class="green-text my-3">
        You will be receiving a confirmation mail shortly.
      </span>
      <v-btn color="traktor" @click="cancel()" dark large> Continue </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  methods: {
    cancel() {
      this.$router.push("/about");
    },
  },
};
</script>

<style scoped>
.v-card {
  height: 80vh;
}

.thankyou {
  display: grid;
  place-items: center;
  height: 100%;
}

h1 {
  color: #3aa959;
}

span {
  color: #4f4f4f;
  font-size: 18px;
}
</style>