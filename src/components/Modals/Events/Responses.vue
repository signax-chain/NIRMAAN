<template>
  <v-row justify="center">
    <v-dialog v-model="responseEventModal.isShowing" max-width="1000">
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="responseEventModal.data"
            :search="search"
          ></v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <download-excel :data="responseEventModal.data">
            <v-btn color="traktor" text>Export data</v-btn>
          </download-excel>
          <v-btn color="red" text @click="responseEventModal.isShowing = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Responses",
  computed: {
    ...mapState({
      responseEventModal: (state) => state.modals.responseEventModal,
    }),
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: true,
          value: "name",
        },
        { text: "Email", value: "email", align: "start", sortable: true },
        {
          text: "Contact",
          value: "phoneNumber",
          sortable: true,
          align: "start",
        },
        {
          text: "Designation",
          value: "designation",
          sortable: true,
          align: "start",
        },
        {
          text: "Organisation",
          value: "organization",
          sortable: true,
          align: "start",
        },
        { text: "Linked In", value: "linkedIn", sortable: true },
        {
          text: "Timestamp",
          value: "createdAt",
          sortable: true,
          align: "start",
        },
      ],
    };
  },
};
</script>

<style scoped>
>>> th {
  color: #3aa95a !important;
  font-size: 16px !important;
  font-weight: bold !important;
}

>>> td {
  font-size: 12px !important;
}

.v-btn {
  text-transform: capitalize;
}
</style>