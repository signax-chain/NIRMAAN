<template>
  <div class="connections__container">
    <div class="table-actions d-flex justify-space-between">
      <v-col cols="12" md="6">
        <v-text-field
          outlined
          dense
          placeholder="Search for connections"
          append-icon="mdi-magnify"
          v-model="search"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" v-if="currentUser.role === 'incubator'">
        <div class="float-right">
          <v-btn color="traktor" dark class="mr-2" @click="goto('/contacts')"
            >Contacts</v-btn
          >
          <v-btn
            color="traktor"
            dark
            @click="goto('/connections/new')"
            >Establish Connection</v-btn
          >
          <v-btn color="grey" text dark @click="connectionDialog = true"
            >Add new Connection</v-btn
          >
        </div>
      </v-col>
    </div>
    <v-data-table
      :headers="headers"
      :items="connections"
      class="mt-3"
      mobile-breakpoint="0"
      :search="search"
    >
      <template v-slot:[`item.contacts`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click="copyToClipboard(item.contact.email)">
              <v-icon color="black" v-bind="attrs" v-on="on"
                >mdi-email</v-icon
              ></v-btn
            >
          </template>
          <span>{{ item.contact.email }}</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click="copyToClipboard(item.contact.phoneNumber)"
              ><v-icon color="black" v-bind="attrs" v-on="on"
                >mdi-phone</v-icon
              ></v-btn
            >
          </template>
          <span>{{ item.contact.phoneNumber }}</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <create
      :visible="connectionDialog"
      @close="connectionDialog = false"
    ></create>
  </div>
</template>
<script>
import { connectionsRef } from "../../config/firebase_services";
import { mapState } from "vuex";
import copy from "copy-to-clipboard";
import Create from "../Modals/Connection/Create.vue";

export default {
  components: { Create },
  name: "ConnectionsComp",
  computed: {
    ...mapState(
      { currentUser: (state) => state.user.currentUser },
      { currentIncubator: (state) => state.incubator.currentIncubator }
    ),
  },
  data() {
    return {
      headers: [
        {
          text: "Designation",
          align: "start",
          sortable: true,
          value: "contact.designation",
        },
        {
          text: "Organisation",
          align: "start",
          sortable: true,
          value: "contact.organisation",
        },
        {
          text: "Connected for",
          align: "start",
          sortable: true,
          value: "contact.connectFor",
        },
        {
          text: "Contact",
          align: "start",
          sortable: true,
          value: "contacts",
        },
      ],
      connections: [],
      search: "",
      connectionDialog: false,
    };
  },
  created() {
    this.updateHeaders();
    this.getConnections();
  },
  methods: {
    updateHeaders() {
      if (this.$store.state.user.currentUser.role === "incubator") {
        this.headers.unshift({
          text: "Startup/ Mentor",
          align: "start",
          sortable: true,
          value: "user.name",
        });

        this.headers[1] = {
          text: "Contact",
          align: "start",
          sortable: true,
          value: "contact.name",
        };
      } else {
        this.headers.unshift({
          text: "Name",
          align: "start",
          sortable: true,
          value: "contact.name",
        });
      }
    },
    async getConnections() {
      if (this.$store.state.user.currentUser.role === "incubator") {
        const documents = await connectionsRef
          .where(
            "incubatorId",
            "==",
            this.$store.state.incubator.currentIncubator.docId
          )
          .orderBy("createdAt", "desc")
          .get();

        documents.forEach((document) => {
          this.connections.push(document.data());
        });
      } else {
        const documents = await connectionsRef
          .where("user.docId", "==", this.currentUser.docId)
          .orderBy("createdAt", "desc")
          .get();

        documents.forEach((document) => {
          this.connections.push(document.data());
        });
      }
    },
    copyToClipboard(text) {
      copy(text);
      this.$toast.success(`Copied ${text} to clipboard`, {
        position: "top",
      });
    },
    goto(path) {
      this.$router.push(path);
    },
  },
};
</script>
<style scoped>
.connections__container {
  padding: 10px;
}

>>> th {
  color: #3aa95a !important;
  font-size: 18px !important;
  font-weight: normal;
}
</style>