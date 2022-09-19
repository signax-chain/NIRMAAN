<template>
  <v-container>
    <v-card class="pa-5">
      <h1 class="text-center">Mentoring Session Feedback Form</h1>
      <v-row class="mt-5">
        <v-col cols="12" md="12">
          <v-text-field
            outlined
            :label="`Name of the ${type}`"
            disabled
            v-model="typeName"
          ></v-text-field>
          <v-text-field label="Session date" outlined v-model="date" disabled>
          </v-text-field>
          <v-text-field label="Session time" outlined v-model="time" disabled>
          </v-text-field>
          <v-text-field
            label="Did the mentoring session take place as scheduled (Yes/No) If No, please specify."
            outlined
            v-model="data.question1"
          >
          </v-text-field>
          <v-text-field
            :label="`Did the ${lable} arrive on time for the Mentoring Session?`"
            outlined
            v-model="data.question2"
          >
          </v-text-field>
          <v-text-field
            :label="
              type === 'Mentor'
                ? 'Key highlights from your Mentoring Session?'
                : 'What were your takeaways from the Mentoring Session?'
            "
            outlined
            v-model="data.question3"
          >
          </v-text-field>
          <v-text-field
            :label="`Any feedback for the ${lable}`"
            outlined
            v-model="data.question4"
          >
          </v-text-field>
          <v-text-field
            :label="
              type === 'Mentor'
                ? 'Any follow up actions for the startup'
                : 'Any follow up request to the mentor'
            "
            outlined
            v-model="data.question5"
          >
          </v-text-field>

          <label>Overall rating</label>
          <v-rating
            v-model="data.rating"
            color="yellow darken-3"
            background-color="grey darken-1"
            empty-icon="$ratingFull"
            half-increments
            hover
            large
          >
          </v-rating>
          <v-btn color="traktor" class="white--text mt-5" @click="submit()"
            >Submit</v-btn
          >
          <!-- <v-btn color="traktor" class="white--text ml-5 mt-5" @click="notes()"
            >Take notes</v-btn
          > -->
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { activityRef, mentorshipRef } from "../../../config/firebase_services";

export default {
  name: "Feedback",
  data() {
    return {
      typeName: null,
      date: null,
      time: null,
      snapData: null,
      data: {
        question1: null,
        question2: null,
        question3: null,
        question4: null,
        question5: null,
        rating: null,
      },
    };
  },
  computed: {
    type: function () {
      return this.$route.params.type === "m" ? "Mentor" : "Startup";
    },
    lable: function () {
      return this.$route.params.type === "m" ? "Startup" : "Mentor";
    },
  },
  async created() {
    await mentorshipRef.doc(this.$route.params.id).onSnapshot((document) => {
      if (this.$route.params.type === "m")
        this.typeName = document.data()["mentor"]["name"];
      else this.typeName = document.data()["startup"]["name"];

      this.date = document.data()["date"];
      this.time = document.data()["time"];

      this.snapData = document.data();
    });
  },
  methods: {
    async submit() {
      const type = this.$route.params.type;

      if (type === "m") {
        this.snapData.feedbacks.mentor = this.data;
        try {
          await mentorshipRef
            .doc(this.$route.params.id)
            .set(this.snapData, { merge: true });

          const activity = {
            incubatorId: this.snapData.incubator.docId,
            statement: `Mentor ${this.snapData.mentor.name} gave their feedback on recent mentoring session.`,
            createdAt: new Date(),
            type: "mentor",
            photoURL: this.snapData.mentor.photoURL,
            notification: true,
            read: false,
          };

          await activityRef.add(activity);

          this.$store.dispatch("SHOW_SNACKBAR", {
            showing: true,
            text: "Submitted",
            color: "success",
          });
        } catch (error) {
          this.$store.dispatch("SHOW_SNACKBAR", {
            showing: true,
            text: error,
            color: "error",
          });
        }
      } else {
        this.snapData.feedbacks.startup = this.data;
        try {
          await mentorshipRef
            .doc(this.$route.params.id)
            .set(this.snapData, { merge: true });

          const activity = {
            incubatorId: this.snapData.incubator.docId,
            statement: `Startup ${this.snapData.startup.name} gave their feedback on recent mentoring session.`,
            createdAt: new Date(),
            photoURL: this.snapData.startup.photoURL,
            type: "startup",
            notification: true,
            read: false,
          };

          await activityRef.add(activity);

          this.$store.dispatch("SHOW_SNACKBAR", {
            showing: true,
            text: "Submitted",
            color: "success",
          });
        } catch (error) {
          this.$store.dispatch("SHOW_SNACKBAR", {
            showing: true,
            text: error,
            color: "error",
          });
        }
      }
    },
    notes() {
      this.$router.push(
        `/notes/${this.$route.params.type}/${this.$route.params.id}`
      );
    },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: capitalize;
}
</style>