var NetworkSimulator = require('../src/NetworkSimulator'),
    App = require('../src/App'),
    topology = require('topology');

// Create the network simulator on the given topology
var network = new NetworkSimulator(topology);

// Add node logic for the desired apps
var node1 = new App('node1');

// API:
//    + start
//    + send
//    + onMessageReceived
