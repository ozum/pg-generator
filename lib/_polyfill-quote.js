/**
 * @private
 */
/*jslint node: true, nomen: true, regexp: true */
"use strict";

if (!String.prototype.quote) {
    // oop version - no dependencies
    String.prototype.quote = (function () {
        // prepare fallback
        // ----------------
        // backslash escape double quotes and backslashes
        var escp_regex = /[\\"]/g,
            escp_callback = '\\$&',
        // escape control characters
            ctrl_map = {
                '\b': '\\b', // backspace
                '\t': '\\t', // tab
                '\n': '\\n', // new line
                '\f': '\\f', // form feed
                '\r': '\\r'  // carriage return
            },
        // don't rely on `Object.keys(ctrl_map).join('')`
            ctrl_regex = new RegExp('[\b\t\n\f\r]', 'g'),
            ctrl_callback = function (match) {
                return ctrl_map[match];
            },
        // hex-escape, spare out control characters and ASCII printables
        // [0-7,11,14-31,127-255]
            xhex_regex = /[\x00-\x07\x0B\x0E-\x1F\x7F-\xFF]/g,
            xhex_callback = function (match, char_code) {
                char_code = match.charCodeAt(0);
                return '\\x' + (char_code < 16 ? '0' : '') + char_code;
            },
        // hex-escape all others
            uhex_regex = /[\u0100-\uFFFF]/g,
            uhex_callback = function (match, char_code) {
                char_code = match.charCodeAt(0);
                return '\\u' + (char_code < 4096 ? '0' : '') + char_code;
            },
        // delegate to native `JSON.stringify` if available
            stringify = typeof JSON !== 'undefined' && JSON.stringify;

        // return actual polyfill
        // ----------------------
        return function () {
            var self = this; // promote compression
            if (self === null) { throw new TypeError('can\'t convert ' + self + ' to object'); }
            if (stringify) { return stringify(self); }
            return '"' + self
                    .replace(escp_regex, escp_callback)
                    .replace(ctrl_regex, ctrl_callback)
                    .replace(xhex_regex, xhex_callback)
                    .replace(uhex_regex, uhex_callback) + '"';
        };
    }());

    // generic version - requires Function#bind
    String.quote = Function.call.bind(''.quote);
}