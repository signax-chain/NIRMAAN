<template>
  <div class="wrapper">
    <v-card elevation>
      <v-tabs
        background-color="traktor"
        dark
        center-active
        centered
        grow
        v-model="tab"
      >
        <v-tabs-slider color="white"></v-tabs-slider>
        <v-tab>Announcement </v-tab>
        <v-tab>Main slider </v-tab>
        <v-tab>Second slider </v-tab>
        <v-tab>Board members </v-tab>
        <v-tab>Team </v-tab>
        <v-tab>Partners </v-tab>
        <v-tab>Gallery </v-tab>
        <v-tab>Newsletter </v-tab>
        <v-tab>Testimonial </v-tab>
        <v-tab>Latest news </v-tab>
        <v-tab>Jobs </v-tab>
        <v-tab>Apply Link </v-tab>
        <v-tab-item>
          <v-card flat tile>
            <v-card-text>
              <announcement></announcement>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat tile>
            <v-card-text>
              <MainSlider />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat tile>
            <v-card-text>
              <SecondSlider />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat tile>
            <v-card-text>
              <BoardMembers />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat tile>
            <v-card-text>
              <TeamMembers />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat tile>
            <v-card-text>
              <Partners />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat tile>
            <v-card-text>
              <Gallery />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat tile>
            <v-card-text>
              <NewsLetters />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat tile>
            <v-card-text>
              <Testimonials />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat tile>
            <v-card-text>
              <LatestNews />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <job></job>
        </v-tab-item>
        <v-tab-item>
          <apply-links></apply-links>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
import BoardMembers from "@/components/OfficialWebsite/BoardMembers";
import TeamMembers from "@/components/OfficialWebsite/TeamMembers";
import Testimonials from "@/components/OfficialWebsite/Testimonials";
import Gallery from "@/components/OfficialWebsite/Gallery";
import Partners from "@/components/OfficialWebsite/Partners";
import NewsLetters from "@/components/OfficialWebsite/NewsLetters";
import LatestNews from "@/components/OfficialWebsite/LatestNews";
import MainSlider from "@/components/OfficialWebsite/MainSlider";
import SecondSlider from "@/components/OfficialWebsite/SecondSlider";
import Announcement from "../../components/OfficialWebsite/Announcement.vue";
import Job from "../Startup/Job.vue";
import ApplyLinks from "../../components/OfficialWebsite/ApplyLinks.vue";

export default {
  name: "OfficialWebsite",
  components: {
    MainSlider,
    SecondSlider,
    BoardMembers,
    TeamMembers,
    Testimonials,
    Gallery,
    Partners,
    NewsLetters,
    LatestNews,
    Announcement,
    Job,
    ApplyLinks,
  },
  data() {
    return {
      tab: null,
    };
  },
};
</script>

<style scoped>
.v-tab {
  color: #fff;
  font-weight: bold;
  font-size: 16px !important;
  text-transform: capitalize !important;
}

@media only screen and (max-width: 600px) {
  .back__nav {
    display: none;
  }
}
</style>