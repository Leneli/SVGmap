module.exports = function() {
    return {
        //локальный сервер "webpack-dev-server"
        devServer: {
            //выводить в консоль только ошибки
            stats: "errors-only",
            port: 9000
        }
    }
};