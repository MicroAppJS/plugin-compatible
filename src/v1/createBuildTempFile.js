'use strict';


module.exports = function createBuildTempFile(api, {
    hooks = [],
    entrys = [],
} = {}) {

    const { path } = require('@micro-app/shared-utils');

    api.beforeBuild(({ args }) => {
        if (args.target === 'plugin') {

            api.addBuildTempPlugin({
                id: 'temp:serverHooks',
                link: path.resolve(__dirname, './convertHooks'),
                opts: {
                    hooks,
                    entrys,
                },
            });
        }
    });

};
