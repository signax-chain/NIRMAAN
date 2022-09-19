<template>
  <v-dialog width="400" persistant v-model="show">
    <v-card>
      <!-- <v-card-title class="heading">
        <v-btn color="red" icon class="d-block ml-auto" @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title> -->
      <v-card-text class="pa-5">
        <div
          class="create-row"
          v-for="(item, index) in items"
          :key="index"
          @click="goto(item.to)"
        >
          <div class="create-icon">
            <img
              :src="require(`../../../assets/images/icons/${item.icon}`)"
              :alt="item.title"
              width="50px"
            />
          </div>
          <div class="create-text">
            <h3>{{ item.title }}</h3>
            <p class="subtitle mb-0">{{ item.subtitle }}</p>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Create",
  props: ["visible"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) return this.$emit("close");
      },
    },
  },
  created() {
    this.checkRole();
    this.updateItems();
  },
  data() {
    return {
      role: null,
      items: [],
    };
  },
  methods: {
    checkRole() {
      this.role = this.$store.state.user.currentUser.role;
    },
    updateItems() {
      if (this.role === "mentor" || this.role === "startup") {
        this.items = [
          {
            title: "Request for New Mentor",
            subtitle:
              "Search and request for a new mentor across sectors, industry & experience.",
            icon: "request-new-mentor.svg",
            to: "/mentors",
          },
          {
            title: "New Connection",
            subtitle:
              "Search and connect with people across sectors, industry & experience.",
            icon: "request-new-connection.svg",
            to: "/contacts",
          },
          {
            title: "New Job Role",
            subtitle:
              "Create & publish job roles at your startups, and notify it to your network",
            icon: "request-new-job.svg",
            to: "/jobs",
          },
        ];
      }

      if (this.role === "incubator") {
        this.items = [
          {
            title: "Add New Startup",
            subtitle:
              "Search and connect with startups across sectors, industry & experience.",
            icon: "add-new-startup.svg",
            to: "/startup/new",
          },
          {
            title: "Add New Mentor",
            subtitle:
              "Search and connect with mentors across sectors, industry & experience.",
            icon: "request-new-mentor.svg",
            to: "/mentor/new",
          },
          {
            title: "Create New Contact",
            subtitle:
              "Create & publish job roles at your startups, and notify it to your network",
            icon: "request-new-connection.svg",
            to: "/contacts",
          },
          {
            title: "Schedule Mentoring Session",
            subtitle:
              "Create & publish job roles at your startups, and notify it to your network",
            icon: "schedule-mentoring-session.svg",
            to: "/mentorship",
          },
          {
            title: "Create New Event",
            subtitle:
              "Create & publish job roles at your startups, and notify it to your network",
            icon: "create-new-event.svg",
            to: "/events",
          },
          // {
          //   title: "Create Form",
          //   subtitle:
          //     "Create & publish job roles at your startups, and notify it to your network",
          //   icon: "create-report.svg",
          //   to: "/form/templates",
          // },
        ];
      }
    },
    goto(path) {
      this.$router.push(path);
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.create-row {
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.create-text {
  padding: 0 1rem;
  cursor: pointer;
}

h3 {
  color: #4d4d4d;
  font-weight: 500;
}

.subtitle {
  color: #adadad;
  font-size: 12px;
}
</style>