/*globals describe,it*/

'use strict';
var Utils = require('../src/Utils'),
    lossyNet = require('./networks/lossy_net'),
    assert = require('assert');

describe('Utils Tests', function() {
    describe('getNetworkGraph', function() {
        it('should get all node ids', function() {
            var ids = Object.keys(Utils.getNetworkGraph(lossyNet)),
                actualIds = ['node1', 'node2', 'node3'];

            for (var i = actualIds.length; i--;) {
                assert(ids.indexOf(actualIds[i]) !== -1, 
                    'Missing id '+actualIds[i]);
            }
            assert(actualIds.length === ids.length, 
                'Lengths of ids do not match');
        });
    });
});
