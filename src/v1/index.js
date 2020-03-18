'use strict';

// 直接把 hooks 和 entrys 直接转化为 plugin

module.exports = function(api, opts) {

    api.registerMethod('modifyChainWebpcakConfig', {
        type: api.API_TYPE.MODIFY,
        description: 'compatible: 合并之后提供 webpack-chain 进行再次修改事件',
    });
    if (api.modifyChainWebpackConfig) {
        api.modifyChainWebpackConfig((...args) => api.applyPluginHooks('modifyChainWebpcakConfig', ...args));
    }

    if (opts.server === true) {
        const createKoaServer = require('./createKoaServer');
        createKoaServer(api);
    }

    // modify micros: 增加 scope

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
