<template>
  <v-container>
    <div class="wrapper">
      <div :class="`tool__bar pa-2 ${isSticky ? 'sticky' : ''}`">
        <div class="col__1">
          <h2 class="mb-2">
            <v-icon class="mr-2" size="28">mdi-text-box-multiple</v-icon
            >{{ title }}
          </h2>
          <v-divider></v-divider>
          <div class="tools mt-2">
            <router-link to="/de">
              <btn color="traktor" class="mr-1 back__btn"
                ><v-icon>mdi-arrow-left</v-icon> Back</btn
              >
            </router-link>
            <v-btn
              color="traktor"
              dark
              @click="save()"
              v-if="
                (currentUser.role === 'incubator' && !strRes) ||
                currentUser.role === 'startup'
              "
              style="mr-5"
              >Save</v-btn
            >
            <v-btn
              color="traktor"
              dark
              @click="submit()"
              v-if="currentUser.role === 'startup'"
              :disabled="
                data[$route.params.mid].steps[$route.params.sid].completed
              "
              >Submit</v-btn
            >
            <v-col
              cols="12"
              md="5"
              v-if="currentUser.role === 'incubator' && strRes"
            >
              <v-select
                outlined
                label="Approve/Suggest"
                :items="adminActions"
                dense
                @change="handleAdminAction"
              ></v-select>
            </v-col>
            <v-btn
              @click="newWorksheet()"
              color="traktor"
              dark
              class="ml-2"
              v-if="currentUser.role === 'incubator' && !strRes"
              ><v-icon>mdi-file-plus-outline</v-icon>New worksheet</v-btn
            >
            <!-- <div class="font">
              <v-autocomplete
                :items="fonts"
                item-text="key"
                v-model="editorStyle.fontFamily"
                dense
              ></v-autocomplete>
            </div> -->
            <!-- <div class="font__size">
              <v-btn class="mr-2" small text @click="decrementFont()">-</v-btn>
              <input type="text" v-model="fontSize" />
              <v-btn class="ml-2" small text @click="incrementFont()">+</v-btn>
            </div> -->
            <!-- <div>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="color"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on"
                    ><v-icon>mdi-format-color-fill</v-icon></v-btn
                  >
                </template>
                <v-color-picker
                  dot-size="25"
                  mode="rgba"
                  show-swatches
                  hide-canvas
                  hide-inputs
                  hide-mode-switch
                  hide-sliders
                  swatches-max-height="200"
                  v-model="color"
                  @input="pickColor"
                ></v-color-picker>
              </v-menu>
            </div> -->
            <!-- <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" @click="bold()"
                    ><v-icon>mdi-format-bold</v-icon></v-btn
                  >
                </template>
                <span>Bold</span>
              </v-tooltip>
            </div> -->

            <div
              v-if="currentUser.role === 'incubator' && !strRes"
              class="d-flex qtn__tools"
            >
              <div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="addType('single')"
                      ><v-icon>mdi-format-text</v-icon></v-btn
                    >
                  </template>
                  <span>Single line question</span>
                </v-tooltip>
              </div>
              <div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="addType('multiline')"
                      ><v-icon>mdi-text</v-icon></v-btn
                    >
                  </template>
                  <span>Multi line question</span>
                </v-tooltip>
              </div>
              <div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="addType('bullet')"
                      ><v-icon>mdi-format-list-numbered</v-icon></v-btn
                    >
                  </template>
                  <span>Bullet points question</span>
                </v-tooltip>
              </div>
              <div>
                <v-btn icon v-bind="attrs" v-on="on" @click="addType('table')"
                  ><v-icon>mdi-table</v-icon></v-btn
                >
              </div>
              <div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="addType('file')"
                      ><v-icon>mdi-file-upload</v-icon></v-btn
                    >
                  </template>
                  <span>File upload question</span>
                </v-tooltip>
              </div>
            </div>

            <!-- <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" @click="undo()"
                    ><v-icon>mdi-undo</v-icon></v-btn
                  >
                </template>
                <span>Undo</span>
              </v-tooltip>
            </div>
            <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" @click="redo()"
                    ><v-icon>mdi-redo</v-icon></v-btn
                  >
                </template>
                <span>Redo</span>
              </v-tooltip>
            </div> -->
          </div>
        </div>
        <div class="options mt-2">
          <v-divider vertical></v-divider>
          <div @click="video()">
            <v-icon size="38">mdi-youtube-tv</v-icon>
            <h5>Watch Video</h5>
          </div>
          <v-divider vertical></v-divider>
          <div @click="ppt()">
            <v-icon size="38">mdi-image</v-icon>
            <h5>View Presentation</h5>
          </div>
          <v-divider vertical></v-divider>
          <div
            @click="chat()"
            v-if="
              (currentUser.role === 'incubator' && strRes) ||
              currentUser.role === 'startup' ||
              currentUser.role === 'mentor'
            "
          >
            <v-icon size="38">mdi-comment-edit</v-icon>
            <h5>Chat</h5>
          </div>
        </div>
      </div>
      <page
        size="A4"
        class="mt-5 page"
        v-for="(page, pIndex) in data[$route.params.mid].steps[
          $route.params.sid
        ].content"
        :key="pIndex"
        :style="editorStyle"
      >
        <div class="editor pa-2" ref="editor">
          <div class="header mb-2">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fincubator%2F1200px-IIT_Madras_Logo.svg.png?alt=media&token=ace33c8e-093d-48e8-9be7-7784ccff6ca1"
              alt="IITM"
              width="60"
            />
            <input
              type="text"
              placeholder="Worksheet title"
              v-model="page.title"
              :readonly="
                currentUser.role === 'startup' ||
                (currentUser.role === 'incubator' && strRes)
              "
              @select="setSelect('title', pIndex)"
              :style="page.style"
              class="page__title"
            />
            <img
              src="https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fincubator%2Flogo.png?alt=media&token=0fc9695f-0d50-47f9-901c-1536c3acfa24"
              alt="Nirmaan"
              width="80"
            />
          </div>
          <v-divider></v-divider>
          <draggable v-model="page.body" group="questions">
            <div
              class="body mt-5 px-2"
              v-for="(field, index) in page.body"
              :key="index"
            >
              <div class="type" v-if="field.type === 'single'">
                <textarea
                  placeholder="Type your question here"
                  v-model="field.question"
                  :readonly="
                    currentUser.role === 'startup' ||
                    (currentUser.role === 'incubator' && strRes)
                  "
                  @select="setSelect('question', pIndex, index)"
                  :style="field.style"
                  class="question"
                  @input="mixin_autoResize_resize"
                ></textarea>
                <div class="qtn__delete">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="red"
                        icon
                        class="qtn__delete"
                        v-bind="attrs"
                        v-on="on"
                        @click="deleteQuestion(pIndex, index)"
                        v-if="currentUser.role === 'incubator' && !strRes"
                        ><v-icon>mdi-delete</v-icon></v-btn
                      >
                    </template>
                    <span>Delete question</span>
                  </v-tooltip>
                </div>

                <textarea
                  placeholder="Write your answer here"
                  class="mt-2"
                  v-model="field.answer"
                  @input="mixin_autoResize_resize"
                  :readonly="currentUser.role === 'incubator' && strRes"
                ></textarea>
              </div>
              <div class="type" v-if="field.type === 'multiline'">
                <textarea
                  placeholder="Type your question here"
                  v-model="field.question"
                  :readonly="
                    currentUser.role === 'startup' ||
                    (currentUser.role === 'incubator' && strRes)
                  "
                  @select="setSelect('question', pIndex, index)"
                  :style="field.style"
                  class="question"
                  @input="mixin_autoResize_resize"
                ></textarea>
                <div class="qtn__delete">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="red"
                        icon
                        class="qtn__delete"
                        v-bind="attrs"
                        v-on="on"
                        @click="deleteQuestion(pIndex, index)"
                        v-if="currentUser.role === 'incubator' && !strRes"
                        ><v-icon>mdi-delete</v-icon></v-btn
                      >
                    </template>
                    <span>Delete question</span>
                  </v-tooltip>
                </div>
                <textarea
                  placeholder="Write your answer here"
                  rows="3"
                  class="mt-2"
                  v-model="field.answer"
                  @input="mixin_autoResize_resize"
                  :readonly="currentUser.role === 'incubator' && strRes"
                ></textarea>
              </div>
              <div class="type" v-if="field.type === 'bullet'">
                <textarea
                  placeholder="Type your question here"
                  v-model="field.question"
                  rows="3"
                  :readonly="
                    currentUser.role === 'startup' ||
                    (currentUser.role === 'incubator' && strRes)
                  "
                  @select="setSelect('question', pIndex, index)"
                  :style="field.style"
                  class="question"
                  @input="mixin_autoResize_resize"
                ></textarea>
                <div class="qtn__delete">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="red"
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="deleteQuestion(pIndex, index)"
                        v-if="currentUser.role === 'incubator' && !strRes"
                        ><v-icon>mdi-delete</v-icon></v-btn
                      >
                    </template>
                    <span>Delete question</span>
                  </v-tooltip>
                </div>
                <ol>
                  <li v-for="(option, oIdx) in field.options" :key="oIdx">
                    <textarea
                      type="text"
                      rows="1"
                      placeholder="Type your answer here"
                      v-model="option.title"
                      @input="mixin_autoResize_resize"
                      ref="tableTextArea"
                      :readonly="currentUser.role === 'incubator' && strRes"
                    ></textarea>
                    <v-btn
                      icon
                      color="red"
                      @click="deleteOption(pIndex, index, oIdx)"
                      v-if="field.options.length > 1"
                      v-show="
                        (currentUser.role === 'incubator' && !strRes) ||
                        currentUser.role === 'startup'
                      "
                      ><v-icon>mdi-delete</v-icon></v-btn
                    >
                    <v-btn
                      icon
                      color="traktor"
                      @click="addNewOption(pIndex, index)"
                      v-if="oIdx === field.options.length - 1"
                      v-show="
                        (currentUser.role === 'incubator' && !strRes) ||
                        currentUser.role === 'startup'
                      "
                      ><v-icon>mdi-plus-circle</v-icon></v-btn
                    >
                  </li>
                </ol>
              </div>
              <div class="type" v-if="field.type === 'table'">
                <textarea
                  type="text"
                  placeholder="Type your question here"
                  class="tbl__textarea question"
                  :readonly="
                    currentUser.role === 'startup' ||
                    (currentUser.role === 'incubator' && strRes)
                  "
                  @select="setSelect('question', pIndex, index)"
                  :style="field.style"
                  v-model="field.question"
                  ref="tableTextArea"
                  @input="mixin_autoResize_resize"
                ></textarea>
                <div class="tbl__actions">
                  <div class="rows__and__cols">
                    <span v-if="currentUser.role === 'incubator' && !strRes"
                      >Rows</span
                    >
                    <input
                      type="text"
                      v-model="field.rowDetails.length"
                      min="2"
                      readonly
                      v-if="currentUser.role === 'incubator' && !strRes"
                    />
                    <div
                      class="d-block tbl__rc_actions"
                      v-if="currentUser.role === 'incubator' && !strRes"
                    >
                      <v-btn
                        icon
                        color="traktor"
                        @click="addNewRow(pIndex, index)"
                        ><v-icon>mdi-chevron-up</v-icon></v-btn
                      >
                      <v-btn icon color="traktor" @click="popRow(pIndex, index)"
                        ><v-icon>mdi-chevron-down</v-icon></v-btn
                      >
                    </div>
                    <span v-if="currentUser.role === 'incubator' && !strRes"
                      >Columns</span
                    >
                    <input
                      type="text"
                      min="2"
                      v-model="field.columnDetails.length"
                      v-if="currentUser.role === 'incubator' && !strRes"
                      readonly
                    />
                    <div
                      class="d-block tbl__rc_actions"
                      v-if="currentUser.role === 'incubator' && !strRes"
                    >
                      <v-btn
                        icon
                        color="traktor"
                        @click="addNewColumn(pIndex, index)"
                        ><v-icon>mdi-chevron-up</v-icon></v-btn
                      >
                      <v-btn
                        icon
                        color="traktor"
                        @click="popColumn(pIndex, index)"
                        ><v-icon>mdi-chevron-down</v-icon></v-btn
                      >
                    </div>
                  </div>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="red"
                        icon
                        class="qtn__delete"
                        v-bind="attrs"
                        v-on="on"
                        @click="deleteQuestion(pIndex, index)"
                        v-if="currentUser.role === 'incubator' && !strRes"
                        ><v-icon>mdi-delete</v-icon></v-btn
                      >
                    </template>
                    <span>Delete question</span>
                  </v-tooltip>
                </div>
                <div class="editor__table">
                  <table>
                    <tr>
                      <th
                        v-for="(heading, hIdx) in field.columnDetails"
                        :key="hIdx"
                      >
                        <textarea
                          type="text"
                          placeholder="Column heading"
                          v-model="heading[`heading${hIdx + 1}`]"
                          @input="mixin_autoResize_resize"
                          ref="tableTextArea"
                          rows="1"
                          :readonly="
                            currentUser.role === 'startup' ||
                            (currentUser.role === 'incubator' && strRes)
                          "
                        ></textarea>
                      </th>
                    </tr>
                    <tr v-for="(row, rIdx) in field.rowDetails" :key="rIdx">
                      <td
                        v-for="(col, cIdx) in field.columnDetails"
                        :key="cIdx"
                      >
                        <textarea
                          type="text"
                          placeholder="Type your answer here"
                          v-model="row[`heading${cIdx + 1}`]"
                          @input="mixin_autoResize_resize"
                          ref="tableTextArea"
                          :readonly="currentUser.role === 'incubator' && strRes"
                        ></textarea>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              <div class="type" v-if="field.type === 'file'">
                <textarea
                  type="text"
                  placeholder="Type your question here"
                  v-model="field.question"
                  :readonly="
                    currentUser.role === 'startup' ||
                    (currentUser.role === 'incubator' && strRes)
                  "
                  @select="setSelect('question', pIndex, index)"
                  :style="field.style"
                  class="question"
                ></textarea>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="red"
                      icon
                      class="qtn__delete"
                      v-bind="attrs"
                      v-on="on"
                      @click="deleteQuestion(pIndex, index)"
                      v-if="currentUser.role === 'incubator' && !strRes"
                      ><v-icon>mdi-delete</v-icon></v-btn
                    >
                  </template>
                  <span>Delete question</span>
                </v-tooltip>
                <v-file-input
                  outlined
                  label="Choose file"
                  dense
                  v-model="field.answer"
                  @change="handleFileUpload(pIndex, index)"
                  :readonly="
                    currentUser.role === 'startup' ||
                    (currentUser.role === 'incubator' && strRes)
                  "
                ></v-file-input>
                <a
                  :href="field.answer"
                  target="_blank"
                  class="ml-10"
                  v-if="
                    (currentUser.role === 'incubator' &&
                      strRes &&
                      field.answer !== '') ||
                    (currentUser.role === 'startup' &&
                      typeof field.answer !== 'object' &&
                      field.answer !== '')
                  "
                  >view file <v-icon>mdi-link</v-icon></a
                >
              </div>
            </div>
          </draggable>
          <div class="footer"></div>
        </div>
        <div
          class="delete-worksheet__btn"
          v-if="currentUser.role === 'incubator' && !strRes"
        >
          <!-- <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click="deleteWorksheet(pIndex)"
                icon
                color="red"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Delete worksheet</span>
          </v-tooltip> -->
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="newWorksheetBefore(pIndex)">
                <v-list-item-title> New worksheet before</v-list-item-title>
              </v-list-item>
              <v-list-item @click="newWorksheetAfter(pIndex)">
                <v-list-item-title> New worksheet after</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="deleteWorksheet(pIndex)"
                v-if="
                  currentUser.role === 'incubator' &&
                  !strRes &&
                  data[$route.params.mid].steps[$route.params.sid].content
                    .length > 1
                "
              >
                <v-list-item-title> Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </page>
      <Video
        :visible="videoDialog"
        :step="step"
        @close="videoDialog = false"
        :uploading="false"
        @uploadVideo="uploadVideo"
        @delete="_deleteVideo"
        :strRes="strRes"
      ></Video>
      <PPT
        :visible="pptDialog"
        :step="step"
        @close="pptDialog = false"
        :uploading="false"
        @uploadPpt="uploadPpt"
        @delete="_deletePPT"
        :strRes="strRes"
      ></PPT>
      <chat
        :visible="chatDialog"
        :questions="questions"
        @close="chatDialog = false"
      ></chat>
      <suggest-changes
        :visible="suggestDialog"
        @close="suggestDialog = false"
      ></suggest-changes>
    </div>
  </v-container>
</template>

<script>
import Video from "../../Modals/DE/Video.vue";
import { uploadFile, uploadFileWithName } from "../../../_helpers/FileUpload";
import {
  activityRef,
  deApprovalsRef,
  deRef,
  deResponsesRef,
  startupsRef,
} from "../../../config/firebase_services";
import { mapState } from "vuex";
import draggable from "vuedraggable";
import Swal from "sweetalert2";
import PPT from "../../Modals/DE/PPT.vue";
import Chat from "../../Modals/DE/Chat.vue";
import mixinAutoResize from "../../../mixins/autoResize.js";
import SuggestChanges from "../../Modals/DE/SuggestChanges.vue";

export default {
  name: "DEWorksheet",
  components: { Video, draggable, PPT, Chat, SuggestChanges },
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  mixins: [mixinAutoResize],
  data() {
    return {
      adminActions: ["Approve", "Suggest Changes"],
      step: "",
      videoDialog: false,
      pptDialog: false,
      helpDialog: false,
      askDialog: false,
      chatDialog: false,
      suggestDialog: false,
      questions: [],
      title: "",
      font: "Arial",
      fonts: [
        {
          key: "Open sans",
          value: "Open sans",
        },
      ],
      fontSize: "12px",
      data: [],
      activeIndex: 0,
      editorStyle: {
        fontFamily: "Open sans",
      },
      selected: {},
      isSticky: false,
      validTags: ["INPUT", "TEXTAREA"],
      history: [],
      currentVersion: 0,
      strRes: false,
      color: "#3aa959",
    };
  },
  mounted() {
    this.strRes = localStorage.getItem("strRes");
    this.data = this.$route.params.data;
    this.title =
      this.data[this.$route.params.mid].steps[this.$route.params.sid].title;
    this.data[this.$route.params.mid].steps[this.$route.params.sid].content ===
    undefined
      ? (this.data[this.$route.params.mid].steps[
          this.$route.params.sid
        ].content = [{ title: "", body: [] }])
      : null;
    this.activeIndex =
      this.data[this.$route.params.mid].steps[this.$route.params.sid].content
        .length - 1;
    this.history[0] = this.data;
    this.autoResizeTextAreas();
    addEventListener("scroll", this.handleScroll);
    addEventListener("keyup", this.handleKeyEvents);
  },
  beforeDestroy() {
    removeEventListener("scroll", this.handleScroll);
    removeEventListener("keyup", this.handleKeyEvents);
  },
  // beforeRouteLeave(to, from, next) {
  //   this.save();
  //   next();
  // },
  methods: {
    // canRender(pIndex) {
    //   this.$nextTick(() => {
    //     return true;
    //   });
    // },
    autoResizeTextAreas() {
      this.$nextTick(() => {
        this.$refs.tableTextArea.forEach((ref) => {
          return (ref.style.height = ref.scrollHeight + "px");
        });
      });
    },
    updateHistory() {
      this.history.push(this.data);
      this.currentVersion++;
      this.$forceUpdate();
    },
    handleKeyEvents(e) {
      if (e.ctrlKey && e.code === "KeyB") {
        this.bold();
      }

      // if (e.ctrlKey && e.code === "KeyZ") {
      //   this.undo();
      // }

      // if (e.ctrlKey && e.code === "KeyY") {
      //   e.preventDefault();
      //   this.redo();
      // }
    },
    undo() {
      if (this.currentVersion !== 0) {
        this.data = [];
        // this.currentVersion--;
        // this.data = this.history[this.currentVersion];
        this.$forceUpdate();
      }
    },
    redo() {
      if (this.currentVersion !== this.history.length) {
        this.currentVersion++;
        this.data = this.history[this.currentVersion];
        this.$forceUpdate();
      }
    },
    async handleFileUpload(pIndex, index) {
      this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
        pIndex
      ].body[index].answer = await uploadFileWithName(
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          pIndex
        ].body[index].answer,
        "DE"
      );
    },
    handleScroll() {
      const scrollPosition = window.scrollY;
      scrollPosition > 60 ? (this.isSticky = true) : (this.isSticky = false);
    },
    addType(type) {
      if (this.$refs.editor[this.activeIndex].clientHeight > 1000)
        this.newWorksheet();
      if (type === "single") {
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          this.activeIndex
        ].body.push({
          type: "single",
          question: "",
          answer: "",
          createdAt: new Date(),
          completed: false,
          style: {},
        });
      }

      if (type === "multiline") {
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          this.activeIndex
        ].body.push({
          type: "multiline",
          question: "",
          answer: "",
          createdAt: new Date(),
          completed: false,
          style: {},
        });
      }

      if (type === "bullet") {
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          this.activeIndex
        ].body.push({
          type: "bullet",
          question: "",
          options: [{ title: "" }],
          createdAt: new Date(),
          completed: false,
          style: {},
        });
      }

      if (type === "table") {
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          this.activeIndex
        ].body.push({
          type: "table",
          question: "",
          columnDetails: [{ heading1: "" }, { heading2: "" }, { heading: "" }],
          rowDetails: [
            {
              heading1: "",
              heading2: "",
              heading3: "",
            },
            {
              heading1: "",
              heading2: "",
              heading3: "",
            },
            {
              heading1: "",
              heading2: "",
              heading3: "",
            },
          ],
          createdAt: new Date(),
          completed: false,
          style: {},
        });
      }

      if (type === "file") {
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          this.activeIndex
        ].body.push({
          type: "file",
          question: "",
          answer: "",
          createdAt: new Date(),
          completed: false,
          style: {},
        });
      }

      this.$forceUpdate();
      this.updateHistory();
    },
    setSelect(type = "", pIndex = "", qIndex = 0) {
      const selectedNodes = window.getSelection().anchorNode.childNodes;
      Array.from(selectedNodes).forEach((el) => {
        if (this.validTags.includes(el.nodeName)) {
          this.fontSize = window.getComputedStyle(el).fontSize;
        }
      });

      this.selected = {
        type: type,
        pIndex: pIndex,
        qIndex: qIndex,
      };
    },
    bold() {
      if (this.selected.type === "title") {
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          this.selected.pIndex
        ].style = {
          ...this.data[this.$route.params.mid].steps[this.$route.params.sid]
            .content[this.selected.pIndex].style,
          fontWeight: "bold",
        };
      }

      if (this.selected.type === "question") {
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          this.selected.pIndex
        ].body[this.selected.qIndex].style = {
          ...this.data[this.$route.params.mid].steps[this.$route.params.sid]
            .content[this.selected.pIndex].body[this.selected.qIndex].style,
          fontWeight: "bold",
        };
      }
      this.$forceUpdate();
      this.updateHistory();
    },
    incrementFont() {
      this.fontSize = parseInt(this.fontSize.replace(/[^0-9]/g, ""));
      this.fontSize++;
      this.fontSize = this.fontSize + "px";
      if (this.selected.type === "title") {
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          this.selected.pIndex
        ].style = {
          ...this.data[this.$route.params.mid].steps[this.$route.params.sid]
            .content[this.selected.pIndex].style,
          fontSize: this.fontSize,
        };
      }

      if (this.selected.type === "question") {
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          this.selected.pIndex
        ].body[this.selected.qIndex].style = {
          ...this.data[this.$route.params.mid].steps[this.$route.params.sid]
            .content[this.selected.pIndex].body[this.selected.qIndex].style,
          fontSize: this.fontSize,
        };
      }
      this.$forceUpdate();
      this.updateHistory();
    },
    decrementFont() {
      this.fontSize = parseInt(this.fontSize.replace(/[^0-9]/g, ""));
      this.fontSize--;
      this.fontSize = this.fontSize + "px";
      if (this.selected.type === "title") {
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          this.selected.pIndex
        ].style = {
          ...this.data[this.$route.params.mid].steps[this.$route.params.sid]
            .content[this.selected.pIndex].style,
          fontSize: this.fontSize,
        };
      }

      if (this.selected.type === "question") {
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          this.selected.pIndex
        ].body[this.selected.qIndex].style = {
          ...this.data[this.$route.params.mid].steps[this.$route.params.sid]
            .content[this.selected.pIndex].body[this.selected.qIndex].style,
          fontSize: this.fontSize,
        };
      }
      this.$forceUpdate();
      this.updateHistory();
    },
    pickColor(color) {
      if (this.selected.type === "title") {
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          this.selected.pIndex
        ].style = {
          ...this.data[this.$route.params.mid].steps[this.$route.params.sid]
            .content[this.selected.pIndex].style,
          color: color.hex,
        };
      }

      if (this.selected.type === "question") {
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          this.selected.pIndex
        ].body[this.selected.qIndex].style = {
          ...this.data[this.$route.params.mid].steps[this.$route.params.sid]
            .content[this.selected.pIndex].body[this.selected.qIndex].style,
          color: color.hex,
        };
      }
      this.$forceUpdate();
      this.updateHistory();
    },
    addNewOption(pIndex, index) {
      this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
        pIndex
      ].body[index].options.push({ title: "" });
      this.$forceUpdate();
      this.updateHistory();
    },
    deleteOption(pIndex, index, oIdx) {
      this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
        pIndex
      ].body[index].options.splice(oIdx, 1);
      this.$forceUpdate();
      this.updateHistory();
    },
    deleteQuestion(pIndex, index) {
      this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
        pIndex
      ].body.splice(index, 1);
      this.$forceUpdate();
      this.updateHistory();
    },
    addNewColumn(pIndex, index) {
      this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
        pIndex
      ].body[index].columnDetails.push({ title: "" });
      let rowDetails =
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          pIndex
        ].body[index].rowDetails;
      const len =
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          pIndex
        ].body[index].columnDetails.length;
      rowDetails.forEach((row) => {
        row[`heading${len}`] = "";
      });
      this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
        pIndex
      ].body[index].rowDetails = rowDetails;
      this.$forceUpdate();
      this.updateHistory();
    },
    popColumn(pIndex, index) {
      this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
        pIndex
      ].body[index].columnDetails.splice(
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          pIndex
        ].body[index].columnDetails.length - 1,
        1
      );

      this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
        pIndex
      ].body[index].rowDetails.forEach((row) => {
        let keys = Object.keys(row);
        return delete row[keys[keys.length - 1]];
      });
      this.$forceUpdate();
      this.updateHistory();
    },
    addNewRow(pIndex, index) {
      let columnDetails =
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          pIndex
        ].body[index].columnDetails;
      let row = {};
      for (let i = 0; i < columnDetails.length; i++) {
        row[`heading${i + 1}`] = "";
      }
      this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
        pIndex
      ].body[index].rowDetails.push(row);
      this.$forceUpdate();
      this.updateHistory();
    },
    popRow(pIndex, index) {
      this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
        pIndex
      ].body[index].rowDetails.splice(
        this.data[this.$route.params.mid].steps[this.$route.params.sid].content[
          pIndex
        ].body[index].rowDetails.length - 1,
        1
      );
      this.$forceUpdate();
      this.updateHistory();
    },
    newWorksheet() {
      this.data[this.$route.params.mid].steps[
        this.$route.params.sid
      ].content.push({ title: "", body: [] });
      this.activeIndex = this.activeIndex + 1;
      this.$forceUpdate();
      this.updateHistory();
    },
    newWorksheetBefore(index) {
      this.data[this.$route.params.mid].steps[
        this.$route.params.sid
      ].content.splice(index, 0, { title: "", body: [] });
      this.activeIndex = index;
      this.$forceUpdate();
    },
    newWorksheetAfter(index) {
      this.data[this.$route.params.mid].steps[
        this.$route.params.sid
      ].content.splice(index + 1, 0, { title: "", body: [] });
      this.activeIndex = index;
      this.$forceUpdate();
    },
    async save() {
      try {
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
        // this.$router.push("/de");
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
    async submit() {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3aa959",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          let prevStep =
            this.data[this.$route.params.mid].steps[this.$route.params.sid]
              .title;

          const activity = {
            incubatorId: this.currentUser.incubatorId,
            photoURL: this.currentUser.photoURL,
            statement: `Startup ${this.currentUser.name} has submitted ${prevStep}.`,
            createdAt: new Date(),
            type: "startup",
            notification: true,
            read: false,
          };

          const approvalData = {
            incubatorId: this.currentUser.incubatorId,
            photoURL: this.currentUser.photoURL,
            statement: `Startup ${this.currentUser.name} has submitted ${prevStep}.`,
            createdAt: new Date(),
            startup: {
              id: this.currentUser.docId,
              name: this.currentUser.name,
              email: this.currentUser.email,
            },
            mid: this.$route.params.mid,
            sid: this.$route.params.sid,
            isApproved: false,
            approvedAt: null,
            approvedBy: {
              type: null,
              name: "",
              id: "",
            },
          };

          try {
            await deResponsesRef
              .doc(this.currentUser.docId)
              .set({ items: this.data }, { merge: true });
            await activityRef.add(activity);
            await deApprovalsRef.add(approvalData);
            this.$toast.success(
              "Submitted. Next step will be unlocked once admin review is approved.",
              {
                position: "top",
              }
            );
            this.$router.push("/de");
          } catch (error) {
            this.$toast.error(error, {
              position: "top",
            });
          }
        }
      });
    },
    video() {
      this.step =
        this.data[this.$route.params.mid].steps[this.$route.params.sid];
      this.videoDialog = true;
    },
    ppt() {
      this.step =
        this.data[this.$route.params.mid].steps[this.$route.params.sid];
      this.pptDialog = true;
    },
    truncateQuestion(maxLength = 50, question) {
      return question.length <= maxLength
        ? question
        : question.substring(0, maxLength) + "...";
    },
    ask() {
      const data = this.data[this.$route.params.mid];
      let questions = [];
      data.steps[this.$route.params.sid].content.forEach((cnt) => {
        let qtns = cnt.body.map((ct) => this.truncateQuestion(50, ct.question));
        questions = [...questions, ...qtns];
      });
      this.askData = {
        stage: data.title,
        step: data.steps[this.$route.params.sid].title,
        questions: questions,
      };
      this.askDialog = true;
    },
    chat() {
      let questions = [];
      const data = this.data[this.$route.params.mid];
      data.steps[this.$route.params.sid].content.forEach((cnt) => {
        let qtns = cnt.body.map((ct) => this.truncateQuestion(50, ct.question));
        questions = [...questions, ...qtns];
      });
      this.chatDialog = true;
      this.questions = questions;
    },
    async uploadVideo(video) {
      if (typeof video === "object")
        this.data[this.$route.params.mid].steps[this.$route.params.sid].video =
          await uploadFile(video, "DE");
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
    async uploadPpt(ppt) {
      if (typeof ppt === "object")
        this.data[this.$route.params.mid].steps[this.$route.params.sid].ppt =
          await uploadFileWithName(ppt, "DE");

      try {
        await deRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .set({ items: this.data }, { merge: true });

        this.pptDialog = false;

        this.$toast.success("Ppt uploaded", {
          position: "top",
        });
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
    async _deletePPT() {
      this.data[this.$route.params.mid].steps[this.$route.params.sid].ppt = "";
      try {
        await deRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .set({ items: this.data }, { merge: true });

        this.pptDialog = false;

        this.$toast.success("Ppt deleted", {
          position: "top",
        });
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
    async _deleteVideo() {
      this.data[this.$route.params.mid].steps[this.$route.params.sid].video =
        "";
      try {
        await deRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .set({ items: this.data }, { merge: true });

        this.pptDialog = false;

        this.$toast.success("Video deleted", {
          position: "top",
        });
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
    async deleteWorksheet(index) {
      try {
        this.data[this.$route.params.mid].steps[
          this.$route.params.sid
        ].content.splice(index, 1);
        this.activeIndex = this.activeIndex - 1;
        this.$toast.success("Deleted", {
          position: "top",
        });
        this.$forceUpdate();
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
    async handleAdminAction(option) {
      if (option === "Approve") {
        Swal.fire({
          title: "Are you sure?",
          showCancelButton: true,
          confirmButtonColor: "#3aa959",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.data[this.$route.params.mid].steps[
              this.$route.params.sid
            ].completed = true;
            this.data[this.$route.params.mid].steps[
              this.$route.params.sid
            ].completedAt = new Date();

            let startupId = localStorage.getItem("strResId");
            const document = await startupsRef.doc(startupId).get();
            const startup = document.data();

            let nextStep = "";
            let nextStage = startup["progress"].nextStage;
            let currentStep = "";
            let currentStage = startup["progress"].currentStage;

            let prevStep =
              this.data[this.$route.params.mid].steps[this.$route.params.sid]
                .title;

            try {
              currentStep =
                this.data[this.$route.params.mid].steps[
                  this.$route.params.sid + 1
                ].title;
              currentStage = this.data[this.$route.params.mid].title;
              this.data[this.$route.params.mid].steps[
                this.$route.params.sid + 1
              ].locked = false;

              try {
                nextStep =
                  this.data[this.$route.params.mid].steps[
                    this.$route.params.sid + 2
                  ].title;
              } catch (error) {
                nextStep = this.data[this.$route.params.mid + 1].steps[0].title;
                nextStage = this.data[this.$route.params.mid + 1].title;
              }
            } catch (error) {
              currentStep =
                this.data[this.$route.params.mid + 1].steps[0].title;
              this.data[this.$route.params.mid + 1].steps[0].locked = false;
              currentStage = this.data[this.$route.params.mid + 1].title;

              nextStep = this.data[this.$route.params.mid + 1].steps[1].title;

              try {
                nextStage = this.data[this.$route.params.mid + 2].title;
              } catch (error) {
                nextStage = "-";
              }
            }

            let progress = {
              currentStep: currentStep,
              nextStep: nextStep,
              currentStage: currentStage,
              nextStage: nextStage,
              total: startup.progress.total,
              count: startup.progress.count + 1,
            };

            const activity = {
              incubatorId: this.currentUser.docId,
              photoURL: startup.photoURL,
              statement: `Startup ${startup.name} has completed ${prevStep} and moved to ${currentStep}.`,
              createdAt: new Date(),
              type: "startup",
              notification: true,
              read: false,
            };

            try {
              await deResponsesRef
                .doc(startup.docId)
                .set({ items: this.data }, { merge: true });
              await startupsRef
                .doc(startup.docId)
                .set({ progress: progress }, { merge: true });
              await deApprovalsRef.doc(localStorage.getItem("approvalId")).set(
                {
                  isApproved: true,
                  approvedAt: new Date(),
                  approvedBy: {
                    id: this.currentUser.docId,
                    name: this.currentUser.name,
                    type: this.currentUser.role,
                  },
                },
                { merge: true }
              );
              await activityRef.add(activity);
              this.$forceUpdate();
              this.$toast.success("Approved.", {
                position: "top",
              });
              this.$router.push("/de");
            } catch (error) {
              this.$toast.error(error, {
                position: "top",
              });
            }
          }
        });
      } else {
        this.suggestDialog = true;
      }
    },
  },
};
</script>

<style scoped>
.sticky {
  position: fixed;
  top: 0;
  left: 256px;
  z-index: 99;
  width: 81%;
  -webkit-animation: 0.95s ease-in-out 0s normal none 1 running fadeInDown;
  animation: 0.95s ease-in-out 0s normal none 1 running fadeInDown;
}

.tool__bar {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  flex: 1;
  background-color: #fff;
  border-radius: 5px;
}

.col__1 {
  flex: 0.5;
}

.tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.options {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex: 0.5;
  text-align: center;
}

.options > div {
  cursor: pointer;
}

.font__size {
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

>>> .font__size > .v-btn {
  min-width: 0px !important;
}

.font__size > input {
  outline: none;
  width: 40px;
}

.v-autocomplete {
  width: 100px !important;
  font-size: 12px;
}

h2,
h5,
h2 > .v-icon {
  color: #3aa959 !important;
}

page {
  height: 3508px;
  width: 2480px;
  border: 1px solid #ccc;
  background: white;
  display: block;
  margin: 0 auto;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.2cm rgba(0, 0, 0, 0.5);
  padding: 10px;
}

page[size="A4"] {
  width: 25cm;
  height: 29.7cm;
}

.editor > .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor > .header > input {
  outline: none;
  text-align: center;
  width: 80%;
}

.editor > .body > .type > input {
  outline: none;
}

.type > textarea {
  width: 95%;
}

.type {
  margin-bottom: 5rem;
  position: relative;
}

.type > textarea {
  outline: none;
  resize: unset;
}

.type:hover {
  /* border: 1px double #ccc; */
  cursor: move;
  /* box-shadow: 0 0 0.1cm rgba(0, 0, 0, 0.5); */
}

input {
  outline: none;
}

ol > li > textarea {
  outline: none;
  width: 90%;
}

.table__cnt {
  width: 50px;
  outline: none;
  margin-left: 10px;
  text-align: right;
  border: 1px solid #ccc;
  padding: 5px;
}

@media print {
  page {
    margin: 0;
    box-shadow: 0;
  }
}

textarea {
  overflow-y: hidden;
  resize: none;
  outline: none;
}

.qtn__delete {
  position: absolute;
  right: 10px;
  display: none;
}

.type:hover .qtn__delete {
  display: inline-block;
}

.tbl__textarea {
  width: 65% !important;
}

.rows__and__cols {
  width: 250px;
  display: flex;
  align-items: center;
}

.rows__and__cols > input {
  outline: none;
  width: 30px;
  margin-left: 10px;
}

.rows__and__cols > span {
  color: #3aa959;
}

.tbl__actions {
  position: absolute;
  display: flex;
  right: 0;
  width: 300px;
  top: 0;
  align-items: center;
}

.editor__table {
  width: 100%;
  overflow-x: scroll;
}

table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

table td,
table th {
  border: 1px solid #ddd;
  padding: 8px;
}

table tr:nth-child(even) {
  background-color: #f2f2f2;
}

table tr:hover {
  background-color: #ddd;
}

table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #3aa959;
  color: white;
}

table th > textarea {
  color: #fff !important;
}

table th > input,
table td > input {
  outline: none !important;
}

table td > textarea {
  outline: none !important;
  resize: none !important;
  width: 100%;
}

>>> .tbl__rc_actions > .v-btn {
  height: 0px !important;
}

.page__title {
  color: #3aa959;
  font-size: 24px;
  font-weight: bold;
}

.question {
  color: #3e3e3e;
  font-size: 16px;
  font-weight: bold;
}

.page {
  position: relative;
}

.delete-worksheet__btn {
  position: absolute;
  top: 0;
  right: -5%;
}

a {
  text-decoration: none;
  color: #3aa959 !important;
}

@media only screen and (max-width: 600px) {
  .tool__bar {
    width: 100% !important;
  }

  .tool__bar > * {
    width: 100%;
  }

  .back__btn {
    display: none;
  }

  .col__1 {
    flex: 1;
  }

  .options {
    flex: 1;
  }

  .qtn__tools {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  h2 {
    font-size: 20px;
  }

  .page {
    width: 100% !important;
  }

  .sticky {
    left: 0;
    width: 100%;
  }

  .editor__table {
    width: 100%;
    overflow: scroll;
  }

  .delete-worksheet__btn {
    right: -30px;
  }
}
</style>

