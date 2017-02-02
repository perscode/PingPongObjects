module.exports = function () {
    var client = './src/client/';
    var clientApp = client + 'app/';
    var content = client + 'content/';
    var server = './src/server/';
    var temp = './.tmp/';
    
    var config = {
        /**
        * Files paths
        */
        alljs: [
            './src/client/app/**/*.js',
            './*.js'
        ],
        build:'./build/',
        client: client,
        index: client + 'index.html',
        js: [
            client + 'components/*.js',
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        css: temp + '*.css',
        server: server,
        temp: temp,
        less: client + 'styles/*.less',
        fonts:'./bower_components/font-awesome/fonts/**/*.*',
        
        /**
         * Bower and NPM locations
         */
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        },
        
        /**
         * browser sync
         */
        browserReloadDelay: 1000,

        /** 
         * Node settings
         */
        defaultPort: 3000,
        nodeServer: server + 'app.js'
    };
    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    return config;
};