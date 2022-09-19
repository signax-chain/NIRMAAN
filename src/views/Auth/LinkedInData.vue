<template>
  <div>data</div>
</template>

<script>
import { linkedInSSO } from "../../services/Auth/sso/linkedin";
export default {
  data() {
    return {
      data: {},
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      try {
        linkedInSSO.getUserData().then((data) => {
          this.data = data;
          console.log(this.data);
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
</style>