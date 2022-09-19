<template>
  <v-dialog persistent max-width="500" v-model="show">
    <v-card>
      <v-card-text>
        <div class="flip-book" id="example">
          <div class="page page-cover page-cover-top" data-density="hard">
            <div class="page-content">
              <h2>BOOK TITLE</h2>
            </div>
          </div>
          <div class="page">
            <div class="page-content">
              <h2 class="page-header">Page Header 1</h2>
              <div
                class="page-image"
                style="background-image: url(1.jpg)"
              ></div>
              <div class="page-text">Page Content 1</div>
              <div class="page-footer">2</div>
            </div>
          </div>
          <div class="page">
            <div class="page-content">
              <h2 class="page-header">Page Header 2</h2>
              <div
                class="page-image"
                style="background-image: url(2.jpg)"
              ></div>
              <div class="page-text">Page Content 2</div>
              <div class="page-footer">3</div>
            </div>
          </div>
          ... more pages here ...
          <div class="page page-cover page-cover-bottom" data-density="hard">
            <div class="page-content">
              <h2>THE END</h2>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { PageFlip } from "page-flip";

export default {
  name: "Book",
  props: ["visible"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.$emit("close");
      },
    },
  },
  data() {
    return {
      pageFlip: "",
    };
  },
  mounted() {
    this.pageFlip = new PageFlip(document.getElementById("example"), {
      // start page index
      startPage: 0,
    //   size: SizeType.FIXED,

      // width & height *(REQUIRED)
      width: 0,
      height: 0,

      // min/max width & height
      minWidth: 0,
      maxWidth: 0,
      minHeight: 0,
      maxHeight: 0,

      // draw book shadows
      drawShadow: true,

      // animation speed
      flippingTime: 1000,

      // allows to switch to portrait mode
      usePortrait: true,

      // z-index property
      startZIndex: 0,

      // auto resizes the parent container to fit the book
      autoSize: true,

      // max opacity of shadow
      maxShadowOpacity: 1,

      // shows book cover
      showCover: false,

      // supports mobile scroll?
      mobileScrollSupport: true,
    });
    this.pageFlip.loadFromHTML(document.querySelectorAll(".page"));
  },
  methods: {},
};
</script>

<style scoped>
</style>