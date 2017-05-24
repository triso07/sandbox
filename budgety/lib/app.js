(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['ui'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('ui'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.ui);
    global.app = mod.exports;
  }
})(this, function (_ui) {
  'use strict';

  // !!!!!!!!!! +++++++++++++++++++++++ INIT APP +++++++++++++++++++++++ !!!!!!!!!! //
  (0, _ui.init)(); // !!!!!!!!!!!!!!!!!!!! IMPORTS !!!!!!!!!!!!!!!!!!!! //
});