<template>
  <div>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">Connections</h3>
    <div class="wrapper mx-5">
      <h3 class="heading ml-0">All Connections</h3>
      <connections-comp />
    </div>
  </div>
</template>

<script>
import ConnectionsComp from "@/components/Contacts/Connections";

export default {
  name: "Connections",
  components: {
    ConnectionsComp,
  },
  data() {
    return {
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Connections",
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