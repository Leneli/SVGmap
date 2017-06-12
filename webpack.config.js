const webpack = require("webpack");
//подключенные плагины и модули
const path = require("path"), //модуль node для работы с путями
    htmlWebpackPlugin = require("html-webpack-plugin"), //модуль для генерации html
    merge = require("webpack-merge"); //слияние
//конфигурации
const pug = require("./webpack/pug"),
    devserver = require("./webpack/devserver"),
    sass = require("./webpack/sass"),
    css = require("./webpack/css"),
    extractCSS = require("./webpack/css.extract");
//пути
const PATHS = {
    //исходники приложения
    source: path.join(__dirname, "source"),
    //результат сборки
    build: path.join(__dirname, "build")
};

//общий для разработки и продакшена код
const common = merge([
    {
        //точка входа для приложения
        //точками входа могут служить только те модули, которые не используются другими модулями приложения
        entry: {
            "index": PATHS.source + "/pages/index/index.js"
        },
        //имена файлов и дериктория для результатов работы
        output: {
            path: PATHS.build,
            filename: "js/[name].js"
        },
        //babel
        module: {
            rules: [{
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['es2015'] }
                }]
            }]
        },
        //подключенные плагины для работы Webpack
        plugins: [
            //главная страница (index.html)
            new htmlWebpackPlugin({
                filename: "index.html",
                chunks: ["index", "common"],
                template: PATHS.source + "/pages/index/index.pug"
            }),
            //вынести общие части кода из скриптов и стилей
            new webpack.optimize.CommonsChunkPlugin({
                name: "common"
            })
        ]
    },
    pug()
]);


//настройки Webpack
module.exports = function(env) {
    if(env === "production") {
        return merge([
            common,
            extractCSS()
        ]);
    }

    if(env === "development") {
        return merge([
            common,
            devserver(),
            sass(),
            css()
        ]);
    }
};