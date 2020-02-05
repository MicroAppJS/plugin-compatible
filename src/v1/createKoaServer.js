'use strict';

module.exports = function createKoaServer(api, {
    port: configPort = 8888,
    host: configHost = 'localhost',
} = {}) {

    const logger = api.logger;

    api.modifyCreateServer(() => {
        const Koa = require('koa');
        // const koaCompose = require('koa-compose');
        const koaConvert = require('koa-convert');

        // const isDev = api.mode === 'development';
        logger.info('[compatible]', 'Starting Koa2 server...');

        return function({ args }) {
            const app = new Koa();
            app._name = 'KOA2'; // 设置名称, 给后面插件判断使用

            // 兼容koa1的中间件
            const _use = app.use;
            app.use = x => _use.call(app, koaConvert(x));
            app.logger = logger;
            app.use((ctx, next) => {
                ctx.logger = logger;
                return next();
            });

            app.on('error', error => {
                logger.error('koa server error: ', error);
            });

            api.applyPluginHooks('onServerInit', { app, args });

            api.applyPluginHooks('beforeServerEntry', { app, args });

            api.applyPluginHooks('onServerEntry', { app, args });

            api.applyPluginHooks('afterServerEntry', { app, args });

            api.applyPluginHooks('onServerInitWillDone', { app, args });

            api.applyPluginHooks('onServerInitDone', { app, args });

            const port = args.port || configPort;
            const host = args.host || configHost;
            return new Promise((resolve, reject) => {
                app.listen(port, host === 'localhost' ? '0.0.0.0' : host, err => {
                    if (err) {
                        logger.error(err);
                        api.applyPluginHooks('onServerRunFail', { host, port, err, args });
                        reject(err);
                        return;
                    }
                    logger.success(`Server running... listen on ${port}, host: ${host}`);

                    api.applyPluginHooks('onServerRunSuccess', { host, port, args });

                    const url = `http://${host}:${port}`;
                    resolve({ host, port, url });
                });
            });
        };
    });

};
