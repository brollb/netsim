'use strict';

var NetSim = require('../src/NetworkSimulator'),
    topology = require('./networks/topology');

// Create the network simulator on the given topology
var netsim = new NetSim(topology);

// Add nodes
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

// Run the simulation
netsim.simulate();
