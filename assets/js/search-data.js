// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-home",
    title: "Home",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "projects-mean-flow-dtamp",
          title: 'Mean Flow × DTAMP',
          description: "Real-time milestone replanning for long-horizon manipulation with one-step Mean Flow sampling inside DTAMP.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/Real-time_replanning_with_Meanflow_DTAMP/";
            },},{id: "projects-chefbox",
          title: 'ChefBox',
          description: "Subscription-based modular unmanned store service that lowers franchise expansion risk.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/chefbox/";
            },},{id: "projects-medi",
          title: 'MEDi',
          description: "On-device AI that helps visually impaired people identify pharmaceutical products.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/medi_app/";
            },},{id: "projects-flow-matching-diffuser",
          title: 'Flow Matching × Diffuser',
          description: "Flow matching in Diffuser for faster, more stable trajectory planning.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/planning_with_flowmatching/";
            },},{id: "projects-unmanned-orchard-robot",
          title: 'Unmanned Orchard Robot',
          description: "Vision-based autonomous guidance and yield monitoring for orchards.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/unmanned_orchard_robot/";
            },},{id: "projects-urban-autonomous-racing",
          title: 'Urban Autonomous Racing',
          description: "Building and racing a fully autonomous vehicle with state-based control and a custom perception data engine.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/urban_autonomous_racing/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6A%75%6E%65%73%6A%75%6B%69%6D@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/junesjukim", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/junesjukim", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=qc6CJjYAAAAJ", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
