<template>
  <div
    class="wrapper"
    :style="
      currentUser.role === 'startup' && data.status === 'droppedout'
        ? 'height: 550px'
        : currentUser.role === 'accountant'
        ? 'height: 400px'
        : currentUser.role === 'incubator' && data.status !== 'active'
        ? 'height: 500px'
        : ''
    "
  >
    <div
      class="p-bg"
      :style="`${
        !isMobile &&
        currentUser.role === 'startup' &&
        data.status === 'droppedout'
          ? 'height: 65%'
          : currentUser.role === 'accountant'
          ? 'height: 50%'
          : 'height: 48%'
      }${
        this.isMobile && $route.path === '/about'
          ? 'height: 20%;'
          : 'height: 40%;'
      }`"
    >
      <!-- <v-btn
        class="float-right"
        icon
        color="black"
        @click="edit()"
        v-if="currentUser.role === 'incubator'"
        ><v-icon size="34">mdi-square-edit-outline</v-icon></v-btn
      > -->
      <img :src="data.photoURL" :alt="data.name" class="logo" />
    </div>
    <div
      class="p-info"
      :style="
        currentUser.role === 'incubator' && data.status === 'active'
          ? 'margin-top: 50px'
          : currentUser.role === 'startup' && data.status === 'active'
          ? 'margin-top: 90px'
          : currentUser.role === 'startup' && data.status !== 'active'
          ? 'margin-top: 30px'
          : currentUser.role === 'incubator' && data.status !== 'active'
          ? 'margin-top: 50px'
          : currentUser.role === 'accountant'
          ? 'margin-top: 60px'
          : 'margin-top: 30px'
      "
    >
      <div class="p-info__left">
        <h3 class="mt-8">{{ data.name }}</h3>
        <v-tooltip bottom v-if="data.status === 'droppedout'">
          <template v-slot:activator="{ on, attrs }">
            <v-chip
              :color="getColor(data.status)"
              class="mt-2 mb-5"
              v-bind="attrs"
              v-on="on"
              outlined
              >{{ getStatus(data.status) }}</v-chip
            >
          </template>
          <span>{{
            data.statusReason ? data.statusReason : "No reason found"
          }}</span>
        </v-tooltip>
        <v-chip
          v-else
          :color="getColor(data.status)"
          class="mt-2 mb-5"
          v-bind="attrs"
          v-on="on"
          outlined
          >{{ getStatus(data.status) }}</v-chip
        >
        <div class="socials" v-if="currentUser.role === 'incubator'">
          <a @click="copyToClipboard(data.email)">
            <v-icon class="mr-2">mdi-email</v-icon>{{ data.email }}</a
          >
          <a @click="copyToClipboard(data.phoneNumber)">
            <v-icon class="mr-2">mdi-phone</v-icon>{{ data.phoneNumber }}</a
          >
          <a
            :href="`${data.socialLinks.linkedIn}`"
            target="_blank"
            v-show="data.socialLinks.linkedIn"
            ><v-icon class="mr-2">mdi-linkedin</v-icon
            >{{ truncateParagraph(20, data.socialLinks.linkedIn) }}</a
          >
          <a
            :href="`${data.socialLinks.website}`"
            target="_blank"
            v-show="data.socialLinks.website"
            ><v-icon class="mr-2">mdi-web</v-icon
            >{{ data.socialLinks.website }}</a
          >
        </div>
      </div>
      <div class="p-info__right" style="width: 64%">
        <!-- <div class="socials" v-if="data.role === 'startup'">
          <a :href="`mailto:${data.email}`" target="_blank"
            ><v-icon class="mr-2" large>mdi-email</v-icon></a
          >
          <a :href="`tel:${data.phoneNumber}`" target="_blank"
            ><v-icon class="mr-2" large>mdi-phone</v-icon></a
          >
          <a
            :href="`${data.socialLinks.linkedIn}`"
            target="_blank"
            v-show="data.socialLinks.linkedIn"
            ><v-icon class="mr-2" large>mdi-linkedin</v-icon></a
          >
          <a
            :href="`${data.socialLinks.website}`"
            target="_blank"
            v-show="data.socialLinks.website"
            ><v-icon class="mr-2" large>mdi-web</v-icon></a
          >
        </div> -->
        <!-- <v-btn
          color="traktor"
          dark
          @click="edit()"
          v-if="currentUser.role === 'startup' && $route.path !== '/about'"
          class="mx-auto d-block"
          :style="currentUser.role === 'startup' ? 'float: right' : ''"
          >Update Profile</v-btn
        > -->
        <Progress v-if="data.status === 'active'" />
        <div
          class="ma-5"
          style="height: 160px; word-break: break-word"
          v-if="data.status !== 'active' && data.statusDescription"
        >
          <span style="color: #8b8b8b"
            >{{ data.status === "graduated" ? "Remarks" : "Reason" }} for
            {{ getStatusText(data.status) }}:
          </span>
          <h4 class="mb-2">{{ data.statusReason }}</h4>
          <p v-if="data.statusDescription">
            {{
              data.statusDescription === undefined
                ? "Not specified"
                : truncateParagraph(350, data.statusDescription)
            }}
            <v-menu open-on-hover top offset-y>
              <template v-slot:activator="{ on, attrs }">
                <a
                  href="#"
                  v-bind="attrs"
                  v-on="on"
                  v-show="data.statusDescription.length >= 350"
                  >Read More</a
                >
              </template>
              <v-card>
                <v-card-text v-html="data.statusDescription"></v-card-text>
              </v-card>
            </v-menu>
          </p>
          <p v-else>No description found</p>
        </div>
        <v-row
          class="p-more__info mx-2"
          v-if="
            currentUser.role === 'incubator' &&
            data.status !== 'active' &&
            !data.statusDescription
          "
        >
          <v-col cols="12" md="12">
            <v-btn
              color="traktor"
              dark
              class="d-block ml-auto mr-7"
              @click="edit()"
              >Edit</v-btn
            >
          </v-col>
          <v-col cols="12" md="3">
            <span class="span">Mentors</span>
            <h5>{{ getMentors(data.mentorsAssociated) }}</h5>
          </v-col>
          <v-col cols="12" md="3">
            <span class="span">Sector</span>
            <h5>{{ data.sector }}</h5>
          </v-col>
          <v-col cols="12" md="3">
            <span class="span">Program</span>
            <h5>{{ data.program }}</h5>
          </v-col>
          <v-col cols="12" md="3">
            <span class="span">Cohort(Name)</span>
            <h5>{{ data.cohort.name }}</h5>
          </v-col>
          <v-col cols="12" md="3">
            <span class="span">Cohort(Year)</span>
            <h5>{{ data.cohort.year }}</h5>
          </v-col>
          <v-col cols="12" md="3">
            <span class="span">CIN/ Registration Number</span>
            <h5>{{ data.cinNumber ? data.cinNumber : "-" }}</h5>
          </v-col>
          <v-col cols="12" md="3">
            <span class="span">Startup Type</span>
            <h5>{{ data.startup_type ? data.startup_type : "-" }}</h5>
          </v-col>
          <v-col cols="12" md="3">
            <span class="span">Industry</span>
            <h5>{{ data.startup_industry ? data.startup_industry : "-" }}</h5>
          </v-col>
          <v-col cols="12" md="3">
            <span class="span">Technology</span>
            <h5>
              {{ data.startup_technology ? data.startup_technology : "-" }}
            </h5>
          </v-col>
        </v-row>
      </div>
    </div>
    <v-divider
      class="my-3 mx-5"
      v-if="data.status === 'active' && !data.statusDescription"
    ></v-divider>
    <v-row v-if="data.status === 'active' && !data.statusDescription">
      <v-col cols="12" md="12">
        <v-btn color="traktor" dark class="d-block ml-auto mr-7" @click="edit()"
          >Edit</v-btn
        >
      </v-col>
    </v-row>
    <v-row
      class="p-more__info mx-2"
      v-if="data.status === 'active' || $route.path === '/about'"
    >
      <v-col cols="12" md="2">
        <span class="span">Mentors</span>
        <h5>{{ getMentors(data.mentorsAssociated) }}</h5>
      </v-col>
      <v-col cols="12" md="2">
        <span class="span">Sector</span>
        <h5>{{ data.sector }}</h5>
      </v-col>
      <v-col cols="12" md="2">
        <span class="span">Program</span>
        <h5>{{ data.program }}</h5>
      </v-col>
      <v-col cols="12" md="2">
        <span class="span">Cohort(Name)</span>
        <h5>{{ data.cohort.name }}</h5>
      </v-col>
      <v-col cols="12" md="2">
        <span class="span">Cohort(Year)</span>
        <h5>{{ data.cohort.year }}</h5>
      </v-col>
      <v-col cols="12" md="2">
        <span class="span">CIN/ Registration Number</span>
        <h5>{{ data.cinNumber }}</h5>
      </v-col>
      <v-col cols="12" md="3">
        <span class="span">Startup Type</span>
        <h5>{{ data.startup_type ? data.startup_type : "-" }}</h5>
      </v-col>
      <v-col cols="12" md="3">
        <span class="span">Industry</span>
        <h5>{{ data.startup_industry ? data.startup_industry : "-" }}</h5>
      </v-col>
      <v-col cols="12" md="3">
        <span class="span">Technology</span>
        <h5>
          {{ data.startup_technology ? data.startup_technology : "-" }}
        </h5>
      </v-col>
    </v-row>
    <startup-edit-modal></startup-edit-modal>
  </div>
</template>
  
<script>
import { mapState } from "vuex";
import StartupEditModal from "../../Modals/StartupEdit";
import Progress from "../Progress.vue";
import copy from "copy-to-clipboard";

export default {
  name: "Profile",
  components: {
    StartupEditModal,
    Progress,
  },
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  props: ["data"],
  data() {
    return {
      statusTextMap: {
        droppedout: "Dropping Out",
        graduated: "Graduating",
        isMobile: false,
      },
    };
  },
  created() {
    this.isMobile = screen.width <= 600;
  },
  methods: {
    getStatusText(status) {
      return this.statusTextMap[status];
    },
    truncateParagraph(maxLength = 80, paragraph) {
      if (paragraph === undefined || paragraph === null) return "";
      return paragraph.length <= maxLength
        ? paragraph
        : paragraph.substring(0, maxLength) + "...";
    },
    getStatus(status) {
      if (status === "active" || status === null) return "Active";
      if (status === "graduated") return "Graduated";
      if (status === "droppedout") return "Dropped out";
    },
    getColor(status) {
      if (status === "active" || status === null) return "#3aa959";
      if (status === "graduated") return "blue";
      if (status === "droppedout") return "red";
    },
    edit() {
      if (
        this.$route.path === "/about" ||
        this.currentUser.role === "incubator"
      )
        this.$store.dispatch("SHOW_STARTUP_EDIT", {
          isShowing: true,
          basicDetails: this.data,
        });
      else this.$router.push("/about");
    },
    getMentors(item) {
      if (item.length === 0) {
        return "Not associated";
      }

      let itm = "";
      item.forEach((it) => {
        itm += it.name + ", ";
      });

      return itm.slice(0, -2);
    },
    copyToClipboard(text) {
      copy(text);
      this.$toast.success(`Copied ${text} to clipboard`, {
        position: "top",
      });
    },
  },
};
</script>

<style scoped>
.wrapper {
  height: 700px;
  /* height: auto; */
  border: 1px solid #e5e5e5;
}

.p-bg {
  height: 33% !important;
  position: relative;
  background-image: url("../../../assets/images/startup-profile-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;
}

.logo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  top: 60%;
  left: 10%;
  position: absolute;
  border: 1px solid #fff;
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.p-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 98%;
  flex-wrap: wrap;
  /* margin-top: 30px; */
}

.p-info__left {
  width: 34%;
  /* text-align: center; */
  display: grid;
  place-items: center;
}

.v-chip {
  font-size: 10px !important;
  height: 18px;
}

.p-info__right {
  /* width: 70%; */
}

a {
  text-decoration: none;
}

.span {
  color: #3e3e3e;
  font-size: 12px;
}

.v-icon {
  color: #3e3e3e;
}

h5 {
  word-break: break-word;
}

h3 {
  color: #4f4f4f;
}

.v-chip {
  height: 20px !important;
}

.socials {
  /* width: 100%; */
}

.socials > * {
  display: block;
  color: #000000de;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
  text-align: left;
  /* padding-left: 2rem; */
}

@media only screen and (max-width: 600px) {
  .wrapper {
    height: 650px;
  }
  .p-bg {
    /* background-image: none; */
    /* height: 40% !important; */
  }
  .logo {
    width: 100px;
    height: 100px;
    top: 75%;
  }

  .p-info {
    margin-top: 10%;
  }
  .p-info__left {
    width: 100%;
  }
  .p-info__right {
    width: 100% !important;
  }
  .p-more__info {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .p-more__info > * {
    width: 100%;
    flex: 1;
  }
}
</style>