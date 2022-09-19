<template>
  <v-container>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">All Requests</h3>
    <v-data-table class="mx-5" :headers="headers" :items="requests">
      <template v-slot:[`item.createdAt`]="{ item }">
        {{ item.createdAt.toDate().toDateString() }}
      </template>
      <template v-slot:[`item.userId`]="{ item }">
        {{ mapStartupName(item.userId) }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <!-- <v-btn color="traktor" dark class="mr-2">View</v-btn> -->
        <v-btn
          v-if="item.type === 'internship'"
          color="traktor"
          dark
          @click="generateCertificate(item)"
          >Generate certificate</v-btn
        >
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { getAllRequests, getStartups } from "../../services/raise-request";
export default {
  components: {},
  name: "AllRequests",
  created() {
    this.checkRole();
    this.getStartups();
    this.getRequests();
  },
  data() {
    return {
      crumbs: [
        {
          text: "Requests",
          disabled: true,
        },
        {
          text: "All Requests",
          disabled: true,
        },
      ],
      role: "",
      startups: [],
      requests: [],
      headers: [
        {
          text: "Raised at",
          align: "left",
          sortable: true,
          value: "createdAt",
        },
        {
          text: "Raised by",
          align: "left",
          sortable: true,
          value: "userId",
        },
        {
          text: "Type",
          align: "left",
          sortable: true,
          value: "request.category",
        },
        {
          text: "Actions",
          align: "left",
          sortable: false,
          value: "actions",
        },
      ],
    };
  },
  methods: {
    checkRole() {
      this.role = this.$store.state.user.currentUser.role;
    },
    async getRequests() {
      if (this.role === "incubator") {
        this.requests = await getAllRequests();
      }
    },
    async getStartups() {
      this.startups = await getStartups();
    },
    mapStartupName(id) {
      const startup = this.startups.find((startup) => startup.id === id);
      return startup.name;
    },
    generateCertificate(item) {
      this.$router.push({
        name: "InternshipCertificate",
        params: { ...item },
      });
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

>>> th {
  color: #3aa959 !important;
  font-size: 16px !important;
}
</style>
