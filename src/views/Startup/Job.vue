<template>
  <v-container>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <div class="jobs-header d-flex justify-space-between">
      <h3 class="heading">Jobs</h3>
      <v-btn color="traktor" dark class="mr-5" to="/jobs/new"
        >Post a new job</v-btn
      >
    </div>
    <div class="jobs-body">
      <h3 class="heading">All Jobs</h3>
      <all-jobs></all-jobs>
    </div>
  </v-container>
</template>

<script>
import AllJobs from "../../components/Startup/Jobs/AllJobs.vue";

export default {
  name: "Job",
  components: {
    AllJobs,
  },
  data() {
    return {
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Jobs",
          disabled: true,
        },
      ],
    };
  },
};
</script>

<style scoped>
.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

.jobs-body {
  background-color: #fff;
  border-radius: 5px;
  padding: 1rem;
  margin: 1rem;
}
</style>