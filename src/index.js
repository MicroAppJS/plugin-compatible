'use strict';

module.exports = function(api, opts = {}) {

    const version = opts.version || 'v1';

    // adapter
    switch (version.toLowerCase()) {
        case 'v1':
        default: {
            require('./v1')(api, opts);
            break;
        }
    }

};
