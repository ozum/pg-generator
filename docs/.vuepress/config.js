// This is user editable config.
const baseConfig = require("../../module-files/configs/vuepress-config.js");

// console.log(require("util").inspect(baseConfig.themeConfig, { depth: null, showHidden: false, colors: true }));
// throw new Error("jj")
module.exports = {
  ...baseConfig,
  themeConfig: {
    ...baseConfig.themeConfig,
    nav: [
      ...baseConfig.themeConfig.nav,
      {
        text: "Versions",
        ariaLabel: "Versions",
        items: [
          { text: "v5", link: "/" },
          { text: "v4", link: "/v4/" },
        ],
      },
    ],
  },
};
