<template>
  <div>
    <h2>Milestones</h2>
    <div class="documents__row">
      <div
        class="document__card"
        v-for="(milestone, index) in milestones.milestones"
        :key="index"
      >
        <h2>{{ milestone.title }}</h2>
        <span
          >Due date on {{ milestone.date.split("-").reverse().join("/") }}</span
        ><br />
        <span>{{ milestone.description }}</span>
        <div class="actions">
          <v-btn
            v-if="!milestone.isCompleted"
            color="traktor"
            class="white--text mr-2"
            small
            @click="markAsDone(index)"
            ><v-icon>mdi-check</v-icon>Mark as completed</v-btn
          >
          <v-btn v-else disabled color="traktor" class="mb-2"
            >Completed on
            {{ milestone.completedDate.toDate().toDateString('en-in') }}</v-btn
          >
        </div>
      </div>
    </div>
    <!-- <div style="display: inline-block; width: 100%; overflow-y: auto">
      <ul class="timeline timeline-horizontal">
        <li
          class="timeline-item"
          v-for="(milestone, index) in milestones.milestones"
          :key="index"
        >
          <div class="timeline-badge success" v-if="milestone.isCompleted">
            <v-icon style="font-size: 48px" class="white--text"
              >mdi-check-circle</v-icon
            >
          </div>
          <div class="timeline-badge danger" v-else>
            <v-icon style="font-size: 40px" class="white--text"
              >mdi-alert-circle-check</v-icon
            >
          </div>
          <div class="timeline-panel">
            <div class="timeline-heading">
              <h4 class="timeline-title black--text">
                {{ milestone.title }}
                <div style="float: right"></div>
              </h4>
            </div>
            <div class="timeline-body">
              <p style="font-size: 10px">{{ milestone.description }}</p>
            </div>
            <small class="text-muted pull-right"
              ><v-icon>mdi-clock</v-icon>{{ milestone.date }}</small
            >
          </div>
        </li>
      </ul>
    </div> -->
  </div>
</template>
<script>
import { milestonesRef } from "../../config/firebase_services";
import Swal from "sweetalert2";

export default {
  name: "Milestones",
  data() {
    return {
      startupId: null,
      milestones: [],
    };
  },
  async created() {
    this.startupId =
      this.$route.params.id !== undefined
        ? this.$route.params.id
        : this.$store.state.user.currentUser.docId;

    await milestonesRef
      .where("startup.docId", "==", this.startupId)
      .onSnapshot((snapshot) => {
        snapshot.forEach((document) => {
          const data = document.data();
          data.docId = document.id;
          this.milestones = data;
        });
      });
  },
  methods: {
    async markAsDone(index) {
      Swal.fire({
        title: "Mark as completed?",
        showCancelButton: true,
        confirmButtonColor: "#3aa959",
        cancelButtonColor: "#d33",
        confirmButtonText: "Mark",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.milestones.milestones[index].isCompleted = true;
          this.milestones.milestones[index].completedDate = new Date();

          const milestones = this.milestones.milestones;
          try {
            await milestonesRef
              .doc(this.milestones.docId)
              .set({ milestones: milestones }, { merge: true });
            this.$toast.success("Updated", {
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
  },
};
</script>
<style scoped>
.timeline,
.timeline-horizontal {
  list-style: none;
  padding: 20px;
  position: relative;
}

.timeline:before {
  top: 40px;
  bottom: 0;
  position: absolute;
  content: " ";
  width: 3px;
  background-color: #eeeeee;
  left: 50%;
  margin-left: -1.5px;
}

.timeline .timeline-item {
  margin-bottom: 20px;
  position: relative;
}

.timeline .timeline-item:before,
.timeline .timeline-item:after {
  content: "";
  display: table;
}

.timeline .timeline-item:after {
  clear: both;
}

.timeline .timeline-item .timeline-badge {
  color: #fff;
  width: 54px;
  height: 54px;
  line-height: 52px;
  font-size: 22px;
  text-align: center;
  position: absolute;
  top: 18px;
  left: 50%;
  margin-left: -25px;
  background-color: #333333;
  border: 3px solid #ffffff;
  z-index: 100;
  border-top-right-radius: 50%;
  border-top-left-radius: 50%;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
}

.timeline .timeline-item .timeline-badge i,
.timeline .timeline-item .timeline-badge .fa,
.timeline .timeline-item .timeline-badge .glyphicon {
  top: 0px;
  left: 0px;
}

.timeline .timeline-item .timeline-badge.primary {
  background-color: #1f9eba;
}

.timeline .timeline-item .timeline-badge.info {
  background-color: #5bc0de;
}

.timeline .timeline-item .timeline-badge.success {
  background-color: #3aa95a;
  display: flex;
}

.timeline .timeline-item .timeline-badge.warning {
  background-color: #d1bd10;
}

.timeline .timeline-item .timeline-badge.danger {
  background-color: #ba1f1f;
}

.timeline .timeline-item .timeline-panel {
  position: relative;
  width: 46%;
  float: left;
  right: 16px;
  border: 1px solid #3aa95a;
  background: #ffffff;
  border-radius: 2px;
  padding: 20px;
  -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.175);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.175);
}

.timeline .timeline-item .timeline-panel:before {
  position: absolute;
  top: 26px;
  right: -16px;
  display: inline-block;
  border-top: 16px solid transparent;
  border-left: 16px solid #777777;
  border-right: 0 solid #777777;
  border-bottom: 16px solid transparent;
  content: " ";
}

.timeline .timeline-item .timeline-panel .timeline-title {
  margin-top: 0;
  color: inherit;
}

.timeline-horizontal {
  list-style: none;
  position: relative;
  padding: 20px 0px 20px 0px;
  display: inline-block;
}

.timeline-horizontal:before {
  height: 3px;
  top: auto;
  bottom: 26px;
  left: 56px;
  right: 0;
  width: 100%;
  margin-bottom: 20px;
}

.timeline-horizontal .timeline-item {
  display: table-cell;
  height: 220px;
  min-width: 260px;
  float: none !important;
  vertical-align: bottom;
}

.timeline-horizontal .timeline-item .timeline-panel {
  top: auto;
  bottom: 64px;
  display: inline-block;
  float: none !important;
  left: 0 !important;
  right: 0 !important;
  width: 70%;
  margin-bottom: 20px;
  border-radius: 30px;
}

.timeline-horizontal .timeline-item .timeline-panel:before {
  top: auto;
  bottom: -16px;
  left: 28px !important;
  right: auto;
  border-right: 16px solid transparent !important;
  border-top: 16px solid #777777 !important;
  border-bottom: 0 solid #777777 !important;
  border-left: 16px solid transparent !important;
}

.timeline-horizontal .timeline-item:before,
.timeline-horizontal .timeline-item:after {
  display: none;
}

.timeline-horizontal .timeline-item .timeline-badge {
  top: auto;
  bottom: 0px;
  left: 43px;
}

.documents__row {
  /* border: 1px solid #dbdbdb; */
  height: 190px;
  border-radius: 10px;
  margin-top: 3%;
  padding: 15px;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
}

.document__card {
  border: 1px solid #3aa959;
  width: 50%;
  height: 100%;
  border-radius: 10px;
  padding: 10px;
  margin-right: 15px;
}

.document__card > h2 {
  color: #3aa959;
}

.document__card > span {
  font-size: 12px;
  color: #666666;
}

.actions {
  float: right;
}

.v-btn {
  text-transform: capitalize;
}

@media only screen and (max-width: 600px) {
  .document__card {
    width: auto;
  }
}
</style>