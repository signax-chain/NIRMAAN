<template>
  <v-container>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">Mentorship</h3>
    <div class="wrapper mx-5">
      <h3 class="heading ml-0">Mentoring Sessions</h3>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="5"
        mobile-breakpoint="0"
      ></v-data-table>
    </div>
  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
  name: "MentorAvailability",
  data() {
    return {
      headers: [
        {
          text: "Mentor",
          value: "mentor.name",
          sortable: true,
          align: "center",
        },
        {
          text: "Email",
          value: "mentor.email",
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
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Mentorship",
          disabled: true,
        },
        {
          text: "Mentor Availability",
          disabled: true,
        },
      ],
    };
  },
  async created() {
    await firebase
      .firestore()
      .collection("mentorAvailability")
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

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

.wrapper {
  background-color: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  padding: 1rem;
}
</style>