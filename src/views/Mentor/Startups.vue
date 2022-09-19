<template>
  <v-container>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <div class="startups-header d-flex justify-space-between">
      <h3 class="heading">
        {{ $route.name === "AllStartups" ? "All Startups" : "My Startups" }}
      </h3>
      <v-btn
        color="traktor"
        dark
        :to="`${
          $route.name === 'MyStartups' ? '/all-startups' : 'mentor-startups'
        }`"
        >{{
          $route.name === "MyStartups"
            ? "View All Startups"
            : "View My Startups"
        }}</v-btn
      >
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Startups",
  created() {
    this.checkRoute();
  },
  data() {
    return {
      crumbs: [],
    };
  },
  methods: {
    checkRoute() {
      if (this.$route.name === "MyStartups") {
        this.crumbs = [
          {
            text: "Dashboard",
            disabled: true,
          },
          {
            text: "Startups",
            disabled: true,
          },
        ];
      } else if (this.$route.name === "AllStartups") {
        this.crumbs = [
          {
            text: "Dashboard",
            disabled: true,
          },
          {
            text: "Startups",
            disabled: true,
          },
          {
            text: "All Startups",
            disabled: true,
          },
        ];
      }
    },
  },
};
</script>

<style scoped>
.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}
</style>