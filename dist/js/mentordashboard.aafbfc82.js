(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["mentordashboard"],{"11ed":function(t,e,s){},"4f64":function(t,e,s){"use strict";s("11ed")},"58cb":function(t,e,s){"use strict";s("657d")},"657d":function(t,e,s){},"75f4":function(t,e,s){"use strict";s.r(e);var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-row",[s("v-col",{staticClass:"mt-3",attrs:{cols:"12",md:t.activityLen>0?9:12}},[s("v-breadcrumbs",{attrs:{items:t.crumbs}}),s("h3",{staticClass:"heading"},[t._v("Recent Activity")]),s("div",{staticClass:"recent-activity-row"},t._l(t.recentActivities,(function(t,e){return s("recent-activity",{key:e,attrs:{activity:t}})})),1),s("v-row",[s("v-col",{staticClass:"current__mentees",attrs:{cols:"12",md:"12"}},[s("h3",{staticClass:"heading mt-5"},[t._v("Other Stats")]),s("Counts",{staticClass:"mx-2"})],1)],1),s("v-row",{staticClass:"mt-5"},[s("v-col",{attrs:{cols:"12",md:"12"}},[s("current-mentees",{staticClass:"mx-5"})],1)],1),s("div",{staticClass:"upcomings"},[s("div",{staticClass:"upcoming-col"},[s("h3",{staticClass:"heading"},[t._v("Upcoming Events")]),s("upcoming-events")],1),s("div",{staticClass:"upcoming-col"},[s("h3",{staticClass:"heading"},[t._v("Mentoring Session")]),s("upcoming-sessions")],1)])],1)],1)},r=[],a=(s("96cf"),s("1da1")),c=s("ccd9"),i=s("6a79"),o=s("f722"),u=s("a284"),d=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-container",{staticClass:"d-flex row"},[s("div",{staticClass:"d-flex startups__mentoring"},[s("v-icon",{attrs:{color:"traktor",size:"54"}},[t._v("mdi-account")]),s("div",{staticClass:"details"},[s("span",[t._v("Startups Mentored")]),s("h1",[t._v(t._s(t.mentor.startupsAssociated.length))])])],1),s("div",{staticClass:"d-flex sessions__conducted"},[s("v-icon",{attrs:{color:"traktor",size:"54"}},[t._v("mdi-school")]),s("div",{staticClass:"details"},[s("span",[t._v("Sessions Conducted")]),s("h1",[t._v(t._s(t.sessionCount))])])],1)])},l=[],p={name:"Counts",data:function(){return{mentor:null,sessionCount:0,feedback:0}},created:function(){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function e(){var s,n,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return s=void 0===t.$route.params.id?t.$store.state.user.currentUser.docId:t.$route.params.id,e.next=3,o["D"].doc(s).get();case 3:return n=e.sent,t.mentor=n.data(),e.next=7,o["E"].where("mentor.docId","==",s).get();case 7:r=e.sent,t.sessionCount=r.size;case 9:case"end":return e.stop()}}),e)})))()}},v=p,m=(s("4f64"),s("2877")),h=s("6544"),b=s.n(h),g=s("a523"),f=s("132d"),w=Object(m["a"])(v,d,l,!1,null,"0b0172b2",null),I=w.exports;b()(w,{VContainer:g["a"],VIcon:f["a"]});var C=s("4e6e"),x=s("ff4b"),_={name:"Dashboard",components:{UpcomingEvents:c["a"],UpcomingSessions:i["a"],CurrentMentees:u["a"],Counts:I,RecentActivity:C["a"]},data:function(){return{isLoading:!0,activityLen:0,cardItems:[{icon:"mdi-account-group",title:"Total startups",count:0,path:"/startups?status=all"},{icon:"mdi-account-multiple-check",title:"Active startups",count:0,path:"/startups?status=active"},{icon:"mdi-account-tie",title:"Graduated startups",count:0,path:"/startups?status=graduated"},{icon:"mdi-account-multiple-minus",title:"Dropped out",count:0,path:"/startups?status=droppedout"},{icon:"mdi-teach",title:"Mentors",count:0,path:"/mentors"}],configItem:{},fundingItems:[{title:"Funding Disbursed",icon:"mdi-cash-multiple",count:0},{title:"Funding Utilized",icon:"mdi-cash-minus",count:0},{title:"External Funding",icon:"mdi-cash-refund",count:0}],crumbs:[{text:"Dashboard",disabled:!0,href:"breadcrumbs_dashboard"}]}},mixins:[x["a"]],created:function(){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function e(){var s,n,r,a,c;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,o["Q"].where("incubatorId","==",t.$store.state.incubator.currentIncubator.docId).where("isDeleted","==",!1).get();case 2:return s=e.sent,t.cardItems[0].count=s.size,e.next=6,o["D"].where("incubatorId","==",t.$store.state.incubator.currentIncubator.docId).where("isDeleted","==",!1).get();case 6:return n=e.sent,t.cardItems[4].count=n.size,e.next=10,o["Q"].where("incubatorId","==",t.$store.state.incubator.currentIncubator.docId).where("status","==","active").where("isDeleted","==",!1).get();case 10:return r=e.sent,t.cardItems[1].count=r.size,e.next=14,o["Q"].where("incubatorId","==",t.$store.state.incubator.currentIncubator.docId).where("status","==","graduated").where("isDeleted","==",!1).get();case 14:return a=e.sent,t.cardItems[2].count=a.size,e.next=18,o["Q"].where("incubatorId","==",t.$store.state.incubator.currentIncubator.docId).where("status","==","droppedout").where("isDeleted","==",!1).get();case 18:c=e.sent,t.cardItems[3].count=c.size,t.isLoading=!1;case 21:case"end":return e.stop()}}),e)})))()},methods:{updateActivityLen:function(t){this.activityLen=t}}},D=_,k=(s("58cb"),s("2bc5")),A=s("62ad"),z=s("0fd9"),R=Object(m["a"])(D,n,r,!1,null,"d5be4190",null);e["default"]=R.exports;b()(R,{VBreadcrumbs:k["a"],VCol:A["a"],VRow:z["a"]})},ff4b:function(t,e,s){"use strict";s("96cf");var n=s("1da1"),r=s("f722"),a=s("4360");e["a"]={data:function(){return{recentActivities:[{title:"Total Startups",icon:"total-startups.svg",count:"0",link:"/startups?status=all"},{title:"Active Startups",icon:"active-startups.svg",count:"0",link:"/startups?status=active"},{title:"Graduated Startups",icon:"graduated-startups.svg",count:"0",link:"/startups?status=graduated"},{title:"Dropped Out",icon:"droppedout-startups.svg",count:"0",link:"/startups?status=droppedout"}]}},created:function(){this.getRecentActivities()},methods:{getRecentActivities:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){var s,n,c,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,r["Q"].where("incubatorId","==",a["a"].state.incubator.currentIncubator.docId).where("isDeleted","==",!1).get();case 2:return s=e.sent,t.recentActivities[0].count=s.size,e.next=6,r["Q"].where("incubatorId","==",a["a"].state.incubator.currentIncubator.docId).where("status","==","active").where("isDeleted","==",!1).get();case 6:return n=e.sent,t.recentActivities[1].count=n.size,e.next=10,r["Q"].where("incubatorId","==",a["a"].state.incubator.currentIncubator.docId).where("status","==","graduated").where("isDeleted","==",!1).get();case 10:return c=e.sent,t.recentActivities[2].count=c.size,e.next=14,r["Q"].where("incubatorId","==",a["a"].state.incubator.currentIncubator.docId).where("status","==","droppedout").where("isDeleted","==",!1).get();case 14:i=e.sent,t.recentActivities[3].count=i.size;case 16:case"end":return e.stop()}}),e)})))()}}}}}]);
//# sourceMappingURL=mentordashboard.aafbfc82.js.map