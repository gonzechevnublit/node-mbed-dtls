'use strict';

var path = require('path');
var should = require('should');
var sinon = require('sinon');
var assert = require('assert');
var dgram = require('dgram');

var dtls = require('../index');

const server_dtls_opts = {
    key:            path.resolve('../test/ca/sky-server.pem'),
    cert:           path.resolve('../test/ca/sky-server.crt'),
    ca_cert:        path.resolve('../test/ca/root_ca.crt'),
    verify_mode:    dtls.VerifyModes.Required,
    debug:          1,
    identityPskCallback : null,
    handshakeTimeoutMin: 3000
};

var socketArray = [];

const server = dtls.createServer(server_dtls_opts, socket => {
	socketArray.push(socket);
	console.log('Server connected count: ' + socketArray.length);

	socket.once('error', (err) => {
		console.error(`socket error on ${socket.remoteAddress}:${socket.remotePort}: ${err}`);
	});

	socket.once('close', () => {
		console.log(`closing socket from ${socket.remoteAddress}:${socket.remotePort}`);
	});
});

server.once('error', (err) => {
	console.log('error', err);
});

server.once('close', () => {
	console.log('close');
});

server.on('listening', () => {
  	console.log('');
  	console.log('Server listening on port 5684');
});

server.listen(5684);
