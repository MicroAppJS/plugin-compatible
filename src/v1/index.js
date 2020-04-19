'use strict';

// 直接把 hooks 和 entrys 直接转化为 plugin

module.exports = function(api, opts) {

    // 兼容 Deprecated
    if (api.hasKey('modifyWebpackChain')) {
        // @Deprecated
        api.registerMethod('modifyChainWebpackConfig', {
            type: api.API_TYPE.MODIFY,
            description: '@Deprecated compatible: 合并之后提供 webpack-chain 进行再次修改事件',
        });
        api.modifyWebpackChain((...args) => api.applyPluginHooks('modifyChainWebpackConfig', ...args));
    }
    if (api.hasKey('onWebpcakChain')) {
        // @Deprecated
        api.registerMethod('onChainWebpcakConfig', {
            type: api.API_TYPE.EVENT,
            description: '@Deprecated compatible: 修改之后提供 webpack-chain 进行查看事件',
        });
        api.onWebpcakChain((...args) => api.applyPluginHooks('onChainWebpcakConfig', ...args));
    }
    if (api.hasKey('resolveWebpackChain')) {
        api.extendMethod('resolveChainableWebpackConfig', {
            description: '@Deprecated compatible: resolve webpack-chain config.',
        }, api.resolveWebpackChain);
    }

    // fixed
    if (api.hasKey('modifyChainWebpackConfig')) {
        // @Deprecated
        api.registerMethod('modifyChainWebpcakConfig', {
            type: api.API_TYPE.MODIFY,
            description: '@Deprecated compatible: 合并之后提供 webpack-chain 进行再次修改事件',
        });
        api.modifyChainWebpackConfig((...args) => api.applyPluginHooks('modifyChainWebpcakConfig', ...args));
    }

    if (opts.server === true) {
        const createKoaServer = require('./createKoaServer');
        createKoaServer(api, opts);
    }

    // 用于兼容老版本的 hooks 和 entrys
    api.onInitWillDone(() => {
        const serverMerge = require('./lib/merge-server');
        const serverHooksMerge = require('./lib/merge-server-hooks');

        const selfServerConfig = api.selfServerConfig;
        const microsServerConfig = api.microsServerConfig;
        const micros = [].concat(api.micros);
        const entrys = serverMerge(...micros.map(key => microsServerConfig[key]), selfServerConfig);
        const hooks = serverHooksMerge(...micros.map(key => microsServerConfig[key]), selfServerConfig);

        if (hooks.length || entrys.length) {
        // 转换所有 hooks 和 entry 为插件, 兼容
            const convertHooks = require('./convertHooks');
            convertHooks(api, {
                hooks,
                entrys,
            });
        }
    });
};
