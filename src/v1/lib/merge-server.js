'use strict';

const { path, tryRequire } = require('@micro-app/shared-utils');

function adapter(microConfig) {
    const microServers = [];
    const { entry, info = {} } = microConfig;
    if (entry) {
        const root = info.root;
        const entryFile = path.resolve(root, entry);
        const entryCallback = tryRequire.resolve(entryFile);
        if (entryCallback && typeof entryCallback === 'string') {
            microServers.push({
                link: entryCallback,
                info,
            });
        }
    }
    return microServers;
}

function serverMerge(...microConfigs) {
    if (!microConfigs || microConfigs.length <= 0) {
        return [];
    }
    const microServers = [];
    microConfigs.forEach(microConfig => {
        microServers.push(...adapter(microConfig));
    });
    return microServers;
}

serverMerge.adapter = adapter;
module.exports = serverMerge;
