'use strict';

const { fs, path, tryRequire } = require('@micro-app/shared-utils');

function adapter(microConfig) {
    const microServers = [];
    const { hooks, info = {} } = microConfig;
    if (hooks) {
        const root = info.root;
        const hooksFile = path.resolve(root, hooks);
        if (fs.existsSync(hooksFile)) {
            if (fs.statSync(hooksFile).isDirectory()) {
                fs.readdirSync(hooksFile).forEach(filename => {
                    const fp = path.resolve(hooksFile, filename);
                    const hooksCallback = tryRequire.resolve(fp);
                    if (hooksCallback && typeof hooksCallback === 'string') {
                        const key = filename.replace(/\.js$/, '');
                        microServers.push({
                            key,
                            link: hooksCallback,
                            info,
                        });
                    }
                });
            }
        }
    }
    return microServers;
}

function serverHooksMerge(...microConfigs) {
    if (!microConfigs || microConfigs.length <= 0) {
        return [];
    }
    const microServers = [];
    microConfigs.forEach(microConfig => {
        if (microConfig) {
            microServers.push(...adapter(microConfig));
        }
    });
    return microServers;
}

serverHooksMerge.adapter = adapter;
module.exports = serverHooksMerge;
