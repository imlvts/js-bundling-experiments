const path = require("path");

module.exports = {
    entry: path.join(__dirname, "demo.js"),
    output: {
        path: path.join(__dirname, "dist"),
        filename: "demo.js"
    }
};
