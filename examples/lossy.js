'use strict';

var NetSim = require('../src/NetworkSimulator'),
    topology = require('./networks/lossy_net');

// Create the network simulator on the given topology
var netsim = new NetSim(topology);

// Add nodes
netsim.addNode({uuid: 'node1',
               onStart: function() {
                   console.log('node1 is sending 10 messages to node4');
                   for (var i = 10; i--;) {
                       this.sendMessage('node4', 'Marco!');
                   }
               }});

netsim.addNode({uuid: 'node4',
               onMessageReceived: function(id, msg) {
                   console.log(this.uuid+' received msg: '+msg);
               } });

// Run the simulation
netsim.simulate();
