module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage", //按需加载自动引入
        corejs: 3, //指定corejs的版本
      },
    ],
  ],
};
