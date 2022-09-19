<template>
  <div>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">Disciplined Entrepreneurship</h3>
    <div class="wrapper">
      <div class="header px-2 py-5 text-center">
        <!-- <v-btn icon color="traktor" dark class="back__btn" link to="/dashboard"
        ><v-icon>mdi-arrow-left</v-icon>Back</v-btn
      > -->
        <h1>Disciplined Entrepreneurship</h1>
        <span class="span sub-heading">24 Steps to a Successful Startup</span>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="success"
              dark
              v-bind="attrs"
              v-on="on"
              icon
              v-if="currentUser.role === 'incubator'"
              class="de-notify"
            >
              <v-badge color="red" :content="approvals.length.toString()">
                <v-icon size="32">mdi-bell</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <v-card width="500">
            <v-card-text>
              <v-row>
                <v-col cols="12" md="12" v-if="approvals.length === 0">
                  <span>No Approval requests found</span>
                </v-col>
                <v-col
                  cols="12"
                  md="12"
                  v-for="(item, index) in approvals"
                  :key="index"
                  class="d-flex justify-space-between align-center"
                >
                  <img
                    :src="item.photoURL"
                    :alt="item.startup.name"
                    class="approval-img"
                  />
                  <span>{{ item.statement }}</span>
                  <v-btn
                    color="traktor"
                    dark
                    small
                    @click="
                      view(item.startup.id, item.mid, item.sid, item.docId)
                    "
                    >view</v-btn
                  >
                  <v-divider></v-divider>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>
        <!-- <v-btn
        color="traktor"
        dark
        class="publish__btn"
        @click="publish()"
        v-if="currentUser.role === 'incubator' && !$route.params.docId"
        >Publish <v-icon>mdi-publish</v-icon></v-btn
      > -->
        <!-- <v-btn
        color="traktor"
        dark
        class="publish__btn"
        @click="addNewStage()"
        v-if="currentUser.role === 'incubator' && !strRes && isItems"
        ><v-icon>mdi-plus-circle</v-icon> Add stage</v-btn
      > -->
      </div>
      <div class="timeline pa-5" v-if="isItems">
        <v-timeline align-top :dense="$vuetify.breakpoint.smAndDown">
          <v-timeline-item
            v-for="(item, i) in timeline.items"
            :key="i"
            color="traktor"
            fill-dot
            small
            ref="titem"
            class="mt-5"
          >
            <div class="module text-center" @click="expand(i)">
              <div
                class="module__progress"
                :style="
                  currentUser.role === 'startup' ||
                  (currentUser.role === 'incubator' && $route.params.docId)
                    ? stageStyle(item)
                    : null
                "
              >
                <img
                  :src="item.icon"
                  :alt="item.title"
                  :style="
                    currentUser.role === 'startup' ||
                    (currentUser.role === 'incubator' && $route.params.docId)
                      ? stageIconStyle(item)
                      : 'filter: invert(1)'
                  "
                />
              </div>
              <h4 class="mt-3">{{ item.title }}</h4>
            </div>
            <div
              v-for="(step, j) in item.steps"
              :key="j"
              :class="`animate__animated steps mt-5 ${
                j % 2 === 0 && i % 2 === 0 ? 'left__step' : ''
              } ${i % 2 === 1 && j % 2 === 0 ? 'right__step' : ''} ${
                step.active
                  ? 'show animate__slideInDown'
                  : 'hide animate__slideInUp'
              }`"
              @click="open(i, j, step)"
            >
              <div class="step__number mb-5">
                <span
                  class="span"
                  v-if="
                    (currentUser.role === 'incubator' &&
                      !$route.params.docId) ||
                    (step.locked !== undefined && !step.locked)
                  "
                  >{{ getNumber(i, j) }}</span
                >
                <v-icon size="34" color="traktor" v-else
                  >mdi-lock-open-outline</v-icon
                >
              </div>
              <span
                class="step__title span"
                v-if="
                  (i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1)
                "
              >
                {{ step.title }}</span
              >
              <span
                class="step__title span"
                v-if="
                  (i % 2 === 0 && j % 2 === 1) || (i % 2 === 1 && j % 2 === 0)
                "
                >{{ step.title }}</span
              >
            </div>
            <div
              :class="`timeline__actions ${
                i % 2 === 0 ? 'timeline__action_right' : 'timeline__action_left'
              } `"
              v-if="currentUser.role === 'incubator' && !$route.params.docId"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="traktor"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    icon
                    text
                    @click="edit(item, i)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                    Edit
                  </v-btn>
                </template>
                <span>Edit stage</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="red"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    icon
                    text
                    @click="_delete(i)"
                  >
                    <v-icon>mdi-delete</v-icon>
                    Delete
                  </v-btn>
                </template>
                <span>Delete stage</span>
              </v-tooltip>
            </div>
          </v-timeline-item>
        </v-timeline>
      </div>
      <div class="mt-5 pa-5" v-else v-show="currentUser.role === 'incubator'">
        <h3 class="text-center">
          You have not yet created the progress template
        </h3>
        <v-btn
          color="traktor"
          class="mx-auto d-block mt-3"
          dark
          @click="dialog = true"
          >Create now</v-btn
        >
      </div>
      <create-timeline
        :visible="dialog"
        @close="dialog = false"
        @setTimeline="updateTimeline"
        :addNew="addNew"
      ></create-timeline>
      <timeline-stage-edit
        :data="stage"
        :visible="editDialog"
        :srcObj="srcObj"
        @close="editDialog = false"
        @handleSrcObj="handleSrcObj"
        @update="update"
      ></timeline-stage-edit>
    </div>
  </div>
</template>

<script>
import { deApprovalsRef, deRef } from "../../config/firebase_services";
import CreateTimeline from "../Modals/DE/CreateTimeline.vue";
import { mapState } from "vuex";
import { deResponsesRef } from "../../config/firebase_services";
import Swal from "sweetalert2";
import TimelineStageEdit from "../Modals/DE/TimelineStageEdit.vue";

export default {
  components: { CreateTimeline, TimelineStageEdit },
  name: "Timeline",
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  created() {
    this.checkRole();
  },
  data: () => ({
    dialog: false,
    addNew: false,
    editDialog: false,
    srcObj: "",
    editIndex: 0,
    stage: {},
    timeline: {},
    isItems: false,
    items: [
      {
        title: "",
        icon: "",
        active: false,
        progress: 0,
        steps: [
          {
            title: "",
            completed: false,
          },
        ],
      },
    ],
    rules: {
      iconRule: [
        (v) => !!v || "Icon is required",
        (v) => (v && v.size < 2000000) || "Icon size should be less than 2 MB!",
      ],
      titleRule: [(v) => !!v || "Title is required"],
    },
    approvals: [],
    crumbs: [
      {
        text: "Dashboard",
        disabled: true,
      },
      {
        text: "Progress",
        disabled: true,
      },
    ],
  }),
  methods: {
    getApprovals() {
      deApprovalsRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .where("isApproved", "==", false)
        .onSnapshot((snapshot) => {
          snapshot.forEach((document) => {
            const data = document.data();
            data.docId = document.id;
            this.approvals.push(data);
          });
        });
    },
    stageStyle(item) {
      if (this.stageCompleted(item)) {
        return {
          backgroundColor: "#3aa959",
        };
      }
      return {
        backgroundColor: "#fff",
      };
    },
    stageIconStyle(item) {
      if (this.stageCompleted(item)) {
        return {
          filter: "invert(1)",
        };
      }
      return null;
    },
    stageCompleted(item) {
      let completed = 0;
      item.steps.forEach((step) => {
        if (step.completed !== undefined && step.completed) completed++;
      });

      return completed === item.steps.length ? true : false;
    },
    checkRole() {
      localStorage.removeItem("strRes");
      localStorage.removeItem("strResId");
      if (
        this.$store.state.user.currentUser.role === "incubator" ||
        this.$store.state.user.currentUser.role === "mentor"
      ) {
        this.getApprovals();
        if (this.$route.params.docId !== undefined) this.getStartupData();
        else this.getData();
      } else this.setupForStartup();
    },
    async setupForStartup() {
      this.isItems = true;
      const document = await deResponsesRef
        .doc(this.$store.state.user.currentUser.docId)
        .get();
      if (!document.exists) {
        const docRef = await deRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .get();
        const data = docRef.data();
        data.incubatorId = this.$store.state.incubator.currentIncubator.docId;
        data.items[0].steps[0].locked = false;
        await deResponsesRef
          .doc(this.$store.state.user.currentUser.docId)
          .set(data, { merge: true });
        this.timeline = data;
      } else this.timeline = document.data();
    },
    async getStartupData() {
      localStorage.setItem("strRes", true);
      localStorage.setItem("strResId", this.$route.params.docId);
      this.isItems = true;
      const document = await deResponsesRef.doc(this.$route.params.docId).get();
      if (!document.exists) {
        const docRef = await deRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .get();
        const data = docRef.data();
        data.incubatorId = this.$store.state.incubator.currentIncubator.docId;
        data.items[0].steps[0].locked = false;
        await deResponsesRef
          .doc(this.$route.params.docId)
          .set(data, { merge: true });
        this.timeline = data;
      } else this.timeline = document.data();
    },
    getData() {
      deRef
        .doc(this.$store.state.user.currentUser.docId)
        .onSnapshot((snapshot) => {
          this.timeline = snapshot.data();
          this.timeline.items === undefined
            ? (this.isItems = false)
            : (this.isItems = true);
        });
    },
    expand(i) {
      this.timeline.items[i].steps.forEach((step) => {
        step.active = !step.active;
      });
      this.$forceUpdate();
    },
    open(i, j, step) {
      if (step.locked === undefined) step.locked = true;
      if (
        (this.currentUser.role === "incubator" &&
          this.$route.params.docId &&
          step.locked) ||
        (this.currentUser.role === "startup" && step.locked)
      ) {
        this.$toast.info(
          "Step is locked. Complete the previous steps to unlock this step!.",
          {
            position: "top",
          }
        );
        return;
      }
      this.$router.push({
        name: "DEWorksheet",
        params: { mid: i, sid: j, data: this.timeline.items },
      });
    },
    updateTimeline(data) {
      this.timeline = data;
    },
    getNumber(i, j) {
      let num = 0;
      if (i === 0) return i + 1 * j + 1;
      for (let a = i; a > 0; a--) {
        num += this.timeline.items[a - 1].steps.length;
        if (a === 1) num += j + 1;
      }
      return num;
    },
    edit(item, i) {
      this.stage = item;
      this.srcObj = item.icon;
      this.editIndex = i;
      this.editDialog = true;
    },
    async _delete(i) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3aa959",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.timeline.items.splice(i, 1);
          try {
            await deRef
              .doc(this.$store.state.incubator.currentIncubator.docId)
              .set(
                { items: this.timeline.items, updatedAt: new Date() },
                { merge: true }
              );
            this.$toast.success("Deleted", {
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
    handleSrcObj(src) {
      this.srcObj = URL.createObjectURL(src);
    },
    async update() {
      this.timeline.items[this.editIndex] = this.stage;
      try {
        await deRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .set(
            { items: this.timeline.items, updatedAt: new Date() },
            { merge: true }
          );
        this.$toast.success("Updated", {
          position: "top",
        });
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
      this.editDialog = false;
    },
    addNewStage() {
      this.addNew = true;
      this.dialog = true;
    },
    async view(id, mid, sid, docId) {
      localStorage.setItem("strRes", true);
      localStorage.setItem("strResId", id);
      localStorage.setItem("approvalId", docId);
      const document = await deResponsesRef.doc(id).get();
      this.$router.push({
        name: "DEWorksheet",
        params: { mid: mid, sid: sid, data: document.data()["items"] },
      });
    },
  },
};
</script>

<style scoped>
.approval-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.header {
  position: relative;
}

.de-notify {
  position: absolute;
  right: 1rem;
  top: 1rem;
}

.wrapper {
  background-image: url("../../assets/images/timeline-bg.png");
  background-repeat: repeat-y;
  width: 96%;
  height: auto;
  margin: 0 auto;
  border-radius: 5px;
}

h1 {
  color: #3aa959;
}

.span {
  color: #5a5a5a;
  font-weight: bold;
}

.theme--light.v-timeline:before {
  background: #3aa959;
}

.module {
  cursor: pointer;
}

.module__progress {
  background-color: #3aa959;
  border: 2px solid #3aa959;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  cursor: pointer;
}

.steps {
  cursor: pointer;
  display: grid;
  place-items: center;
}

.left__step {
  margin-left: -1000px;
}

.right__step {
  width: 100%;
  margin-left: 510px;
}

.show {
  display: grid;
}

.hide {
  display: none;
}

img {
  width: 80px;
  object-fit: cover;
}

.step__number {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #3aa959;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3aa959;
  font-size: 28px;
}

.publish__btn {
  position: absolute;
  top: 5%;
  right: 10%;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate3d(0, -20%, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.timeline__actions {
  display: none;
  place-items: center;
  width: 150px;
  position: absolute;
  top: 25px;
}

.timeline__action_right {
  right: 0;
}

.timeline__action_left {
  left: 0;
}

.v-timeline-item__body:hover .timeline__actions {
  display: grid;
}

.back__btn {
  position: absolute;
  left: 8%;
}


@media only screen and (max-width: 600px) {
  .wrapper {
    width: 100%;
  }
  .back__btn {
    display: none;
  }

  h1 {
    font-size: 26px;
  }

  .sub-heading {
    font-size: 12px;
  }

  .left__step {
    margin-left: 0px !important;
  }

  .right__step {
    margin-left: 0px !important;
  }

  .v-timeline-item__body:hover .timeline__actions {
    top: -55px;
    display: grid;
    right: -45px !important;
    margin-top: 5px;
  }

  .timeline__action_left {
    left: 95px !important;
  }

  .steps {
    text-align: center;
  }
}
</style>