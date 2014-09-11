(function () {
  'use strict';
  window.HighchartsServicePlugin = function () {
    var noop = function () {
    };
    var functionNames = [
        'preInit',
        'isAlive'
      ];
    return function HighchartsServicePlugin() {
      for (var i = 0; i < functionNames.length; i++) {
        this[functionNames[i]] = noop;
      }
    };
  }();
  // implent your own service plugin while inheriting from HighchartsServicePlugin
  window.MyHighchartsServicePlugin = function MyHighchartsServicePlugin() {
    window.HighchartsServicePlugin.call(this);
    // create a method, which is being called in Highcharts-Service context
    this.isAlive = function isAlive() {
      console.log(arguments);
      return true;
    };
  };
  /**
  * handles (un)registering of plugins and offers a callMethod method to call all registered plugins.
  * @return {[type]} [description]
  */
  var PluginService = function PluginService() {
    var plugins = [new window.HighchartsServicePlugin()];
    var callMethod = function callPlugins(methodName, thisContext, args) {
      for (var i = 0; i < plugins.length; i++) {
        if (!plugins[i]) {
          return false;
        }
        try {
          plugins[i][methodName].apply(thisContext, args);
        } catch (e) {
          // if method not implemented or some error happened, do not abort processing.
          console.error(e);
        }
      }
    };
    var registerPlugin = function registerPlugin(plugin) {
      if (plugins.length === 1 && plugins[0] instanceof window.HighchartsServicePlugin) {
        plugins[0] = plugin;
      } else {
        plugins.push(plugin);
      }
    };
    var unregisterPlugin = function unregisterPlugin(plugin) {
      if (!plugins.length) {
        return false;
      }
      var index = plugins.indexOf(plugin);
      if (index < 0) {
        return false;
      }
      plugins.splice(index, 1);
      return true;
    };
    return {
      registerPlugin: registerPlugin,
      callMethod: callMethod,
      unregisterPlugin: unregisterPlugin
    };
  };
  (function (angular) {
    var ChartConfig = [
        '$resource',
        function ChartConfig($resource) {
        }
      ];
    var Diagram = [
        '$resource',
        function Diagram($resource) {
        }
      ];
    var HighchartService = [
        'ChartConfig',
        'Diagram',
        function HighchartService(ChartConfig, Diagram) {
          var c = ChartConfig;
          var d = Diagram;
          var pluginService = new PluginService();
          return {
            registerPlugin: pluginService.registerPlugin,
            callMethod: pluginService.callMethod,
            unregisterPlugin: pluginService.unregisterPlugin
          };
        }
      ];
    // wire module and its components up with angular
    angular.module('ng-highchartsservice', [
      'ngResource',
      'highcharts-ng'
    ]).service('highchartsService', HighchartService).factory('ChartConfig', ChartConfig).factory('Diagram', Diagram);
  }(angular));
}());