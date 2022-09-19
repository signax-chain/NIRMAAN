<template>
  <v-container>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <div class="d-flex justify-space-between align-center mx-5 mb-3">
      <h3 class="heading">Booster Kits</h3>
      <!-- <v-btn dark color="traktor" v-if="currentUser.role === 'incubator'"
        >Add new benifit</v-btn
      > -->
    </div>
    <div class="wrapper mx-5">
      <h3 class="heading ml-0">All Perks & Offers</h3>
      <div class="d-flex justify-space-between mt-5">
        <div class="d-flex">
          <v-text-field
            outlined
            dense
            label="Search for offers"
            append-icon="mdi-magnify"
          ></v-text-field>
        </div>
        <div>
          <v-btn
            dark
            color="traktor"
            @click="addNewPerkDialog = true"
            v-if="
              currentUser.role === 'incubator' ||
              currentUser.role === 'sIncubator'
            "
            >Add new perk</v-btn
          >
        </div>
      </div>
      <h4>Categories</h4>
      <div>
        <v-chip
          class="ma-2"
          color="traktor"
          v-for="(category, index) in categories"
          :key="index"
          outlined
        >
          {{ category }}
        </v-chip>
      </div>
      <div class="perks-row d-flex mt-5 flex-wrap justify-space-between">
        <div class="perk mb-5" v-for="(perk, index) in perks" :key="index">
          <v-btn icon color="traktor" class="d-block ml-auto"
            ><v-icon>mdi-arrow-top-right</v-icon></v-btn
          >
          <img
            :src="require(`../../assets/images/${perk.logo}`)"
            alt=""
            class="d-block mx-auto"
            width="250px"
          />
          <div>
            <v-chip
              class="ma-2"
              color="traktor"
              v-for="(tag, index) in perk.tags"
              :key="index"
              dark
              style="font-size: 12px"
            >
              {{ tag }}
            </v-chip>
          </div>
          <div class="perk-info">
            <h4 class="title">{{ perk.title }}</h4>
            <p>{{ perk.description }}</p>
          </div>
          <h4 class="title">Benifits</h4>
          <p>{{ perk.benifits }}</p>
        </div>
      </div>
    </div>
    <add-new-benifit
      :visible="addNewPerkDialog"
      @close="addNewPerkDialog = false"
    ></add-new-benifit>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import AddNewBenifit from "../Modals/Incubator/AddNewBenifit.vue";
export default {
  components: { AddNewBenifit },
  name: "AllBenifits",
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
  data() {
    return {
      addNewPerkDialog: false,
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Benifits",
          disabled: true,
        },
        {
          text: "All Benifits",
          disabled: true,
        },
      ],
      categories: [
        "All",
        "Cloud",
        "Design",
        "Developer tools",
        "Domains",
        "Game development",
        "Infrastructure & APIs",
        "Internet of Things",
        "Learn",
        "Marketing",
        "Mobile",
        "Productivity",
        "Security & analytics",
        "Virtual Events",
      ],
      perks: [
        {
          logo: "canva.png",
          title: "Canva",
          description:
            "Canva is a free, online drawing and design tool for the web. It lets you create beautiful designs in seconds, and share them with friends and the world.",
          benifits:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices odio eros vitae rhoncus, lectus lorem cras.",
          tags: ["Design", "Marketing", "Productivity"],
        },
        {
          logo: "digital-ocean.png",
          title: "Digital Ocean",
          description:
            "Digital Ocean is a cloud platform for developers and teams. We provide a simple, secure, and reliable way to manage your cloud infrastructure.",
          benifits:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices odio eros vitae rhoncus, lectus lorem cras.",
          tags: ["Design", "Marketing", "Productivity"],
        },
        {
          logo: "namecheap.png",
          title: "Namecheap",
          description:
            "Namecheap is a domain name registration and management service that offers a simple, secure, and reliable way to manage your domain registration.",
          benifits:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices odio eros vitae rhoncus, lectus lorem cras.",
          tags: ["Design", "Marketing", "Productivity"],
        },
        {
          logo: "jetbrains.png",
          title: "JetBrains",
          description:
            "JetBrains is a cloud platform for developers and teams. We provide a simple, secure, and reliable way to manage your cloud infrastructure.",
          benifits:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices odio eros vitae rhoncus, lectus lorem cras.",
          tags: ["Design", "Marketing", "Productivity"],
        },
        {
          logo: "microsoft-azure.png",
          title: "Microsoft Azure",
          description:
            "Microsoft Azure is a cloud platform for developers and teams. We provide a simple, secure, and reliable way to manage your cloud infrastructure.",
          benifits:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices odio eros vitae rhoncus, lectus lorem cras.",
          tags: ["Design", "Marketing", "Productivity"],
        },
        {
          logo: "github.png",
          title: "Github",
          description:
            "Github is a cloud platform for developers and teams. We provide a simple, secure, and reliable way to manage your cloud infrastructure.",
          benifits:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices odio eros vitae rhoncus, lectus lorem cras.",
          tags: ["Design", "Marketing", "Productivity"],
        },
      ],
    };
  },
};
</script>

<style scoped>
.heading {
  color: #4d4d4d;
  font-weight: 500;
}

.wrapper {
  background-color: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  padding: 1rem;
}

h4 {
  color: #4f4f4f;
  font-weight: normal;
}

.perk {
  border: 1px solid #dbdbdb;
  width: 30%;
  border-radius: 10px;
  padding: 1rem;
}

p {
  color: #828282;
  font-size: 14px;
}
</style>