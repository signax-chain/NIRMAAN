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
import { speakerAvailabilityRef } from "../../config/firebase_services";

export default {
  name: "SpeakerAvailability",
  data() {
    return {
      headers: [
        {
          text: "Speaker",
          value: "speaker.name",
          sortable: true,
          align: "center",
        },
        {
          text: "Email",
          value: "speaker.email",
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
        // {
        //   text: "Actions",
        //   value: "actions",
        //   sortable: true,
        //   align: "center",
        // },
      ],
      items: [],
    };
  },
  created() {
    this.getAvailabilities();
  },
  methods: {
    async getAvailabilities() {
      speakerAvailabilityRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
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
          });
        });
    },
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