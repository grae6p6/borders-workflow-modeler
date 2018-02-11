
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

    const server = http.createServer(app).listen(app.get('port'), function() {
        console.log('Prod server listening on port ' + app.get('port'));
    });

    process.on('SIGTERM', shutDown);
    process.on('SIGINT', shutDown);
    process.on('SIGQUIT', shutDown);

    let connections = [];

    server.on('connection', connection => {
        connections.push(connection);
        connection.on('close', () => connections = connections.filter(curr => curr !== connection));
    });

    function shutDown() {
        console.log('Received kill signal, shutting down gracefully');
        server.close(() => {
            console.log('Closed out remaining connections');
            process.exit(0);
        });

        setTimeout(() => {
            console.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000);

        connections.forEach(curr => curr.end());
        setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
    }


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

