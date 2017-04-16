module.exports = function() {
    return {
        module: {
            rules: [
                {
                    test: /\.pug$/,
                    loader: "pug-loader",
                    options: {
                        //расставить отступы и переносы строк
                        pretty: true
                    }
                }
            ]
        }
    }
};