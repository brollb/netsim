/*
 * Static utility functions for the network simulator.
 */
'use strict';

/**
 * Guarantee that an item has the given fields. If the field is missing, fill 
 * it with a "no operation" function.
 *
 * @param {Object} item
 * @param {String} fn1
 * @param {String} fn2
 * @return {undefined}
 */
var guaranteeFns = function(item, fn1, fn2) {
    var fn;

    for (var i = arguments.length-1; i > 0; i--) {
        fn = arguments[i];
        item[fn] = item[fn]|| nop;
    }

    return item;
};

//no operation
var nop = function() {
};

/**
 * Perform a shallow copy of "src" to "dst".
 *
 * @param {Object} dst
 * @param {Object} src
 * @return {Object} dst
 */
var copyObject = function(dst, src) {
    var keys = Object.keys(src);
    for (var i = keys.length; i--;) {
        dst[keys[i]] = src[keys[i]];
    }
    return dst;
};

module.exports = {
    guaranteeFns: guaranteeFns,
    copyObject: copyObject
};
