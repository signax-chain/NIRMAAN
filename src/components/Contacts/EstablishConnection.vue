<template>
  <div>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <div class="d-flex justify-space-between align-center">
      <h3 class="heading">Establish Connection</h3>
      <v-btn color="traktor" dark class="mr-5" @click="goto()"
        >All Connections</v-btn
      >
    </div>
    <div class="ma-5 pa-3 wrapper">
      <v-form>
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete
              outlined
              :items="items"
              item-text="name"
              item-value="docId"
              v-model="connection.user"
              label="Select Startup/ Mentor"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
              outlined
              :items="contacts"
              item-text="name"
              item-value="docId"
              v-model="connection.contact"
              label="Select Contact"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="12">
            <v-textarea
              label="Email Content"
              outlined
              v-model="connection.content"
            ></v-textarea>
          </v-col>
          <v-row>
            <v-col cols="12">
              <v-btn
                color="traktor"
                class="white--text mr-4 float-right mb-5"
                @click="establish()"
                >Establish Connection</v-btn
              >
            </v-col>
          </v-row>
        </v-row>
      </v-form>
    </div>
  </div>
</template>
<script>
import {
  startupsRef,
  mentorsRef,
  contactsRef,
  connectionsRef,
  activityRef,
} from "../../config/firebase_services";
import axios from "axios";

export default {
  name: "EstablishConnection",
  data() {
    return {
      items: [],
      contacts: [],
      connection: {
        user: null,
        contact: null,
        content: null,
      },
      crumbs: [
        {
          text: "Connections",
          disabled: true,
        },
        {
          text: "Establish Connection",
          disabled: true,
        },
      ],
    };
  },
  created() {
    this.getStartups();
    this.getMentors();
    this.getContacts();
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
        this.items.push(document.data());
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
        this.items.push(document.data());
      });
    },

    getContacts() {
      contactsRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .onSnapshot((snapshot) => {
          this.contacts = [];
          snapshot.forEach((document) => {
            const data = document.data();
            data.docId = document.id;
            this.contacts.push(data);
          });
        });
    },

    async establish() {
      const obj = Object.keys(this.connection).find(
        (key) => this.connection[key] === null
      );
      if (obj !== undefined) {
        this.$toast.error("All fields are required!...", {
          position: "top",
        });
        return;
      }

      try {
        this.connection.user = this.items.find(
          (item) => item.docId === this.connection.user
        );
        this.connection.contact = this.contacts.find(
          (item) => item.docId === this.connection.contact
        );
        this.connection.incubatorId =
          this.$store.state.incubator.currentIncubator.docId;
        this.connection.createdAt = new Date();

        const activity = {
          createdAt: new Date(),
          statement: `Connection established bewteen ${this.connection.contact.name} and ${this.connection.user.name}`,
          type: "incubator",
          notification: false,
          incubatorId: this.$store.state.incubator.currentIncubator,
          photoURL: this.$store.state.incubator.currentIncubator.photoURL,
        };

        await connectionsRef.add(this.connection);
        await axios.post("https://traktor-api.herokuapp.com/sendMail", {
          from: {
            name: this.$store.state.incubator.currentIncubator.name,
            email: this.$store.state.incubator.currentIncubator.email,
          },
          to: {
            name: this.connection.user.name,
            email: this.connection.user.email,
          },
          subject: "Connection Established",
          content: `<body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;"><table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;line-height: 50px;font-size: 1px;margin-left: 7%;">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"><h2 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #e31212;font-size: 26px;line-height: 34px;font-family: Avenir,sans-serif;text-align: center;"></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;margin-left: 7%;"><h3 class="size-16" style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 24px;font-family: arial,sans-serif;" lang="x-size-16"><span class="font-arial">Dear ${this.connection.user.name},</span></h3><p style="Margin-top: 12px;Margin-bottom: 0;"><span style="color:#000000;font-size: 16px;">Hope you are doing well. This is to inform you that connection have been established with ${this.connection.contact.name}. </span></p></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;margin-left:8%;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"><table style="border:1px solid black; border-collapse: collapse;text-align:center;"><tr><td style="border:1px solid black;width:150px;color:black;"><b>Contact</b></td><td style="border:1px solid black;width:180px;color:black;">${this.connection.contact.name}</td></tr><tr><td style="border:1px solid black;color:black;"><b>Email</b></td><td style="border:1px solid black;color:black;">${this.connection.contact.email}</td></tr><tr><td style="border:1px solid black;color:black;"><b>Mobile</b></td><td style="border:1px solid black;color:black;">${this.connection.contact.phoneNumber}</td></tr></table></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;margin-left:8%;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"> </div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div role="contentinfo"><div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"><div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #adb3b9;font-family: sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"><div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"><div style="font-size: 14px;line-height: 19px;margin-left: 7%;"><div>Regards,</div></div><div style="font-size: 14px;line-height: 19px;Margin-top: 18px;margin-left: 7%;"><div>${this.$store.state.incubator.currentIncubator.name}</div></div></div></div></div></div></div></div></td></tr></tbody></table></body>`,
        });

        await activityRef.add(activity);
        this.$toast.success("Connection Established", {
          position: "top",
        });
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
    goto() {
      this.$router.push("/connections");
    },
  },
};
</script>
<style scoped>
.v-btn {
  text-transform: capitalize;
}

.wrapper {
  background-color: #fff;
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}
</style>