// next.config.js
const withImages = require("next-images");
module.exports = withImages({
  env: {
    host: "https://35.223.238.198:8080/api",
  },
});
