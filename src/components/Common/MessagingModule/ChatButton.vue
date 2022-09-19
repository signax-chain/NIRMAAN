<template>
  <div>
    <button
      color="traktor"
      class="floating__btn"
      draggable="true"
      @dragstart="dragStart"
      @click="chatDialog = true"
    >
      <v-icon color="white" v-if="chatDialog">mdi-close</v-icon>
      <v-icon color="white" v-else>mdi-message-text</v-icon>
    </button>
    <message-widget
      :visible="chatDialog"
      @close="chatDialog = false"
    ></message-widget>
  </div>
</template>

<script>
import MessageWidget from "./MessageWidget.vue";
export default {
  components: { MessageWidget },
  data() {
    return {
      chatDialog: false,
    };
  },
  methods: {
    dragStart(event) {
      var style = window.getComputedStyle(event.target, null);
      var str =
        parseInt(style.getPropertyValue("left")) -
        event.clientX +
        "," +
        (parseInt(style.getPropertyValue("top")) - event.clientY) +
        "," +
        event.target.id;
      event.dataTransfer.setData("Text", str);
    },
  },
};
</script>

<style scoped>
.floating__btn {
  background-color: #66bb6a !important;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none !important;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);
  bottom: 0;
  position: fixed;
  margin: 1em;
  right: 0;
  z-index: 998;
}
</style>