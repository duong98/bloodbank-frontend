// next.config.js
const withImages = require("next-images");
module.exports = withImages({
  env: {
    host: "http://localhost:8080/api/",
  },
});
