'use strict';

var path = require('path');
var should = require('should');
var sinon = require('sinon');
var assert = require('assert');
var fs = require('fs');

var dgram = require('dgram');
var URL = require('url');

var dtls = require('../index');

const server_dtls_opts = {
    key:            path.resolve('./ca/sky-server.pem'),
    cert:           path.resolve('./ca/sky-server.crt'),
    ca_cert:        path.resolve('./ca/root_ca.crt'),
    verify_mode:    dtls.VerifyModes.Required,
    debug:          1,
    identityPskCallback : null,
    handshakeTimeoutMin: 3000
};

const url = URL.parse('coaps://127.0.0.1/');

const client_dtls_opts = {
	key:           Buffer.concat([fs.readFileSync(path.join(__dirname, './ca/sky-client.pem')), new Buffer([0])]),
	cert:          Buffer.concat([fs.readFileSync(path.join(__dirname, './ca/sky-client.crt')), new Buffer([0])]),
	CACert:        Buffer.concat([fs.readFileSync(path.join(__dirname, './ca/root_ca.crt')), new Buffer([0])]),
	server_name_indication: "sky-server",
	debug: 1,
	host: url.hostname,
  	port: url.port || 5684,
	socket: dgram.createSocket({ type: 'udp4', reuseAddr: true })
};

describe('createServer', function() {
	it('create server', function (done) {
		const server = dtls.createServer(server_dtls_opts, socket => {
			socket.on('data', msg => {
				console.log('Server received:', msg.toString('utf8'));

				var message = Buffer.from('World!');
	  			socket.send(message, 0, message.length,	socket.port, socket.host)
			});

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
	      done();
	    });

		server.listen(5684);
	});

	it('send request', function (done) {
		this.timeout(5000);

		const client = dtls.connect(client_dtls_opts, socket => {
			socket.on('data', msg => {
				console.log('Client received:', msg.toString('utf8'));
				done();
			});
		});

		client.on('secureConnect', (socket) => {
			var message = Buffer.from('Hello!');
  			socket.send(message, 0, message.length,	url.port, url.hostname)
	    });

        client.on('error', (err) => {
			console.log('error', err);
	    });

	    client.on('close', (err) => {
			console.log('close', err);
	    });
	});
});
