<template>
  <v-row justify="center">
    <v-dialog
      v-model="show"
      hide-overlay
      transition="dialog-bottom-transition"
      width="90%"
    >
      <v-card>
        <v-toolbar dark color="traktor">
          <v-toolbar-title>
            <v-icon>mdi-comment-text-multiple</v-icon>
            Messaging...</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <div class="d-flex align-center" v-if="activeChat.chatUser.name">
            <img :src="activeChat.chatUser.photoURL" alt="" class="logo" />
            <span class="ml-2">{{ activeChat.chatUser.name }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark icon @click="show = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <v-list three-line class="chat-list">
                <template>
                  <div class="d-flex align-center">
                    <v-text-field
                      placeholder="Search"
                      v-model="search"
                      prepend-inner-icon="mdi-magnify"
                      class="mr-2"
                    ></v-text-field>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="traktor"
                          v-bind="attrs"
                          v-on="on"
                          @click="newChatDialog = true"
                        >
                          <v-icon size="30">mdi-account-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>New Chat</span>
                    </v-tooltip>
                  </div>
                </template>
                <template>
                  <div class="pa-4 text-center" v-if="chatUsers.length <= 0">
                    <img
                      src="../../../assets/images/no-documents.svg"
                      alt="No Chats"
                      width="100%"
                    />
                    <span
                      >No Chats yet. Add a user to establish new
                      converation</span
                    >
                  </div>
                </template>
                <template v-for="(chat, index) in chatUsers">
                  <v-list-item :key="index" @click="handleActiveChat(index)">
                    <v-list-item-avatar>
                      <v-img
                        :src="chat.chatUser.photoURL"
                        :alt="chat.chatUser.name"
                      ></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title
                        v-html="chat.chatUser.name"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-html="getLastMessage()"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider :key="index"></v-divider>
                </template>
              </v-list>
            </v-col>
            <v-col cols="12" md="9">
              <div class="chat-container">
                <v-alert
                  icon="mdi-information"
                  text
                  type="info"
                  outlined
                  class="mt-5"
                  v-if="chats.length === 0"
                >
                  You don't have any chats with {{ activeChat.chatUser.name }}.
                  Send a message to start the conversation.
                </v-alert>
                <div class="chat__container" ref="container" v-else>
                  <div
                    class="chat__row"
                    v-for="(msg, index) in chats"
                    :key="index"
                  >
                    <div
                      class="chat chat__right"
                      v-if="msg.sender === currentUser.role"
                    >
                      <div v-if="msg.type === 'media'">
                        <p
                          class="media"
                          v-if="msg.fileType === 'application/pdf'"
                        >
                          <a href="" @click="openMedia(msg.mediaURL)">
                            {{ msg.mediaName }}
                            <v-icon color="traktor">mdi-download</v-icon>
                          </a>
                        </p>
                        <p v-if="msg.fileType === 'image/png'">
                          <img
                            :src="msg.mediaURL"
                            alt=""
                            style="width: 200px; cursor: pointer"
                          />
                        </p>
                        <img
                          :src="msg.photoURL"
                          alt=""
                          class="ml-3 chat-photo"
                        />
                      </div>
                      <div v-else>
                        <p>{{ msg.message }}</p>
                        <img
                          :src="msg.photoURL"
                          alt=""
                          class="ml-3 chat-photo"
                        />
                      </div>
                      <span>{{ msg.createdAt }} by you</span>
                    </div>
                    <div class="chat chat__left" v-else>
                      <div v-if="msg.type === 'media'">
                        <p class="media">
                          <a href="" @click="openMedia(msg.mediaURL)">
                            {{ msg.mediaName }}
                            <v-icon color="traktor">mdi-download</v-icon>
                          </a>
                        </p>
                        <img
                          :src="msg.photoURL"
                          alt=""
                          class="ml-3 chat-photo"
                        />
                      </div>
                      <div v-else>
                        <img
                          :src="msg.photoURL"
                          alt=""
                          class="mr-3 chat-photo"
                        />
                        <p>{{ msg.message }}</p>
                      </div>
                      <span>{{ msg.createdAt }} by {{ msg.name }}</span>
                    </div>
                  </div>
                </div>
                <div class="chat-actions d-flex align-center">
                  <v-text-field
                    v-model="message"
                    placeholder="Type here"
                    outlined
                    color="traktor"
                    dense
                    append-icon="mdi-send"
                    @keyup.enter="sendMessage"
                    @click:append="sendMessage"
                    class="mr-6"
                  ></v-text-field>
                  <v-speed-dial
                    v-model="fab"
                    bottom
                    right
                    direction="top"
                    transition="slide-y-reverse-transition"
                  >
                    <template v-slot:activator>
                      <v-btn
                        v-model="fab"
                        :color="fab ? 'red' : 'traktor'"
                        dark
                        fab
                        small
                      >
                        <v-icon v-if="fab"> mdi-close </v-icon>
                        <v-icon v-else> mdi-account-circle </v-icon>
                      </v-btn>
                    </template>
                    <v-btn
                      fab
                      dark
                      small
                      color="traktor"
                      @click="$refs.attachment.click()"
                    >
                      <v-icon>mdi-attachment</v-icon>
                    </v-btn>
                    <v-btn
                      fab
                      dark
                      small
                      color="indigo"
                      @click="$refs.image.click()"
                    >
                      <v-icon>mdi-image</v-icon>
                    </v-btn>
                  </v-speed-dial>
                </div>
                <input
                  type="file"
                  ref="attachment"
                  style="display: none"
                  @change="handleAttachment"
                  accept="application/*"
                />
                <input
                  type="file"
                  ref="image"
                  style="display: none"
                  @change="handleImage"
                  accept="image/*"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <available-users
      :visible="newChatDialog"
      @close="handleNewChatClose"
    ></available-users>
    <progress-loader
      :loaderText="loaderText"
      :visible="loader"
    ></progress-loader>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import {
  messagingModuleRef,
  messagingModuleUsersRef,
} from "../../../config/firebase_services";
import { uploadFileWithName } from "../../../_helpers/FileUpload";
import ProgressLoader from "../../Modals/Loaders/ProgressLoader.vue";
import AvailableUsers from "./AvailableUsers.vue";
export default {
  components: { AvailableUsers, ProgressLoader },
  props: ["visible", "selectedConversationId"],

  data() {
    return {
      newChatDialog: false,
      fab: false,
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      chatUsers: [],
      chats: [],
      message: "",
      activeChat: {
        chatUser: {
          name: "",
          photoURL: "",
        },
        message: "",
      },
      loaderText: "",
      loader: false,
    };
  },
  created() {
    this.getChatUsers();
    this.$forceUpdate();
  },
  mounted() {
    this.getChatUsers();
    this.scrollToEnd();
  },
  updated() {
    this.scrollToEnd();
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      },
    },
  },
  methods: {
    getChats() {
      messagingModuleRef
        .doc(this.activeChat.conversationId)
        .collection("messages")
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
          });
        });
    },
    scrollToEnd() {
      const content = this.$refs.container;
      content.scrollTop = content.scrollHeight;
    },
    async getChatUsers() {
      this.chatUsers = [];
      try {
        const documents = await messagingModuleUsersRef
          .where("userId", "==", this.$store.state.user.currentUser.docId)
          .orderBy("createdAt", "desc")
          .get();
        this.chatUsers = documents.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        console.log(this.selectedConversationId);
        if (this.selectedConversationId)
          this.activeChat = this.chatUsers.find(
            (user) => user.id === this.selectedConversationId
          );
        else this.activeChat = this.chatUsers[0];
        this.getChats();
      } catch (error) {
        console.log(error);
      }
    },
    openMedia(url) {
      window.open(url, "_blank");
    },
    async handleAttachment(e) {
      try {
        this.loaderText = "Uploading...";
        this.loader = true;
        const file = await uploadFileWithName(
          e.target.files[0],
          `messaging/${this.activeChat.conversationId}`
        );
        console.log(file);
        const chat = {
          message: "",
          createdAt: new Date(),
          sender: this.currentUser.role,
          senderId: this.currentUser.docId,
          photoURL: this.currentUser.photoURL,
          name: this.currentUser.name,
          read: false,
          type: "media",
          mediaURL: file,
          mediaName: e.target.files[0].name,
          fileType: e.target.files[0].type,
        };
        await messagingModuleRef
          .doc(this.activeChat.conversationId)
          .collection("messages")
          .add(chat);
        this.loader = false;
        this.fab = false;
      } catch (error) {
        this.loader = false;
        this.$toast.open({
          message: error.message,
          type: "error",
          position: "top",
        });
      }
    },
    async handleImage(e) {
      try {
        this.loaderText = "Uploading...";
        this.loader = true;
        const file = await uploadFileWithName(
          e.target.files[0],
          `messaging/${this.activeChat.conversationId}`
        );
        console.log(file);
        const chat = {
          message: "",
          createdAt: new Date(),
          sender: this.currentUser.role,
          senderId: this.currentUser.docId,
          photoURL: this.currentUser.photoURL,
          name: this.currentUser.name,
          read: false,
          type: "media",
          mediaURL: file,
          mediaName: e.target.files[0].name,
          fileType: e.target.files[0].type,
        };
        await messagingModuleRef
          .doc(this.activeChat.conversationId)
          .collection("messages")
          .add(chat);
        this.loader = false;
        this.fab = false;
      } catch (error) {
        this.loader = false;
        this.$toast.open({
          message: error.message,
          type: "error",
          position: "top",
        });
      }
    },
    async sendMessage() {
      if (this.message.trim() === "") return;
      const chat = {
        message: this.message,
        createdAt: new Date(),
        sender: this.currentUser.role,
        senderId: this.currentUser.docId,
        photoURL: this.currentUser.photoURL,
        name: this.currentUser.name,
        read: false,
      };
      try {
        await messagingModuleRef
          .doc(this.activeChat.conversationId)
          .collection("messages")
          .add(chat);
        this.message = "";
      } catch (error) {
        console.log(error);
      }
    },
    handleNewChatClose() {
      this.newChatDialog = false;
      this.getChatUsers();
    },
    handleActiveChat(index) {
      this.chats = [];
      this.activeChat = this.chatUsers[index];
      this.getChats();
    },
    getLastMessage() {
      //   return this.chats[this.chats.length - 1].message;
      return "No messages yet";
    },
  },
};
</script>

<style scoped>
>>> .v-dialog:not(.v-dialog--fullscreen) {
  /* border-radius: 10px !important; */
}

.chat-list {
  height: 60vh;
  overflow-y: scroll;
}

.v-list-item {
  border-right: 1px solid #ccc !important;
}

.chat-container {
  height: 100%;
  position: relative;
  width: 100%;
}

.chat-actions {
  position: absolute;
  bottom: 0;
  width: 100%;
}

>>> .v-btn {
  border-radius: 50% !important;
}

.logo {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  object-fit: contain;
}

.chat__container {
  width: 100%;
  max-height: 400px;
  min-height: 400px;
  overflow-y: scroll;
  height: auto;
  margin-top: auto;
  padding: 0 10px;
  background-image: url("https://github-production-user-asset-6210df.s3.amazonaws.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
  background-size: cover;
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

.chat-photo {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: contain;
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
  background: #fff;
  border: 1px solid #fff;
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
  border-bottom: 12px solid #fff !important;
  transform: rotate(42deg);
  left: -6px;
  top: 3px;
}

span {
  font-size: 10px;
}

/* .media {
  height: auto;
  background-color: #fff;
  padding: 1rem;
  border-radius: 5px;
  text-align: right;
  margin-left: auto;
} */

.media > a {
  text-decoration: none;
}
</style>