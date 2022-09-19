<template>
  <div class="wrapper">
    <h2>Generate Reports</h2>
    <div class="row__1">
      <div>
        <h4 class="my-2">Select category</h4>
        <div class="categories">
          <div
            @click="activeBlock = 'startup'"
            :class="activeBlock === 'startup' ? 'activeBlock' : ''"
          >
            <v-icon :color="activeBlock === 'startup' ? '#fff' : 'traktor'"
              >mdi-school</v-icon
            >
            <h4
              class="ml-2"
              :style="activeBlock === 'startup' ? 'color: #fff' : ''"
            >
              Startups
            </h4>
          </div>
          <!-- <div
            @click="activeBlock = 'mentor'"
            :class="activeBlock === 'mentor' ? 'activeBlock' : ''"
          >
            <v-icon :color="activeBlock === 'mentor' ? '#fff' : 'traktor'"
              >mdi-account-supervisor-circle</v-icon
            >
            <h4
              class="ml-2"
              :style="activeBlock === 'mentor' ? 'color: #fff' : ''"
            >
              Mentors
            </h4>
          </div> -->
        </div>
      </div>
      <div class="mt-5 startup__block" v-if="activeBlock === 'startup'">
        <v-stepper v-model="e" vertical color="traktor">
          <v-stepper-step step="1"> Filters </v-stepper-step>
          <!-- <h4 class="mb-2">Select startups</h4> -->
          <v-stepper-content step="1">
            <!-- <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  outlined
                  placeholder="Search by startup name"
                  dense
                  prepend-inner-icon="mdi-magnify"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="1" class="d-flex align-center mb-6">
                <v-btn @click="showFilters = !showFilters" text color="#8b8b8b">
                  <v-icon color="traktor" class="mr-2"
                    >mdi-filter-variant</v-icon
                  >
                  Filters
                </v-btn>
              </v-col>
            </v-row> -->
            <div class="filters__section" v-show="showFilters">
              <v-btn text color="#8b8b8b">
                <v-icon color="traktor" class="mr-2">mdi-filter-variant</v-icon>
                Filter by
              </v-btn>
              <v-row>
                <v-col cols="12" md="4" class="filter-col">
                  <div class="filter-status pl-5 mt-5">
                    <h5>Status</h5>
                    <div class="d-flex mt-2">
                      <v-chip
                        class="ma-2"
                        outlined
                        v-for="(item, index) in status"
                        :key="index"
                        :color="item.color"
                        :input-value="item.filter"
                        :filter="item.filter"
                        @click="handleStatus(item)"
                      >
                        {{ item.value }}
                      </v-chip>
                    </div>
                  </div>
                  <div class="filter-program pl-5 mt-5">
                    <h5>Program</h5>
                    <div class="d-flex justify-space-between mt-3 flex-wrap">
                      <v-checkbox
                        v-for="(program, index) in programs"
                        :key="index"
                        :label="program"
                        color="traktor"
                        :value="program"
                        v-show="program !== 'Add new +'"
                        hide-details
                        v-model="filters.program"
                        class="mb-2"
                      ></v-checkbox>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="4" class="filter-col">
                  <div class="filter-sector mt-5">
                    <h5>Sector</h5>
                    <v-autocomplete
                      outlined
                      dense
                      label="Select sector"
                      class="mt-2"
                      :items="sectors"
                      multiple
                      clearable
                      v-model="filters.sector"
                    ></v-autocomplete>
                  </div>
                  <div class="filter-cohort">
                    <h5>Cohort</h5>
                    <v-dialog v-model="modal" persistent width="290px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :value="formattedMonthAndYear"
                          outlined
                          dense
                          class="mt-2"
                          placeholder="Select cohort"
                          clearable
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="cohorts"
                        type="month"
                        color="traktor"
                        scrollable
                        multiple
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="red" @click="modal = false">
                          Cancel
                        </v-btn>
                        <v-btn text color="traktor" @click="modal = false">
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="filter-stage mt-5">
                    <h5>Stage</h5>
                    <v-autocomplete
                      outlined
                      dense
                      label="Select stage"
                      class="mt-2"
                      :items="stages"
                      item-text="value"
                      item-value="key"
                      multiple
                      v-model="filters.stage"
                      clearable
                    ></v-autocomplete>
                  </div>
                  <div class="filter-mentors">
                    <h5>Mentors Associated</h5>
                    <v-autocomplete
                      outlined
                      dense
                      label="Select mentors"
                      class="mt-2"
                      :items="mentorsAssociated"
                      item-text="name"
                      item-value="id"
                      multiple
                      v-model="filters.mentorsAssociated"
                      clearable
                    ></v-autocomplete>
                  </div>
                </v-col>
              </v-row>
              <v-row class="mt-5">
                <v-col cols="12" md="12">
                  <div class="float-right">
                    <v-btn text color="red" @click="clearFilters()"
                      >Clear filters</v-btn
                    >
                    <v-btn color="traktor" dark @click="handleFilters()"
                      >Next</v-btn
                    >
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-stepper-content>
          <v-stepper-step step="2"> Filtered Startups </v-stepper-step>
          <v-stepper-content step="2">
            <div class="found-section mt-5">
              <v-btn text color="traktor"
                ><v-icon class="mr-2">mdi-magnify</v-icon
                >{{
                  filteredStartups.length > 0 ? filteredStartups.length : "No"
                }}
                Startups found</v-btn
              >
              <div class="selected-items ml-4 my-5">
                <v-row>
                  <v-col
                    cols="12"
                    md="3"
                    v-for="(item, index) in filteredStartups"
                    :key="index"
                    color="traktor"
                  >
                    <v-checkbox
                      v-model="selectedItems"
                      :value="item"
                      :key="item.docId"
                    >
                      <template v-slot:label>
                        <img
                          :src="item.photoURL"
                          alt=""
                          class="checkbox-img mr-2"
                        />
                        {{ item.name }}
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
                <!-- <v-row>
                  <v-col col="12" md="12">
                    <v-btn
                      text
                      color="traktor"
                      class="d-block ml-auto"
                      @click="
                        filteredStartups.length === startups.length
                          ? viewLessStartups()
                          : viewAllStartups()
                      "
                      >{{
                        filteredStartups.length === startups.length
                          ? "View less startups"
                          : "View all startups"
                      }}
                      <v-icon class="ml-2">mdi-arrow-right</v-icon></v-btn
                    >
                  </v-col>
                </v-row> -->
              </div>
              <v-row class="mt-5">
                <v-col cols="12" md="12">
                  <div class="float-right">
                    <v-btn color="traktor" class="mr-3" dark @click="e = 1"
                      >Back</v-btn
                    >
                    <v-btn color="traktor" dark @click="e = 3">Next</v-btn>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-stepper-content>
          <v-stepper-step step="3">Select Fields to export</v-stepper-step>
          <v-stepper-content step="3">
            <div class="filter-info">
              <!-- <v-btn text color="#8b8b8b"
                ><v-icon color="traktor" class="mr-2">mdi-text</v-icon>Select
                information</v-btn
              > -->
              <div class="select-info mt-5">
                <v-row class="ml-1">
                  <v-col cols="12" md="3">
                    <v-checkbox
                      color="traktor"
                      label="All details"
                      v-model="filterInfo.all"
                      @change="handleAllFilterInfo"
                      :indeterminate="filterInfo.all"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-checkbox
                      color="traktor"
                      label="Awards & Recognitions"
                      v-model="filterInfo.awards"
                      @change="handleOtherFilterInfo"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-checkbox
                      color="traktor"
                      label="Cohort details"
                      v-model="filterInfo.cohort"
                      @change="handleOtherFilterInfo"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-checkbox
                      color="traktor"
                      label="About startup"
                      v-model="filterInfo.description"
                      @change="handleOtherFilterInfo"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-checkbox
                      color="traktor"
                      label="Email address"
                      v-model="filterInfo.email"
                      @change="handleOtherFilterInfo"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-checkbox
                      color="traktor"
                      label="Founders"
                      v-model="filterInfo.founders"
                      @change="handleOtherFilterInfo"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-checkbox
                      color="traktor"
                      label="Mentor(s)"
                      v-model="filterInfo.mentorsAssociated"
                      @change="handleOtherFilterInfo"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-checkbox
                      color="traktor"
                      label="Phone number"
                      v-model="filterInfo.phoneNumber"
                      @change="handleOtherFilterInfo"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-checkbox
                      color="traktor"
                      label="Program"
                      v-model="filterInfo.program"
                      @change="handleOtherFilterInfo"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-checkbox
                      color="traktor"
                      label="Sector"
                      v-model="filterInfo.sector"
                      @change="handleOtherFilterInfo"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-checkbox
                      color="traktor"
                      label="Social links"
                      v-model="filterInfo.socialLinks"
                      @change="handleOtherFilterInfo"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-checkbox
                      color="traktor"
                      label="Team details"
                      v-model="filterInfo.teamMembers"
                      @change="handleOtherFilterInfo"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-checkbox
                      color="traktor"
                      label="Status"
                      v-model="filterInfo.status"
                      @change="handleOtherFilterInfo"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-checkbox
                      color="traktor"
                      label="Stage"
                      v-model="filterInfo.stage"
                      @change="handleOtherFilterInfo"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-checkbox
                      color="traktor"
                      label="In nirmaan since"
                      v-model="filterInfo.since"
                      @change="handleOtherFilterInfo"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-checkbox
                      color="traktor"
                      label="Funding"
                      v-model="filterInfo.funding"
                      @change="handleOtherFilterInfo"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </div>
              <v-row class="mt-5">
                <v-col cols="12" md="12">
                  <div class="float-right">
                    <v-btn color="traktor" class="mr-3" dark @click="e = 2"
                      >Back</v-btn
                    >
                    <v-btn color="traktor" dark @click="generateReport()"
                      >Generate Report</v-btn
                    >
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-stepper-content>
        </v-stepper>
      </div>
      <div class="mentor__block mt-5" v-if="activeBlock === 'mentor'">
        <h1>Mentors block</h1>
      </div>
    </div>
    <progress-loader
      :visible="progressLoader"
      loaderText="preparing the report"
      @close="progressLoader = false"
    ></progress-loader>
  </div>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";
import { getSectors, getStages } from "../../services/dynamics";
import { getMentorsAssociated, getAllStartups } from "../../services/Startups";
import ProgressLoader from "../../components/Modals/Loaders/ProgressLoader.vue";

export default {
  components: { ProgressLoader },
  name: "ReportsV2",
  computed: {
    formattedMonthAndYear() {
      return this.cohorts.map((cohort) =>
        cohort ? moment(cohort).format("MMM YYYY") : ""
      );
    },
    ...mapState({ programs: (state) => state.dynamics.programs }),
  },
  data() {
    return {
      progressLoader: false,
      showFilters: true,
      cohorts: [],
      modal: false,
      selectedItems: [],
      activeBlock: "startup",
      sectors: [],
      stages: [],
      status: [
        {
          key: "active",
          value: "Active",
          color: "traktor",
          filter: false,
        },
        {
          key: "graduated",
          value: "Graduated",
          color: "blue",
          filter: false,
        },
        {
          key: "droppedout",
          value: "Dropped out",
          color: "red",
          filter: false,
        },
      ],
      mentorsAssociated: [],
      startups: [
        {
          docid: "all",
          name: "All Startup",
          photoURL:
            "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/icons%2Fmdi_school.png?alt=media&token=34ace762-db39-4281-8f78-dc176d27200d",
        },
      ],
      filteredStartups: [],
      filters: {
        status: [],
        program: [],
        sector: [],
        cohortMonth: [],
        cohortYear: [],
        stage: [],
        mentorsAssociated: [],
      },
      filterInfo: {
        all: false,
        awards: false,
        cohort: false,
        description: false,
        email: false,
        founders: false,
        mentorsAssociated: false,
        name: true,
        photoURL: true,
        phoneNumber: false,
        program: false,
        sector: false,
        socialLinks: false,
        teamMembers: false,
        status: false,
        stage: false,
        since: false,
        funding: false,
      },
      keyMap: {
        awards: "Awards & Recognitions",
        cohort: "Cohort",
        description: "Description",
        email: "Email",
        founders: "Founders",
        mentorsAssociated: "Mentors Associated",
        name: "Startup",
        photoURL: "Photo URL",
        phoneNumber: "Phone Number",
        program: "Program",
        sector: "Sector",
        socialLinks: "Social Links",
        teamMembers: "Team Members",
        status: "Status",
        stage: "Stage",
        since: "In Nirmaan Since",
        funding: "Funding",
      },
      e: 1,
      filteredData: [],
    };
  },
  created() {
    this.initializeData();
  },
  methods: {
    async initializeData() {
      const incubatorId = this.$store.state.incubator.currentIncubator.docId;
      this.sectors = await getSectors(incubatorId);
      this.mentorsAssociated = await getMentorsAssociated(incubatorId);
      this.stages = await getStages(incubatorId);
      this.startups = [
        ...this.startups,
        ...(await getAllStartups(incubatorId)),
      ];
      this.handleFormat();
      this.viewLessStartups();
    },
    handleFormat() {
      this.startups.forEach((startup) => {
        startup.cohortMonth = startup.cohort?.name;
        startup.cohortYear = startup.cohort?.year;
        startup.stage = startup.progress?.currentStage;
        startup.mentorsAssociated = startup?.mentorsAssociated
          ? startup.mentorsAssociated.map((mentor) => mentor.id)
          : null;
      });
      // const ma = this.startups.map((startup) => startup.mentorsAssociated);
    },
    viewAllStartups() {
      this.filteredStartups = this.startups;
    },
    viewLessStartups() {
      this.filteredStartups = this.startups.slice(
        0,
        Math.floor(this.startups.length * 0.2)
      );
    },
    handleStatus(item) {
      item.filter = !item.filter;
      if (item.filter) this.filters.status = [...this.filters.status, item.key];
      else
        this.filters.status = this.filters.status.filter(
          (status) => status !== item.key
        );
    },
    async handleFilters() {
      const splitCohorts = this.formattedMonthAndYear.map((v) => v.split(" "));
      this.filters.cohortMonth = [...new Set(splitCohorts.map((v) => v[0]))];
      this.filters.cohortYear = [...new Set(splitCohorts.map((v) => +v[1]))];
      this.filteredStartups = await this.filterStartups();
      this.e = 2;
    },
    clearFilters() {
      this.status.forEach((status) => {
        status.filter = false;
      });
      this.filters = {
        status: [],
        program: [],
        sector: [],
        cohortMonth: [],
        cohortYear: [],
        stage: [],
        mentorsAssociated: [],
      };
      this.filteredStartups = this.startups;
    },
    filterStartups() {
      let filterFrom = [];
      this.filteredData = this.startups;
      Object.keys(this.filters).forEach((value, index) => {
        filterFrom = index === 0 ? this.startups : this.filteredData;
        if (this.filters[value].length === 0) return;
        let data = [];

        if (value === "mentorsAssociated") {
          this.filters[value].forEach((v) => {
            const temp = filterFrom.filter((dt) => dt[value].includes(v));
            data = [...data, ...temp];
          });
          this.filteredData = data;
          return;
        }

        this.filters[value].forEach((v) => {
          const temp = filterFrom.filter((dt) => dt[value] === v);
          data = [...data, ...temp];
        });
        this.filteredData = data;
      });
      this.selectedItems = this.filteredData;
      return this.filteredData;
    },
    handleAllFilterInfo() {
      if (this.filterInfo.all)
        Object.keys(this.filterInfo).forEach(
          (key) => (this.filterInfo[key] = true)
        );
      else
        Object.keys(this.filterInfo).forEach(
          (key) => (this.filterInfo[key] = false)
        );
      this.filterInfo.name = true;
      this.filterInfo.photoURL = true;
    },
    handleOtherFilterInfo() {
      this.filterInfo.all = true;
      const item = Object.values(this.filterInfo).find(
        (value) => value === false
      );
      if (item === undefined) this.filterInfo.all = true;
      else this.filterInfo.all = false;
    },
    generateReport() {
      this.prepareReportData();
    },
    prepareReportData() {
      this.progressLoader = true;
      const reportData = [];
      const keys = Object.keys(this.filterInfo).filter(
        (key) => this.filterInfo[key] === true
      );
      this.selectedItems.forEach((startup) => {
        let data = {};
        keys.forEach((key) => {
          // if (index === 0) return;
          data[this.keyMap[key]] = startup[key];
        });
        reportData.push(data);
      });
      setTimeout(() => {
        this.progressLoader = false;
        this.$router.push({
          path: "/report-visualize",
          name: "ReportVisualizer",
          params: { data: reportData },
        });
      }, 3000);
    },
  },
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  height: auto;
  min-height: 100%;
  background-color: #fff;
  border-radius: 5px;
  padding: 1.5rem;
  border: 1px solid #ccc;
}

h2 {
  color: #4f4f4f;
}

.row__1 {
  border-top: 1px solid #ccc;
  height: auto;
  margin-top: 1rem;
}

.activeBlock {
  background-color: #3aa959;
}

h4 {
  color: #8b8b8b;
  font-weight: 400;
}

.categories {
  display: flex;
  width: 28%;
  justify-content: space-between;
}

.categories > div {
  /* background-color: #3aa959; */
  border-radius: 5px;
  padding: 1rem;
  display: flex;
  border: 1px solid #ccc;
  cursor: pointer;
}

.filter__block {
  cursor: pointer;
  background-color: #f8f8f8;
  border-radius: 5px;
  height: 100%;
}

.filters__section {
  width: 100%;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: all 0.5s ease-in-out;
  padding: 1rem 0.5rem;
  overflow: hidden;
}

.filter-col {
  border-right: 1px solid #ccc;
}

.v-chip {
  font-size: 12px !important;
  cursor: pointer;
}

.filter-info {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 1rem 0;
}

>>> .v-input--selection-controls {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

>>> .v-messages {
  min-height: 0 !important;
}

.checkbox-img {
  width: 25px;
  height: 25px;
  border-radius: 50%;
}
</style>