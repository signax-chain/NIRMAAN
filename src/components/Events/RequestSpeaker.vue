<template>
  <div>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">Events</h3>
    <v-form ref="form" @submit.prevent="request()" class="wrapper mx-5">
      <h3 class="heading ml-0">Request Speaker</h3>
      <v-row>
        <v-col cols="12">
          <v-autocomplete
            label="Select speaker"
            outlined
            :items="speakers"
            item-text="name"
            item-value="docId"
            v-model="data.speaker"
            :rules="rules.speaker"
          >
          </v-autocomplete>
          <v-textarea
            label="Anything to share?"
            outlined
            v-model="data.description"
          >
          </v-textarea>
          <v-btn color="traktor" class="white--text float-right" type="submit"
            >Request speaker</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import {
  startupsRef,
  mentorsRef,
  speakerAvailabilityRef,
  activityRef,
} from "../../config/firebase_services";
import axios from "axios";

export default {
  name: "RequestSpeaker",
  data() {
    return {
      speakers: [],
      data: {
        speaker: null,
        description: null,
        incubatorId: null,
        incubatorData: null,
        availableDate: "Not updated",
        availableTime: "Not updated",
        additionalInfo: "-",
        createdAt: null,
      },
      rules: {
        speaker: [(v) => !!v || "Please select a speaker"],
      },
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Events",
          disabled: true,
        },
        {
          text: "Request Speaker",
          disabled: true,
        },
      ],
    };
  },
  created() {
    this.getStartups();
    this.getMentors();
  },
  methods: {
    async getStartups() {
      const documents = await startupsRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .where("status", "!=", "droppedout")
        .where("isDeleted", "==", false)
        .get();

      documents.forEach((document) => {
        this.speakers.push(document.data());
      });
    },
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
        this.speakers.push(document.data());
      });
    },
    async request() {
      if (this.$refs.form.validate()) {
        const obj = this.speakers.find(
          (speaker) => speaker.docId === this.data.speaker
        );

        this.data.speaker = obj;
        this.data.incubatorId = this.$store.state.user.currentUser.docId;
        this.data.incubatorData = this.$store.state.user.currentUser;
        this.data.createdAt = new Date();

        try {
          const dataRef = await speakerAvailabilityRef.add(this.data);

          const link = `https://traktor.thestartupreneur.co/event/update-availability/${dataRef.id}`;

          await axios.post("https://traktor-api.herokuapp.com/sendMail", {
            from: {
              name: this.data.incubatorData.name,
              email: this.data.incubatorData.email,
            },
            to: {
              name: this.data.speaker.name,
              email: this.data.speaker.email,
            },
            subject: "Requesting Speaker Availability",
            content: `<body class="no-padding" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%;"><table class="wrapper" style="border-collapse: collapse; table-layout: fixed; min-width: 320px; width: 100%; background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><div><div class="layout one-col fixed-width" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #ffffff;"><div class="column" style="text-align: left; color: #8e959c; font-size: 14px; line-height: 21px; font-family: sans-serif; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px);"><div style="margin-left: 20px; margin-right: 20px;"><div style="mso-line-height-rule: exactly; line-height: 50px; font-size: 1px; margin-left: 7%;"> &nbsp;</div></div><div style="margin-left: 20px; margin-right: 20px;"><div style="mso-line-height-rule: exactly; mso-text-raise: 4px;"></div></div></div></div></div><div style="line-height: 20px; font-size: 20px;">&nbsp;</div><div class="layout one-col fixed-width" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #fff;"><div class="column" style="text-align: left; color: #8e959c; font-size: 14px; line-height: 21px; font-family: sans-serif; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px);"><div style=""><div style="mso-line-height-rule: exactly; mso-text-raise: 4px; margin-left: 7%;"><h3 class="size-16" style="margin-top: 0; margin-bottom: 0; font-style: normal; font-weight: normal; color: #000000; font-size: 16px; line-height: 24px; font-family: arial, sans-serif;" lang="x-size-16" > <span class="font-arial">Dear ${this.data.speaker.name},</span></h3><p style="margin-top: 12px; margin-bottom: 0;"><span style="color: #000000; font-size: 16px;">Hope you are doing well. This is to request your availability for an event. </span></p></div></div></div></div></div><div class="layout one-col fixed-width" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #fff;"><div class="column" style="text-align: left; margin-left: 8%; color: #8e959c; font-size: 14px; line-height: 21px; font-family: sans-serif; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px);" ><h6 style="margin-bottom: 0; font-style: normal; font-weight: normal; color: black; font-size: 16px; line-height: 26px; font-family: Avenir, sans-serif;"> Please confirm your availability by clicking <a class="btn btn-succes" href="${link}"> this </a> link or kindly suggest an alternative day and time that works for you.<br /> <br /> Feel free to reach out to us in case of any queries. We thank you for your constant support.</h6></div></div></div><div style="line-height: 20px; font-size: 20px;">&nbsp;</div><div class="layout one-col fixed-width" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #ffffff;"><div class="column" style="text-align: left; color: #8e959c; font-size: 14px; margin-left: 8%; line-height: 21px; font-family: sans-serif; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px);" ></div></div><div style="line-height: 20px; font-size: 20px;">&nbsp;</div><div role="contentinfo"><div class="layout email-footer" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%;"><div class="column wide" style="text-align: left; font-size: 12px; line-height: 19px; color: #adb3b9; font-family: sans-serif; float: left; max-width: 400px; min-width: 320px; width: 320px; width: calc(8000% - 47600px);" ><div style="margin-left: 20px; margin-right: 20px; margin-top: 10px; margin-bottom: 10px;"><div style="font-size: 14px; line-height: 19px; margin-left: 7%;"><div>Regards,</div></div><div style="font-size: 14px; line-height: 19px; margin-top: 18px; margin-left: 7%;"><div>${this.data.incubatorData.name}</div></div></div></div></div></div></div></div></div></td></tr></tbody></table></body>`,
          });

          const activity = {
            incubatorId: this.data.incubatorId,
            photoURL: this.data.incubatorData.photoURL,
            statement: `Speaker availability request sent to ${this.data.speaker.name}`,
            createdAt: new Date(),
            type: "incubator",
            notification: false,
          };

          await activityRef.add(activity);

          this.$toast.success("Requested", {
            position: "top",
          });
        } catch (error) {
          this.$toast.error(error, {
            position: "top",
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
