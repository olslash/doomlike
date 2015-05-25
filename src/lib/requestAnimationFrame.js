/* @flow */
'use strict';

// This polyfill is adapted from the MIT-licensed
// https://github.com/underscorediscovery/realtime-multiplayer-in-html5
exports.requestAnimationFrame = (function() {
    var lastTimestamp = Date.now(),
        now,
        timeout;
    return function(callback: Function): number {
        now = Date.now();
        timeout = Math.max(0, 1000/10 - (now - lastTimestamp));
        lastTimestamp = now + timeout;
        return setTimeout(function() {
            callback(now + timeout);
        }, timeout);
    };
})(),

exports.cancelAnimationFrame = clearTimeout;
