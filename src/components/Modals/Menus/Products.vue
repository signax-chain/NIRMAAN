<template>
  <v-card>
    <v-card-title class="heading">Products</v-card-title>
    <v-card-text>
      <div class="product-row">
        <div
          class="product-col mb-5"
          v-for="(product, index) in products"
          :key="index"
          @click="openLink(product)"
        >
          <img
            class="product-icon"
            :src="require(`../../../assets/images/icons/${product.icon}`)"
            alt=""
          />
          <h4 class="product-name" v-html="product.name"></h4>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { formObj } from "../../../services/forms/form";
export default {
  name: "Products",
  created() {
    this.updateProducts();
  },
  data() {
    return {
      products: [
        // {
        //   name: "Startupreneur <span class='branding-text'>Connect</span>",
        //   icon: "connect.svg",
        //   to: "",
        // },
      ],
    };
  },
  methods: {
    openLink(product) {
      if (product.isLink) {
        window.open(product.to, "_blank");
        return;
      }

      if (product.isMethod) {
        console.log(product.methodName);
        eval(product.methodName);
        return;
      }
      this.$router.push(product.to);
    },
    async openFormBuilder() {
      const creds = await formObj.authenticateUser();
      formObj.redirectToForm(Math.random(), creds);
    },
    updateProducts() {
      const role = this.$store.state.user.currentUser.role;

      if (role === "incubator" || role === "mentor") {
        this.products.push(
          // {
          //   name: "Forms",
          //   icon: "forms.svg",
          //   to: "",
          //   isLink: false,
          //   isMethod: true,
          //   methodName: "this.openFormBuilder()",
          // },
          {
            name: "Website",
            icon: "website-icon.svg",
            to: "/official-website",
            isLink: false,
          },
          {
            name: "Notes",
            icon: "contacts.svg",
            to: "/all-notes",
            isLink: false,
          },
          {
            name: "DE",
            icon: "de.svg",
            to: "/disciplined-entrepreneurship",
            isLink: false,
          },
          // {
          //   name: "DE",
          //   icon: "de.svg",
          //   to: "/de",
          //   isLink: false,
          // },
          {
            name: "Resources",
            icon: "resources.svg",
            to: "/resources",
            isLink: false,
          },
          {
            name: "Drive",
            icon: "resources.svg",
            to: "/drive",
            isLink: false,
          }
          // {
          //   name: "Benefits",
          //   icon: "benifits.svg",
          //   to: "/benifits",
          //   isLink: false,
          // }
        );
      }

      if (role === "startup") {
        this.products.push(
          // {
          //   name: "Forms",
          //   icon: "forms.svg",
          //   to: "https://forms-430d4.web.app",
          //   isLink: true,
          // },
          {
            name: "Mentors",
            icon: "mentors.svg",
            to: "/mentors",
            isLink: false,
          },
          {
            name: "Startups",
            icon: "startups.svg",
            to: "/startups",
            isLink: false,
          },
          {
            name: "Contacts",
            icon: "contacts.svg",
            to: "/contacts",
            isLink: false,
          },
          {
            name: "Jobs",
            icon: "jobs.svg",
            to: "/jobs",
            isLink: false,
          },
          {
            name: "DE",
            icon: "de.svg",
            to: "/disciplined-entrepreneurship",
            isLink: false,
          }
        );
      }
    },
  },
};
</script>

<style scoped>
.heading {
  color: #4d4d4d;
}

>>> .branding-text {
  color: #3aa959 !important;
}

.product-row {
  display: flex;
  justify-content: space-between;
  width: 320px;
  flex-wrap: wrap;
}

.product-col {
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  padding: 1rem;
  text-align: center;
  width: 150px;
  cursor: pointer;
}

.product-name {
  color: #424242;
  font-size: 14px;
}

@media only screen and (max-width: 600px) {
}
</style>