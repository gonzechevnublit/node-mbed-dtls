# Load Test

## Usage

1. Run server.js:

> $ node server.js

2. Run client.js:

> $ node client.js

## Server

* If the server receives a connection request and successfully connects. The socket will be push into the socketArray and print out how many clients are currently connected successfully.

## Client

* `client.js` will create clients and send connection request to the server.
* How many clients depend on the for loop.
* If the client is connected successfully. The socket will be push into the socketArray and print out how many clients are currently connected successfully.

## Issues

* If more then 50 clients send connection request to the server in the same time. A few client will not connect successfully.
