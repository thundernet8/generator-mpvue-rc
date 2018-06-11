var path = require('path');
var fs = require('fs');
var utils = require('./utils');
var config = require('../config');
var vueLoaderConfig = require('./vue-loader.conf');
var MpvuePlugin = require('webpack-mpvue-asset-plugin');
var StringReplacePlugin = require('string-replace-webpack-plugin');
var glob = require('glob');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

function getEntry(rootSrc, pattern) {
    var files = glob.sync(path.resolve(rootSrc, pattern));
    return files.reduce((res, file) => {
        var info = path.parse(file);
        var key = info.dir.slice(rootSrc.length + 1) + '/' + info.name;
        res[key] = path.resolve(file);
        return res;
    }, {});
}

function getComponentsEntry(rootSrc, pattern) {
    var files = glob.sync(path.resolve(rootSrc, pattern));
    return files.reduce((res, file) => {
        var info = path.parse(path.parse(file).dir);
        res[info.name] = path.resolve(file);
        return res;
    }, {});
}

// const appEntry = { app: resolve('./src/main.js') }
// const pagesEntry = getEntry(resolve('./src'), 'pages/**/main.js')
const componentsEntry = getComponentsEntry(resolve('./src'), 'components/**/index.vue');
console.log(componentsEntry);
const entry = componentsEntry;

module.exports = {
    // 如果要自定义生成的 dist 目录里面的文件路径，
    // 可以将 entry 写成 {'toPath': 'fromPath'} 的形式，
    // toPath 为相对于 dist 的路径, 例：index/demo，则生成的文件地址为 dist/index/demo.js
    entry,
    target: require('mpvue-webpack-target'),
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath:
            process.env.NODE_ENV === 'production'
                ? config.build.assetsPublicPath
                : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            vue: 'mpvue',
            '@': resolve('src')
        },
        symlinks: false,
        aliasFields: ['mpvue', 'weapp', 'browser'],
        mainFields: ['browser', 'module', 'main']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'mpvue-rc-loader',
                        options: vueLoaderConfig
                    },
                    {
                        loader: StringReplacePlugin.replace({
                            replacements: [
                                {
                                    pattern: /(this|self)\.\$emit\(/g,
                                    replacement: function(match, p1, offset, string) {
                                        return `${p1}.$mp.page.triggerEvent(`;
                                    }
                                }
                            ]
                        })
                    }
                ]
            },
            {
                test: /\.js$/,
                include: [resolve('src'), resolve('test')],
                use: [
                    'babel-loader',
                    {
                        loader: 'mpvue-loader',
                        options: {
                            checkMPEntry: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name]].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[ext]')
                }
            }
        ]
    },
    plugins: [new MpvuePlugin(), new StringReplacePlugin()]
};
