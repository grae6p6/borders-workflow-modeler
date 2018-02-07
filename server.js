
const port =  process.env.PORT || 8080;

if (process.env.NODE_ENV === 'production') {

    const express = require('express');
    const http = require('http');
    const app = express();
    const path = require('path');

    const respond = (req, res) => {
        res.send('OK');
    };

    process.title = 'borders-workflow-modeler';

    app.set('port', port);

    app.use(express.static(__dirname + "/"));

    app.get('/healthz', respond);
    app.get('/readiness', respond);

    app.all('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    http.createServer(app).listen(app.get('port'), function() {
        console.log('Prod server listening on port ' + app.get('port'));
    });

    const closeGracefully = (signal) => {
        setTimeout(() => {
            logger.warn('Forcefully shutting down from sig:', signal);
            process.exit(0); // eslint-disable-line no-process-exit
        }, 500);

        server.close(() => process.exit(0)); // eslint-disable-line no-process-exit
    };

    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal =>
        process.on(signal, () => closeGracefully(signal))
    );

} else {
    const webpack = require('webpack');
    const WebpackDevServer = require('webpack-dev-server');
    const config = require('./webpack.config');

    const server = new WebpackDevServer(webpack(config), {
        publicPath: config.output.publicPath,
        hot: true,

        historyApiFallback: true,
        contentBase: 'public/',
    });


    server.listen(port, 'localhost', (error) => {
        if (error) {
            return console.log(error);
        }
        console.log('Dev Server running at http://localhost:' + port + "/");
    });
}

