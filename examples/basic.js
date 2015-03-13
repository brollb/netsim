var NetworkSimulator = require('../src/NetworkSimulator'),
    App = require('../src/App'),
    topology = require('topology');

// Create the network simulator on the given topology
var network = new NetworkSimulator(topology);

// Add node logic for the desired apps
var node1 = new App('node1')
    .onStart(function() {
        console.log('node1 is starting');
    })
    .onMessage(function(msg) {
        console.log('node1 received a msg');
    })

node1 = new App({id: 'node1',
                 onStart: startFn,
                 onMessage: msgFn});

// API:
//    + start
//    + send
//    + onMessageReceived
