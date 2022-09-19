<template>
  <v-container>
    <v-dialog v-model="dialog" persistent max-width="700">
      <v-card>
        <v-card-title class="headline">Re-schedule session</v-card-title>
        <v-card-text class="mt-5">
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Select startup"
                outlined
                v-model="data.startup.name"
                disabled
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Select mentor"
                outlined
                v-model="data.mentor.name"
                disabled
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-dialog
                ref="dialog1"
                v-model="modal"
                :return-value.sync="data.date"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="data.date"
                    label="Select date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                  ></v-text-field>
                </template>
                <v-date-picker v-model="data.date" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog1.save(data.date)"
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-dialog>
            </v-col>
            <v-col cols="6">
              <v-dialog
                ref="dialog2"
                v-model="modal2"
                :return-value.sync="data.time"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="data.time"
                    label="Select time"
                    prepend-icon="mdi-clock"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                  ></v-text-field>
                </template>
                <v-time-picker v-if="modal2" v-model="data.time" full-width>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal2 = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog2.save(data.time)"
                    >OK</v-btn
                  >
                </v-time-picker>
              </v-dialog>
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Video conferencing link and other details"
                outlined
                v-model="data.description"
              >
              </v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="traktor" class="white--text" @click="update()"
            >Re-Schedule</v-btn
          >
          <v-btn color="red darken-1" text @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { activityRef, mentorshipRef } from "../../../config/firebase_services";

export default {
  name: "RescheduleModal",
  props: {
    dialog: {
      default: false,
    },
    data: {
      type: Object,
    },
  },
  data() {
    return {
      modal: false,
      modal2: false,
    };
  },
  created() {
    const temp = this.data.date.split("/");
    this.data.date = temp[2] + "-" + temp[1] + "-" + temp[0];
  },
  methods: {
    update() {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.$store.dispatch("SHOW_LOADER", { isShowing: true });

          try {
            this.data.status = "Re-Scheduled";
            this.data.datetime = new Date(
              this.data.date + " " + this.data.time
            );

            await mentorshipRef
              .doc(this.data.docId)
              .set(this.data, { merge: true });

            await axios.post("https://traktor-api.herokuapp.com/sendMail", {
              from: {
                name: this.data.incubator.name,
                email: this.data.incubator.email,
              },
              to: {
                name: this.data.startup.name,
                email: this.data.startup.email,
              },
              subject: "Mentoring Session Rescheduling Found",
              content: `<body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;"><table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;line-height: 50px;font-size: 1px;margin-left: 7%;">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"><h2 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #e31212;font-size: 26px;line-height: 34px;font-family: Avenir,sans-serif;text-align: center;"><span style="color:#000000">Mentoring Session Re-Scheduled</span></h2></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;margin-left: 7%;"><h3 class="size-16" style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 24px;font-family: arial,sans-serif;" lang="x-size-16"><span class="font-arial">Hello ${this.data.startup.name},</span></h3><p style="Margin-top: 12px;Margin-bottom: 0;"><span style="color:#000000;font-size: 16px;">This is to inform you that the mentoring session has been re-scheduled </span></p><p style="Margin-top: 20px;Margin-bottom: 0;"><span style="color:#000000;font-size: 16px;">Below are the updated details about mentoring session.&nbsp;</span></p></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;margin-left:8%;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"><h3 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 26px;font-family: Avenir,sans-serif;">Mentor : ${this.data.mentor.name}</h3><h3 style="Margin-top: 12px;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 26px;font-family: Avenir,sans-serif;">Date : ${this.data.date}</h3><h3 style="Margin-top: 12px;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 26px;font-family: Avenir,sans-serif;">Time : ${this.data.time}</h3><h3 style="Margin-top: 12px;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 26px;font-family: Avenir,sans-serif;">Message : ${this.data.description}</h3></div></div><h6 style="Margin-top: 12px;Margin-bottom: 0;font-style: normal;font-weight: normal;color: black;font-size: 16px;line-height: 26px;font-family: Avenir,sans-serif;">Request you to confirm your availability for the same or suggest an alternative day/time that works for you.</h6></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;margin-left:8%;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div role="contentinfo"><div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"><div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #adb3b9;font-family: sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"><div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"><div style="font-size: 14px;line-height: 19px;margin-left: 7%;"><div>Thank You,</div></div><div style="font-size: 14px;line-height: 19px;Margin-top: 18px;margin-left: 7%;"><div>${this.data.incubator.name}</div></div></div></div></div></div></div></div></td></tr></tbody></table></body>`,
            });

            try {
              await axios.post("https://traktor-api.herokuapp.com/sendMail", {
                from: {
                  name: this.data.incubator.name,
                  email: this.data.incubator.email,
                },
                to: {
                  name: this.data.mentor.name,
                  email: this.data.mentor.email,
                },
                subject: "Mentoring Session Request",
                content: `<body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;"><table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;line-height: 50px;font-size: 1px;margin-left: 7%;">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"><h2 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #e31212;font-size: 26px;line-height: 34px;font-family: Avenir,sans-serif;text-align: center;"><span style="color:#000000">Mentoring Session Re-Scheduled</span></h2></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;margin-left: 7%;"><h3 class="size-16" style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 24px;font-family: arial,sans-serif;" lang="x-size-16"><span class="font-arial">Hello ${this.data.mentor.name},</span></h3><p style="Margin-top: 12px;Margin-bottom: 0;"><span style="color:#000000;font-size: 16px;">This is to inform you that the mentoring session has been re-scheduled </span></p><p style="Margin-top: 20px;Margin-bottom: 0;"><span style="color:#000000;font-size: 16px;">Below are the updated details about mentoring session.&nbsp;</span></p></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;margin-left:8%;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"><h3 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 26px;font-family: Avenir,sans-serif;">Startup : ${this.data.startup.name}</h3><h3 style="Margin-top: 12px;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 26px;font-family: Avenir,sans-serif;">Date : ${this.data.date}</h3><h3 style="Margin-top: 12px;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 26px;font-family: Avenir,sans-serif;">Time : ${this.data.time}</h3><h3 style="Margin-top: 12px;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 26px;font-family: Avenir,sans-serif;">Message : ${this.data.description}</h3></div></div><h6 style="Margin-top: 12px;Margin-bottom: 0;font-style: normal;font-weight: normal;color: black;font-size: 16px;line-height: 26px;font-family: Avenir,sans-serif;">Request you to confirm your availability for the same or suggest an alternative day/time that works for you.</h6></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;margin-left:8%;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div role="contentinfo"><div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"><div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #adb3b9;font-family: sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"><div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"><div style="font-size: 14px;line-height: 19px;margin-left: 7%;"><div>Thank You,</div></div><div style="font-size: 14px;line-height: 19px;Margin-top: 18px;margin-left: 7%;"><div>${this.data.incubator.name}</div></div></div></div></div></div></div></div></td></tr></tbody></table></body>`,
              });

              const activity = {
                incubator: this.$store.state.user.currentUser,
                incubatorId: this.$store.state.user.currentUser.docId,
                statement: `Session Re-Scheduled bewteen ${this.data.mentor.name} and ${this.data.startup.name} on ${this.data.date} at ${this.data.time}`,
                createdAt: new Date(),
                type: "",
                notification: false,
                photoURL: this.$store.state.user.currentUser.photoURL,
              };

              await activityRef.add(activity);

              this.$store.dispatch("SHOW_LOADER", { isShowing: false });
              this.$store.dispatch("SHOW_SNACKBAR", {
                showing: true,
                text: "Re-Scheduled",
                color: "success",
              });
              this.dialog = false;
            } catch (error) {
              this.$store.dispatch("SHOW_LOADER", { isShowing: false });
              this.$store.dispatch("SHOW_SNACKBAR", {
                showing: true,
                text: error,
                color: "error",
              });
            }
          } catch (error) {
            this.$store.dispatch("SHOW_LOADER", { isShowing: false });
            this.$store.dispatch("SHOW_SNACKBAR", {
              showing: true,
              text: error,
              color: "error",
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: capitalize;
}
</style>