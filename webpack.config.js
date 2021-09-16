module.exports = {
    entry: './dist/index.js',
    output: {
        filename: 'main.js',
        path: __dirname
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    devServer: {
        host: "0.0.0.0"
    },
    watch: true
};
