'use strict';

const { _, tryRequire } = require('@micro-app/shared-utils');

const HOOK_KEY_MAP = {
    init: 'onServerInit',
    before: 'beforeServerEntry',
    after: 'afterServerEntry',
    willDone: 'onServerInitWillDone',
    done: 'onServerInitDone',
};

module.exports = function(api, { hooks, entrys }) {
    const logger = api.logger;

    // 生成模拟插件注册
    // hooks
    (hooks || []).map(({ key, link, info = {} }) => {
        const hook = tryRequire(link);
        if (hook && _.isFunction(hook)) {
            const hookName = HOOK_KEY_MAP[key];
            if (hookName) {
                return {
                    hookName, hook,
                    info, link, key,
                };
            }
        }
        return false;
    }).filter(item => !!item).forEach(({ hookName, hook, info, link, key }) => {
        api[hookName](params => {
            logger.info('[compatible]', `【 ${info.name} 】Hook inject "${key}"`);
            logger.debug('[compatible]', `【 ${info.name} 】Hook inject "${key}" Link: ${link}`);
            return hook(params.app, info);
        });
    });

    // entrys
    (entrys || []).map(item => {
        const entry = tryRequire(item.link);
        if (entry && _.isFunction(entry)) {
            return { ...item, entry };
        }
        return false;
    }).filter(item => !!item).forEach(({ entry, info, link }) => {
        api.onServerEntry(params => {
            logger.info(`【 ${info.name} 】Inserted`);
            logger.debug(`【 ${info.name} 】Inserted Link: ${link}`);
            return entry(params.app, info);
        });
    });
};
