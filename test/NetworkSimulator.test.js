/*globals beforeEach,describe,it*/
/*
 * Tests for the Network Simulator
 */
'use strict';
var NetworkSimulator = require('../src/NetworkSimulator'),
    Utils = require('../src/Utils'),
    App = require('../src/App'),
    assert = require('assert'),
    // Network topologies
    k2Topology = require('./networks/basic_top'),  // clique of size 2
    p3Topology = require('./networks/p3_top'),  // path of length 3
    lossyNetwork = require('./networks/lossy_net'),
    slowNetwork = require('./networks/slow_net'),
    unreliableNetwork = require('./networks/unreliable_net');

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
        it('should send multiple messages between two nodes', function() {
            netsim = new NetworkSimulator(k2Topology);
            var receivedCount = 0,
                total = 2,
                n1 = {uuid: 'node1',
                      onMessageReceived: function(sender) {
                          receivedCount++;
                      }
                     },
                n2 = {uuid: 'node2',
                      onStart: function() {
                          for (var i = total; i--;) {
                              this.sendMessage('node1', 'Hello World');
                          }
                      }
                };

            netsim.addNode(n1);
            netsim.addNode(n2);
            netsim.simulate();

            assert(receivedCount === total, 
                'Node did not receive both messages from initial node');
        });

        it('should pass a message between two nodes', function() {
            netsim = new NetworkSimulator(k2Topology);
            var receivedMsg = false,
                n1 = {uuid: 'node1',
                      onMessageReceived: function(sender) {
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

        it('should pass a message between two nodes regardless of order', function() {
            netsim = new NetworkSimulator(k2Topology);
            var receivedMsg = false,
                n1 = {uuid: 'node1',
                      onMessageReceived: function(sender) {
                          receivedMsg = true;
                      }
                     },
                n2 = {uuid: 'node2',
                      onStart: function() {
                          this.sendMessage('node1', 'Hello World');
                      },
                      onMessageReceived: function() {
                          receivedMsg = true;
                      }
                };

            netsim.addNode(n2);
            netsim.addNode(n1);
            netsim.simulate();

            assert(receivedMsg, 
                'Node did not receive the message from initial node');
        });

        it('should send correct id to recipient', function() {
            var receivedMsg = 0,
                n1 = {uuid: 'node1',
                      onMessageReceived: function(id, msg) {
                          assert(id === 'node3', 
                              'Node recieved id of intermediate node');
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

        it('should convert unlabeled apps to routers', function() {
            var receivedMsg = false,
                n1 = {uuid: 'node1',
                      onMessageReceived: function(msg) {
                          receivedMsg = true;
                      }
                     },
                n3 = {uuid: 'node3',
                      onStart: function() {
                          this.sendMessage('node1', 'Hello World');
                      }
                };

            netsim = new NetworkSimulator(p3Topology);

            netsim.addNode(n1);
            netsim.addNode(n3);
            netsim.simulate();

            assert(receivedMsg === true, 
                'Node did not receive message!');
        });

        it('should find routes', function() {
            netsim = new NetworkSimulator(lossyNetwork);
            // Check that it has all routes
            var nodeIds = Object.keys(Utils.getNetworkGraph(lossyNetwork)),
                route;

            for (var i = nodeIds.length; i--;) {
                for (var j = i-1; j >= 0; j--) {
                    route = netsim.getRoute(nodeIds[i], nodeIds[j]);
                    assert(route.length > 0, 
                        'No route for '+nodeIds[i]+' to '+nodeIds[j]);

                    route = netsim.getRoute(nodeIds[j], nodeIds[i]);
                    assert(route.length > 0, 
                        'No route for '+nodeIds[j]+' to '+nodeIds[i]);
                }
            }
        });

    });

    describe('Network Topology Tests', function() {
        it('should record edges in _edges', function() {
            var edges = lossyNetwork,
                src,
                dst;

            netsim = new NetworkSimulator(lossyNetwork);
            for (var i = edges.length; i--;) {
                src = edges[i].src;
                dst = edges[i].dst;
                assert(netsim._edges[src][dst] === edges[i]);
                assert(netsim._edges[dst][src] === edges[i]);
            }

            
        });

        it('unreliable latency networks should have varied delivery times', function() {
            var endTime,
                n1 = {uuid: 'node1',
                      onMessageReceived: function(msg) {
                          endTime = this.time();
                      }
                     },
                n3 = {uuid: 'node3',
                      onStart: function() {
                          this.sendMessage('node1', 'Hello World');
                      }
                };

            netsim = new NetworkSimulator(unreliableNetwork);

            // Check the BasicRouter's routes
            netsim.addNode(n1);
            netsim.addNode(n3);
            netsim.simulate();

            var diff = Math.abs(200-endTime);
            assert(diff > 10, 
                'Message was not varied ('+diff+')');

        });

        it('high latency network should delay packets', function() {
            var endTime,
                n1 = {uuid: 'node1',
                      onMessageReceived: function(msg) {
                          endTime = this.time();
                      }
                     },
                n3 = {uuid: 'node3',
                      onStart: function() {
                          this.sendMessage('node1', 'Hello World');
                      }
                };

            netsim = new NetworkSimulator(slowNetwork);

            // Check the BasicRouter's routes
            netsim.addNode(n1);
            netsim.addNode(n3);
            netsim.simulate();

            assert(endTime > 100, 
                'Message was not delayed ('+endTime+')');

        });

        it('lossy network should drop packets', function() {
            var receivedCount = 0,
                total = 100,
                n1 = {uuid: 'node1',
                      onMessageReceived: function(msg) {
                          receivedCount++;
                      }
                     },
                n3 = {uuid: 'node3',
                      onStart: function() {
                          for (var i = total; i--;) {
                              this.sendMessage('node1', 'Hello World');
                          }
                      }
                };

            netsim = new NetworkSimulator(lossyNetwork);

            // Check the BasicRouter's routes
            netsim.addNode(n1);
            netsim.addNode(n3);
            netsim.simulate();

            assert(receivedCount < total, 
                'No packets were dropped');
        });

    });

    // TODO: Getting results?

});
