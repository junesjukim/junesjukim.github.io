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
        },{id: "post-implicit-q-learning-iql-explained",
        
          title: "Implicit Q-Learning (IQL) Explained",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/studies/2024/iql-review/";
          
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
          section: "News",},{id: "projects-medi-app",
          title: 'MEDi App',
          description: "An accessibility app for visually-impaired shoppers",
          section: "Projects",handler: () => {
              window.location.href = "/projects/medi_app/";
            },},{id: "projects-passionate-pet-lover",
          title: 'Passionate Pet Lover',
          description: "Daily Pet Care Management Platform",
          section: "Projects",handler: () => {
              window.location.href = "/projects/passionate_pet_lover/";
            },},{id: "projects-autonomous-driving-robot-si-dong-ai",
          title: 'Autonomous Driving Robot (Si:Dong AI)',
          description: "YOLOv5 application on Depth Camera and Fusion with Lidar for Autonomous Driving",
          section: "Projects",handler: () => {
              window.location.href = "/projects/sidong_ai/";
            },},{id: "projects-sky-blue-workers",
          title: 'Sky Blue Workers',
          description: "Job Platform for Blue Collar Workers",
          section: "Projects",handler: () => {
              window.location.href = "/projects/sky_blue_workers/";
            },},{id: "projects-unmanned-orchard-robot",
          title: 'Unmanned Orchard Robot',
          description: "Vision-Based Autonomous Guidance and Yield Monitoring",
          section: "Projects",handler: () => {
              window.location.href = "/projects/unmanned_orchard_robot/";
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
