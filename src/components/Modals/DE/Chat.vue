<template>
  <!-- <v-row justify="center"> -->
  <!-- <v-dialog
      v-model="show"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    > -->
  <div class="mt-5">
    <!-- <v-toolbar dark color="traktor">
        <v-btn icon dark @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Chat</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items> </v-toolbar-items>
      </v-toolbar> -->
    <v-card-text>
      <div class="chat__container" ref="container">
        <div class="chat__row" v-for="(msg, index) in chats" :key="index">
          <div class="chat chat__right" v-if="msg.sender === currentUser.role">
            <div>
              <p>{{ msg.message }}</p>
              <img :src="msg.photoURL" alt="" class="ml-3" />
            </div>
            <span>{{ msg.createdAt }} by you</span>
          </div>
          <div class="chat chat__left" v-else>
            <div>
              <img :src="msg.photoURL" alt="" class="mr-3" />
              <p>{{ msg.message }}</p>
            </div>
            <span>{{ msg.createdAt }} by {{ msg.name }}</span>
          </div>
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-text-field
        outlined
        label="Type here"
        class="typing__area"
        append-icon="mdi-send"
        v-model="chat.message"
        @keyup.enter="send()"
        @click:append="send()"
      ></v-text-field>
    </v-card-actions>
  </div>
  <!-- </v-dialog> -->
  <!-- </v-row> -->
</template>

<script>
import { mapState } from "vuex";
import {
  activityRef,
  deChat,
  startupsRef,
} from "../../../config/firebase_services";

export default {
  name: "Chat",
  props: ["visible", "questions"],
  data() {
    return {
      chat: {
        message: "",
        createdAt: "",
        sender: "",
        questionTag: false,
        question: "",
        senderId: "",
        incubatorId: "",
        read: false,
        photoURL: "",
      },
      chats: [],
      chatId: "",
      startupName: "",
      isFirstTime: true,
    };
  },
  created() {
    this.setChat();
    this.getChats();
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) return this.$emit("close");
      },
    },
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  updated() {
    this.scrollToEnd();
  },
  mounted() {
    this.scrollToEnd();
  },
  methods: {
    scrollToEnd() {
      const content = this.$refs.container;
      content.scrollTop = content.scrollHeight;
    },
    async setChat() {
      if (this.$store.state.user.currentUser.role === "startup") {
        this.chatId = this.$store.state.user.currentUser.docId;
        this.startupName = this.$store.state.user.currentUser.name;
      } else {
        this.chatId = localStorage.getItem("strResId");
        const document = await startupsRef.doc(this.chatId).get();
        this.startupName = document.data()["name"];
      }
    },
    getChats() {
      deChat
        .doc(this.chatId)
        .collection("chats")
        .orderBy("createdAt")
        .onSnapshot((snapshot) => {
          this.chats = [];
          snapshot.forEach((document) => {
            const data = document.data();
            data.docId = document.id;
            data.createdAt =
              data.createdAt.toDate().toDateString() +
              " at " +
              data.createdAt.toDate().toLocaleTimeString("en-in", {
                hour: "2-digit",
                minute: "2-digit",
              });
            this.chats.push(data);
            console.log(this.chats);
          });
        });
    },
    tagQtn(qtn) {
      this.chat.questionTag = true;
      this.chat.question = qtn;
      this.chat.message = qtn + " - ";
    },
    async send() {
      if (this.chat.message === "") return;
      this.chat.createdAt = new Date();
      this.chat.sender = this.currentUser.role;
      this.chat.senderId = this.currentUser.docId;
      this.chat.incubatorId =
        this.$store.state.incubator.currentIncubator.docId;
      this.chat.photoURL = this.currentUser.photoURL;
      this.chat.name = this.currentUser.name;

      if (this.isFirstTime) {
        const path1 = `/de/${this.chatId}`;
        const path2 = "/de/0/0";
        const data = {
          incubatorId: this.$store.state.incubator.currentIncubator.docId,
          startupId: this.chatId,
          createdAt: new Date(),
          notification: true,
          read: false,
        };

        if (this.currentUser.role === "incubator") {
          data.statement = `You have a new message from ${this.$store.state.incubator.currentIncubator.name} in DE chat`;
          data.photoURL = this.$store.state.incubator.currentIncubator.photoURL;
          data.type = "startup";
          data.onlyStartup = true;
        }

        if (this.currentUser.role === "mentor") {
          data.statement = `You have a new message from ${this.currentUser.name} in DE chat`;
          data.photoURL = this.currentUser.photoURL;
          data.type = "mentor";
          data.click = true;
          data.href = null;
          data.paths = [path1, path2];
        }

        if (this.currentUser.role === "startup") {
          data.statement = `You have a new message from ${this.startupName} in DE chat`;
          data.photoURL = this.currentUser.photoURL;
          data.type = "incubator";
          data.click = true;
          data.href = null;
          data.paths = [path1, path2];
        }
        await activityRef.add(data);
      }

      try {
        await deChat.doc(this.chatId).collection("chats").add(this.chat);
        this.chat.message = "";
        this.isFirstTime = false;
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
.typing__area {
  width: 98%;
  position: absolute;
  bottom: 0;
}

.chat__container {
  width: 100%;
  max-height: 480px;
  overflow-y: scroll;
  height: auto;
  margin-top: auto;
  padding: 0 10px;
}

.chat__row {
  display: flex;
  width: 100%;
}

.chat {
  flex: 0.5;
  border-radius: 5px;
  margin-top: 20px;
}

.chat__right {
  display: block;
  margin-left: auto;
  text-align: right;
  padding: 5px;
}

.chat > div {
  display: flex;
  align-items: center;
}

img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.chat__right > div > p {
  border-radius: 5px;
  background: #dcf8c6;
  border: 1px solid #dcf8c6;
  width: fit-content;
  padding: 5px;
  margin-left: auto;
  margin-bottom: 0;
  position: relative;
}

.chat__right > div > p:after {
  content: "";
  position: absolute;
  margin-top: -6px;
  margin-left: -5px;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid #dcf8c6 !important;
  transform: rotate(-42deg);
  right: -10px;
  top: 3px;
}

.chat__left {
  display: block;
  margin-right: auto;
  text-align: left;
  padding: 5px;
}

.chat__left > div > p {
  border-radius: 5px;
  background: #cfd1cf;
  border: 1px solid #cfd1cf;
  width: fit-content;
  padding: 5px;
  margin-right: auto;
  margin-bottom: 0;
  position: relative;
}

.chat__left > div > p::after {
  content: "";
  position: absolute;
  margin-top: -6px;
  margin-left: -5px;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid #cfd1cf !important;
  transform: rotate(42deg);
  left: -6px;
  top: 3px;
}

span {
  font-size: 10px;
}

.questions {
  position: absolute;
  bottom: 15%;
  display: flex;
  flex-wrap: wrap;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 1);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 1);
}
</style>