<template>
  <v-app-bar app elevation="0">
    <v-app-bar-nav-icon
      @click.stop="sidebarMenu = !sidebarMenu"
      color="traktor"
    ></v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <v-menu bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-badge color="red" :content="notifications.length" class="mr-5"
          ><v-icon size="28" color="traktor" v-bind="attrs" v-on="on"
            >mdi-bell</v-icon
          >
        </v-badge>
      </template>

      <v-list subheader two-line>
        <v-list-item
          v-for="(notification, index) in notifications"
          :key="index"
        >
          <v-list-item-avatar>
            <v-img :src="notification.photoURL"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title
              v-text="notification.statement"
            ></v-list-item-title>

            <v-list-item-subtitle>{{
              notification.createdAt.toDate().toDateString()
            }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon>
              <v-icon color="traktor" size="12">mdi-circle</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn class="mr-2" icon color="traktor" @click="logout()"
      ><v-icon size="28">mdi-logout-variant</v-icon></v-btn
    >
  </v-app-bar>
</template>

<script>
import firebase from "firebase";

export default {
  name: "AppBar",
  data() {
    return {
      sidebarMenu: true,
      notifications: [],
    };
  },

  async created() {
    const documents = await firebase
      .firestore()
      .collection("activities")
      .where("notification", "==", true)
      .orderBy("createdAt")
      .get();

    documents.forEach((document) => {
      this.notifications.push(document.data());
    });
  },
  methods: {
    logout() {
      firebase.auth().signOut();
      this.$store.dispatch("SHOW_CURRENT_USER", null);
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
</style>