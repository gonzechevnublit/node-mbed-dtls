'use strict';

var path = require('path');
var should = require('should');
var sinon = require('sinon');
var assert = require('assert');
var fs = require('fs');

var dgram = require('dgram');
var URL = require('url');

var dtls = require('../index');

const url = URL.parse('coaps://127.0.0.1/');

var count = 0;

var socketArray = [];

function newClientAndRequest() {
	const client_dtls_opts = {
		key:           Buffer.concat([fs.readFileSync(path.join(__dirname, '../test/ca/sky-client.pem')), new Buffer([0])]),
		cert:          Buffer.concat([fs.readFileSync(path.join(__dirname, '../test/ca/sky-client.crt')), new Buffer([0])]),
		CACert:        Buffer.concat([fs.readFileSync(path.join(__dirname, '../test/ca/root_ca.crt')), new Buffer([0])]),
		server_name_indication: "sky-server",
		debug: 1,
		host: url.hostname,
	  	port: url.port || 5684,
		socket: dgram.createSocket({ type: 'udp4', reuseAddr: true })
	};

	const client = dtls.connect(client_dtls_opts);

	client.on('secureConnect', (socket) => {
		socketArray.push(socket);
		console.log('Client connected count: ' + socketArray.length);
	});

	client.on('error', (err) => {
		console.log('error', err);
		throw new Error(err);
	});

	client.on('close', () => {
		console.log('Client close');
		throw new Error('Client close');
	});
}

for (var i = 0; i < 50; i++) {
	newClientAndRequest(); 
}
