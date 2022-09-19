<template>
  <section class="pa-1">
    <div class="d-flex justify-space-between">
      <p class="mt-3">
        Apply for AWS Credits and get cloud credits worth $1500
      </p>
      <v-btn large @click="goto()" class="mt-1">Apply Now</v-btn>
    </div>
  </section>
</template>

<script>
export default {
  methods: {
    goto() {
      this.$router.push("/aws-credit/apply");
    },
  },
};
</script>

<style scoped>
section {
  background-color: #3aa959;
  color: #fff;
  margin: 0;
  width: 100%;
}

section > div {
  width: 52%;
  margin: 0 auto;
  text-align: center;
}

p {
  font-size: 18px;
}

.v-btn {
  font-size: 16px !important;
  background: rgba(255, 255, 255, 0.14) !important;
  color: #fff !important;
  border-radius: 3px;
  /* box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1); */
}
</style>