import Vue from "vue";
import VueRouter from "vue-router";

import isLoggedIn from "../services/authGuard";
import store from "../store";

import Events from "../views/Incubator/Events.vue";
import CreateEvent from "../components/Events/CreateEvent.vue";
import RequestSpeaker from "../components/Events/RequestSpeaker.vue";

import Mentorship from "../views/Incubator/Mentorship.vue";
import ScheduleSession from "../components/Mentorship/ScheduleSession.vue";
import RequestMentor from "../components/Mentorship/RequestMentor.vue";
import MentorAvailability from "../components/Mentorship/MentorAvailability.vue";

import OfficialWebsite from "../views/Configurations/OfficialWebsite.vue";
import Startups from "../views/Incubator/Startups.vue";
import Timeline from "../components/DisciplinedEntrepreneurship/Timeline.vue";
import DEWorksheet from "../components/DisciplinedEntrepreneurship/Worksheet/DEWorksheet.vue";
import Startupship from "../views/Incubator/Startupship.vue";

import MyStartups from "../components/Mentor/MyStartups.vue";
import AllStartups from "../components/Mentor/AllStartups.vue";
import ReportsV2 from "../views/Reports/ReportsV2.vue";
import ReportVisualizer from "../views/Reports/ReportVisualizer2.vue";

import FormTemplates from "../views/Forms/Templates.vue";
import ResumeDashboard from "../views/Startup/ResumeDashboard.vue";
import ResumeMentorDashboard from "../views/Mentor/ResumeDashboard.vue";
import CreateNewJob from "../components/Startup/Jobs/CreateNewJob.vue";

import RaiseRequest from "../components/Common/RaiseRequest.vue";
import AllRequests from "../views/Requests/AllRequests.vue";
import InternshipCertificateTemplate from "../components/Templates/InternshipCertificates.vue";

import AllNotifications from "../components/Notifications/List.vue";

import Incubators from "../views/SuperIncubator/Incubators.vue";
import AllBenifits from "../components/Benifits/AllBenifits.vue";
import IncubatorProfile from "../views/SuperIncubator/IncubatorProfile.vue";

import AllResources from "../components/Resources/AllResources.vue";
import StartupFunding from "../views/Accountant/StartupFunding.vue";
import FundingForm from "../views/Accountant/FundingForm.vue";
import StartupDocuments from "../views/Startup/Documents.vue";

import CreateConnection from "../components/Contacts/EstablishConnection.vue";

import LinkedInCallBack from "../views/Auth/LinkedInCallBack.vue";

import SSO from "../views/Auth/SSO.vue";
import IncubatorSettings from "../views/Incubator/Settings.vue";

import DeV2 from "../views/DeV2/DeV2.vue";
import LinkedInData from "../views/Auth/LinkedInData.vue";
import Externals from "../views/Externals.vue";
import Drive from "../views/Incubator/Drive.vue";

import AwsCreditApply from "../components/Benifits/AWS/ApplyForm.vue";
import RequestsRaised from "../components/Benifits/AWS/RequestsRaised.vue";
import AwsApplicationStatus from '../components/Benifits/AWS/ApplicationStatus.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Auth/Login.vue"),
  },
  {
    path: "/nirmaan-iitm",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Auth/Login.vue"),
  },
  {
    path: "/dashboard",
    // name: "Dashboard",
    component: () => {
      if (store.state.user.currentUser.role === "sIncubator")
        return import(
          /* webpackChunkName: "dashboard" */ "../views/SuperIncubator/Dashboard.vue"
        );
      if (
        store.state.user.currentUser.role === "incubator" ||
        store.state.user.currentUser.role === "member"
      )
        return import(
          /* webpackChunkName: "dashboard" */ "../views/Incubator/Dashboard.vue"
        );
      if (store.state.user.currentUser.role === "mentor")
        return import(
          /* webpackChunkName: "mentordashboard" */ "../views/Mentor/Dashboard.vue"
        );
      if (store.state.user.currentUser.role === "startup")
        return import(
          /* webpackChunkName: "resumedashboard" */ "../views/Startup/ResumeDashboard.vue"
        );
      if (store.state.user.currentUser.role === "accountant")
        return import(
          /* webpackChunkName: "accountantdashboard" */ "../views/Accountant/Dashboard.vue"
        );
    },
  },
  {
    path: "/startups",
    component: Startups,
  },
  {
    path: "/mentor-startups",
    name: "MyStartups",
    component: MyStartups,
  },
  {
    path: "/all-startups",
    name: "AllStartups",
    component: AllStartups,
  },
  {
    path: "/startup/new",
    name: "AddNewStartup",
    component: () =>
      import(
        /* webpackChunkName: "addnewstartup" */ "../components/Incubator/AddNewStartup.vue"
      ),
  },
  {
    path: "/startup/:id",
    name: "ResumeDashboard",
    component: () =>
      import(
        /* webpackChunkName: "startupdashboard" */ "../views/Startup/ResumeDashboard.vue"
      ),
  },
  {
    path: "/documentation",
    name: "Documentation",
    component: () =>
      import(
        /* webpackChunkName: "documentation" */ "../views/Documentation.vue"
      ),
  },
  {
    path: "/contacts",
    name: "Contacts",
    component: () =>
      import(
        /* webpackChunkName: "contacts" */ "../views/Startup/Contacts.vue"
      ),
  },
  {
    path: "/connections",
    name: "Connections",
    component: () => {
      if (store.state.user.currentUser.role === "startup")
        return import(
          /* webpackChunkName: "connections" */ "../views/Startup/Connections.vue"
        );
      if (
        store.state.user.currentUser.role === "incubator" ||
        store.state.user.currentUser.role === "member" ||
        store.state.user.currentUser.role === "sIncubator"
      )
        return import(
          /* webpackChunkName: "connections" */ "../views/Incubator/Connections.vue"
        );
    },
  },
  {
    path: "/connections/new",
    name: "CreateConnection",
    component: CreateConnection,
  },
  {
    path: "/mentor/new",
    name: "AddNewMentor",
    component: () =>
      import(
        /* webpackChunkName: "addnewsmentor" */ "../components/Incubator/AddNewMentor.vue"
      ),
  },
  {
    path: "/mentor/:id",
    name: "MentorProfile",
    component: ResumeMentorDashboard,
  },
  {
    path: "/mentors",
    name: "Mentors",
    component: () =>
      import(
        /* webpackChunkName: "mentors" */ "../views/Incubator/Mentors.vue"
      ),
  },
  {
    path: "/mentorship",
    name: "Mentorship",
    component: Mentorship,
  },
  {
    path: "/mentorship/schedule-session",
    name: "ScheduleSession",
    component: ScheduleSession,
  },
  {
    path: "/mentorship/request-mentor",
    name: "RequestMentor",
    component: RequestMentor,
  },
  {
    path: "/mentorship/mentor-availability",
    name: "MentorAvailability",
    component: MentorAvailability,
  },
  {
    path: "/startupship",
    component: Startupship,
    name: "Startupship",
  },
  {
    path: "/startupship/:id",
    component: Startupship,
  },
  {
    path: "/events",
    name: "Events",
    component: Events,
  },
  {
    path: "/events/new",
    name: "CreateEvent",
    component: CreateEvent,
  },
  {
    path: "/events/request-speaker",
    name: "RequestSpeaker",
    component: RequestSpeaker,
  },
  {
    path: "/event/update-availability/:id",
    name: "UpdateSpeakerAvailability",
    component: () =>
      import(
        /* webpackChunkName: "updatespeakeravailability" */ "../components/Links/Events/UpdateAvailability.vue"
      ),
  },
  {
    path: "/event/register/:id",
    name: "EventRegister",
    component: () =>
      import(
        /* webpackChunkName: "eventregister" */ "../components/Links/Events/Register.vue"
      ),
  },
  {
    path: "/event/feedback/:id",
    name: "EventFeedback",
    component: () =>
      import(
        /* webpackChunkName: "eventfeedback" */ "../components/Links/Events/Feedback.vue"
      ),
  },
  {
    path: "/event/view/:id",
    name: "ViewEvent",
    component: () =>
      import(
        /* webpackChunkName: "viewevent" */ "../components/Events/ViewEvent.vue"
      ),
  },
  {
    path: "/mentorship/update-availability/:id",
    name: "UpdateMentorAvailability",
    component: () =>
      import(
        /* webpackChunkName: "updatementoravailability" */ "../components/Links/Mentorship/UpdateAvailability.vue"
      ),
  },
  {
    path: "/startupship/update-availability/:id",
    name: "UpdateStartupAvailability",
    component: () =>
      import(
        /* webpackChunkName: "updateStartupAvailability" */ "../components/Links/Startupship/UpdateAvailability.vue"
      ),
  },
  {
    path: "/mentorship/feedback/:type/:id",
    name: "Feedback",
    component: () =>
      import(
        /* webpackChunkName: "feedback" */ "../components/Links/Mentorship/Feedback.vue"
      ),
  },
  // {
  //   path: '/mentorship/notes/:type/:id',
  //   name: 'DocumentEditor',
  //   component: () => import("../components/SpecialComps/DocumentEditor.vue")
  // },
  {
    path: "/progress",
    name: "Progress",
    component: () =>
      import(
        /* webpackChunkName: "progress" */ "../views/Incubator/Progress.vue"
      ),
  },
  {
    path: "/reports",
    name: "ReportsV2",
    component: ReportsV2,
  },
  {
    path: "/report-visualize",
    name: "ReportVisualizer",
    component: ReportVisualizer,
  },
  {
    path: "/report/ir/:sm/:id",
    name: "InReport",
    component: () =>
      import(
        /* webpackChunkName: "inreport" */ "../components/Reports/IndividualReport.vue"
      ),
  },
  {
    path: "/report/clr/:cn/:cy",
    name: "CLReport",
    component: () =>
      import(
        /* webpackChunkName: "clreport" */ "../components/Reports/CohortLevelReport.vue"
      ),
  },
  {
    path: "/activities",
    name: "Activities",
    component: () =>
      import(
        /* webpackChunkName: "activities" */ "../views/Incubator/Activities.vue"
      ),
  },
  {
    path: "/uploads",
    name: "Uploads",
    component: () =>
      import(
        /* webpackChunkName: "uploads" */ "../views/Configurations/Uploads.vue"
      ),
  },
  {
    path: "/official-website",
    name: "OfficialWebsite",
    component: OfficialWebsite,
  },
  {
    path: "/de",
    component: Timeline,
    name: "Timeline",
  },
  // {
  //   path: "/de-progress",
  //   component: DeV2,
  // },
  // {
  //   path: "/de/:docId",
  //   component: Timeline,
  //   name: "STimeline",
  // },
  {
    path: "/de",
    component: Timeline,
    name: "Timeline",
  },
  {
    path: "/de-progress",
    component: Timeline,
  },
  {
    path: "/de/:docId",
    component: Timeline,
    name: "STimeline",
  },
  {
    path: "/de/:mid/:sid",
    name: "DEWorksheet",
    component: DEWorksheet,
  },
  {
    path: "/coming-soon",
    name: "ComingSoon",
    component: () =>
      import(
        /* webpackChunkName: "comingsoon" */ "../views/Others/ComingSoon.vue"
      ),
  },
  {
    path: "/notes/new",
    name: "DocumentEditor",
    component: () => import("../components/SpecialComps/DocumentEditor.vue"),
  },
  {
    path: "/notes/:id",
    component: () => import("../components/SpecialComps/DocumentEditor.vue"),
  },
  {
    path: "/all-notes",
    name: "MyNotes",
    component: () => import("../components/SpecialComps/MyNotes.vue"),
  },
  {
    path: "/jobs",
    name: "Job",
    component: () => import("../views/Startup/Job.vue"),
  },
  {
    path: "/jobs/new",
    name: "CreateNewJob",
    component: CreateNewJob,
  },
  {
    path: "/profile",
    component: ResumeMentorDashboard,
  },
  {
    path: "/form/templates",
    component: FormTemplates,
  },
  {
    path: "/about",
    name: "About",
    component: ResumeDashboard,
  },
  {
    path: "/raise-request",
    name: "RaiseRequest",
    component: RaiseRequest,
  },
  {
    path: "/all-requests",
    name: "AllRequests",
    component: AllRequests,
  },
  {
    path: "/internship-certificate/:id",
    name: "InternshipCertificate",
    component: InternshipCertificateTemplate,
  },
  {
    path: "/notifications",
    name: "AllNotifications",
    component: AllNotifications,
  },
  {
    path: "/incubators",
    name: "Incubators",
    component: Incubators,
  },
  {
    path: "/benifits",
    name: "Benifits",
    component: AllBenifits,
  },
  {
    path: "/incubator/:id",
    name: "IncubatorProfile",
    component: IncubatorProfile,
  },
  {
    path: "/resources",
    name: "Resources",
    component: AllResources,
  },
  {
    path: "/startups/:id/funding",
    name: "StartupFunding",
    component: StartupFunding,
  },
  {
    path: "/startup/:id/documents",
    name: "StartupDocuments",
    component: StartupDocuments,
  },
  {
    path: "/funding/create",
    name: "FundingForm",
    component: FundingForm,
  },
  {
    path: "/auth/sso/vOMMq1OjWPSyR8ddnYfmFrnw8v83",
    name: "Login",
    component: SSO,
  },
  {
    path: "/auth/linkedin/callback",
    name: "LinkedInCallBack",
    component: LinkedInCallBack,
  },
  {
    path: "/settings",
    name: "IncubatorSettings",
    component: IncubatorSettings,
  },
  {
    path: "/disciplined-entrepreneurship",
    name: "DeV2",
    component: DeV2,
  },
  {
    path: "/disciplined-entrepreneurship/:id",
    name: "Dev2",
    component: DeV2,
  },
  {
    path: "/linkedin-data",
    name: "LinkedInData",
    component: LinkedInData,
  },
  {
    path: "/externals",
    name: "Externals",
    component: Externals,
  },
  {
    path: "/aws-credit/apply",
    name: "AwsCreditApply",
    component: AwsCreditApply,
  },
  {
    path: "/requests-raised",
    name: "RequestsRaised",
    component: RequestsRaised,
  },
  {
    path: '/aws-credits/:id',
    name: 'AwsApplicationStatus',
    component: AwsApplicationStatus,
  },
  {
    path: "/drive",
    name: "Drive",
    component: Drive,
  },
  {
    path: "*",
    name: "NotFound",
    component: () =>
      import(/* webpackChunkName: "notfound" */ "../views/Others/404.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  window.scrollTo(0, 0);
  const isAuthenticated = await isLoggedIn();
  if (to.name !== "Login" && !isAuthenticated) {
    if (
      to.name === "AddNewStartup" ||
      to.name === "EventRegister" ||
      to.name === "EventFeedback" ||
      to.name === "UpdateMentorAvailability" ||
      to.name === "UpdateStartupAvailability" ||
      to.name === "Feedback" ||
      to.name === "InReport"
      // to.name === "CLReport"
    ) {
      next();
      return;
    }
    next({ name: "Login" });
  } else next();

  if (to.name === "Login" && isAuthenticated) {
    next({ name: "Dashboard" });
  }
});

export default router;
