<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-autocomplete
          label="Select startup"
          outlined
          :items="startups"
          v-model="selectedStartups"
          item-text="name"
          item-value="docId"
          append-icon="mdi-magnify"
          multiple
        >
          <v-list-tile slot="prepend-item" ripple @click="toggle">
            <v-list-tile-action>
              <v-btn icon>
                <v-icon :color="startups.length > 0 ? 'indigo darken-4' : ''">{{
                  icon
                }}</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-title>Select All</v-list-tile-title>
          </v-list-tile>
          <v-divider slot="prepend-item" class="mt-2" />
        </v-autocomplete>
        <v-text-field label="Subject" outlined v-model="subject"></v-text-field>
        <vue-editor v-model="content"></vue-editor>
        <!-- <v-textarea label="Email contents" outlined v-model="description">
        </v-textarea> -->
        <v-btn
          color="traktor"
          class="white--text mt-5 ml-auto d-block"
          @click="request()"
          >Request</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import {
  activityRef,
  startupsRef,
  startupAvailabilityRef,
} from "../../config/firebase_services";
import { VueEditor } from "vue2-editor";

export default {
  name: "RequestStartup",
  components: {
    VueEditor,
  },
  computed: {
    allStartups() {
      return this.selectedStartups.length === this.startups.length;
    },
    someStartups() {
      return this.selectedStartups.length > 0 && !this.allStartups;
    },
    icon() {
      if (this.allStartups) return "mdi-close-box";
      if (this.someStartups) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
  },
  data() {
    return {
      startups: [],
      selectedStartups: [],
      subject: "Requesting Participant Availability",
      description: null,
      content: "<h3>Email content</h3>",
    };
  },
  async created() {
    this.getStartups();
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
        this.startups.push(document.data());
      });
      const startupId = this.$route.params.id;
      if (startupId !== undefined) this.selectedStartups.push(startupId);
    },
    toggle() {
      this.$nextTick(() => {
        if (this.allStartups) {
          this.selectedStartups = [];
        } else {
          this.selectedStartups = this.startups.slice();
        }
      });
    },
    async sendMail(data) {
      try {
        const dataRef = await startupAvailabilityRef.add(data);

        const link = `https://traktor.thestartupreneur.co/startupship/update-availability/${dataRef.id}`;

        await axios.post("https://traktor-api.herokuapp.com/sendMail", {
          from: {
            name: data.incubatorData.name,
            email: data.incubatorData.email,
          },
          to: {
            name: data.startup.name,
            email: data.startup.email,
          },
          subject: this.subject,
          content: `<body class="no-padding" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%;"><table class="wrapper" style="border-collapse: collapse; table-layout: fixed; min-width: 320px; width: 100%; background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><div><div class="layout one-col fixed-width" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #ffffff;"><div class="column" style="text-align: left; color: #8e959c; font-size: 14px; line-height: 21px; font-family: sans-serif; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px);"><div style="margin-left: 20px; margin-right: 20px;"><div style="mso-line-height-rule: exactly; line-height: 50px; font-size: 1px; margin-left: 7%;"> &nbsp;</div></div><div style="margin-left: 20px; margin-right: 20px;"><div style="mso-line-height-rule: exactly; mso-text-raise: 4px;"></div></div></div></div></div><div style="line-height: 20px; font-size: 20px;">&nbsp;</div><div class="layout one-col fixed-width" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #fff;"><div class="column" style="text-align: left; color: #8e959c; font-size: 14px; line-height: 21px; font-family: sans-serif; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px);"><div style=""><div style="mso-line-height-rule: exactly; mso-text-raise: 4px; margin-left: 7%;"><h3 class="size-16" style="margin-top: 0; margin-bottom: 0; font-style: normal; font-weight: normal; color: #000000; font-size: 16px; line-height: 24px; font-family: arial, sans-serif;" lang="x-size-16" > <span class="font-arial">Dear ${data.startup.founders[0].name},</span></h3><p style="margin-top: 12px; margin-bottom: 0;"><span style="color: #000000; font-size: 16px;">${this.content}</span></p></div></div></div></div></div><div class="layout one-col fixed-width" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #fff;"><div class="column" style="text-align: left; margin-left: 7%; color: #8e959c; font-size: 14px; line-height: 21px; font-family: sans-serif; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px);" ><span style="margin-bottom: 0; font-style: normal; font-weight: normal; color: #222222; font-size: 14px; line-height: 26px; font-family: Avenir, sans-serif;"> Please confirm your availability by clicking <a class="btn btn-succes" href="${link}"> this </a> link or kindly suggest an alternative day and time that works for you.<br /> <br /> Feel free to reach out to us in case of any queries. We thank you for your constant support.</span></div></div></div><div style="line-height: 20px; font-size: 20px;">&nbsp;</div><div class="layout one-col fixed-width" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #ffffff;"><div class="column" style="text-align: left; color: #8e959c; font-size: 14px; margin-left: 8%; line-height: 21px; font-family: sans-serif; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px);" ></div></div><div style="line-height: 20px; font-size: 20px;">&nbsp;</div><div role="contentinfo"><div class="layout email-footer" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%;"><div class="column wide" style="text-align: left; font-size: 12px; line-height: 19px; color: #adb3b9; font-family: sans-serif; float: left; max-width: 400px; min-width: 320px; width: 320px; width: calc(8000% - 47600px);" ><div style="margin-left: 20px; margin-right: 20px; margin-top: 10px; margin-bottom: 10px;"><div style="font-size: 14px; line-height: 19px; margin-left: 7%;"><div>Regards,</div></div><div style="font-size: 14px; line-height: 19px; margin-top: 18px; margin-left: 7%;"><div>${data.incubatorData.name}</div></div></div></div></div></div></div></div></div></td></tr></tbody></table></body>`,
        });

        const activity = {
          incubatorId: data.incubatorData.docId,
          statement: `Startup availability request sent to ${data.startup.name}`,
          createdAt: new Date(),
          type: "startup",
          notification: false,
          photoURL: data.startup.photoURL,
        };

        await activityRef.add(activity);
      } catch (error) {
        this.$store.dispatch("SHOW_SNACKBAR", {
          showing: true,
          text: error,
          color: "error",
        });
      }
    },
    request() {
      if (this.selectedStartups.length === 0) {
        this.$toast.error("Select atleast one startup!", {
          position: "top",
        });
        return;
      }

      this.$store.dispatch("SHOW_LOADER", { isShowing: true });

      let counter = 0;
      this.selectedStartups.forEach(async (startup) => {
        const obj = this.startups.find((strp) => strp.docId === startup);
        const data = {
          startup: null,
          description: null,
          incubatorId: null,
          incubatorData: null,
          availableDate: "Not updated",
          availableTime: "Not updated",
          additionalInfo: "-",
          createdAt: null,
        };
        data.startup = obj;
        data.incubatorId = this.$store.state.user.currentUser.docId;
        data.incubatorData = this.$store.state.user.currentUser;
        data.createdAt = new Date();
        await this.sendMail(data);
        counter++;

        if (counter === this.selectedStartups.length) {
          this.$store.dispatch("SHOW_LOADER", { isShowing: false });

          this.$store.dispatch("SHOW_SNACKBAR", {
            showing: true,
            text: "Requested",
            color: "success",
          });
          this.content = null;
          this.subject = "Requesting Participant Availability";
          this.selectedStartups = [];
        }
      });
    },
  },
};
</script>

<style scoped>
.v-btn {
  font-weight: bold;
  text-transform: capitalize;
}
</style>