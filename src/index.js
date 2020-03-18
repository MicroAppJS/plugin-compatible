'use strict';

module.exports = function compatible(api, opts = {}) {

    const version = opts.version || 'v1';

    // adapter
    switch (version.toLowerCase()) {
        case 'v1':
            return require('./v1')(api, opts);
        default:
            break;
    }

    api.logger.warn('[compatible]', `Not Support Version: ${version}`);

    return;
};
