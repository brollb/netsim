/*globals beforeEach,describe,it*/
/*
 * Tests for the Network Simulator
 */
'use strict';
var NetworkSimulator = require('../src/NetworkSimulator'),
    basicTopology = require('./basic_top'),
    assert = require('assert');

describe('Network Simulator Tests', function() {
    var netsim;

    describe('Node Creation Tests', function() {
        beforeEach(function() {
            netsim = new NetworkSimulator(basicTopology);
        });

        it('should not add node without id', function() {
            var node = {};
            assert.throws(function() {
                netsim.addNode(node);
            }, /Invalid node/);
        });

        it('should not add missing nodes', function() {
            var node = {id: 'asdfasdf'};
            assert.throws(function() {
                netsim.addNode(node);
            }, Error);
        });

        it('should add node to network', function() {
            var started = false,
            node = {id: 'node2'};

            netsim.addNode(node);
        });
    //});

    //describe('Communication Tests', function() {
        it('should pass a message between two nodes', function() {
            var receivedMsg = false,
                n1 = {id: 'node1',
                      onMessageReceived: function() {
                          console.log('Received message!');
                          receivedMsg = true;
                      }
                     },
                n2 = {id: 'node1',
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

        it.skip('should pass a message through a router', function() {
            // TODO
            assert(false, 'Need to write test');
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
