import { messagingModuleUsersRef } from "../config/firebase_services";
import store from "@/store";

export default {
  data() {
    return {
      messagingDialog: false,
      conversationSchema: {
        conversationId: "",
        userId: "",
        createdAt: "",
        updatedAt: "",
        chatUser: {
          name: "",
          photoURL: "",
          userId: "",
        },
      },
      selectedConversationId: "",
    };
  },
  methods: {
    generateConversationId(uid) {
      const userId = store.state.user.currentUser.docId;
      const conversationId =
        userId < uid ? `${userId}-${uid}` : `${uid}-${userId}`;
      return conversationId;
    },
    async handleMessage(item) {
      const conversationId = this.generateConversationId(item.docId);
      const document = await messagingModuleUsersRef
        .where("conversationId", "==", conversationId)
        .get();
      if (document.empty) {
        await this.createConversation(conversationId, item);
      } else this.selectedConversationId = conversationId;
      console.log(this.selectedConversationId);
      this.messagingDialog = true;
    },
    async createConversation(conversationId, item) {
      await messagingModuleUsersRef.add({
        conversationId,
        userId: item.docId,
        createdAt: new Date(),
        updatedAt: new Date(),
        chatUser: {
          name: store.state.user.currentUser.name,
          photoURL: store.state.user.currentUser.photoURL,
          userId: store.state.user.currentUser.docId,
        },
      });
      await messagingModuleUsersRef.add({
        conversationId,
        userId: store.state.user.currentUser.docId,
        createdAt: new Date(),
        updatedAt: new Date(),
        chatUser: {
          name: item.name,
          photoURL: item.photoURL,
          userId: item.docId,
        },
      });
    },
  },
};
