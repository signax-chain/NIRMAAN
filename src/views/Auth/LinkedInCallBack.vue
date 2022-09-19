<template>
  <div></div>
</template>

<script>
export default {
  name: "LinkedInCallBack",
  async created() {
    this.$store.dispatch("SHOW_LOADER", { isShowing: true });
    console.log(this.$route.query.code);
    localStorage.setItem("linkedin-access_token", this.$route.query.code);
    this.$store.dispatch("SHOW_LOADER", { isShowing: false });
    window.close();
  },
};
</script>

<style>
</style>