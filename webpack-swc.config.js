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
                    loader: require.resolve("swc-loader"), // you would put swc-loader
                    options: {
                        jsc: {
                            target: "es2015",
                            parser: {
                                syntax: "ecmascript",
                                jsx: true,
                                dynamicImport: true,
                                classProperty: true,
                                exportNamespaceFrom: true,
                                exportDefaultFrom: true
                            }
                        }
                    }
                }
            }
        ]
    }
};
