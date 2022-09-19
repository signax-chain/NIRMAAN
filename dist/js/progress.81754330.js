(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["progress"],{4357:function(t,e,a){"use strict";a("c2e3")},7572:function(t,e,a){"use strict";a("ed4d")},b3b2:function(t,e,a){"use strict";a("d9b6")},c2e3:function(t,e,a){},d9b6:function(t,e,a){},ed4d:function(t,e,a){},f06d:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",[a("div",{staticClass:"wrapper"},[a("v-row",{staticClass:"back__nav"},[a("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var i=e.on,n=e.attrs;return[a("v-btn",t._g(t._b({attrs:{icon:"",color:"traktor",link:"",to:"/dashboard"}},"v-btn",n,!1),i),[a("v-icon",{attrs:{size:"30"}},[t._v("mdi-arrow-left")])],1)]}}])},[a("span",[t._v("Back")])])],1),a("v-row",{staticClass:"top__header"},[a("v-col",{staticClass:"d-flex",attrs:{cols:"12"}},[a("h2",{staticClass:"white--text"},[t._v("Update Progress")]),a("div",{staticClass:"actions__items d-flex ml-auto"})])],1)],1),a("v-tabs",{staticClass:"elevation-2",attrs:{"background-color":"traktor",dark:"",centered:t.centered,grow:t.grow,"icons-and-text":t.icons},model:{value:t.tab,callback:function(e){t.tab=e},expression:"tab"}},[a("v-tabs-slider"),a("v-tab",[t._v(" Set Goals "),t.icons?a("v-icon",[t._v("mdi-account-question-outline")]):t._e()],1),a("v-tab",[t._v(" Update Progress "),t.icons?a("v-icon",[t._v("mdi-human-greeting-proximity")]):t._e()],1),a("v-tab-item",[a("v-card",{attrs:{flat:"",tile:""}},[a("v-card-text",[a("Milestones")],1)],1)],1),a("v-tab-item",[a("v-card",{attrs:{flat:"",tile:""}},[a("v-card-text",[a("ProgressUpdate")],1)],1)],1)],1)],1)},n=[],o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",[a("v-row",{staticClass:"mt-5"},[a("v-col",{attrs:{cols:"12",md:"3"}},[a("v-autocomplete",{attrs:{outlined:"",label:"Select field",items:t.fileds},on:{change:function(e){return t.onChangeField()}},model:{value:t.selectedField,callback:function(e){t.selectedField=e},expression:"selectedField"}})],1),"Startup"===t.selectedField?a("v-col",{attrs:{cols:"12",md:"3"}},[a("v-autocomplete",{attrs:{outlined:"",label:"Select Startup",items:t.startups,"item-text":"name","item-value":"docId"},model:{value:t.selectedStartup,callback:function(e){t.selectedStartup=e},expression:"selectedStartup"}})],1):t._e(),"Mentor"===t.selectedField?a("v-col",{attrs:{cols:"12",md:"3"}},[a("v-autocomplete",{attrs:{outlined:"",label:"Select Mentor",items:t.mentors,"item-text":"name","item-value":"docId"},model:{value:t.selectedMentor,callback:function(e){t.selectedMentor=e},expression:"selectedMentor"}})],1):t._e(),a("v-col",{attrs:{cols:"12",md:"3"}},[a("v-autocomplete",{attrs:{outlined:"",label:"Select Status",items:t.status},model:{value:t.stage,callback:function(e){t.stage=e},expression:"stage"}})],1),a("v-col",{attrs:{cols:"12",md:"3"}},[a("v-file-input",{attrs:{outlined:"",label:"Upload document"},model:{value:t.document,callback:function(e){t.document=e},expression:"document"}})],1),a("v-col",{attrs:{cols:"12",md:"12"}},[a("v-textarea",{attrs:{label:"Comment",outlined:""},model:{value:t.description,callback:function(e){t.description=e},expression:"description"}})],1),a("v-col",{attrs:{cols:"12",md:"12"}},[a("v-btn",{staticClass:"white--text ml-auto d-block",attrs:{color:"traktor"},on:{click:function(e){return t.submit()}}},[t._v("Submit")])],1)],1)],1)},s=[],r=(a("a4d3"),a("e01a"),a("7db0"),a("4160"),a("159b"),a("53ca")),l=(a("96cf"),a("1da1")),c=a("f722"),d=a("c7ca"),u={name:"ProgressUpdate",data:function(){return{fileds:["Startup","Mentor"],selectedField:"Startup",startups:[],selectedStartup:null,selectedMentor:null,mentors:[],status:["General","Idea","Prototype","MVP","Pivoted","Early Traction","Seed Funding","Product Market Fit","VC Funding","Scaling","Jobs Created","Internal Seed Funding","Awards and Recognitions","Media Mentions","Exit"],stage:null,document:null,description:null}},created:function(){var t=this;return Object(l["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,c["Q"].where("incubatorId","==",t.$store.state.incubator.currentIncubator.docId).where("isDeleted","==",!1).get();case 2:return a=e.sent,a.forEach((function(e){e.exists&&t.startups.push(e.data())})),e.next=6,c["D"].where("incubatorId","==",t.$store.state.incubator.currentIncubator.docId).where("isDeleted","==",!1).get();case 6:a=e.sent,a.forEach((function(e){e.exists&&t.mentors.push(e.data())}));case 8:case"end":return e.stop()}}),e)})))()},methods:{onChangeField:function(){var t=this.selectedField;"Startup"===t&&(this.status=["General","Idea","Prototype","MVP","Pivoted","Early Traction","Seed Funding","Product Market Fit","VC Funding","Scaling","Jobs Created","Internal Seed Funding","Awards and Recognitions","Media Mentions","Exit"]),"Mentor"===t&&(this.status=["Active","Inactive","On a break","Exit"])},submit:function(){var t=this;return Object(l["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(null!==t.stage){e.next=3;break}return t.$toast.error("Stage cannot be empty!",{position:"top"}),e.abrupt("return");case 3:if("Startup"!==t.selectedField){e.next=7;break}if(null!==t.selectedStartup&&""!==t.selectedStartup){e.next=7;break}return t.$toast.error("Startup cannot be empty!",{position:"top"}),e.abrupt("return");case 7:if("Mentor"!==t.selectedField){e.next=11;break}if(null!==t.selectedMentor&&""!==t.selectedMentor){e.next=11;break}return t.$toast.error("Mentor cannot be empty!",{position:"top"}),e.abrupt("return");case 11:if(t.$store.dispatch("SHOW_LOADER",{isShowing:!0}),null===t.document||"object"!==Object(r["a"])(t.document)){e.next=20;break}return e.next=15,Object(d["a"])(t.document,"progressUpdateDocs");case 15:a=e.sent,t.uploadData(a),t.$store.dispatch("SHOW_LOADER",{isShowing:!1}),e.next=22;break;case 20:t.uploadData(null),t.$store.dispatch("SHOW_LOADER",{isShowing:!1});case 22:case"end":return e.stop()}}),e)})))()},uploadData:function(t){var e=this;return Object(l["a"])(regeneratorRuntime.mark((function a(){var i,n,o;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(i={},"Startup"!==e.selectedField){a.next=20;break}return n=e.startups.find((function(t){return t.docId===e.selectedStartup})),i.startup=n,i.incubator=e.$store.state.incubator.currentIncubator,i.stage=e.stage,i.document=t,i.description=e.description,i.createdAt=new Date,a.prev=9,a.next=12,c["P"].add(i);case 12:return a.next=14,c["Q"].doc(i.startup.docId).set({stage:i.stage},{merge:!0});case 14:e.$toast.success("Updated",{position:"top"}),a.next=20;break;case 17:a.prev=17,a.t0=a["catch"](9),e.$toast.error(a.t0,{position:"top"});case 20:if("Mentor"!==e.selectedField){a.next=39;break}return o=e.mentors.find((function(t){return t.docId===e.selectedMentor})),i.mentor=o,i.incubator=e.$store.state.incubator.currentIncubator,i.stage=e.stage,i.document=t,i.description=e.description,i.createdAt=new Date,a.prev=28,a.next=31,c["C"].add(i);case 31:return a.next=33,c["D"].doc(i.mentor.docId).set({stage:i.stage},{merge:!0});case 33:e.$toast.success("Updated",{position:"top"}),a.next=39;break;case 36:a.prev=36,a.t1=a["catch"](28),e.$toast.error(a.t1,{position:"top"});case 39:case"end":return a.stop()}}),a,null,[[9,17],[28,36]])})))()}}},p=u,m=(a("7572"),a("2877")),v=a("6544"),b=a.n(v),h=a("c6a6"),f=a("8336"),x=a("62ad"),w=a("a523"),g=a("23a7"),k=a("0fd9"),y=a("a844"),M=Object(m["a"])(p,o,s,!1,null,"ca3a4e1c",null),_=M.exports;b()(M,{VAutocomplete:h["a"],VBtn:f["a"],VCol:x["a"],VContainer:w["a"],VFileInput:g["a"],VRow:k["a"],VTextarea:y["a"]});var S=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-form",[a("v-select",{attrs:{outlined:"",label:"Select startup",items:t.startups,"item-text":"name","item-value":"docId"},model:{value:t.startup,callback:function(e){t.startup=e},expression:"startup"}}),t._l(t.milestones,(function(e,i){return a("v-row",{key:i},[a("v-col",{attrs:{cols:"12",md:"3"}},[a("v-select",{attrs:{outlined:"",label:"Select milestone",items:t.milestoneOptions,dense:""},on:{change:function(e){return t.handleMilestone(i)}},model:{value:e.title,callback:function(a){t.$set(e,"title",a)},expression:"milestone.title"}})],1),a("v-col",{attrs:{cols:"12",md:"3"}},[a("v-text-field",{attrs:{type:"date",outlined:"",dense:"",label:"Milestone date"},model:{value:e.date,callback:function(a){t.$set(e,"date",a)},expression:"milestone.date"}})],1),a("v-col",{attrs:{cols:"12",md:"3"}},[a("v-text-field",{attrs:{label:"Description",outlined:"",dense:""},model:{value:e.description,callback:function(a){t.$set(e,"description",a)},expression:"milestone.description"}})],1),a("v-col",{attrs:{cols:"12",md:"1"}}),a("v-col",{attrs:{cols:"12",md:"2"}},[a("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on,o=e.attrs;return[a("v-btn",t._g(t._b({directives:[{name:"show",rawName:"v-show",value:i+1===t.milestones.length,expression:"index + 1 === milestones.length"}],attrs:{icon:"",color:"traktor"},on:{click:function(e){return t.addNewMilestone()}}},"v-btn",o,!1),n),[a("v-icon",{attrs:{size:"28"}},[t._v("mdi-plus-circle")])],1)]}}],null,!0)},[a("span",[t._v("Add new task")])]),a("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on,o=e.attrs;return[a("v-btn",t._g(t._b({directives:[{name:"show",rawName:"v-show",value:1!==t.milestones.length,expression:"milestones.length !== 1"}],attrs:{icon:"",color:"red"},on:{click:function(e){return t.deleteMilestone(i)}}},"v-btn",o,!1),n),[a("v-icon",{attrs:{size:"28"}},[t._v("mdi-delete")])],1)]}}],null,!0)},[a("span",[t._v("Delete task")])])],1)],1)})),a("h2",{staticClass:"mt-5 black--text"},[t._v("Visualization")]),a("div",{staticClass:"row mt-2"},[a("div",{staticClass:"col-md-12"},[a("div",{staticStyle:{display:"inline-block",width:"100%","overflow-y":"auto"}},[a("ul",{staticClass:"timeline timeline-horizontal"},t._l(t.milestones,(function(e,i){return a("li",{key:i,staticClass:"timeline-item"},[a("div",{staticClass:"timeline-badge success"},[a("v-icon",{staticClass:"white--text",staticStyle:{"font-size":"48px"}},[t._v("mdi-progress-clock")])],1),a("div",{staticClass:"timeline-panel"},[a("div",{staticClass:"timeline-heading"},[a("h4",{staticClass:"timeline-title black--text"},[t._v(" "+t._s(e.title)+" "),a("div",{staticStyle:{float:"right"}})])]),a("div",{staticClass:"timeline-body"},[a("p",{staticStyle:{"font-size":"10px"}},[t._v(t._s(e.description))])]),a("small",{staticClass:"text-muted pull-right"},[a("v-icon",[t._v("mdi-clock")]),t._v(t._s(e.date))],1)])])})),0)])])]),a("v-btn",{staticClass:"white--text ml-auto d-block",attrs:{color:"traktor"},on:{click:function(e){return t.submit()}}},[t._v("Save milestone")]),a("v-dialog",{attrs:{persistent:"","max-width":"290"},model:{value:t.addNewDialog,callback:function(e){t.addNewDialog=e},expression:"addNewDialog"}},[a("v-card",[a("v-card-title",{staticClass:"headline"},[t._v(" Add new ")]),a("v-card-text",[a("v-text-field",{attrs:{outlined:"",label:"Add new"},model:{value:t.newOption,callback:function(e){t.newOption=e},expression:"newOption"}})],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"red",text:""},on:{click:function(e){t.addNewDialog=!1}}},[t._v(" Cancel ")]),a("v-btn",{staticClass:"white--text",attrs:{color:"traktor"},on:{click:function(e){return t.addNewOption()}}},[t._v(" Add ")])],1)],1)],1)],2)},C=[],V=(a("99af"),a("a15b"),a("a434"),a("b0c0"),a("bc3a")),I=a.n(V),O={name:"Milestones",data:function(){return{startup:null,startups:[],modal:!1,milestoneOptions:["General","Idea","Prototype","MVP","Pivoted","Early Traction","Seed Funding","Product Market Fit","VC Funding","Scaling","Jobs Created","Internal Seed Funding","Awards and Recognitions","Media Mentions","Exit","Add new +"],milestones:[{id:+new Date,title:null,date:null,description:null,isCompleted:!1}],addNewDialog:!1,newOption:null,index:null}},created:function(){this.getStartups()},methods:{getStartups:function(){var t=this;return Object(l["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,c["Q"].where("incubatorId","==",t.$store.state.incubator.currentIncubator.docId).where("isDeleted","==",!1).get();case 2:a=e.sent,a.forEach((function(e){t.startups.push(e.data())}));case 4:case"end":return e.stop()}}),e)})))()},handleMilestone:function(t){"Add new +"===this.milestones[t].title&&(this.addNewDialog=!0,this.index=t)},addNewOption:function(){null!==this.newOption&&""!==this.newOption?(this.milestoneOptions.splice(this.milestoneOptions.length-1,0,this.newOption),this.milestoneOptions.join(),this.milestones[this.index].title=this.newOption,this.newOption=null,this.index=null,this.addNewDialog=!1):this.$toast.error("Milestone cannot be empty!",{position:"top"})},addNewMilestone:function(){this.milestones.push({id:+new Date,title:null,date:null,description:null,isCompleted:!1})},deleteMilestone:function(t){this.milestones.splice(t,1)},submit:function(){var t=this;return Object(l["a"])(regeneratorRuntime.mark((function e(){var a,i,n,o,s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(null!==t.startup){e.next=3;break}return t.$toast.warning("Please select a startup to set the milestone",{position:"top"}),e.abrupt("return");case 3:if(a=t.milestones.find((function(t){return null===t.title||null===t.date})),void 0===a){e.next=7;break}return t.$toast.warning("Looks like you are missing with title or date for some tasks!...",{position:"top"}),e.abrupt("return");case 7:return i=t.startups.find((function(e){return e.docId===t.startup})),n={startup:i,milestones:t.milestones,incubatorId:t.$store.state.incubator.currentIncubator.docId,createdAt:new Date},e.prev=9,e.next=12,c["H"].add(n);case 12:for(o=null,s=0;s<n.milestones.length;s++)o+='<tr><td style="border:1px solid black;width:150px;color:black;">'+n.milestones[s].title+'</td><td style="border:1px solid black;width:180px;color:black;">'+n.milestones[s].date+'</td><td style="border:1px solid black;width:180px;color:black;">'+n.milestones[s].description+"</td></tr>";return e.next=16,I.a.post("https://traktor-api.herokuapp.com/sendMail",{from:{name:t.$store.state.incubator.currentIncubator.name,email:t.$store.state.incubator.currentIncubator.email},to:{name:n.startup.name,email:n.startup.email},subject:"Milestone update",content:'<body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;"><table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;line-height: 50px;font-size: 1px;margin-left: 7%;">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"><h2 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #e31212;font-size: 26px;line-height: 34px;font-family: Avenir,sans-serif;text-align: center;"></h2></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;margin-left: 7%;"><h3 class="size-16" style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 24px;font-family: arial,sans-serif;" lang="x-size-16"><span class="font-arial">Dear '.concat(n.startup.name,' </span></h3><p style="Margin-top: 12px;Margin-bottom: 0;"><span style="color:#000000;font-size: 16px;">Hope you are doing well. This is to inform you that following are the milestones to be completed in the given schedule.</span></p></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;margin-left:8%;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"><table style="border:1px solid black; border-collapse: collapse;text-align:center;"><tr><th>Milestone</th><th>Date</th><th>Description</th></tr>').concat(o,'</table></div></div></div> </div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div style="line-height:20px;font-size:20px;">&nbsp;</div><div role="contentinfo"><div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"><div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #adb3b9;font-family: sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"><div style="Margin-left: 20px; Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"><div style="font-size: 14px;line-height: 19px; margin-left: 7%;"><div>Regards,</div></div><div style="font-size: 14px;line-height: 19px;Margin-top: 18px;margin-left: 7%;"><div>\' + data.incubatorData.name + ').concat(t.$store.state.incubator.currentIncubator.name,"</div></div></div></div></div></div></div></div></div></td></tr></tbody></table></body>")});case 16:t.$toast.success("Milestones set successfully",{position:"top"}),e.next=22;break;case 19:e.prev=19,e.t0=e["catch"](9),t.$toast.error(e.t0,{position:"top"});case 22:case"end":return e.stop()}}),e,null,[[9,19]])})))()}}},D=O,$=(a("b3b2"),a("b0af")),F=a("99d9"),z=a("169a"),P=a("4bd4"),R=a("132d"),A=a("b974"),E=a("2fa4"),T=a("8654"),j=a("3a2f"),N=Object(m["a"])(D,S,C,!1,null,"41f350f4",null),U=N.exports;b()(N,{VBtn:f["a"],VCard:$["a"],VCardActions:F["a"],VCardText:F["b"],VCardTitle:F["c"],VCol:x["a"],VDialog:z["a"],VForm:P["a"],VIcon:R["a"],VRow:k["a"],VSelect:A["a"],VSpacer:E["a"],VTextField:T["a"],VTooltip:j["a"]});var H={name:"Progress",components:{ProgressUpdate:_,Milestones:U},data:function(){return{tab:null,icons:!0,centered:!0,grow:!0,tabs:3}}},J=H,B=(a("4357"),a("71a3")),G=a("c671"),L=a("fe57"),Q=a("9a96"),W=Object(m["a"])(J,i,n,!1,null,"0f40ce66",null);e["default"]=W.exports;b()(W,{VBtn:f["a"],VCard:$["a"],VCardText:F["b"],VCol:x["a"],VContainer:w["a"],VIcon:R["a"],VRow:k["a"],VTab:B["a"],VTabItem:G["a"],VTabs:L["a"],VTabsSlider:Q["a"],VTooltip:j["a"]})}}]);
//# sourceMappingURL=progress.81754330.js.map