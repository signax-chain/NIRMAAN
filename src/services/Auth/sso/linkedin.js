import axios from "axios";

class LinkedInSSO {
  constructor() {}

  getCredentials() {
    const CLIENT_ID = "86h9h40h4pvsgp";
    const CLIENT_SECRET = "hNq2eiRVOmPdIgCO";
    const REDIRECT_URI = "http://localhost:8080/auth/linkedin/callback";
    const GRANT_TYPE = "authorization_code";
    const state = "some-state-of-my-choice";
    const scope = "r_liteprofile%20r_emailaddress%20w_member_social";

    return {
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI,
      GRANT_TYPE,
      state,
      scope,
    };
  }

  getRedictUrl() {
    const { CLIENT_ID, REDIRECT_URI, state, scope } = this.getCredentials();
    const REQUEST_URL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}&scope=${scope}`;
    return REQUEST_URL;
  }

  async getAccessToken() {
    // const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, GRANT_TYPE } = this.getCredentials();
    // const response = await axios.post(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=${GRANT_TYPE}&code=${localStorage.getItem('linkedin-access_token')}&redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    //     {
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //     });
    const response = await axios.get(
      "http://localhost:5001/sso/linkedin/oauth2-access-token",
      {
        headers: {
          Authorization: `${localStorage.getItem("linkedin-access_token")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    localStorage.setItem(
      "linkedin-oauth2_access_token",
      response.data.access_token
    );
  }

  async getUserData() {
    console.log(localStorage.getItem("linkedin-oauth2_access_token"));
    const response = await axios.get(
      "http://localhost:5001/sso/linkedin/user-data",
      {
        headers: {
          Authorization: `${localStorage.getItem(
            "linkedin-oauth2_access_token"
          )}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }

  async checkIfUserIsLoggedIn() {
    await this.getAccessToken();
  }

  async shareText(text) {
    const user = JSON.parse(localStorage.getItem("linkedin-user"));
    const response = await axios.post(
      "http://localhost:5001/sso/linkedin/share-text",
      {
        userId: user.id,
        text: text,
      },
      {
        headers: {
          Authorization: `${localStorage.getItem(
            "linkedin-oauth2_access_token"
          )}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
}

export const linkedInSSO = new LinkedInSSO();
