<template>
  <div>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">
      <v-btn icon color="traktor" to="/contacts">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      My Connections
    </h3>
    <div class="connections-table">
      <profile />
      <connections-comp class="mt-5" />
    </div>
  </div>
</template>
<script>
import Profile from "@/components/Contacts/Profile";
import ConnectionsComp from "@/components/Contacts/Connections";

export default {
  name: "Connections",
  components: {
    Profile,
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
          text: "Contacts",
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
.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

.connections-table {
  background-color: #fff;
  border-radius: 5px;
  padding: 1rem;
  margin: 1rem 1.5rem;
}
</style>