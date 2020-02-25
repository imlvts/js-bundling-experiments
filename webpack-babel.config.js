const path = require("path");

module.exports = {
    entry: path.join(__dirname, "demo.js"),
    output: {
        path: path.join(__dirname, "dist"),
        filename: "demo.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: require.resolve("babel-loader"),
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
