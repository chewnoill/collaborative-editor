const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  webpackFinal: async (config) => {
    const t= {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
        ...config.resolve.alias,
      "components": path.resolve(__dirname, "../src/components"),

        }
      }
    }
    console.log({t: t.resolve.alias});
    return t;
  },
};
