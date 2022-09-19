<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <h2>{{ title }}</h2>
        <vue-file-toolbar-menu :content="menu" class="bar" />
      </v-col>
      <v-col cols="4" md="4">
        <div class="medias d-flex justify-space-between">
          <div @click="video()">
            <v-icon size="38">mdi-youtube-tv</v-icon>
            <h5>Watch Video</h5>
          </div>
          <div>
            <v-icon size="38">mdi-image</v-icon>
            <h5>View Presentation</h5>
          </div>
          <div>
            <v-icon size="38">mdi-comment-edit</v-icon>
            <h5>Review Changes</h5>
          </div>
          <div>
            <v-icon size="38">mdi-help-circle</v-icon>
            <h5>Ask for help</h5>
          </div>
        </div>
      </v-col>
    </v-row>
    <div>
      <vue-document-editor
        class="editor"
        ref="editor"
        :content.sync="content"
        :overlay="overlay"
        :zoom="zoom"
        :page_format_mm="page_format_mm"
        :page_margins="page_margins"
      />
      <Video
        :visible="videoDialog"
        :step="step"
        @close="videoDialog = false"
        :uploading="false"
        @uploadVideo="uploadVideo"
      ></Video>
      <v-btn
        class="floating__btn"
        color="traktor"
        dark
        @click="save()"
        fab
        right
        absolute
        ><v-icon>mdi-content-save</v-icon></v-btn
      >
    </div>
  </v-container>
</template>

<script>
import VueFileToolbarMenu from "vue-file-toolbar-menu";
import VueDocumentEditor from "vue-document-editor";
import Video from "../../Modals/DE/Video.vue";
import { uploadFile } from "../../../_helpers/FileUpload";
import { deRef, deResponsesRef } from "../../../config/firebase_services";
import { mapState } from "vuex";

export default {
  name: "Worksheet",
  components: { VueFileToolbarMenu, VueDocumentEditor, Video },
  data() {
    return {
      // This is where the pages content is stored and synced
      content: [
        `<div style="display: flex; justify-content: space-between; align-items: center;"><img src='https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fincubator%2F1200px-IIT_Madras_Logo.svg.png?alt=media&token=ace33c8e-093d-48e8-9be7-7784ccff6ca1' alt='IITM' width='80' /><div></div><img src='https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fincubator%2Flogo.png?alt=media&token=0fc9695f-0d50-47f9-901c-1536c3acfa24' alt='Nirmaan' width="100"/></div>
        <div style='margin-top: 25px;'>Type contents here...</div>`,
      ],
      zoom: 0.8,
      zoom_min: 0.1,
      zoom_max: 5.0,
      page_format_mm: [320, 160],
      page_margins: "10mm 15mm",
      display: "grid", // ["grid", "vertical", "horizontal"]
      mounted: false, // will be true after this component is mounted
      undo_count: -1, // contains the number of times user can undo (= current position in content_history)
      content_history: [], // contains the content states for undo/redo operations
      isEdit: false,
      data: "",
      step: "",
      videoDialog: false,
      pptDialog: false,
      helpDialog: false,
      title: "",
      font: "Avenir",
    };
  },
  created() {
    // Initialize gesture flags
    let start_zoom_gesture = false;
    let start_dist_touch = false;
    let start_zoom_touch = false;

    // Manage ctrl+scroll zoom (or trackpad pinch)
    window.addEventListener(
      "wheel",
      (e) => {
        if (e.ctrlKey) {
          e.preventDefault();
          this.zoom = Math.min(
            Math.max(this.zoom - e.deltaY * 0.01, this.zoom_min),
            this.zoom_max
          );
        }
      },
      { passive: false }
    );

    // Manage trackpad pinch on Safari
    window.addEventListener("gesturestart", (e) => {
      e.preventDefault();
      start_zoom_gesture = this.zoom;
    });
    window.addEventListener("gesturechange", (e) => {
      e.preventDefault();
      if (!start_zoom_touch) {
        this.zoom = Math.min(
          Math.max(start_zoom_gesture * e.scale, this.zoom_min),
          this.zoom_max
        );
      }
    });
    window.addEventListener("gestureend", () => {
      start_zoom_gesture = false;
    });

    // Manage pinch to zoom for touch devices
    window.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length == 2) {
          e.preventDefault();
          start_dist_touch = Math.hypot(
            e.touches[0].pageX - e.touches[1].pageX,
            e.touches[0].pageY - e.touches[1].pageY
          );
          start_zoom_touch = this.zoom;
        }
      },
      { passive: false }
    );
    window.addEventListener(
      "touchmove",
      (e) => {
        if (start_dist_touch && start_zoom_touch) {
          e.preventDefault();
          let zoom =
            (start_zoom_touch *
              Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
              )) /
            start_dist_touch;
          this.zoom = Math.min(Math.max(zoom, this.zoom_min), this.zoom_max);
        }
      },
      { passive: false }
    );
    window.addEventListener(
      "touchend",
      () => {
        start_dist_touch = false;
        start_zoom_touch = false;
      },
      { passive: false }
    );

    // Manage history undo/redo events
    const manage_undo_redo = (e) => {
      switch (e && e.inputType) {
        case "historyUndo":
          e.preventDefault();
          e.stopPropagation();
          this.undo();
          break;
        case "historyRedo":
          e.preventDefault();
          e.stopPropagation();
          this.redo();
          break;
      }
    };
    window.addEventListener("beforeinput", manage_undo_redo);
    window.addEventListener("input", manage_undo_redo); // in case of beforeinput event is not implemented (Firefox)

    // If your component is susceptible to be destroyed, don't forget to
    // use window.removeEventListener in the Vue.js beforeDestroy handler
  },
  computed: {
    menu() {
      return [
        // Main commands
        {
          text: "",
          title: "New worksheet",
          icon: "description",
          disabled: !this.current_text_style,
          click: () => this.insertPageBreak(),
        },
        { is: "spacer" },

        // Undo / redo commands
        {
          title: "Undo",
          icon: "undo",
          disabled: !this.can_undo,
          hotkey: this.isMacLike ? "command+z" : "ctrl+z",
          click: () => this.undo(),
        },
        {
          title: "Redo",
          icon: "redo",
          disabled: !this.can_redo,
          hotkey: this.isMacLike ? "shift+command+z" : "ctrl+y",
          click: () => this.redo(),
        },

        { is: "spacer" },

        // Rich text menus
        {
          icon: "format_align_left",
          title: "Align left",
          active: this.isLeftAligned,
          disabled: !this.current_text_style,
          hotkey: this.isMacLike ? "shift+command+l" : "ctrl+shift+l",
          click: () => document.execCommand("justifyLeft"),
        },
        {
          icon: "format_align_center",
          title: "Align center",
          active: this.isCentered,
          disabled: !this.current_text_style,
          hotkey: this.isMacLike ? "shift+command+e" : "ctrl+shift+e",
          click: () => document.execCommand("justifyCenter"),
        },
        {
          icon: "format_align_right",
          title: "Align right",
          active: this.isRightAligned,
          disabled: !this.current_text_style,
          hotkey: this.isMacLike ? "shift+command+r" : "ctrl+shift+r",
          click: () => document.execCommand("justifyRight"),
        },
        {
          icon: "format_align_justify",
          title: "Justify content",
          active: this.isJustified,
          disabled: !this.current_text_style,
          hotkey: this.isMacLike ? "shift+command+j" : "ctrl+shift+j",
          click: () => document.execCommand("justifyFull"),
        },
        { is: "separator" },
        {
          icon: "format_bold",
          title: "Bold",
          active: this.isBold,
          disabled: !this.current_text_style,
          hotkey: this.isMacLike ? "command+b" : "ctrl+b",
          click: () => document.execCommand("bold"),
        },
        {
          icon: "format_italic",
          title: "Italic",
          active: this.isItalic,
          disabled: !this.current_text_style,
          hotkey: this.isMacLike ? "command+i" : "ctrl+i",
          click: () => document.execCommand("italic"),
        },
        {
          icon: "format_underline",
          title: "Underline",
          active: this.isUnderline,
          disabled: !this.current_text_style,
          hotkey: this.isMacLike ? "command+u" : "ctrl+u",
          click: () => document.execCommand("underline"),
        },
        {
          icon: "format_strikethrough",
          title: "Strike through",
          active: this.isStrikeThrough,
          disabled: !this.current_text_style,
          click: () => document.execCommand("strikethrough"),
        },
        {
          is: "button-color",
          type: "compact",
          menu_class: "align-center",
          disabled: !this.current_text_style,
          color: this.curColor,
          update_color: (new_color) =>
            document.execCommand("foreColor", false, new_color.hex8),
        },
        { is: "separator" },
        {
          icon: "format_list_numbered",
          title: "Numbered list",
          active: this.isNumberedList,
          disabled: !this.current_text_style,
          click: () => document.execCommand("insertOrderedList"),
        },
        {
          icon: "format_list_bulleted",
          title: "Bulleted list",
          active: this.isBulletedList,
          disabled: !this.current_text_style,
          click: () => document.execCommand("insertUnorderedList"),
        },
        {
          html: "<b>H1</b>",
          title: "Header 1",
          active: this.isH1,
          disabled: !this.current_text_style,
          click: () => document.execCommand("formatBlock", false, "<h1>"),
        },
        {
          html: "<b>H2</b>",
          title: "Header 2",
          active: this.isH2,
          disabled: !this.current_text_style,
          click: () => document.execCommand("formatBlock", false, "<h2>"),
        },
        {
          html: "<b>H3</b>",
          title: "Header 3",
          active: this.isH3,
          disabled: !this.current_text_style,
          click: () => document.execCommand("formatBlock", false, "<h3>"),
        },
        // {
        //   html:
        //     '<div class="ellipsis" style="width: 80px; font-size: 95%;">' +
        //     this.font +
        //     "</div>",
        //   title: "Font",
        //   chevron: true,
        //   menu: this.font_menu,
        //   menu_height: 200,
        // },
      ];
    },
    // Formats management
    current_format_name() {
      const format = this.formats.find(
        ([, width_mm, height_mm]) =>
          this.page_format_mm[0] == width_mm &&
          this.page_format_mm[1] == height_mm
      );
      return format
        ? format[0]
        : this.page_format_mm[0] + "mm x " + this.page_format_mm[1] + "mm";
    },
    formats: () => [
      ["A0", 841, 1189],
      ["A0L", 1189, 841],
      ["A1", 594, 841],
      ["A1L", 841, 594],
      ["A2", 420, 594],
      ["A2L", 594, 420],
      ["A3", 297, 420],
      ["A3L", 420, 297],
      ["A4", 210, 297],
      ["A4L", 297, 210],
      ["A5", 148, 210],
      ["A5L", 210, 148],
      ["A6", 105, 148],
      ["A6L", 148, 105],
    ],

    // Current text style management
    current_text_style() {
      return this.mounted ? this.$refs.editor.current_text_style : false;
    },
    isLeftAligned() {
      return ["start", "left", "-moz-left"].includes(
        this.current_text_style.textAlign
      );
    },
    isRightAligned() {
      return ["end", "right", "-moz-right"].includes(
        this.current_text_style.textAlign
      );
    },
    isCentered() {
      return ["center", "-moz-center"].includes(
        this.current_text_style.textAlign
      );
    },
    isJustified() {
      return ["justify", "justify-all"].includes(
        this.current_text_style.textAlign
      );
    },
    isBold() {
      const fontWeight = this.current_text_style.fontWeight;
      return (
        fontWeight &&
        (parseInt(fontWeight) > 400 || fontWeight.indexOf("bold") == 0)
      );
    },
    isItalic() {
      return this.current_text_style.fontStyle == "italic";
    },
    isUnderline() {
      // text-decoration is not overridden by children, so we query the parent stack
      const stack = this.current_text_style.textDecorationStack;
      return stack && stack.some((d) => d.indexOf("underline") == 0);
    },
    isStrikeThrough() {
      // text-decoration is not overridden by children, so we query the parent stack
      const stack = this.current_text_style.textDecorationStack;
      return stack && stack.some((d) => d.indexOf("line-through") == 0);
    },
    isNumberedList() {
      return (
        this.current_text_style.isList &&
        this.current_text_style.listStyleType == "decimal"
      );
    },
    isBulletedList() {
      return (
        this.current_text_style.isList &&
        ["disc", "circle"].includes(this.current_text_style.listStyleType)
      );
    },
    isH1() {
      return this.current_text_style.headerLevel == 1;
    },
    isH2() {
      return this.current_text_style.headerLevel == 2;
    },
    isH3() {
      return this.current_text_style.headerLevel == 3;
    },
    curColor() {
      return this.current_text_style.color || "transparent";
    },

    // Platform management
    isMacLike: () => /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform),
    font_menu() {
      return this.font_list.map((font) => {
        return {
          html:
            '<span class="ellipsis" style="font-family:' +
            font +
            '">' +
            font +
            "</span>",
          icon: this.theme != "default" && this.font == font ? "check" : false,
          active: this.font == font,
          height: 20,
          click: () => {
            document.execCommand("fontName", false, font);
            this.font = font;
          },
        };
      });
    },
    font_list: () => [
      "Arial",
      "Avenir",
      "Courier New",
      "Garamond",
      "Georgia",
      "Impact",
      "Helvetica",
      "Palatino",
      "Roboto",
      "Times New Roman",
      "Verdana",
    ],
    // Undo / redo flags
    can_undo() {
      return this.undo_count > 0;
    },
    can_redo() {
      return this.content_history.length - this.undo_count - 1 > 0;
    },
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  mounted() {
    this.mounted = true;
    this.data = this.$route.params.data;
    this.title = this.data[this.$route.params.mid].steps[
      this.$route.params.sid
    ].title;
    this.content =
      this.data[this.$route.params.mid].steps[this.$route.params.sid]
        .content === undefined ||
      this.data[this.$route.params.mid].steps[this.$route.params.sid]
        .content === ""
        ? [
            `<div style="display: flex; justify-content: space-between; align-items: center;"><img src='https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fincubator%2F1200px-IIT_Madras_Logo.svg.png?alt=media&token=ace33c8e-093d-48e8-9be7-7784ccff6ca1' alt='IITM' width='80' /><div></div><img src='https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fincubator%2Flogo.png?alt=media&token=0fc9695f-0d50-47f9-901c-1536c3acfa24' alt='Nirmaan' width="100"/></div>
        <div style='margin-top: 25px;'>Type contents here...</div>`,
          ]
        : this.data[this.$route.params.mid].steps[this.$route.params.sid]
            .content;
  },
  methods: {
    async save() {
      try {
        this.data[this.$route.params.mid].steps[
          this.$route.params.sid
        ].content = this.content;

        if (this.currentUser.role === "incubator")
          await deRef
            .doc(this.$store.state.incubator.currentIncubator.docId)
            .set({ items: this.data }, { merge: true });
        else
          await deResponsesRef
            .doc(this.currentUser.docId)
            .set({ items: this.data }, { merge: true });
        this.$toast.success("Saved", {
          position: "top",
        });
        this.$router.push("/de");
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
    video() {
      this.step = this.data[this.$route.params.mid].steps[
        this.$route.params.sid
      ];
      this.videoDialog = true;
    },
    async uploadVideo(video) {
      if (typeof video === "object")
        this.data[this.$route.params.mid].steps[
          this.$route.params.sid
        ].video = await uploadFile(video, "DE");
      else
        this.data[this.$route.params.mid].steps[this.$route.params.sid].video =
          video.name;

      try {
        await deRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .set({ items: this.data }, { merge: true });

        this.videoDialog = false;

        this.$toast.success("Video uploaded", {
          position: "top",
        });
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
    // Page overlays (headers, footers, page numbers)
    overlay(page, total) {
      // Add page numbers on each page
      let html =
        '<div style="position: absolute; bottom: 8mm; right: 10mm">Page ' +
        page +
        " of " +
        total +
        "</div>";

      // Add custom headers and footers from page 3
      if (page >= 2) {
        html += `<div style="display: flex; justify-content: space-between; align-items: center;"><img src='https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fincubator%2F1200px-IIT_Madras_Logo.svg.png?alt=media&token=ace33c8e-093d-48e8-9be7-7784ccff6ca1' alt='IITM' width='80' /><img src='https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fincubator%2Flogo.png?alt=media&token=0fc9695f-0d50-47f9-901c-1536c3acfa24' alt='Nirmaan' width="100"/></div>`;
      }
      return html;
    },
    undo() {
      if (this.can_undo) {
        this._mute_next_content_watcher = true;
        this.content = this.content_history[--this.undo_count];
      }
    },
    redo() {
      if (this.can_redo) {
        this._mute_next_content_watcher = true;
        this.content = this.content_history[++this.undo_count];
      }
    },
    resetContentHistory() {
      this.content_history = [];
      this.undo_count = -1;
    },
    async insertPageBreak() {
      // insert paragraph at caret position
      document.execCommand("insertParagraph");

      // insert a marker at caret position (start of the new paragraph)
      const marker = "###PB###"; // must be regex compatible
      document.execCommand("insertText", false, marker);

      // wait for DOM update
      await this.$nextTick();

      // find the marker inside content items and split this content item in two items between the two paragraphs
      // only match root tags (p, div, h1, h2...) to avoid non-root tags like <li>
      const regexp = new RegExp("<(p|div|h\\d)( [^/>]+)*>(<[^/>]+>)*" + marker);
      for (let i = 0; i < this.content.length; i++) {
        const item = this.content[i];
        if (typeof item != "string") continue;
        const match = regexp.exec(item);
        if (match) {
          const tags_open = match[0].slice(0, -marker.length);
          let content_plus_tags_close = item.substr(
            match.index + match[0].length
          );
          // insert <br> to empty pages that would not be handled correctly by contenteditable
          if (content_plus_tags_close.indexOf("</") == 0)
            content_plus_tags_close = "<br>" + content_plus_tags_close;
          this.content.splice(
            i,
            1,
            item.substr(0, match.index),
            tags_open + content_plus_tags_close
          );
          return;
        }
      }

      // if the code didn't return before, the split didn't work (e.g. inside a <li>). just remove the marker from the content
      for (let i = 0; i < this.content.length; i++) {
        const item = this.content[i];
        if (typeof item != "string" || item.indexOf(marker) < 0) continue;
        this.content.splice(i, 1, item.replace(marker, ""));
        break;
      }
    },
  },
  watch: {
    content: {
      immediate: true,
      // Fill undo / redo history stack on user input
      handler(new_content) {
        if (!this._mute_next_content_watcher) {
          // only update the stack when content is changed by user input, not undo/redo commands
          this.content_history[++this.undo_count] = new_content;
          this.content_history.length = this.undo_count + 1; // remove all redo items
        }
        this._mute_next_content_watcher = false;
      },
    },
  },
};
</script>

<style scoped>
h2 {
  color: #3aa959;
}

.medias > div {
  text-align: center;
  cursor: pointer;
  /* border: 1px solid #ccc; */
}

>>> .v-icon {
  /* color: #dfdddd !important; */
}

h5 {
  color: #3aa959;
}

.floating__btn {
  bottom: 0;
  position: fixed;
  margin: 1em;
  z-index: 998;
}
</style>