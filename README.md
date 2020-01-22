# Micro APP Plugin - Compatible

[Plugin] compatible plugin.

针对于跨版本升级的兼容性方案. 用于 `@micro-app/cli` 的插件.

[![Github Actions Coveralls][Github-Actions-Coveralls]][Github-Actions-Coveralls-url]
[![Coverage Status][Coverage-img]][Coverage-url]
[![NPM Version][npm-img]][npm-url]
[![NPM Download][download-img]][download-url]

[Github-Actions-Coveralls]: https://github.com/MicroAppJS/plugin-compatible/workflows/Coveralls/badge.svg
[Github-Actions-Coveralls-url]: https://github.com/MicroAppJS/plugin-compatible
[Coverage-img]: https://coveralls.io/repos/github/MicroAppJS/plugin-compatible/badge.svg?branch=master
[Coverage-url]: https://coveralls.io/github/MicroAppJS/plugin-compatible?branch=master
[npm-img]: https://img.shields.io/npm/v/@micro-app/plugin-compatible.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@micro-app/plugin-compatible
[download-img]: https://img.shields.io/npm/dm/@micro-app/plugin-compatible.svg?style=flat-square
[download-url]: https://npmjs.org/package/@micro-app/plugin-compatible

## Install

```sh
yarn add @micro-app/plugin-compatible
```

or

```sh
npm install -S @micro-app/plugin-compatible
```

## Usage

### 在项目 `根目录` 的 `micro-app.config.js` 文件中配置

```js
module.exports = {
    // ...

    plugins: [ // 自定义插件
        ['@micro-app/plugin-compatible', {
            version: 'v1', // default: 'v1'
            server: false, // default: true
        }],
    ],
};
```
