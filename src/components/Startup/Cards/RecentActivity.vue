<template>
  <div
    class="recent-activity-col mr-2 mb-3"
    :style="`width: ${width}%`"
    @click="goto(activity.link)"
  >
    <img
      :src="require(`../../../assets/images/icons/${activity.icon}`)"
      alt=""
    />
    <div>
      <v-btn
        icon
        color="white"
        class="edit-btn mb-5"
        v-if="activity.isEditable"
        @click="edit(activity.title, activity.count)"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <h3>{{ activity.count }}</h3>
      <span
        :class="`${currentUser.role === 'mentor' ? 'is-mentor-title' : ''}`"
      >
        {{ activity.title }}</span
      >
    </div>
    <impact-stats
      :visible="impactDialog"
      :collection="collection"
      :count="count"
      @close="impactDialog = false"
    ></impact-stats>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ImpactStats from "../../Modals/Incubator/ImpactStats.vue";
export default {
  components: { ImpactStats },
  name: "RecentActivityCard",
  props: ["activity", "width"],
  data() {
    return {
      impactDialog: false,
      collection: "",
      count: 0,
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
  methods: {
    goto(link) {
      this.$router.push(link);
    },
    edit(collection, count) {
      this.collection = collection;
      this.impactDialog = true;
      this.count = count;
    },
  },
};
</script>

<style scoped>
.recent-activity-col {
  /* background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  width: 24%;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  cursor: pointer; */
  background-color: #3aa959;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  width: 24%;
  padding: 1rem;
  /* display: flex; */
  /* justify-content: space-between; */
  /* align-items: center; */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  cursor: pointer;
  color: #fff;
}

h3 {
  font-weight: 600;
  text-align: right;
}

span {
  opacity: 0.5;
  font-size: 12px;
  white-space: normal;
}

img {
  width: 50px;
}

.is-mentor-title {
  font-size: 12px;
  white-space: normal;
}

.recent-activity-col > div {
  position: relative;
}

.edit-btn {
  position: absolute;
  top: -20px;
  right: -15px;
  display: none;
}

.recent-activity-col:hover .edit-btn {
  display: inline;
  margin-bottom: 5px;
}
</style>