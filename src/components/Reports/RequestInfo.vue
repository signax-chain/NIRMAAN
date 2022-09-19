<template>
  <div>
    <v-form class="mt-5">
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            label="Select Field"
            :items="fields"
            outlined
            dense
            v-model="field"
            @change="handleField"
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-if="field === 'Startup'"
            label="Select Startup"
            :items="startups"
            outlined
            dense
            item-text="name"
            item-value="docId"
            v-model="data.user"
          ></v-select>
          <v-select
            v-if="field === 'Mentor'"
            label="Select Mentor"
            :items="mentors"
            outlined
            dense
            item-text="name"
            item-value="docId"
            v-model="data.user"
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            label="Select Information Type"
            :items="informationTypes"
            outlined
            dense
            v-model="data.type"
            @change="handleInfoType"
          ></v-select>
        </v-col>
        <v-col cols="12" md="12">
          <v-textarea
            outlined
            dense
            label="Comment"
            v-model="data.comment"
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="12">
          <v-btn
            color="traktor"
            class="white--text ml-auto d-block"
            @click="request()"
            >Send Request</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
    <v-dialog v-model="addNewDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"> Add new </v-card-title>
        <v-card-text>
          <v-text-field
            outlined
            label="Add new"
            v-model="addNewValue"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="addNewDialog = false">
            Cancel
          </v-btn>
          <v-btn color="traktor" class="white--text" @click="add()">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import {
  startupsRef,
  mentorsRef,
  requestInformationsRef,
  activityRef,
} from "../../config/firebase_services";
import axios from "axios";

export default {
  name: "RequestInfo",
  data() {
    return {
      fields: ["Startup", "Mentor"],
      informationTypes: [
        "Official Docuemnts",
        "Presentations",
        "Performance Report",
        "Payment Receips",
        "Bill/ Reimbursements",
        "Progress",
        "Add new +",
      ],
      startups: [],
      mentors: [],
      field: "Startup",
      data: {
        user: null,
        type: null,
        comment: null,
      },
      addNewDialog: false,
      addNewValue: null,
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
        .where("isDeleted", "==", false)
        .get();

      documents.forEach((document) => {
        this.startups.push(document.data());
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
        this.mentors.push(document.data());
      });
    },

    handleField() {
      this.data.user = null;
    },

    handleInfoType(type) {
      if (type === "Add new +") this.addNewDialog = true;
    },

    add() {
      if (this.addNewValue === null) {
        this.$toast.error("Cannot add empty value", {
          position: "top",
        });
        return;
      }
      this.informationTypes.splice(
        this.informationTypes.length - 1,
        0,
        this.addNewValue
      );
      this.informationTypes.join();
      this.data.type = this.addNewValue;
      this.addNewDialog = false;
      this.addNewValue = null;
    },

    async request() {
      if (this.data.user === null) {
        this.$toast.error("Select an user to request the information", {
          position: "top",
        });
        return;
      }

      if (this.data.type === null) {
        this.$toast.error("Select the information type", {
          position: "top",
        });
        return;
      }

      if (this.field === "Startup") {
        this.data.user = this.startups.find(
          (startup) => startup.docId === this.data.user
        );
      }

      if (this.field === "Mentor") {
        this.data.user = this.mentors.find(
          (mentor) => mentor.docId === this.data.user
        );
      }

      this.data.incubatorId = this.$store.state.incubator.currentIncubator.docId;
      this.data.createdAt = new Date();

      const activity = {
        type: "incubator",
        notification: false,
        statement: `${this.$store.state.incubator.currentIncubator.name} has sent Information request to ${this.data.user.name}`,
        createdAt: new Date(),
        incubatorId: this.$store.state.incubator.currentIncubator.docId,
      };

      try {
        await requestInformationsRef.add(this.data);
        const link = `https://traktor.thestartupreneur.co/documents/`;

        await axios.post("https://traktor-api.herokuapp.com/sendMail", {
          from: {
            name: this.$store.state.incubator.currentIncubator.name,
            email: this.$store.state.incubator.currentIncubator.email,
          },
          to: {
            name: this.data.user.name,
            email: this.data.user.email,
          },
          subject: "Information Requested",
          content: `<body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;"><table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;line-height: 50px;font-size: 1px;margin-left: 7%;">&nbsp;</div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;margin-left: 7%;"><h3 class="size-16" style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 24px;font-family: arial,sans-serif;" lang="x-size-16"><span class="font-arial">Dear ${this.data.user.name},</span></h3><p style="Margin-top: 12px;Margin-bottom: 0;"><span style="color:#000000;font-size: 16px;">Hope you are doing well. This is to request information about ${this.data.type} </span></p></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;margin-left:8%;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><h6 style="Margin-top: 12px;Margin-bottom: 0;font-style: normal;font-weight: normal;color: black;font-size: 16px;line-height: 26px;font-family: Avenir,sans-serif;">Kindly share the same by clicking on this <a href="${link}">link </a></h6></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;margin-left:8%;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div role="contentinfo"><div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"><div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #adb3b9;font-family: sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"><div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"><div style="font-size: 14px;line-height: 19px;margin-left: 7%;"><div>Regards,</div></div><div style="font-size: 14px;line-height: 19px;Margin-top: 18px;margin-left: 7%;"><div>${this.$store.state.incubator.currentIncubator.name}</div></div></div></div></div></div></div></div></td></tr></tbody></table></body>`,
        });
        await activityRef.add(activity);
        this.$toast.success("Request Sent", {
          position: "top",
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
.v-btn {
  text-transform: capitalize;
}
</style>