(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["inreport"],{"0b15":function(t,e,s){},"15eb":function(t,e,s){"use strict";s("0b15")},a4ac:function(t,e,s){"use strict";s.r(e);var r=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-container",[s("v-row",[s("v-card",{staticClass:"report__container mt-5 px-10 py-2",attrs:{id:"report__container"}},[s("v-img",{staticClass:"mx-auto",attrs:{src:t.user.photoURL,alt:t.user.name,width:"100"}}),s("h2",{staticClass:"text-center"},[t._v(t._s(t.user.name))]),s("p",{staticClass:"mt-5"},[t._v(t._s(t.user.description))]),s("div",{staticClass:"basic__details"},[s("h3",[t._v("Basic details")]),"s"===t.type?s("v-row",[s("v-col",{attrs:{cols:"6",md:"6"}},[s("v-simple-table",{scopedSlots:t._u([{key:"default",fn:function(){return[s("tbody",[s("tr",[s("th",{staticClass:"text-left"},[t._v("Cohort")]),s("td",[t._v(t._s(t.user.cohort.name)+" "+t._s(t.user.cohort.year))])]),s("tr",[s("th",{staticClass:"text-left"},[t._v("Sector")]),s("td",[t._v(t._s(t.user.sector))])]),s("tr",[s("th",{staticClass:"text-left"},[t._v("Faculty/ Student ID")]),s("td",[t._v(" "+t._s(""!==t.user.facultyOrStudentId||null!==t.user.facultyOrStudentId?t.user.facultyOrStudentId:"-")+" ")])]),s("tr",[s("th",{staticClass:"text-left"},[t._v("CIN/ Reg.No")]),s("td",[t._v(" "+t._s(null!==t.user.cinNumber||""!==t.user.cinNumber?t.user.cinNumber:"-")+" ")])])])]},proxy:!0}],null,!1,3514070359)})],1),s("v-col",{attrs:{cols:"6",md:"6"}},[s("v-simple-table",{scopedSlots:t._u([{key:"default",fn:function(){return[s("tbody",[s("tr",[s("th",{staticClass:"text-left"},[t._v("Email")]),s("td",[t._v(t._s(t.user.email))])]),s("tr",[s("th",{staticClass:"text-left"},[t._v("Contact number")]),s("td",[t._v(t._s(t.user.phoneNumber))])]),s("tr",[s("th",{staticClass:"text-left"},[t._v("Website")]),s("td",[t._v(t._s(t.user.socialLinks.website))])]),s("tr",[s("th",{staticClass:"text-left"},[t._v("Linked In")]),s("td",[t._v(t._s(t.user.socialLinks.linkedIn))])])])]},proxy:!0}],null,!1,4014668701)})],1)],1):t._e(),"m"===t.type?s("v-row",[s("v-col",{attrs:{cols:"6",md:"6"}},[s("v-simple-table",{scopedSlots:t._u([{key:"default",fn:function(){return[s("tbody",[s("tr",[s("th",{staticClass:"text-left"},[t._v("Designation")]),s("td",[t._v(t._s(t.user.designation))])]),s("tr",[s("th",{staticClass:"text-left"},[t._v("Institution")]),s("td",[t._v(t._s(t.user.institution))])]),s("tr",[s("th",{staticClass:"text-left"},[t._v("Expertise")]),s("td",[t._v(" "+t._s(t.user.areaOfExpertise.toString())+" ")])]),s("tr",[s("th",{staticClass:"text-left"},[t._v("Qualification")]),s("td",[t._v(" "+t._s(t.user.qualification)+" ")])])])]},proxy:!0}],null,!1,23040318)})],1),s("v-col",{attrs:{cols:"6",md:"6"}},[s("v-simple-table",{scopedSlots:t._u([{key:"default",fn:function(){return[s("tbody",[s("tr",[s("th",{staticClass:"text-left"},[t._v("Email")]),s("td",[t._v(t._s(t.user.email))])]),s("tr",[s("th",{staticClass:"text-left"},[t._v("Contact number")]),s("td",[t._v(t._s(t.user.phoneNumber))])]),s("tr",[s("th",{staticClass:"text-left"},[t._v("Linked In")]),s("td",[t._v(t._s(t.user.socialLinks.linkedIn))])]),s("tr",[s("th",{staticClass:"text-left"},[t._v("Startups")]),s("td",[t._v(t._s(t.getStartups(t.user.startupsAssociated)))])])])]},proxy:!0}],null,!1,2091070602)})],1)],1):t._e()],1),"s"===t.type?s("div",{staticClass:"founder__details mt-4"},[s("h3",[t._v("Founder details")]),s("v-simple-table",{attrs:{"fixed-header":""},scopedSlots:t._u([{key:"default",fn:function(){return[s("thead",[s("tr",[s("th",{staticClass:"text-left"},[t._v("Name")]),s("th",{staticClass:"text-left"},[t._v("Email")]),s("th",{staticClass:"text-left"},[t._v("Contact number")]),s("th",{staticClass:"text-left"},[t._v("Linked In")])])]),s("tbody",t._l(t.user.founders,(function(e,r){return s("tr",{key:r},[s("td",[t._v(t._s(e.name))]),s("td",[t._v(t._s(e.email))]),s("td",[t._v(t._s(e.phoneNumber))]),s("td",[t._v(t._s(e.linkedIn))])])})),0)]},proxy:!0}],null,!1,3688812891)})],1):t._e(),"s"===t.type?s("div",{staticClass:"awards__and_recognitions mt-4"},[s("h3",[t._v("Awards and recognitions")]),s("v-simple-table",{attrs:{"fixed-header":""},scopedSlots:t._u([{key:"default",fn:function(){return[s("thead",[s("tr",[s("th",{staticClass:"text-left"},[t._v("Date")]),s("th",{staticClass:"text-left"},[t._v("Name")]),s("th",{staticClass:"text-left"},[t._v("Given by")]),s("th",{staticClass:"text-left"},[t._v("Prize money")])])]),s("tbody",t._l(t.user.awards,(function(e,r){return s("tr",{key:r},[s("td",[t._v(t._s(e.date))]),s("td",[t._v(t._s(e.name))]),s("td",[t._v(t._s(e.givenBy))]),s("td",[t._v(t._s(e.money))])])})),0)]},proxy:!0}],null,!1,2462789427)})],1):t._e(),s("div",{staticClass:"progress mt-4"},[s("h3",[t._v("Progress")]),s("v-simple-table",{attrs:{"fixed-header":""},scopedSlots:t._u([{key:"default",fn:function(){return[s("thead",[s("tr",[s("th",{staticClass:"text-left"},[t._v("Date")]),s("th",{staticClass:"text-left"},[t._v("Stage")]),s("th",{staticClass:"text-left"},[t._v("Description")])])]),s("tbody",t._l(t.progress,(function(e,r){return s("tr",{key:r},[s("td",[t._v(t._s(e.createdAt.toDate().toDateString()))]),s("td",[t._v(t._s(e.stage))]),s("td",{staticStyle:{width:"350px"}},[t._v(t._s(e.description))])])})),0)]},proxy:!0}])})],1),s("div",{staticClass:"progress mt-4"},[s("h3",[t._v("Activities")]),s("v-simple-table",{attrs:{"fixed-header":""},scopedSlots:t._u([{key:"default",fn:function(){return[s("thead",[s("tr",[s("th",{staticClass:"text-left"},[t._v("Date")]),s("th",{staticClass:"text-left"},[t._v("Activity")])])]),s("tbody",t._l(t.activities,(function(e,r){return s("tr",{key:r},[s("td",[t._v(t._s(e.createdAt.toDate().toDateString()))]),s("td",{staticStyle:{width:"550px"}},[t._v(t._s(e.statement))])])})),0)]},proxy:!0}])})],1)],1)],1)],1)},a=[],n=(s("4160"),s("d81d"),s("b0c0"),s("d3b7"),s("25f0"),s("159b"),s("96cf"),s("1da1")),i=s("f722"),o=s("d67e"),c=s.n(o),u={name:"InReport",data:function(){return{type:null,user:{},activities:[],progress:[]}},created:function(){this.validateURL()},methods:{validateURL:function(){var t=this.$route.params;this.type=t.sm,this.prepareReport(t)},prepareReport:function(t){"s"===t.sm?this.getStartupDetails(t.id):"m"===t.sm&&this.getMentorDetails(t.id)},getStartupDetails:function(t){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function s(){var r;return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return s.next=2,i["Q"].doc(t).get();case 2:r=s.sent,e.user=r.data(),e.getStartupProgress(t);case 5:case"end":return s.stop()}}),s)})))()},getMentorDetails:function(t){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function s(){var r;return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return s.next=2,i["D"].doc(t).get();case 2:r=s.sent,e.user=r.data(),e.getMentorProgress(t);case 5:case"end":return s.stop()}}),s)})))()},getStartupProgress:function(t){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function s(){var r;return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return s.next=2,i["P"].where("startup.docId","==",t).get();case 2:r=s.sent,r.forEach((function(t){e.progress.push(t.data())})),e.getStartupActivities(t);case 5:case"end":return s.stop()}}),s)})))()},getStartupActivities:function(t){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function s(){var r;return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return s.next=2,i["a"].where("type","==","startup").where("startup.docId","==",t).get();case 2:r=s.sent,r.forEach((function(t){e.activities.push(t.data())}));case 4:case"end":return s.stop()}}),s)})))()},getMentorProgress:function(t){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function s(){var r;return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return s.next=2,i["C"].where("mentor.docId","==",t).get();case 2:r=s.sent,r.forEach((function(t){e.progress.push(t.data())})),e.getMentorActivities(t);case 5:case"end":return s.stop()}}),s)})))()},getMentorActivities:function(t){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function s(){var r;return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return s.next=2,i["a"].where("type","==","mentor").where("mentor.docId","==",t).get();case 2:r=s.sent,r.forEach((function(t){e.activities.push(t.data())}));case 4:case"end":return s.stop()}}),s)})))()},getStartups:function(t){return t.map((function(t){return t.name})).toString()},download:function(){var t=document.getElementById("report__container"),e={margin:[.2,0,1.1,0],filename:"".concat(this.user.name),image:{type:"jpeg",quality:.98},html2canvas:{scale:2},jsPDF:{unit:"in",format:"letter",orientation:"portrait"}};c()(t,e)}}},l=u,d=(s("15eb"),s("2877")),_=s("6544"),v=s.n(_),f=s("b0af"),p=s("62ad"),h=s("a523"),m=s("adda"),g=s("0fd9"),x=s("1f4f"),y=Object(d["a"])(l,r,a,!1,null,"a134a5c6",null);e["default"]=y.exports;v()(y,{VCard:f["a"],VCol:p["a"],VContainer:h["a"],VImg:m["a"],VRow:g["a"],VSimpleTable:x["a"]})}}]);
//# sourceMappingURL=inreport.c0b236db.js.map