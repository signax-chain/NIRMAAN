// import { deApprovalsRef } from "../config/firebase_services";
import store from "../store";

const initializeSuperIncubatorNavigation = () => {
  const allowedNavigation = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "mdi-view-dashboard",
    },
    {
      title: "Incubators",
      href: "/incubators",
      icon: "mdi-account-multiple",
    },
    {
      title: "Startups",
      href: "/startups",
      icon: "mdi-school",
    },
    {
      title: "Mentors",
      href: "/mentors",
      icon: "mdi-book-open",
    },
    {
      title: "Connections",
      href: "/connections",
      icon: "mdi-message-text",
      // count: 0,
    },
    {
      title: "Reports",
      href: "/reports",
      icon: "mdi-file-multiple",
    },
    {
      title: 'Benifits',
      href: '/benifits',
      icon: 'mdi-gift'
    },
    {
      title: 'Resources',
      href: '/resources',
      icon: 'mdi-folder-open'
    },
  ]

  return store.dispatch("SET_NAVIGATION", allowedNavigation);
}

const initializeIncubatorNavigation = () => {
  const allowedNavigation = [
    {
      title: "Dashboard",
      href: "/dashboard?tab=overview",
      icon: "mdi-view-dashboard",
      // count: 0,
    },
    {
      title: "Startups",
      href: "/startups",
      icon: "mdi-school",
      // count: 0,
    },
    {
      title: "Mentors",
      href: "/mentors",
      icon: "mdi-account-supervisor-circle",
      // count: 0,
    },
    // {
    //   title: "DE",
    //   href: "/de",
    //   icon: "mdi-account-tie",
    //   // count: 0,
    // },
    {
      title: "Mentorship",
      href: "/mentorship",
      icon: "mdi-book-open-blank-variant",
      // count: 0,
    },
    {
      title: "Events",
      href: "/events",
      icon: "mdi-calendar",
      // count: 0,
    },
    {
      title: "Connections",
      href: "/connections",
      icon: "mdi-message-text",
      // count: 0,
    },

    // {
    //   title: 'Jobs',
    //   href: '/jobs',
    //   icon: 'mdi-school'
    // },
    // {
    //   title: "Progress",
    //   href: "/progress",
    //   icon: "mdi-chart-box",
    // },
    {
      title: "Reports",
      href: "/reports",
      icon: "mdi-file-multiple",
    },
    // {
    //   title: "Activity",
    //   href: "/activities",
    //   icon: "mdi-clipboard-text",
    // },
  ];
  // deApprovalsRef.where('incubatorId', '==', store.state.incubator.currentIncubator.docId).where('isApproved', '==', false).onSnapshot(snapshot => {
  //   snapshot.forEach(() => {
  //     allowedNavigation[3].count++;
  //   })
  // });

  return store.dispatch("SET_NAVIGATION", allowedNavigation);
};

const initializeMentorNavigation = () => {
  const allowedNavigation = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "mdi-view-dashboard",
    },
    {
      title: "Startups",
      href: "/mentor-startups",
      icon: "mdi-school",
    },
    {
      title: "Mentors",
      href: "/mentors",
      icon: "mdi-account-supervisor-circle",
    },
    {
      title: "Profile",
      href: "/profile",
      icon: "mdi-account-circle",
    },
    // {
    //   title: "Contacts",
    //   href: "/contacts",
    //   icon: "mdi-message-text",
    // },
    // {
    //   title: "Activities",
    //   href: "/documentation",
    //   icon: "mdi-file-multiple",
    // },
  ];
  return store.dispatch("SET_NAVIGATION", allowedNavigation);
};

const initializeStartupNavigation = () => {
  const allowedNavigation = [
    // {
    //   title: "Dashboard",
    //   href: "/dashboard",
    //   icon: "mdi-view-dashboard",
    // },
    {
      title: "Profile",
      href: "/about",
      icon: "mdi-account-circle",
    },
    {
      title: 'DE',
      href: '/disciplined-entrepreneurship',
      icon: 'mdi-puzzle'
    },
    {
      title: "Mentors",
      href: "/mentors",
      icon: "mdi-account-supervisor-circle",
    },
    {
      title: "Startups",
      href: "/startups",
      icon: "mdi-school",
    },
    {
      title: "Contacts",
      href: "/contacts",
      icon: "mdi-message-text",
    },
    {
      title: 'Jobs',
      href: '/jobs',
      icon: 'mdi-school'
    },
    {
      title: 'Resources',
      href: '/resources',
      icon: 'mdi-school'
    },
    // {
    //   title: 'Benifits',
    //   href: '/benifits',
    //   icon: 'mdi-gift'
    // },

    // {
    //   title: "Activities",
    //   href: "/documentation",
    //   icon: "mdi-file-multiple",
    // },
  ];
  return store.dispatch("SET_NAVIGATION", allowedNavigation);
};

const initializeMemberNavigation = () => {
  const allowedNavigation = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "mdi-view-dashboard",
    },
    {
      title: "Startups",
      href: "/startups",
      icon: "mdi-school",
    },
    {
      title: "Mentors",
      href: "/mentors",
      icon: "mdi-account-supervisor-circle",
    },
    {
      title: "DE",
      href: "/de",
      icon: "mdi-account-tie",
    },
    {
      title: "Mentorship",
      href: "/mentorship",
      icon: "mdi-book-open-blank-variant",
    },
    {
      title: "Events",
      href: "/events",
      icon: "mdi-calendar",
    },
    {
      title: "Connections",
      href: "/connections",
      icon: "mdi-message-text",
    },
    // {
    //   title: 'Jobs',
    //   href: '/jobs',
    //   icon: 'mdi-school'
    // },
  ];
  return store.dispatch("SET_NAVIGATION", allowedNavigation);
};

const initializeAccountantNavigation = () => {
  const allowedNavigation = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "mdi-view-dashboard",
    },
    {
      title: "Startups",
      href: "/startups",
      icon: "mdi-school",
    }
  ]

  return store.dispatch("SET_NAVIGATION", allowedNavigation);
}

export {
  initializeSuperIncubatorNavigation,
  initializeIncubatorNavigation,
  initializeMentorNavigation,
  initializeStartupNavigation,
  initializeMemberNavigation,
  initializeAccountantNavigation
};
