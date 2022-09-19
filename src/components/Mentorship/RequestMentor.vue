<template>
  <div>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">Mentorship</h3>
    <v-form ref="form" class="wrapper mx-5">
      <h3 class="heading ml-0">Request Mentor</h3>
      <v-row>
        <v-col cols="12">
          <v-autocomplete
            label="Select mentor"
            outlined
            :items="items"
            v-model="data.mentor"
            :rules="rules.mentor"
          >
          </v-autocomplete>
          <v-textarea
            label="Anything to share?"
            outlined
            v-model="data.description"
          >
          </v-textarea>
          <v-btn
            color="traktor"
            class="white--text float-right"
            @click="request()"
            >Request mentor</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import firebase from "firebase";
import axios from "axios";
import { mentorsRef } from "../../config/firebase_services";

export default {
  name: "RequestMentor",
  data() {
    return {
      mentors: [],
      items: [],
      rules: {
        mentor: [(v) => !!v || "Please select a mentor."],
      },
      data: {
        mentor: null,
        description: null,
        incubatorId: null,
        incubatorData: null,
        availableDate: "Not updated",
        availableTime: "Not updated",
        additionalInfo: "-",
        createdAt: null,
      },
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
          text: "Request Mentor",
          disabled: true,
        },
      ],
    };
  },
  async created() {
    this.getMentors();
  },
  methods: {
    async getMentors() {
      const documents = await mentorsRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .where("isDeleted", "==", false)
        .get();
      documents.forEach((document) => {
        this.mentors.push(document.data());
        this.items.push(document.data()["name"]);
      });
    },
    async request() {
      if (this.$refs.form.validate()) {
        const obj = this.mentors.find(
          (mentor) => mentor.name === this.data.mentor
        );
        this.data.mentor = obj;
        this.data.incubatorId = this.$store.state.user.currentUser.docId;
        this.data.incubatorData = this.$store.state.user.currentUser;
        this.data.createdAt = new Date();

        try {
          const dataRef = await firebase
            .firestore()
            .collection("mentorAvailability")
            .add(this.data);

          const link = `https://traktor.thestartupreneur.co/mentorship/update-availability/${dataRef.id}`;

          await axios.post("https://traktor-api.herokuapp.com/sendMail", {
            from: {
              name: this.data.incubatorData.name,
              email: this.data.incubatorData.email,
            },
            to: {
              name: this.data.mentor.name,
              email: this.data.mentor.email,
            },
            subject: "Requesting Mentor Availability",
            content: `<body class="no-padding" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%;"><table class="wrapper" style="border-collapse: collapse; table-layout: fixed; min-width: 320px; width: 100%; background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><div><div class="layout one-col fixed-width" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #ffffff;"><div class="column" style="text-align: left; color: #8e959c; font-size: 14px; line-height: 21px; font-family: sans-serif; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px);"><div style="margin-left: 20px; margin-right: 20px;"><div style="mso-line-height-rule: exactly; line-height: 50px; font-size: 1px; margin-left: 7%;"> &nbsp;</div></div><div style="margin-left: 20px; margin-right: 20px;"><div style="mso-line-height-rule: exactly; mso-text-raise: 4px;"></div></div></div></div></div><div style="line-height: 20px; font-size: 20px;">&nbsp;</div><div class="layout one-col fixed-width" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #fff;"><div class="column" style="text-align: left; color: #8e959c; font-size: 14px; line-height: 21px; font-family: sans-serif; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px);"><div style=""><div style="mso-line-height-rule: exactly; mso-text-raise: 4px; margin-left: 7%;"><h3 class="size-16" style="margin-top: 0; margin-bottom: 0; font-style: normal; font-weight: normal; color: #000000; font-size: 16px; line-height: 24px; font-family: arial, sans-serif;" lang="x-size-16" > <span class="font-arial">Dear ${this.data.mentor.name},</span></h3><p style="margin-top: 12px; margin-bottom: 0;"><span style="color: #000000; font-size: 16px;">Hope you are doing well. This is to request your availability for a mentoring session. </span></p></div></div></div></div></div><div class="layout one-col fixed-width" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #fff;"><div class="column" style="text-align: left; margin-left: 8%; color: #8e959c; font-size: 14px; line-height: 21px; font-family: sans-serif; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px);" ><h6 style="margin-bottom: 0; font-style: normal; font-weight: normal; color: black; font-size: 16px; line-height: 26px; font-family: Avenir, sans-serif;"> Please confirm your availability by clicking <a class="btn btn-succes" href="${link}"> this </a> link or kindly suggest an alternative day and time that works for you.<br /> <br /> Feel free to reach out to us in case of any queries. We thank you for your constant support.</h6></div></div></div><div style="line-height: 20px; font-size: 20px;">&nbsp;</div><div class="layout one-col fixed-width" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #ffffff;"><div class="column" style="text-align: left; color: #8e959c; font-size: 14px; margin-left: 8%; line-height: 21px; font-family: sans-serif; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px);" ></div></div><div style="line-height: 20px; font-size: 20px;">&nbsp;</div><div role="contentinfo"><div class="layout email-footer" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%;"><div class="column wide" style="text-align: left; font-size: 12px; line-height: 19px; color: #adb3b9; font-family: sans-serif; float: left; max-width: 400px; min-width: 320px; width: 320px; width: calc(8000% - 47600px);" ><div style="margin-left: 20px; margin-right: 20px; margin-top: 10px; margin-bottom: 10px;"><div style="font-size: 14px; line-height: 19px; margin-left: 7%;"><div>Regards,</div></div><div style="font-size: 14px; line-height: 19px; margin-top: 18px; margin-left: 7%;"><div>${this.data.incubatorData.name}</div></div></div></div></div></div></div></div></div></td></tr></tbody></table></body>`,
          });

          const activity = {
            incubator: this.data.incubatorData,
            statement: `Mentor availability request sent to ${this.data.mentor.name}`,
            createdAt: new Date(),
            type: "mentor",
            notification: false,
          };

          await firebase.firestore().collection("activities").add(activity);

          this.$store.dispatch("SHOW_SNACKBAR", {
            showing: true,
            text: "Requested",
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
  },
};
</script>

<style scoped>
.wrapper {
  background-color: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  padding: 1rem 1rem 3rem 1rem;
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}
</style>