import { auth, usersRef } from "../../config/firebase_services";
// import axios from "axios";

// const URL =
//   "https://ipgeolocation.abstractapi.com/v1/?api_key=66edba86909646d493e2e67385c49030";
/**
 * @param  {} credential
 */
const LoginService = (credential) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        await auth
          .signInWithEmailAndPassword(credential.email, credential.password)
          .then((user) => {
            auth.currentUser.getIdTokenResult().then(async (idTokenResult) => {
              const documents = await usersRef.doc(user.user.uid).get();
              const currentUser = documents.data();
              const roles = idTokenResult.claims.roles;
              currentUser.role = Object.keys(roles).find(
                (key) => roles[key] === true
              );

              // const moreInfo = await getLocationDetails();
              // const loginAudit = {
              //   user: currentUser,
              //   loginTimestamp: new Date(),
              //   browserVersion: navigator.appVersion,
              //   platform: navigator.platform,
              //   moreInfo: moreInfo,
              // };
              // await loginAuditRef.add(loginAudit);
              resolve(currentUser);
            });
          })
          .catch((error) => {
            resolve(error);
          });
      } catch (error) {
        resolve(error);
      }
    }, 1000);
  });
};

// function getLocationDetails() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       axios
//         .get(URL)
//         .then((response) => {
//           resolve(response.data);
//         })
//         .catch((error) => {
//           resolve(error);
//         });
//     }, 500);
//   });
// }

export { LoginService };
