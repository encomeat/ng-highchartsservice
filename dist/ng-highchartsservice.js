(function () {
  'use strict';
  /**
   * Define HighchartsServicePluginFactory. It basically is an nullobject,
   * creating an interface from which a HighchartsServicePlugin should inherit via
   * `HighchartsServicePlugin.call(this);`
   * @return {function} Interface/Nullobject for HighchartServicePlugin
   */
  var HighchartsServicePlugin = function () {
      var noop = function () {
      };
      // TODO: inject functionNames dynamically
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
  /**
   * handles (un)registering of plugins and offers a callMethod method to call all registered plugins.
   * @return {object} Public API
   */
  var HighchartsPluginService = function PluginService() {
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
  var HighchartsChartConfig = [function HighchartsChartConfig() {
      }];
  var HighchartsDiagram = [function HighchartsDiagram() {
      }];
  var HighchartService = [
      'HighchartsChartConfig',
      'HighchartsDiagram',
      function (HighchartsChartConfig, HighchartsDiagram) {
        return function HighchartService() {
          if (HighchartsChartConfig) {
          }
          if (HighchartsDiagram) {
          }
          var pluginService = new HighchartsPluginService();
          return {
            registerPlugin: pluginService.registerPlugin,
            callMethod: pluginService.callMethod,
            unregisterPlugin: pluginService.unregisterPlugin
          };
        };
      }
    ];
  // wire module and its components up with angular
  angular.module('ng-highchartsservice', [
    'ngResource',
    'highcharts-ng'
  ]).factory('HighchartsService', HighchartService).factory('HighchartsChartConfig', HighchartsChartConfig).factory('HighchartsDiagram', HighchartsDiagram).factory('HighchartsServicePlugin', HighchartsServicePlugin);
}());