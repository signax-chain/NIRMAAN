<template>
  <div>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">Events</h3>
    <div class="wrapper mx-5">
      <h3 class="heading ml-0">All Events</h3>
      <all-events />
    </div>
  </div>
</template>

<script>
import AllEvents from "@/components/Events/AllEvents";

export default {
  name: "Events",
  components: {
    AllEvents,
  },
  data() {
    return {
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Events",
          disabled: true,
        },
      ],
    };
  },
};
</script>

<style scoped>
.wrapper {
  background-color: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  padding: 1rem 1rem 3rem 1rem;
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}
</style>