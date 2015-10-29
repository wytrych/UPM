"use strict";

window.modules = {};
window.define = function (func, namespace) {
    try {
        if (window.modules[namespace]) {
            throw new Error();
        }

        window.modules[namespace] = func();
    } catch (e) {
        console.log("Namespace " + namespace + " already in use.");
    }
};