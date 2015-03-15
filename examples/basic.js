'use strict';

var NetworkSimulator = require('../src/NetworkSimulator'),
    topology = require('./topology');

// Create the network simulator on the given topology
var netsim = new NetworkSimulator(topology);

netsim.addNode({uuid: 'node1',
               onStart: function() {
                   this.sendMessage('node4', 'Marco!');
               },
               onMessageReceived: function(id, msg) {
                   console.log(this.uuid+' received msg: '+msg);
               } });

netsim.addNode({uuid: 'node4',
               onMessageReceived: function(id, msg) {
                   console.log(this.uuid+' received msg: '+msg);
                   this.sendMessage('node1', 'Polo!');
               } });

netsim.simulate();
// Add node logic for the desired apps
// API:
//    + onStart
//    + sendMessage
//    + onMessageReceived
