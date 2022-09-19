<template>
  <div class="wrapper pa-5">
    <h2>Mentoring Sessions</h2>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="10"
      class="elevation-0 mt-5"
      mobile-breakpoint="0"
      :search="search"
    >
      <template v-slot:[`item.feedback`]="{ item }">
        <v-btn
          color="traktor"
          class="white--text"
          @click="viewFeedback(item.docId)"
          >View feedback</v-btn
        >
      </template>
      <template v-slot:[`item.mentorHours`]="{ item }">
        {{ getMentorHours(item) }}
      </template>
    </v-data-table>
    <feedback
      v-if="feedbacks"
      :visible="feedbackDialog"
      :feedbacks="feedbacks"
      @close="feedbackDialog = false"
    >
    </feedback>
  </div>
</template>

<script>
import { mentorshipRef } from "@/config/firebase_services";
import Feedback from "../../Modals/Mentorship/Feedback.vue";

export default {
  components: { Feedback },
  data() {
    return {
      items: [],
      headers: [
        {
          text: "Startup",
          value: "startupname",
          sortable: true,
          align: "center",
        },
        {
          text: "Date",
          value: "date",
          sortable: true,
          align: "center",
        },
        {
          text: "Time",
          value: "time",
          sortable: true,
          align: "center",
        },
        {
          text: "Mentor hours",
          value: "mentorHours",
          sortable: true,
          align: "center",
        },
        {
          text: "Feedback",
          value: "feedback",
          sortable: true,
          align: "center",
        },
      ],
      feedbacks: null,
      feedbackDialog: false,
      search: "",
    };
  },
  created() {
    this.getSessions();
  },
  methods: {
    async getSessions() {
      const documents = await mentorshipRef
        .where("mentor.id", "==", this.$route.params.id)
        .get();

      documents.forEach((document) => {
        const data = document.data();
        data.docId = document.id;
        if (data.date !== null) {
          const temp = data.date.split("-");
          data.date = temp[2] + "/" + temp[1] + "/" + temp[0];
        }
        data.mentorname = data.mentor.name;
        data.startupname = data.startup.name;
        this.items.push(data);
      });
    },
    getMentorHours(item) {
      if (!item.mentorHours) return "-";
      let hours = Math.floor(item.mentorHours / 60);
      let minutes = item.mentorHours % 60;
      return hours + ":" + (minutes < 10 ? "0" : "") + minutes;
    },
    viewFeedback(docId) {
      const obj = this.items.find((item) => item.docId === docId);
      this.feedbacks = obj;
      this.feedbackDialog = true;
    },
  },
};
</script>

<style scoped>
>>> th {
    color: #3aa959 !important;
    font-size: 16px !important;
}
</style>