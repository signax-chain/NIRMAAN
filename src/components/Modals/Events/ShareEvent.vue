<template>
  <v-row justify="center">
    <v-dialog v-model="shareEventModal.isShowing" persistent max-width="800">
      <v-card class="mt-5">
        <v-card-title class="headline"> Share event with</v-card-title>
        <v-card-text>
          <v-tabs v-model="tab" background-color="traktor" centered dark grow>
            <v-tabs-slider></v-tabs-slider>
            <v-tab> Startups </v-tab>
            <v-tab> Mentors </v-tab>
            <v-tab> Cohort </v-tab>
            <v-tab> Copy link </v-tab>
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-container fluid>
                    <v-row>
                      <v-col cols="12">
                        <v-combobox
                          v-model="startupSelects"
                          :items="startups"
                          label="Select startups"
                          multiple
                          outlined
                          item-text="name"
                          item-value="docId"
                          chips
                          dense
                          @change="checkForAllStartups"
                        ></v-combobox>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-container fluid>
                    <v-row>
                      <v-col cols="12">
                        <v-combobox
                          v-model="mentorSelects"
                          :items="mentors"
                          label="Select mentors"
                          multiple
                          outlined
                          item-text="name"
                          item-value="docId"
                          chips
                          dense
                          @change="checkForAllMentors"
                        ></v-combobox>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-container fluid>
                    <v-row>
                      <v-col cols="12">
                        <v-combobox
                          v-model="cohortSelects"
                          :items="cohorts"
                          label="Select cohort"
                          multiple
                          outlined
                          chips
                          dense
                        ></v-combobox>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-container fluid>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          outlined
                          dense
                          append-icon="mdi-clipboard"
                          @click:append="copyToClipboard()"
                          :value="`${eventLink}${shareEventModal.data.docId}`"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card-text>
        <v-card-actions class="mt-5">
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="shareEventModal.isShowing = false"
          >
            Cancel
          </v-btn>
          <v-btn color="traktor" class="white--text" @click="share()">
            Share <v-icon>mdi-share</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import { startupsRef, mentorsRef } from "../../../config/firebase_services";
import Swal from "sweetalert2";
import axios from "axios";
import copy from "copy-to-clipboard";

export default {
  name: "ShareEvent",
  computed: {
    ...mapState({ shareEventModal: (state) => state.modals.shareEventModal }),
  },
  data() {
    return {
      tab: null,
      startups: [],
      mentors: [],
      cohorts: [],
      startupSelects: [],
      mentorSelects: [],
      cohortSelects: [],
      selects: [],
      eventLink: null,
    };
  },
  props: ["event"],
  created() {
    this.getStartups();
    this.getMentors();
    this.getEventLink();
  },
  methods: {
    getEventLink() {
      this.eventLink = `https://traktor.thestartupreneur.co/event/register/`;
    },
    async getStartups() {
      const documents = await startupsRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .where("isDeleted", "==", false)
        .get();
      documents.forEach((document) => {
        this.startups.push(document.data());
      });
      this.startups.unshift("Select all");
      this.getCohorts();
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
        this.mentors.push(document.data());
      });
      this.mentors.unshift("Select all");
    },
    getCohorts() {
      this.cohorts = this.startups.map((startup) => startup.cohort);
      this.cohorts = this.cohorts.filter((cohort) => cohort !== undefined);
      this.cohorts = this.cohorts.map(
        (cohort) => cohort.name + " " + cohort.year
      );
    },
    checkForAllStartups(attr) {
      if (attr[0] === "Select all") {
        this.startupSelects = [...this.startups];
        const index = this.startupSelects.findIndex(
          (startup) => startup === "Select all"
        );
        this.startupSelects.splice(index, 1);
      }
    },
    checkForAllMentors(attr) {
      if (attr[0] === "Select all") {
        this.mentorSelects = [...this.mentors];
        const index = this.mentorSelects.findIndex(
          (mentor) => mentor === "Select all"
        );
        this.mentorSelects.splice(index, 1);
      }
    },
    share() {
      if (
        this.startupSelects.length === 0 &&
        this.mentorSelects.length === 0 &&
        this.cohortSelects.length === 0
      ) {
        this.$toast.error("Please select an entity to share the event!", {
          position: "top",
        });
        return;
      }
      if (this.startupSelects.length !== 0) {
        this.selects = [...this.selects, ...this.startupSelects];
      }
      if (this.mentorSelects.length !== 0) {
        this.selects = [...this.selects, ...this.mentorSelects];
      }
      if (this.cohortSelects.length !== 0) {
        this.filterCohortSelects();
      }

      Swal.fire({
        title: "Share event with email update?",
        showCancelButton: true,
        confirmButtonColor: "#3AA95A",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          let counter = 0;
          this.selects.forEach((select) => {
            this.sendMail(select);

            counter++;

            if (counter === this.selects.length) {
              this.$toast.success("Shared", {
                position: "top",
              });
              this.shareEventModal.isShowing = false;
              this.selects = [];
              this.startupSelects = [];
              this.mentorSelects = [];
              this.cohortSelects = [];
            }
          });
        }
      });
    },
    filterCohortSelects() {
      this.cohortSelects.forEach((cs) => {
        const arr = cs.split(" ");
        const obj = this.startups.find(
          (startup) =>
            startup.cohort.name == arr[0] && startup.cohort.year == arr[1]
        );
        this.selects.push(obj);
      });
    },

    copyToClipboard() {
      const link = `https://traktor.thestartupreneur.co/event/register/${this.shareEventModal.data.docId}`;
      copy(link);
      this.$toast.success("Copied to clipboard", {
        position: "top",
      });
    },

    async sendMail(select) {
      try {
        let link = `https://traktor.thestartupreneur.co/event/register/${this.shareEventModal.data.docId}`;
        const speakers = this.shareEventModal.data.speakers.map(
          (speaker) => speaker.name
        );

        await axios.post("https://traktor-api.herokuapp.com/sendMail", {
          from: {
            name: this.$store.state.incubator.currentIncubator.name,
            email: this.$store.state.incubator.currentIncubator.email,
          },
          to: {
            name: select.name,
            email: select.email,
          },
          subject: "New Event Invitation",
          content: `<body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;"><table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;line-height: 50px;font-size: 1px;margin-left: 7%;">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"><h2 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #e31212;font-size: 26px;line-height: 34px;font-family: Avenir,sans-serif;text-align: center;"></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;margin-left: 7%;"><h3 class="size-16" style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 24px;font-family: arial,sans-serif;" lang="x-size-16"><span class="font-arial">Dear ${
            select.name
          },</span></h3><p style="Margin-top: 12px;Margin-bottom: 0;"><span style="color:#000000;font-size: 16px;">Hope you are doing well. This is to inform you that, there will be ${
            this.shareEventModal.data.type
          } on ${
            this.shareEventModal.data.title
          } by ${speakers.toString()} on ${this.shareEventModal.data.date} at ${
            this.shareEventModal.data.time
          }.</span></p></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;margin-left:8%;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"></div></div><h6 style="Margin-top: 12px;Margin-bottom: 0;font-style: normal;font-weight: normal;color: black;font-size: 16px;line-height: 26px;font-family: Avenir,sans-serif;">Please find the below link for event registration and for more details..<br/><br/> Please feel free to reach out to us in case of any queries. We thank you for your constant support.</h6></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;margin-left:8%;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"> <a href="${link}">Register here</a></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div role="contentinfo"><div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"><div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #adb3b9;font-family: sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"><div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"><div style="font-size: 14px;line-height: 19px;margin-left: 7%;"><div>Regards,</div></div><div style="font-size: 14px;line-height: 19px;Margin-top: 18px;margin-left: 7%;"><div>${
            this.$store.state.incubator.currentIncubator.name
          }</div></div></div></div></div></div></div></div></td></tr></tbody></table></body>`,
        });
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
  },
};
</script>

<style scoped>
.v-tab {
  color: #fff;
  font-weight: bold;
  font-size: 16px !important;
  text-transform: capitalize !important;
}
</style>