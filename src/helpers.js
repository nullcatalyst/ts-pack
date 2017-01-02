/*
// Missing helpers (these can be used to search tsc.js if needed):
typescript:param        (__param)
typescript:metadata     (__metadata)
typescript:decorate     (__decorate)
typescript:awaiter      (__awaiter)
typescript:async-super
typescript:advanced-async-super
typescript:generator    (__generator)
typescript:export-star  (__export) -> NOTE: This helper is not needed, the functionality is replaced by the packer
*/


// typescript:rest
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};

    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) {
            t[p] = s[p];
        }
    }

    if (s != null && typeof Object.getOwnPropertySymbols === 'function') {
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0) {
                t[p[i]] = s[p[i]];
            }
        }
    }

    return t;
};

// typescript:assign
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) {
                t[p] = s[p];
            }
        }
    }

    return t;
};

// typescript:extends
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) {
            d[p] = b[p];
        }
    }

    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
