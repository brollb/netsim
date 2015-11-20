[![Version](https://badge.fury.io/js/netsim.svg)](https://www.npmjs.com/package/netsim)
[![Build Status](https://travis-ci.org/brollb/netsim.svg?branch=master)](https://travis-ci.org/brollb/netsim)

# NetSim.JS

NetSim is a network simulator for Javascript.

## Installation
Add the project to your current npm project with 
```
npm install netsim --save
```

## Creating a Simulation
In order to create a network simulation, you must first create a network topology to simulate. Then you define app logic at given nodes in the network. Finally you run the simulation!

### Defining a network
A network is simply a list of edges in the network where an edge is a Javascript object with `src` and `dst` string attributes. All nodes in the network are inferred by netsim from the edges.

Optionally, you can define `packetLoss`, `latencyMean` and `latencySigma` for each edge. `packetLoss` denotes the likelihood of a packet being dropped while `latencyMean` and `latencySigma` define the normal distribution defining the latency of the given edge.

Example network definition:
```
[
{src: 'node1', dst: 'node2'},
{src: 'node2', dst: 'node3', packetLoss: 0.5},
{src: 'node3', dst: 'node4', latencyMean: 100, latencySigma: 7}
{src: 'node1', dst: 'node4', packetLoss: 0.4, latencyMean: 100, latencySigma: 0}
]
```
### Adding apps
All apps must have a `uuid`. The `uuid` corresponds to the given node in the network topology where this app logic is to be run.

Along with a `uuid`, apps can optionally define `onStart` and `onMessageReceived` methods. `onStart` is a function to be called at the start of the simulation while `onMessageReceived` is the event handler for receiving messages.

Example app:
```
node1 = netsim.addNode({uuid: 'node1',
                        onStart: function() {
                            this.sendMessage('node4', 'Marco!');
                        },
                        onMessageReceived: function(id, msg) {
                            console.log(this.uuid+' received msg: '+msg);
                        } });
```

### Running the Simulation
After defining the network, the simulation can be run with
```
netsim.simulate();
```

## Examples
```
var NetSim = require('netsim');
var netsim = new NetSim(topology);

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

```
More examples can be found in `examples/` on the github page!
