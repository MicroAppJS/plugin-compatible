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
        if (link && tryRequire.resolve(link)) {
            const hookName = HOOK_KEY_MAP[key];
            if (hookName) {
                return {
                    hookName,
                    info, link, key,
                };
            }
        }
        return false;
    }).filter(item => !!item).forEach(({ hookName, info, link, key }) => {
        api[hookName](params => {
            const hook = tryRequire(link);
            if (hook && _.isFunction(hook)) {
                logger.info('[compatible]', `【 ${info.name} 】Hook inject "${key}"`);
                logger.debug('[compatible]', `【 ${info.name} 】Hook inject "${key}" Link: ${link}`);
                return hook(params.app, info);
            }
            return false;
        });
    });

    // entrys
    (entrys || []).map(item => {
        if (item && item.link && tryRequire.resolve(item.link)) {
            return { ...item };
        }
        return false;
    }).filter(item => !!item).forEach(({ link, info }) => {
        api.onServerEntry(params => {
            const entry = tryRequire(link);
            if (entry && _.isFunction(entry)) {
                logger.info(`【 ${info.name} 】Inserted`);
                logger.debug(`【 ${info.name} 】Inserted Link: ${link}`);
                return entry(params.app, info);
            }
            return false;
        });
    });
};
