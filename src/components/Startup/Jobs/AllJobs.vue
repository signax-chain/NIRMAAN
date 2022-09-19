<template>
  <v-container>
    <v-data-table
      :search="search"
      :headers="headers"
      :items="jobs"
      :items-per-page="5"
      class="elevation-1 mb-5"
      mobile-breakpoint="0"
    >
      <template v-slot:top>
        <v-row>
          <v-col cols="12" md="5">
            <v-text-field
              v-model="search"
              label="Search Jobs"
              class="px-4"
              outlined
              dense
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.description`]="{ item }">
        {{ truncateParagraph(50, item.description) }}
      </template>
      <template v-slot:[`item.createdAt`]="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>
      <template v-slot:[`item.responses`]="{ item }">
        <v-btn
          color="traktor"
          class="white--text"
          @click="viewResponses(item.docId)"
          >View</v-btn
        >
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
          </template>
          <v-list>
            <v-list-item @click="view(item)">
              <v-list-item-title> View </v-list-item-title>
            </v-list-item>
            <!-- <v-list-item @click="edit(item.docId)">
              <v-list-item-title> Edit </v-list-item-title>
            </v-list-item> -->
            <v-list-item @click="_delete(item.docId)">
              <v-list-item-title> Delete </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
    <job-response
      :visible="dialog"
      :data="responses"
      @close="dialog = false"
    ></job-response>
    <preview :visible="pDialog" :job="job" @close="pDialog = false"></preview>
  </v-container>
</template>

<script>
import { websiteRef } from "../../../config/firebase_services";
import _helpers from "../../../mixins/_helpers";
import Preview from "../../Modals/Jobs/Preview.vue";
import JobResponse from "../../Modals/Startup/JobResponse.vue";
import Swal from "sweetalert2";

export default {
  components: { JobResponse, Preview },
  name: "AllJobs",
  data() {
    return {
      headers: [
        {
          text: "Role",
          value: "role",
          sortable: true,
          align: "center",
        },
        {
          text: "Duration",
          value: "duration",
          sortable: true,
          align: "center",
        },
        {
          text: "Requirements",
          value: "requirements",
          sortable: true,
          align: "center",
        },
        {
          text: "Paid/unpaid",
          value: "remuneration",
          sortable: true,
          align: "center",
        },
        {
          text: "Created at",
          value: "createdAt",
          sortable: true,
          align: "center",
        },
        {
          text: "Responses",
          value: "responses",
          sortable: true,
          align: "center",
        },
        { text: "Actions", value: "actions", sortable: true, align: "center" },
      ],
      search: null,
      jobs: [],
      dialog: false,
      responses: [],
      pDialog: false,
      job: {},
    };
  },
  mixins: [_helpers],
  created() {
    this.getData();
  },
  methods: {
    view(job) {
      this.job = job;
      this.pDialog = true;
    },
    async _delete(docId) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3aa959",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            websiteRef
              .doc(this.$store.state.incubator.currentIncubator.docId)
              .collection("jobs")
              .doc(docId)
              .delete();
            this.$toast.success("Deleted", {
              position: "top",
            });
          } catch (error) {
            this.$toast.error(error, {
              position: "top",
            });
          }
        }
      });
    },
    getData() {
      if (this.$store.state.user.currentUser.role === "startup") {
        websiteRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("jobs")
          .where("startupId", "==", this.$store.state.user.currentUser.docId)
          .onSnapshot((snapshot) => {
            this.jobs = [];
            snapshot.forEach((document) => {
              const data = document.data();
              data.docId = document.id;
              this.jobs.push(data);
            });
          });
      } else {
        this.headers.unshift({
          text: "Startup",
          value: "moreInfo.name",
          sortable: true,
          align: "center",
        });
        websiteRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .collection("jobs")
          .orderBy("createdAt", "desc")
          .onSnapshot((snapshot) => {
            this.jobs = [];
            snapshot.forEach((document) => {
              const data = document.data();
              data.docId = document.id;
              this.jobs.push(data);
            });
          });
      }
    },
    formatDate(timestamp) {
      return (
        timestamp.toDate().toDateString() +
        " at " +
        timestamp.toDate().toLocaleTimeString("en-in", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    },
    async viewResponses(docId) {
      this.responses = [];
      const documents = await websiteRef
        .doc(this.$store.state.incubator.currentIncubator.docId)
        .collection("jobResponses")
        .where("jobId", "==", docId)
        .orderBy("createdAt", "desc")
        .get();

      documents.forEach((document) => {
        this.responses.push(document.data());
      });
      this.dialog = true;
    },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: capitalize;
}

>>> th {
  color: #3aa95a !important;
  font-size: 18px !important;
  font-weight: normal;
}
</style>