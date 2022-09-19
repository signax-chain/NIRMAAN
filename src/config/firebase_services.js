import firebase from "firebase";

// services
const auth = firebase.auth();
const db = firebase.firestore();
const storageRef = firebase.storage().ref();
const messaging = firebase.messaging();

//collections
const usersRef = db.collection("users");
const startupsRef = db.collection("startups");
const mentorsRef = db.collection("mentors");
const membersRef = db.collection("members");
const incubatorsRef = db.collection("incubators");
const activityRef = db.collection("activities");
const startupProgressRef = db.collection("startupProgress");
const mentorProgressRef = db.collection("mentorProgress");
const mentorshipRef = db.collection("mentorship");
const startupshipRef = db.collection("startupship");
const mentorAvailabilityRef = db.collection("mentorAvailability");
const startupAvailabilityRef = db.collection("startupAvailability");
const loginAuditRef = db.collection("loginAudits");
const milestonesRef = db.collection("milestones");
const documentationRef = db.collection("documentation");
const contactsRef = db.collection("contacts");
const connectionRequestsRef = db.collection("connectionRequests");
const connectionsRef = db.collection("connections");
const requestInformationsRef = db.collection("requestInformations");
const speakersRef = db.collection("speakers");
const speakerAvailabilityRef = db.collection("speakerAvailability");
const eventsRef = db.collection("events");
const eventRegistrationsRef = db.collection("eventRegistrations");
const eventFeedbacksRef = db.collection("eventFeedbacks");
const uploadsRef = db.collection('uploads')
const websiteRef = db.collection('website')

const errorLogsRef = db.collection("errorLogs");
const warningLogsRef = db.collection("warningLogs");
const fcmTokensRef = db.collection("fcmTokens");
const notesRef = db.collection('notes');
const deRef = db.collection('de')
const deResponsesRef = db.collection('deResponses')
const deApprovalsRef = db.collection('deApprovals')
const deSuggestionsRef = db.collection('deSuggestions')
const dynamicsRef = db.collection('dynamics')
const deChat = db.collection('deChat')
const startupComplaintsRef = db.collection('startupComplaints')
const internalConnectionsRef = db.collection('internalConnections')
const defaultTemplatesRef = db.collection('defaultTemplates')
const credentialsRef = db.collection('credentials')
const requestsRaisedRef = db.collection('requestsRaised')
const impactStatsRef = db.collection('impactStats')
const resourcesRef = db.collection('resources')
const fundingsRef = db.collection('fundings')
const dev2Ref = db.collection('dev2')
const deResponsesV2Ref = db.collection('deResponsesV2')
const driveRef = db.collection('drive')
const messagingModuleRef = db.collection('messagingModule')
const messagingModuleUsersRef = db.collection('messagingModuleUsers')

export {
  firebase,
  auth,
  db,
  storageRef,
  messaging,
  fcmTokensRef,
  usersRef,
  startupsRef,
  mentorsRef,
  membersRef,
  incubatorsRef,
  activityRef,
  startupProgressRef,
  mentorProgressRef,
  mentorshipRef,
  startupshipRef,
  mentorAvailabilityRef,
  startupAvailabilityRef,
  loginAuditRef,
  milestonesRef,
  documentationRef,
  contactsRef,
  connectionsRef,
  connectionRequestsRef,
  requestInformationsRef,
  speakersRef,
  speakerAvailabilityRef,
  eventsRef,
  eventRegistrationsRef,
  eventFeedbacksRef,
  uploadsRef,
  errorLogsRef,
  warningLogsRef,
  websiteRef,
  notesRef,
  deRef,
  deResponsesRef,
  deApprovalsRef,
  deSuggestionsRef,
  dynamicsRef,
  deChat,
  startupComplaintsRef,
  internalConnectionsRef,
  defaultTemplatesRef,
  credentialsRef,
  requestsRaisedRef,
  impactStatsRef,
  resourcesRef,
  fundingsRef,
  dev2Ref,
  deResponsesV2Ref,
  driveRef,
  messagingModuleRef,
  messagingModuleUsersRef
};
