<template>
  <div :class="`px-5 ${startup.status !== 'active' ? 'py-5' : ''}`">
    <div class="d-flex">
      <h2 v-if="startup.status !== 'active'">Stage</h2>
    </div>
    <div class="progress__container my-2">
      <div class="progress__update">
        <span class="current__label">Current Stage</span>
        <h3 class="mt-1 d-flex align-center">
          <img
            :src="getVector(startup.progress.currentStage)"
            alt=""
            width="40px"
            class="mr-3"
          />
          {{ startup.progress.currentStage }}
        </h3>
        <span class="next__label"
          >Next stage: {{ startup.progress.nextStage }}</span
        >
        <v-btn
          color="traktor"
          dark
          class="continue__btn not_mbl"
          link
          @click="view()"
          >{{ btnTitle }}</v-btn
        >
        <div class="progress__bar">
          <!-- <span class="progress__completed"
            >{{ startup.progress.count }} of {{ startup.progress.total }} steps
            completed</span
          > -->
          <!-- <div class="progress__bars mt-3">
            <span
              v-for="i in startup.progress.total"
              :key="i"
              :class="i <= startup.progress.count ? 'active' : ''"
            ></span>
          </div> -->
          <v-btn
            color="traktor"
            dark
            class="continue__btn mbl"
            link
            @click="view()"
            >{{ btnTitle }}</v-btn
          >
        </div>
      </div>
    </div>
    <!-- <ProgressUpdate /> -->
    <!-- <startup-edit></startup-edit> -->
  </div>
</template>

<script>
import {
  startupsRef,
  startupProgressRef,
} from "../../config/firebase_services";
import { mapState } from "vuex";
// import ProgressUpdate from "@/components/Modals/Startup/ProgressUpdate";
import Swal from "sweetalert2";
import _helpers from "../../mixins/_helpers";
import { deRef, deResponsesRef } from "../../config/firebase_services";
// import StartupEdit from "../Modals/StartupEdit.vue";

export default {
  name: "Progress",
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
    btnTitle: function () {
      return this.$store.state.user.currentUser.role === "startup"
        ? this.$route.path === "/about"
          ? "Edit"
          : "Continue"
        : "View";
    },
  },
  components: {
    // ProgressUpdate,
    // StartupEdit,
  },
  mixins: [_helpers],
  data() {
    return {
      stageIconMap: [
        {
          stage: "General",
          icon: "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/icons%2Fstage%2F1_StartingUp.svg?alt=media&token=b040091f-fc6f-4043-8156-2def60f8c902",
        },
        {
          stage: "Idea",
          icon: "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/icons%2Fstage%2F2_Idea.svg?alt=media&token=d032a3a3-f829-4aca-96b0-ff283773d22a",
        },
        {
          stage: "Prototype",
          icon: "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/icons%2Fstage%2F3_MarketResearch.svg?alt=media&token=00933c33-b697-4afc-973a-5f04231b96b6",
        },
        {
          stage: "MVP",
          icon: "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/icons%2Fstage%2F4_Product.svg?alt=media&token=a287732c-90f1-4217-a6e2-769b4cd50325",
        },
        {
          stage: "Pivoted",
          icon: "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/icons%2Fstage%2F5_BusinessModel.svg?alt=media&token=367976a2-7952-4df0-b3a9-a018d12ed97f",
        },
        {
          stage: "Early Traction",
          icon: "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/icons%2Fstage%2F6_PricingRevenue.svg?alt=media&token=be1b47d5-0388-442f-80bf-c4f79bfb257f",
        },
        {
          stage: "Seed Funding",
          icon: "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/icons%2Fstage%2F7_LegalCompliance.svg?alt=media&token=14cbda2c-efc1-4572-8a99-0d5a002b8b13",
        },
        {
          stage: "Product Market Fit",
          icon: "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/icons%2Fstage%2F8_MarketingBranding.svg?alt=media&token=e5e38bfb-41ca-4943-9946-ba2d6f890cf0",
        },
        {
          stage: "VC Funding",
          icon: "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/icons%2Fstage%2F9_Team.svg?alt=media&token=7fd85a2b-aff8-4cb9-9d81-cb3ca7ce8dce",
        },
        {
          stage: "Scaling",
          icon: "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/icons%2Fstage%2F10_Technology.svg?alt=media&token=b11c33f3-34ae-4358-9abb-bff34165f5e9",
        },
        {
          stage: "Jobs Created",
          icon: "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/icons%2Fstage%2F11_FinancingFunding.svg?alt=media&token=663d80af-32c2-4ebb-9efd-5e907dea130f",
        },
        {
          stage: "Internal Seed Funding",
          icon: "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/icons%2Fstage%2F12_GoToMarket.svg?alt=media&token=f426c845-de96-42f2-a789-b6dc922acca0",
        },
      ],
      stageVectorMap: [
        {
          stage: "Problem Identification",
          icon: "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/DE%2F1622529387496?alt=media&token=844c336a-868b-4e32-b0d4-ed16801bcfea",
        },
        {
          stage: "Problem validation",
          icon: "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/DE%2F1622529389710?alt=media&token=92263619-f1e2-4436-93dc-78783b45ff59",
        },
        {
          stage: "Lead customer EOI",
          icon: "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/DE%2F1622529391349?alt=media&token=316172c6-2679-42dc-b88f-b5460c0489b2",
        },
        {
          stage: "Graduation",
          icon: "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/DE%2F1622804427753?alt=media&token=0e6c7317-d9d8-47b2-9b98-a779c45276b1",
        },
      ],
      progress: [
        "General",
        "Idea",
        "Prototype",
        "MVP",
        "Pivoted",
        "Early Traction",
        "Seed Funding",
        "Product Market Fit",
        "VC Funding",
        "Scaling",
        "Jobs Created",
        "Internal Seed Funding",
        "Awards and Recognitions",
        "Media Mentions",
        "Exit",
      ],
      currentProgress: null,
      startup: null,
      startupId: null,
      stages: [],
    };
  },
  async created() {
    this.startupId =
      this.$route.params.id !== undefined
        ? this.$route.params.id
        : this.$store.state.user.currentUser.docId;

    startupsRef.doc(this.startupId).onSnapshot((snapshot) => {
      // this.currentProgress =
      //   snapshot.data()["stage"] !== null
      //     ? snapshot.data()["stage"]
      //     : "General";
      this.startup = snapshot.data();
      if (this.startup.progress === undefined) this.updateInitialProgress();
    });

    // startupProgressRef
    //   .where("startup.docId", "==", this.startupId)
    //   .orderBy("createdAt")
    //   .onSnapshot((snapshot) => {
    //     this.stages = [];
    //     snapshot.forEach((document) => {
    //       const data = document.data();
    //       data.docId = document.id;
    //       this.stages.push(data);
    //     });
    //   });
  },
  methods: {
    getVector(stage) {
      return this.stageVectorMap.find((item) => item.stage === stage).icon;
    },
    async updateInitialProgress() {
      let timeline = {};
      let flag = false;
      const document = await deResponsesRef.doc(this.startupId).get();
      if (!document.exists) {
        const docRef = await deRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .get();
        if (!docRef.exists) {
          flag = true;
        } else {
          const data = docRef.data();
          data.items[0].steps[0].locked = false;

          await deResponsesRef.doc(this.startupId).set(data, { merge: true });
          timeline = data;
        }
      } else timeline = document.data();

      let progress = {};

      if (flag) {
        progress = {
          current: "Not updated",
          next: "Not updated",
          count: 0,
          total: 0,
        };
      } else {
        progress = {
          currentStage: timeline.items[0].title,
          nextStage: timeline.items[1].title,
          count: 0,
          total: 24,
        };
      }

      await startupsRef
        .doc(this.startupId)
        .set({ progress: progress }, { merge: true });
    },
    getIcon(stage) {
      const obj = this.stageIconMap.find((obj) => obj.stage === stage);
      return obj.icon;
    },
    getNextStep() {
      return this.progress[this.progress.indexOf(this.currentProgress) + 1];
    },
    view() {
      if (this.currentUser.role === "startup")
        if (this.$route.path === "/about")
          this.$store.dispatch("SHOW_STARTUP_EDIT", {
            isShowing: true,
            basicDetails: this.currentUser,
          });
        else this.$router.push(`/disciplined-entrepreneurship/${this.currentUser.docId}`);
      else if (
        (this.currentUser.role === "incubator" && this.$route.params.id) ||
        (this.currentUser.role === "mentor" && this.$route.params.id)
      )
        this.$router.push(`/disciplined-entrepreneurship/${this.$route.params.id}`);
      else this.$router.push("/disciplined-entrepreneurship");
    },
    add() {
      const currentProgressedStages = this.stages.map((stage) => stage.stage);
      this.$store.dispatch("SHOW_STARTUP_PROGRESS_UPDATE", {
        isShowing: true,
        isUpdate: false,
        data: {
          stage: null,
          description: null,
          document: null,
          startup: this.startup,
        },
        currentProgressedStages: currentProgressedStages,
      });
    },
    edit(stage) {
      this.$store.dispatch("SHOW_STARTUP_PROGRESS_UPDATE", {
        isShowing: true,
        isUpdate: true,
        data: {
          ...stage,
        },
      });
    },
    async _delete(_id) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3aa959",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await startupProgressRef.doc(_id).delete();
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
    open(document) {
      window.open(document, "_blank").focus();
    },
  },
};
</script>

<style scoped>
.progress__container {
  display: flex;
  /* overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap; */
  width: 100%;
}

.progress__update {
  /* width: 50%; */
  width: 100%;
  height: auto;
  /* min-height: 160px; */
  /* background-color: #3aa959; */
  border-radius: 10px;
  /* color: #fff; */
  /* padding: 10px; */
  /* margin-right: 15px; */
  position: relative;
}

.card__footer {
  position: absolute;
  bottom: 0;
}

.progress__update > .next__step {
  float: right;
  margin-top: -15%;
}

.progress__completed {
  font-size: 14px;
  font-weight: bold;
  color: #747474;
}

.progress__bar {
  /* margin-top: 55px; */
  position: absolute;
  bottom: 10px;
  width: 90%;
}

.progress__bars {
  width: 100%;
  height: 8px;
  display: flex;
}

.progress__bars > span {
  background-color: rgba(58, 169, 89, 0.25);
  width: 6.66%;
  margin-right: 5px;
  /* opacity: 0.3; */
  /* border: 1px solid #ccc; */
}

.progress__bars > .active {
  background-color: #3aa959;
  opacity: 1;
}

.description {
  font-size: 12px;
  white-space: normal;
}

.acheived__on {
  font-size: 10px;
}

.stage__icon {
  width: 100px;
  filter: invert(1);
  /* filter: invert(1) sepia(1) saturate(5) hue-rotate(175deg); */
}

.current__label {
  font-size: 14px;
  color: #bcbcbc;
}

h3 {
  padding: 0 !important;
  color: #3aa959;
  font-size: 22px;
}

.next__label {
  font-size: 12px;
  color: #3aa959;
  font-weight: bold;
}

.continue__btn {
  position: absolute;
  right: 10px;
  top: 10px;
  /* color: #3aa959; */
}

.mbl {
  display: none;
}

@media only screen and (max-width: 600px) {
  .progress__update {
    width: 100%;
  }

  .v-btn {
    margin-top: -10px;
  }

  .progress__bar {
    width: 100%;
  }

  h3 {
    font-size: 16px;
    margin-top: 10px !important;
  }

  .not_mbl {
    display: none;
  }

  .mbl {
    display: block;
    margin-top: 50px;
  }
}
</style>
