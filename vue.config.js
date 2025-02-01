const { defineConfig } = require('@vue/cli-service');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: (config) => {
    // 添加 NodePolyfillPlugin
    config.plugins.push(new NodePolyfillPlugin());

    // 添加 resolve.fallback 配置
    config.resolve.fallback = {
      fs: false, // 如果不需要 fs 模块，可以禁用
      path: require.resolve('path-browserify'), // 提供 path 模块的 polyfill
    };
  },
});