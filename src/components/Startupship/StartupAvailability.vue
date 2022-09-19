<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
      class="elevation-1"
      mobile-breakpoint="0"
    ></v-data-table>
  </v-container>
</template>

<script>
import { startupAvailabilityRef } from "../../config/firebase_services";

export default {
  name: "MentorAvailability",
  data() {
    return {
      headers: [
        {
          text: "Mentor",
          value: "startup.name",
          sortable: true,
          align: "center",
        },
        {
          text: "Email",
          value: "startup.email",
          sortable: true,
          align: "center",
        },
        {
          text: "Date",
          value: "availableDate",
          sortable: true,
          align: "center",
        },
        {
          text: "Time",
          value: "availableTime",
          sortable: true,
          align: "center",
        },
        {
          text: "Info",
          value: "additionalInfo",
          sortable: true,
          align: "center",
        },
      ],
      items: [],
    };
  },
  async created() {
    startupAvailabilityRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        this.items = [];
        snapshot.forEach((document) => {
          if (document.exists) {
            const data = document.data();
            const datetime = new Date(
              data.availableDate + " " + data.availableTime
            );

            if (datetime != "Invalid Date") {
              data.availableDate = datetime.toLocaleDateString("en-in");
              data.availableTime = datetime.toLocaleTimeString("en-in");
            }

            this.items.push(data);
          }
          this.items.sort((a, b) => {
            return a.availableDate.localeCompare(b.availableDate);
          });
        });
      });
  },
};
</script>

<style scoped>
>>> th {
  color: #3aa95a !important;
  font-size: 14px !important;
}

>>> td {
  font-weight: bold !important;
}
</style>