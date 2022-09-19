<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="heading"
        >Available Users
        <span class="grey--text ml-2" style="font-size: 14px">
          (Startups, Mentors, Contacts)</span
        >
        <v-spacer></v-spacer>
        <v-btn icon @click.native="show = false" color="red">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          v-model="search"
          append-icon="mdi-magnify"
          class="mr-2"
          placeholder="Search User to chat"
          :items="users"
          item-text="name"
          item-value="docId"
          @change="handleChange"
          clearable
        >
          <template v-slot:selection="{ item }">
            <div class="d-flex align-center">
              <img :src="item.photoURL" :alt="item.name" class="logo" />
              <span class="ml-2">{{ item.name }}</span>
            </div>
          </template>
          <template v-slot:item="{ item }">
            <div class="d-flex align-center">
              <img :src="item.photoURL" :alt="item.name" class="logo" />
              <span class="ml-2">{{ item.name }}</span>
            </div>
          </template>
        </v-autocomplete>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { messagingModuleUsersRef } from "../../../config/firebase_services";
import { getMentorsByIncubatorId } from "../../../services/Mentors";
import { getStartupsByIncubatorId } from "../../../services/Startups";
export default {
  props: ["visible"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) return this.$emit("close");
      },
    },
  },
  data() {
    return {
      search: "",
      users: [],
    };
  },
  created() {
    this.handleUsers();
  },
  mounted() {
    this.handleUsers();
  },
  methods: {
    async handleUsers() {
      this.users = [];
    //   const role = this.checkRole();
      //   if (role === "incubator") {
      const incubatorId = this.$store.state.user.currentUser.docId;
      await this.getStartups(incubatorId);
      await this.getMentors(incubatorId);
      // await this.getContacts();
      //   }
    },
    async getIncubator() {},
    async getStartups(incubatorId) {
      const startups = await getStartupsByIncubatorId(incubatorId);
      this.users = [...this.users, ...startups];
    },
    async getMentors(incubatorId) {
      const mentors = await getMentorsByIncubatorId(incubatorId);
      this.users = [...this.users, ...mentors];
    },
    async getContacts() {},
    async getConnections() {},
    checkRole() {
      return this.$store.state.user.currentUser.role;
    },
    async handleChange(uid) {
      if (uid !== null) {
        const conversationId = this.generateConversationId(uid);
        const user = this.users.find((user) => user.docId === uid);
        await messagingModuleUsersRef.add({
          userId: uid,
          chatUser: {
            userId: this.$store.state.user.currentUser.docId,
            name: this.$store.state.user.currentUser.name,
            photoURL: this.$store.state.user.currentUser.photoURL,
          },
          conversationId: conversationId,
          createdAt: new Date(),
        });

        await messagingModuleUsersRef.add({
          userId: this.$store.state.user.currentUser.docId,
          chatUser: {
            userId: user.docId,
            name: user.name,
            photoURL: user.photoURL,
          },
          conversationId: conversationId,
          createdAt: new Date(),
        });
        this.search = "";
        this.$emit("close");
      }
    },
    generateConversationId(uid) {
      const userId = this.$store.state.user.currentUser.docId;
      const conversationId =
        userId < uid ? `${userId}-${uid}` : `${uid}-${userId}`;
      return conversationId;
    },
  },
};
</script>

<style scoped>
.logo {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>