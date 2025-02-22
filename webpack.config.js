const path = require("path");
const webpack = require("webpack");

module.exports = (env, argv) => {
    const isProduction = argv.mode === "production";
    
    return {
        mode: isProduction ? "production" : "development",
        entry: {
            index: "./src/index.ts",
        },
        output: {
            filename: "[name].bundle.js",
            path: path.resolve(__dirname, "docs/")
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: [".ts", ".js"]
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify(isProduction ? "production" : "development")
            })
        ]
    };
};