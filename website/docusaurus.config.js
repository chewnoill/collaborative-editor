// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Collaborative Editor",
  tagline: "",
  url: "http://docs.williamcohen.com",
  baseUrl: "/website/",
  onBrokenLinks: "error",
  onBrokenMarkdownLinks: "error",
  favicon: "img/favicon.ico",
  organizationName: "chewnoill", // Usually your GitHub org/user name.
  projectName: "collaborative-editor", // Usually your repo name.

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/chewnoill/collaborative-editor/edit/master/website/",
          remarkPlugins: [require("mdx-mermaid")],
          path: "../docs",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: "https://github.com/chewnoill/collaborative-editor/edit/master/website/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Collaborative Editor Doc Site",
        logo: {
          alt: "My Site Logo",
          src: "img/logo.svg",
        },
        items: [
          { to: "/docs/getting-started", label: "Getting Started", position: "left" },
          { to: "/slides/intro", label: "Intro Slide Deck", position: "left" },
          {
            href: 'https://github.com/chewnoill/collaborative-editor',
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: 'https://github.com/chewnoill/collaborative-editor',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} WillDocs, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
