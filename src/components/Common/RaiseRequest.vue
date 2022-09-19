<template>
  <div class="wrapper">
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">Raise a Request</h3>
    <div class="form">
      <h3 class="heading text-center ma-0">Raise a Request</h3>
      <div class="form-body mt-5">
        <label>Select Category </label>
        <v-select
          outlined
          dense
          :items="categories"
          label="Type of request"
          v-model="request.category"
          @change="handleTypeOfRequest()"
          item-text="text"
        ></v-select>
        <internship-certificate
          v-if="request.category === 'internship'"
          :dates="types.internship.dates"
          :role="types.internship.role"
          :college="types.internship.college"
          :candidateName="types.internship.candidateName"
          @update:candidateName="types.internship.candidateName = $event"
          @update:dates="types.internship.dates = $event"
          @update:role="types.internship.role = $event"
          @update:college="types.internship.college = $event"
        ></internship-certificate>
        <v-textarea
          placeholder="Add a description of your request"
          outlined
          v-model="request.description"
        ></v-textarea>
        <v-btn color="traktor" dark @click="submit()">Request</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { activityRef, requestsRaisedRef } from "../../config/firebase_services";
import InternshipCertificate from "../RaiseRequests/InternshipCertificate.vue";
export default {
  name: "RaiseRequest",
  components: { InternshipCertificate },
  data() {
    return {
      request: {
        category: "",
        description: "",
      },
      types: {
        internship: {
          candidateName: "",
          role: "",
          college: "",
          dates: ["2021-10-01", "2021-10-30"],
        },
      },
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Raise a Request",
          disabled: true,
        },
      ],
      categories: [
        {
          text: "Request regarding Mentors",
          value: "mentor",
          isMail: false,
        },
        {
          text: "Request regarding Contacts / Connections",
          value: "connection",
          isMail: false,
        },
        {
          text: "Request regarding Documentation",
          value: "documentation",
          isMail: false,
        },
        {
          text: "Request regarding Booking of Space / Conference Rooms",
          value: "booking",
          isMail: false,
        },
        {
          text: "Request regarding Network Connectivity / Facilities",
          value: "network",
          isMail: false,
        },
        {
          text: "Request regarding funding",
          value: "funding",
          isMail: false,
        },
        {
          text: "Request regarding internship certificate",
          value: "internship",
          isMail: false,
        },
        // {
        //   text: "Request for AWS credits",
        //   value: "aws-credits",
        //   isMail: true,
        // },
        {
          text: "Other request(s)",
          value: "other",
          isMail: false,
        },
      ],
    };
  },
  methods: {
    handleTypeOfRequest() {
      console.log(this.request.category);
    },
    async sendMail(from, to, subject, content) {
      const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        content: content,
      };
      try {
        await axios.post(
          "https://traktor-api.herokuapp.com/sendMail",
          mailOptions
        );
      } catch (error) {
        return error;
      }
    },
    async submit() {
      const data = {};
      const currentUser = this.$store.state.user.currentUser;
      const currentIncubator = this.$store.state.incubator.currentIncubator;

      data.incubatorId = currentIncubator.docId;
      data.userId = currentUser.docId;
      data.createdAt = new Date();
      data.type = this.request.category;
      data.request = {
        category: this.categories.find(
          (category) => category.value === this.request.category
        ).text,
        description: this.request.description,
      };
      data.request = { ...data.request, ...this.types[this.request.category] };

      const activity = {
        createdAt: new Date(),
        userId: currentUser.docId,
        incubatorId: currentIncubator.docId,
        photoURL: currentUser.photoURL,
        notification: true,
        read: false,
        statement: `${currentUser.name} raised a ${data.request.category}`,
        link: "/all-requests",
      };

      try {
        await requestsRaisedRef.add(data);
        await activityRef.add(activity);

        if (
          this.categories.find(
            (category) => category.value === this.request.category
          ).isMail
        ) {
          this.sendMail(
            { email: "start@thestartupreneur.co", name: "Startupreneur" },
            { email: currentIncubator.email, name: currentIncubator.name },
            data.request.category,
            `<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title><!--[if !mso]><!-- --><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a{padding:0}.ReadMsgBody{width:100%}.ExternalClass{width:100%}.ExternalClass *{line-height:100%}body{margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table,td{border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0}img{border:0;height:auto;line-height:100%;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic}p{display:block;margin:13px 0}</style><!--[if !mso]><!--><style type="text/css">@media only screen and (max-width:480px){@-ms-viewport{width:320px}@viewport{width:320px}}</style><!--<![endif]--><!--[if mso]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if lte mso 11]><style type="text/css">.outlook-group-fix{width:100% !important}</style><![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css"><style type="text/css">@import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);@import url(https://fonts.googleapis.com/css?family=Cabin:400,700);</style><!--<![endif]--><style type="text/css">@media only screen and (min-width:480px){.mj-column-per-100{width:100%!important;max-width:100%}.mj-column-per-50{width:50%!important;max-width:50%}}</style><style type="text/css">@media only screen and (max-width:480px){table.full-width-mobile{width:100%!important}td.full-width-mobile{width:auto!important}}</style><style type="text/css">.hide_on_mobile{display:none!important}@media only screen and (min-width:480px){.hide_on_mobile{display:block!important}}.hide_section_on_mobile{display:none!important}@media only screen and (min-width:480px){.hide_section_on_mobile{display:table!important}}.hide_on_desktop{display:block!important}@media only screen and (min-width:480px){.hide_on_desktop{display:none!important}}.hide_section_on_desktop{display:table!important}@media only screen and (min-width:480px){.hide_section_on_desktop{display:none!important}}[owa] .mj-column-per-100{width:100%!important}[owa] .mj-column-per-50{width:50%!important}[owa] .mj-column-per-33{width:33.333333333333336%!important}h1,h2,h3,p{margin:0}@media only print and (min-width:480px){.mj-column-per-100{width:100%!important}.mj-column-per-40{width:40%!important}.mj-column-per-60{width:60%!important}.mj-column-per-50{width:50%!important}mj-column-per-33{width:33.333333333333336%!important}}</style></head><body style="background-color:#FFF"><div style="background-color:#FFF"><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="Margin:0 auto;max-width:600px"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%"><tbody><tr><td style="direction:ltr;font-size:0;padding:9px 0 9px 0;text-align:center;vertical-align:top"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%"><tr><td align="left" style="font-size:0;padding:15px 15px 15px 15px;word-break:break-word"><div style="font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000"><p style="text-align:center"><span style="font-size:18px"><strong>${data.request.category}</strong></span></p></div></td></tr><tr><td style="font-size:0;padding:10px undefined;padding-top:10px;padding-right:10px;word-break:break-word"><p style="border-top:solid 1px #000;font-size:1;margin:0 auto;width:100%"></p><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:NaNpx;" role="presentation" width="NaNpx" ><tr><td style="height:0;line-height:0;"> &nbsp;</td></tr></table><![endif]--></td></tr></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="Margin:0 auto;max-width:600px"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%"><tbody><tr><td style="direction:ltr;font-size:0;padding:9px 0 9px 0;text-align:center;vertical-align:top"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%"><tr><td align="left" style="font-size:0;padding:15px 15px 15px 15px;word-break:break-word"><div style="font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000"><p><span style="font-size:14px">Dear <strong>${currentIncubator.name},</strong></span></p></div></td></tr><tr><td align="left" style="font-size:0;padding:15px 15px 15px 15px;word-break:break-word"><div style="font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000"><p><span style="font-size:12px">Hope you are doing well. This is to inform you that startup ${currentUser.name} have ${data.request.category}.</span></p></div></td></tr><tr><td align="left" style="font-size:0;padding:15px 15px 15px 15px;word-break:break-word"><div style="font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000"><p><span style="font-size:12px">Please feel free to reach out to us in case of any queries. We thank you for your constant support.</span></p></div></td></tr><tr><td align="left" style="font-size:0;padding:15px 15px 15px 15px;word-break:break-word"><div style="font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000"><p><span style="font-size:12px;color:#7e8c8d">Regards,</span></p><p><span style="color:#000"><strong><span style="font-size:12px">Startupreneur</span></strong></span></p></div></td></tr><tr><td style="font-size:0;padding:10px undefined;padding-top:10px;padding-right:10px;word-break:break-word"><p style="border-top:solid 1px #000;font-size:1;margin:0 auto;width:100%"></p></td></tr></table></div></td></tr></tbody></table></div><div style="Margin:0 auto;max-width:600px"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%"><tbody><tr><td style="direction:ltr;font-size:0;padding:9px 0 9px 0;text-align:center;vertical-align:top"><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%"><tr><td align="left" style="font-size:0;padding:15px 15px 15px 15px;word-break:break-word"><div style="font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000"><p style="text-align:center">Powered By</p></div></td></tr><tr><td align="center" style="font-size:0;padding:0;word-break:break-word"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0"><tbody><tr><td style="width:270px"><img height="auto" src="https://s3-eu-west-1.amazonaws.com/topolio/uploads/606d856563a94/1617791341.jpg" style="border:0;display:block;outline:0;text-decoration:none;height:auto;width:100%;font-size:13px" width="270"></td></tr></tbody></table></td></tr></table></div></td></tr></tbody></table></div></div></body></html>`
          );
        }

        this.$toast.success("Request raised successfully", {
          position: "top",
        });

        this.request = {
          category: "",
          description: "",
        };
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
  },
};
</script>

<style scoped>
.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

.form {
  width: 600px;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border: 1px solid #dbdbdb;
  padding: 1rem;
  border-radius: 5px;
}

label {
  color: #b0b0b0;
  font-size: 12px;
}

@media only screen and (max-width: 600px) {
  .form {
    width: 84%;
  }
}
</style>