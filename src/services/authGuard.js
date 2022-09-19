import { auth } from "../config/firebase_services";

const isLoggedIn = () => {
  return new Promise((resolve) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

export default isLoggedIn;
