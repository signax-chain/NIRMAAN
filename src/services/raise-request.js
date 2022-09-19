import {
  requestsRaisedRef,
  startupsRef,
  websiteRef,
} from "../config/firebase_services";
import store from "../store";

export const getJobPositions = async () => {
  try {
    const documents = await websiteRef
      .doc(getIncubatorId())
      .collection("jobs")
      .get();
    const jobPositions = [];
    documents.forEach((doc) => {
      jobPositions.push({
        id: doc.id,
        role: doc.data()["role"],
      });
    });
    return jobPositions;
  } catch (error) {
    return error;
  }
};

export const getAllRequests = async () => {
  try {
    const requests = [];
    const documents = await requestsRaisedRef
      .where("incubatorId", "==", getIncubatorId())
      .get();
    documents.forEach((doc) => {
      requests.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return requests;
  } catch (error) {
    return error;
  }
};

export const getStartups = async () => {
  try {
    const documents = await startupsRef
      .where("incubatorId", "==", getIncubatorId())
      .where("isDeleted", "==", false)
      .get();
    const startups = [];
    documents.forEach((doc) => {
      startups.push({
        id: doc.id,
        name: doc.data()["name"],
      });
    });
    return startups;
  } catch (error) {
    return error;
  }
};

export const getRequestsByType = async (type, incubatorId) => {
  try {
    const documents = await requestsRaisedRef
      .where("incubatorId", "==", incubatorId)
      .where("type", "==", type)
      .get();
    const requests = [];
    documents.forEach((doc) => {
      requests.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return requests;
  } catch (error) {
    return error;
  }
};

export const getRequestById = async (id) => {
  try {
    const document = await requestsRaisedRef.doc(id).get();
    return {
      id: document.id,
      ...document.data(),
    };
  } catch (error) {
    return error;
  }
};

function getIncubatorId() {
  return store.state.incubator.currentIncubator.docId;
}
