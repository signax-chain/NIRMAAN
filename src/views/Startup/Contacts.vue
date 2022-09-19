<template>
  <div>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <div class="d-flex justify-space-between mb-5">
      <h3 class="heading">Contacts</h3>
      <v-btn color="traktor" dark class="mr-5" to="/connections">My Connections</v-btn>
    </div>
    <div class="contacts-table mx-5">
      <contacts-comp />
    </div>
  </div>
</template>
<script>
import ContactsComp from "@/components/Contacts/Contacts";

export default {
  name: "Contacts",
  components: {
    ContactsComp,
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
      ],
    }
  }
};
</script>
<style scoped>
.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

.contacts-table {
  background-color: #fff;
  border-radius: 5px;
  padding: 1rem;
}
</style>