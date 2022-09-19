<template>
  <v-container>
    <div class="heading">
      My Forms
      <v-btn
        color="traktor"
        class="white--text float-right"
        @click="newForm()"
        :disabled="newFormLoader"
      >
        <v-icon class="mr-2" v-if="newFormLoader">mdi-cached</v-icon>
        <v-icon class="mr-2" v-else>mdi-plus-circle</v-icon>
        {{ createBtnText }}
      </v-btn>
    </div>
    <div class="template-row mb-10" v-if="myForms.length > 0">
      <div class="template-col" v-for="(form, index) in myForms" :key="index">
        <img :src="form.headerBanner" alt="" />
        <div class="template-title">{{ form.title }}</div>
        <div class="template-actions">
          <span class="timestamp">{{
            new Date(form.createdAt).toDateString()
          }}</span>
          <div class="menu-actions">
            <v-menu offset-y class="menu">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" class="actions-btn">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="edit(form._id)">
                  <v-list-item-title>View</v-list-item-title>
                </v-list-item>
                <v-list-item @click="edit(form._id)">
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="setAsDefault(form)">
                  <v-list-item-title>Set as default</v-list-item-title>
                </v-list-item>
                <v-list-item @click="_delete(form._id)">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
    </div>
    <span v-else>No forms found</span>
    <v-divider class="mt-5"></v-divider>
    <div class="heading">Default templates</div>
    <div class="template-row" v-if="defaultTemplates.length > 0">
      <div
        class="template-col"
        v-for="(template, index) in defaultTemplates"
        :key="index"
      >
        <img :src="template.headerBanner" alt="" />
        <div class="template-title">{{ template.title }}</div>
        <div class="template-actions">
          <span class="timestamp">{{
            new Date(template.createdAt).toDateString()
          }}</span>
          <div class="menu-actions">
            <v-menu offset-y class="menu">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" class="actions-btn">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="edit(template._id)">
                  <v-list-item-title>Edit on form builder</v-list-item-title>
                </v-list-item>
                <v-list-item @click="setAsDefault(template)">
                  <v-list-item-title>Set as default template</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
    </div>
    <span v-else>No templates found</span>
    <v-divider class="mt-5"></v-divider>
    <div class="heading">All templates</div>
    <div class="template-row mb-10" v-if="templates.length > 0">
      <div
        class="template-col"
        v-for="(template, index) in templates"
        :key="index"
      >
        <img :src="template.headerBanner" alt="" />
        <div class="template-title">{{ template.title }}</div>
        <div class="template-actions">
          <span class="timestamp">{{
            new Date(template.createdAt).toDateString()
          }}</span>
          <div class="menu-actions">
            <v-menu offset-y class="menu">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" class="actions-btn">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="create(template)">
                  <v-list-item-title>Edit on form builder</v-list-item-title>
                </v-list-item>
                <v-list-item @click="setAsDefault(template)">
                  <v-list-item-title>Set as default template</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
    </div>
    <span v-else>No templates found</span>
    <v-skeleton-loader type="card@3" v-if="!isLoaded"></v-skeleton-loader>
  </v-container>
</template>

<script>
import { formTemplate } from "../../services/forms/form-template";
import { formObj } from "../../services/forms/form";
import { defaultTemplatesRef } from "../../config/firebase_services";
import { mapState } from "vuex";

export default {
  name: "FormTemplates",
  data() {
    return {
      myForms: [],
      templates: [],
      defaultTemplates: [],
      isLoaded: false,
      createBtnText: "Create new Form",
      newFormLoader: false,
    };
  },
  created() {
    this.getMyForms();
    this.getFormTemplates();
    this.getDefaultTemplates();
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
  methods: {
    async getMyForms() {
      const myForms = await formObj.findByUserId();
      this.myForms = myForms;
    },
    async getFormTemplates() {
      this.templates = await formTemplate.findAll();
      this.isLoaded = true;
    },
    async getDefaultTemplates() {
      const documents = await defaultTemplatesRef
        .doc(this.$store.state.user.currentUser.docId)
        .collection("forms")
        .get();
      documents.forEach((document) => {
        this.defaultTemplates.push(document.data());
      });
    },
    async create(template) {
      delete template._id;
      await formObj.create(template);
      this.getMyForms();
    },
    async setAsDefault(template) {
      try {
        await defaultTemplatesRef
          .doc(this.currentUser.docId)
          .collection("forms")
          .add(template);
        this.$toast.success("Set as default template", {
          position: "top",
        });
      } catch (error) {
        this.$toast.error(error.message, {
          position: "top",
        });
      }
    },
    async newForm() {
      this.newFormLoader = true;
      this.createBtnText = "Creating...";
      const formData = {
        title: "Untitled Form",
        description: "",
        questions: [],
      };
      await formObj.create(formData);
      this.createBtnText = "Create new Form";
      this.newFormLoader = false;
      this.getMyForms();
    },
    async edit(id) {
      const creds = await formObj.authenticateUser();
      formObj.redirectToForm(id, creds);
    },
    async _delete(id) {
      try {
        await formObj._delete(id);
        this.getMyForms();

        this.$toast.success("Form deleted", {
          position: "top",
        });
      } catch (error) {
        this.$toast.error(error.message, {
          position: "top",
        });
      }
    },
  },
};
</script>

<style scoped>
.heading {
  font-size: 28px;
  color: #3aa959;
  margin: 2rem 0;
}

.template-row {
  display: flex;
  flex-wrap: wrap;
}

.template-col {
  width: 31%;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
  padding: 0.5rem;
  cursor: pointer;
  background-color: #fff;
  margin-right: 1rem;
  position: relative;
  height: auto;
  min-height: 200px;
}

.template-col > img {
  width: 100%;
}

.template-title {
  font-size: 20px;
}

.template-actions {
  position: absolute;
  bottom: 5px;
  width: 100%;
}

.timestamp {
  color: #797979;
  font-size: 12px;
}

.menu-actions {
  position: relative;
}

.actions-btn {
  position: absolute;
  right: 10px;
  bottom: 0px;
}
.v-skeleton-loader {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

>>> .v-skeleton-loader__card {
  width: 31% !important;
  height: 200px !important;
}

>>> .v-skeleton-loader__image {
  height: 150px;
}
</style>