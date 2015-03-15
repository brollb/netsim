/*globals beforeEach,describe,it*/
/*
 * Tests for the Network Simulator
 */
'use strict';
var NetworkSimulator = require('../src/NetworkSimulator'),
    App = require('../src/App'),
    k2Topology = require('./basic_top'),  // clique of size 2
    p3Topology = require('./p3_top'),  // path of length 3
    assert = require('assert');

describe('Network Simulator Tests', function() {
    var netsim;

    describe('Node Creation Tests', function() {
        beforeEach(function() {
            netsim = new NetworkSimulator(k2Topology);
        });

        it('should not add node without uuid', function() {
            var node = {};
            assert.throws(function() {
                netsim.addNode(node);
            }, /Invalid node/);
        });

        it('should not add missing nodes', function() {
            var node = {uuid: 'asdfasdf'};
            assert.throws(function() {
                netsim.addNode(node);
            }, Error);
        });

        it('should add node to network', function() {
            var started = false,
            node = {uuid: 'node2'};

            netsim.addNode(node);
        });
    });

    describe('Communication Tests', function() {
        it('should pass a message between two nodes', function() {
            netsim = new NetworkSimulator(k2Topology);
            var receivedMsg = false,
                n1 = {uuid: 'node1',
                      onMessageReceived: function() {
                          receivedMsg = true;
                      }
                     },
                n2 = {uuid: 'node2',
                      start: function() {
                          this.sendMessage('node1', 'Hello World');
                      },
                      onMessageReceived: function() {
                          receivedMsg = true;
                      }
                };

            netsim.addNode(n1);
            netsim.addNode(n2);
            netsim.simulate();

            assert(receivedMsg, 
                'Node did not receive the message from initial node');
        });

        it('should pass a message through a router', function() {
            var receivedMsg = 0,
                n1 = {uuid: 'node1',
                      onMessageReceived: function(msg) {
                          receivedMsg++;
                      }
                     },
                n2 = {uuid: 'node2',
                      onMessage: function(sender, msg) {
                          receivedMsg++;
                          App.prototype.onMessage.call(this, sender, msg);
                      }
                },
                n3 = {uuid: 'node3',
                      start: function() {
                          this.sendMessage('node1', 'Hello World');
                      }
                };

            netsim = new NetworkSimulator(p3Topology);

            netsim.addNode(n1);
            netsim.addNode(n2);
            netsim.addNode(n3);
            netsim.simulate();

            assert(receivedMsg === 2, 
                'Message did not pass to node3 through router ('+receivedMsg+')');
        });
    });

    describe('Network Topology Tests', function() {
        //it('should turn all remaining nodes to routers', function() {
            // TODO

        //});
        // TODO: Latency
        // TODO: Packet loss
    });

    // TODO: Running Simulation
    // TODO: Getting results?

});
