<template>
  <div class="contacts__container">
    <h3 v-if="currentUser.role === 'startup'" class="heading">Contacts</h3>
    <v-data-table
      :headers="headers"
      :items="contacts"
      class="mt-3"
      mobile-breakpoint="0"
    >
      <template v-slot:[`item.contacts`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click="copyToClipboard(item.email)">
              <v-icon color="black" v-bind="attrs" v-on="on"
                >mdi-email</v-icon
              ></v-btn
            >
          </template>
          <span>{{ item.email }}</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click="copyToClipboard(item.phoneNumber)"
              ><v-icon color="black" v-bind="attrs" v-on="on"
                >mdi-phone</v-icon
              ></v-btn
            >
          </template>
          <span>{{ item.phoneNumber }}</span>
        </v-tooltip>
      </template>
      <template v-slot:[`item.connect`]="{ item }">
        <v-btn color="traktor" class="white--text" @click="connect(item)"
          >Connect</v-btn
        >
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
          </template>
          <v-list>
            <v-list-item @click="edit(item)">
              <v-list-item-title> Edit </v-list-item-title>
            </v-list-item>
            <v-list-item @click="_delete(item.docId)">
              <v-list-item-title> Delete </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="800">
        <v-card>
          <v-card-title class="headline">
            Edit Contact
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialog = false">
              Cancel
            </v-btn>
            <v-btn color="traktor" class="white--text" @click="update()">
              Update
            </v-btn>
          </v-card-title>
          <v-card-text class="mt-5">
            <v-form>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Name"
                    outlined
                    dense
                    v-model="contact.name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Designation"
                    outlined
                    dense
                    v-model="contact.designation"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Organisation"
                    outlined
                    dense
                    v-model="contact.organisation"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Connect For?"
                    outlined
                    dense
                    v-model="contact.connectFor"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Contact Number"
                    outlined
                    dense
                    v-model="contact.phoneNumber"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Email Address"
                    outlined
                    dense
                    type="email"
                    v-model="contact.email"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
import {
  contactsRef,
  connectionRequestsRef,
  activityRef,
} from "../../config/firebase_services";
import Swal from "sweetalert2";
import axios from "axios";
import copy from "copy-to-clipboard";

export default {
  name: "ContactsComp",
  data() {
    return {
      dialog: false,
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: true,
          value: "name",
        },
        {
          text: "Designation",
          align: "start",
          sortable: true,
          value: "designation",
        },
        {
          text: "Organisation",
          align: "start",
          sortable: true,
          value: "organisation",
        },
        {
          text: "Connect for",
          align: "start",
          sortable: true,
          value: "connectFor",
        },
      ],
      contacts: [],
      contact: [],
      currentUser: {},
    };
  },
  created() {
    this.getContacts();
    this.updateHeaders();
    this.updateCurrentUser();
  },
  methods: {
    updateCurrentUser() {
      const currentUser = this.$store.state.user.currentUser;
      this.currentUser.role = currentUser.role;
      if (currentUser.role === "startup") this.currentUser.title = "Startup";
      if (currentUser.role === "mentor") this.currentUser.title = "Mentors";
    },
    getContacts() {
      contactsRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          this.contacts = [];
          snapshot.forEach((document) => {
            const data = document.data();
            data.docId = document.id;
            this.contacts.push(data);
          });
        });
    },

    updateHeaders() {
      const role = this.$store.state.user.currentUser.role;

      if (role === "incubator") {
        this.headers[1] = {
          text: "Contact",
          align: "start",
          sortable: true,
          value: "contacts",
        };

        this.headers.push({
          text: "Actions",
          align: "start",
          sortable: true,
          value: "actions",
        });
      }

      if (role === "startup" || role === "mentor") {
        this.headers.push({
          text: "",
          align: "start",
          sortable: false,
          value: "connect",
        });
      }
    },

    async connect(contact) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3aa959",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const data = {
            incubatorId: this.$store.state.incubator.currentIncubator.docId,
            createdAt: new Date(),
            startup:
              this.currentUser.role === "startup"
                ? this.$store.state.user.currentUser
                : null,
            mentor:
              this.currentUser.role === "mentor"
                ? this.$store.state.user.currentUser
                : null,
            contact: contact,
            read: false,
          };

          const activity = {
            createdAt: new Date(),
            incubatorId: this.$store.state.incubator.currentIncubator.docId,
            notification: true,
            type: "startup",
            startup: this.$store.state.user.currentUser,
            statement: `${this.currentUser.title} ${this.$store.state.user.currentUser.name} have requested for a new connection with contact ${contact.name}.`,
            photoURL: this.$store.state.user.currentUser.photoURL,
            read: false,
          };

          try {
            await connectionRequestsRef.add(data);
            await axios.post("https://traktor-api.herokuapp.com/sendMail", {
              from: {
                name: "The Startupreneur",
                email: "start@thestartupreneur.co",
              },
              to: {
                name: this.$store.state.incubator.currentIncubator.name,
                email: this.$store.state.incubator.currentIncubator.email,
              },
              subject: "New Connection Request",
              content: `<body class="no-padding" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%;"><table class="wrapper" style="border-collapse: collapse; table-layout: fixed; min-width: 320px; width: 100%; background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><div><div class="layout one-col fixed-width" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #ffffff;"><div class="column" style="text-align: left; color: #8e959c; font-size: 14px; line-height: 21px; font-family: sans-serif; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px);"><div style="margin-left: 20px; margin-right: 20px;"><div style="mso-line-height-rule: exactly; line-height: 50px; font-size: 1px; margin-left: 7%;"> &nbsp;</div></div><div style="margin-left: 20px; margin-right: 20px;"><div style="mso-line-height-rule: exactly; mso-text-raise: 4px;"></div></div></div></div></div><div style="line-height: 20px; font-size: 20px;">&nbsp;</div><div class="layout one-col fixed-width" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #fff;"><div class="column" style="text-align: left; color: #8e959c; font-size: 14px; line-height: 21px; font-family: sans-serif; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px);"><div style=""><div style="mso-line-height-rule: exactly; mso-text-raise: 4px; margin-left: 7%;"><h3 class="size-16" style="margin-top: 0; margin-bottom: 0; font-style: normal; font-weight: normal; color: #000000; font-size: 16px; line-height: 24px; font-family: arial, sans-serif;" lang="x-size-16" > <span class="font-arial">Dear ${this.$store.state.incubator.currentIncubator.name},</span></h3><p style="margin-top: 12px; margin-bottom: 0;"><span style="color: #000000; font-size: 16px;">Hope you are doing well. This is to inform you that startup ${this.$store.state.user.currentUser.name} has requested for a new connection with the contact ${contact.name}. </span></p></div></div></div></div></div><div class="layout one-col fixed-width" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #fff;"><div class="column" style="text-align: left; margin-left: 8%; color: #8e959c; font-size: 14px; line-height: 21px; font-family: sans-serif; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px);" ></div></div></div><div style="line-height: 20px; font-size: 20px;">&nbsp;</div><div class="layout one-col fixed-width" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #ffffff;"><div class="column" style="text-align: left; color: #8e959c; font-size: 14px; margin-left: 8%; line-height: 21px; font-family: sans-serif; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px);" ></div></div><div style="line-height: 20px; font-size: 20px;">&nbsp;</div><div role="contentinfo"><div class="layout email-footer" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;" ><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%;"><div class="column wide" style="text-align: left; font-size: 12px; line-height: 19px; color: #adb3b9; font-family: sans-serif; float: left; max-width: 400px; min-width: 320px; width: 320px; width: calc(8000% - 47600px);" ><div style="margin-left: 20px; margin-right: 20px; margin-top: 10px; margin-bottom: 10px;"><div style="font-size: 14px; line-height: 19px; margin-left: 7%;"><div>Regards,</div></div><div style="font-size: 14px; line-height: 19px; margin-top: 18px; margin-left: 7%;"><div>The Startupreneur</div></div></div></div></div></div></div></div></div></td></tr></tbody></table></body>`,
            });
            await activityRef.add(activity);
            this.$toast.success(
              "Request sent to incubator. Please wait for the incubator reply.",
              {
                position: "top",
              }
            );
          } catch (error) {
            this.$toast.error(error, {
              position: "top",
            });
          }
        }
      });
    },

    edit(contact) {
      this.contact = contact;
      this.dialog = true;
    },

    async update() {
      const obj = Object.keys(this.contact).find(
        (key) => this.contact[key] === ""
      );
      if (obj !== undefined) {
        this.$toast.error("All fields are required!...", {
          position: "top",
        });
        return;
      }

      try {
        await contactsRef
          .doc(this.contact.docId)
          .set(this.contact, { merge: true });
        this.$toast.success(`Updated`, {
          position: "top",
        });
        this.dialog = false;
        this.contact = [];
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },

    async _delete(docId) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3aa959",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await contactsRef.doc(docId).delete();
            this.$toast.success(`Deleted`, {
              position: "top",
            });
          } catch (error) {
            this.$toast.error(error, {
              position: "top",
            });
          }
        }
      });
    },

    copyToClipboard(text) {
      copy(text);
      this.$toast.success(`Copied ${text} to clipboard`, {
        position: "top",
      });
    },
  },
};
</script>
<style scoped>
.contacts__container {
  padding: 10px;
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1rem;
  font-weight: 500;
}

>>> th {
  color: #3aa95a !important;
  font-size: 18px !important;
  font-weight: normal;
}
</style>