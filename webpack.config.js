const path = require('path');
//引入copy-webpack-plugin插件，作用是实现基本的文件复制功能
const CopyWebpackPlugin = require('copy-webpack-plugin');
//引入babel插件来转译ES6
const babel = require('@babel/core');
//引入less模块
const less = require('less');

module.exports = {
  mode: "development",
  watch: true,
  entry: "./src/app.js",
  //entry字段表示入口文件，但小程序开发无须打包输出为单个文件，所以输入项目中的任一文件即可，这里将entry设置为
  //小程序的启动文件app.js
  output: {
    path: path.join(__dirname, "dist"),
    /* clean: true, */
  },
  //output配置为dist目录，这样最终代码输出会出现在项目根目录的dist文件夹中，在启动小程序开发IDE预览效果
  //时选择dist目录即可
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "./src"),
        use: {
          loader: "babel-loader",
          options: {
            // presets: ["@babel/preset-env"],
            cacheDirectory: true, //开启babel缓存
            cacheCompression: false, //关闭缓存文件压缩
            plugins: ["@babel/plugin-transform-runtime"], //减小体积
          },
        },
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin(
      [
        {
          from: "**/*.js",
          to: "./",
          ignore: ["*.test.js", "*.spec.js"],
          transform(content, path) {
            const newCode = babel.transformSync(content, {
              babelrc: true,
              presets: ["@babel/preset-env"],
            }).code;
            return Promise.resolve(newCode.toString());
          },
        },
        {
          from: "**/*.wxml",
          to: "./",
        },
        {
          from: "**/*.json",
          to: "./",
        },
        {
          from: "**/*.jpg",
          to: "./",
        },
        {
          from: "**/*.png",
          to: "./",
        },
        {
          from: "**/*.css",
          to: "./",
        },
        {
          from: "**/*.wxss",
          to: "./",
        },
        {
          from: "**/*.wxs",
          to: "./",
        },
        {
          from: "**/*.less",
          to: "./",
          transform(content, path) {
            //调用less.render()将Less代码编译为css代码
            return less.render(content.toString()).then(function (output) {
              return output.css;
            });
          },
          transformPath(targetPath) {
            return targetPath.replace(".less", ".wxss");
          },
        },
      ],
      {
        context: "./src",
      }
    ),
  ],
};
