import { startupsRef } from "../../../config/firebase_services";
import store from "../../../store";

const availableStudentIds = {
  AE: "Aerospace Engineering",
  AM: "Applied Machanics",
  BT: "Biotechnology",
  CH: "Chemical Engineering",
  CY: "Chemistry",
  CE: "Civil Engineering",
  CS: "Computer Science and Engineering",
  EE: "Electrical Engineering",
  ED: "Engineering Design",
  HS: "Humanities and Social Sciences",
  MS: "Management Studies",
  MA: "Mathematics",
  ME: "Mechanical Engineering",
  MM: "Metallurgical and Materials Engineering",
  OE: "Ocean Engineering",
  PH: "Physics",
  BS: 'Biological Sciences',
  EP: 'Engineering Physics',
  NA: 'Naval Architecture',
};

console.log("availableStudentIds", availableStudentIds);

export const getStartupsByStudentId = async () => {
  const incubatorId = store.state.incubator.currentIncubator.docId;

  const documents = await startupsRef
    .where("incubatorId", "==", incubatorId)
    .where("isDeleted", "==", false)
    .get();

  let startups = [];
  documents.forEach((document) => {
    startups.push(document.data());
  });

  let studentIds = [];
  studentIds = startups
    .map((startup) => startup.facultyOrStudentId)
    .filter((id) => id !== null && id !== undefined && id !== "")
    .map((id) => id.toUpperCase())
    .map((id) => id.substring(0, 2));

  let counts = {};
  studentIds.forEach(function(x) {
    counts[x] = (counts[x] || 0) + 1;
  });

  const mappedStudentIds = {};
  Object.keys(counts).forEach((key) => {
    mappedStudentIds[key] = counts[key];
  });

  return mappedStudentIds;
};
