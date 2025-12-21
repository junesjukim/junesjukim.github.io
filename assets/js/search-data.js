// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-projects",
          title: "projects",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-repos",
          title: "repos",
          description: "selected",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-studies",
          title: "studies",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/studies/index.html";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "This is a description of the page. You can modify it in &#39;_pages/cv.md&#39;. You can also change or remove the top pdf download button.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "projects-fully-automated-hot-dog-vending-machine",
          title: 'Fully automated hot dog vending machine',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/Fully%20automated%20hot%20dog%20vending%20machineTAMP%20copy/";
            },},{id: "projects-robust-replanning-integrating-mean-flow-with-dtamp",
          title: 'Robust Replanning Integrating Mean Flow with DTAMP',
          description: "Overcoming dynamics hallucination in long-horizon manipulation by integrating Mean Flow, Flow matching with DTAMP-based replanning strategies.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/Real-time_replanning_with_Meanflow_DTAMP/";
            },},{id: "projects-medi",
          title: 'MEDi',
          description: "An AI-driven platform to help visually impaired individuals identify pharmaceutical products.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/medi_app/";
            },},{id: "projects-planning-with-flowmatching",
          title: 'Planning with Flowmatching',
          description: "Optimizing real-time robotic control by transitioning from Diffusion to Flow Matching to reduce sampling steps and analyze dynamics errors.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/planning_with_flowmatching/";
            },},{id: "projects-unmanned-orchard-robot",
          title: 'Unmanned Orchard Robot',
          description: "Vision-Based Autonomous Guidance and Yield Monitoring",
          section: "Projects",handler: () => {
              window.location.href = "/projects/unmanned_orchard_robot/";
            },},{id: "projects-urban-autonomous-racing",
          title: 'Urban Autonomous Racing',
          description: "Building and racing a fully autonomous vehicle, focusing on robust state-based control systems and a custom perception data engine.",
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
