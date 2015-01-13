(function() {
  'use strict';
  var debug = false;

  var HighChartsConfigService = function HighChartsConfigService() {
    this.$get = function() {
      return {};
    };

    this.setDebugMode = function(debugMode) {
      debug = !!debugMode;
    };
  };

  /**
   * Define HighchartsServicePluginFactory. It basically is an nullobject,
   * creating an interface from which a HighchartsServicePlugin should inherit via
   * `HighchartsServicePlugin.call(this);`
   * @return {function} Interface/Nullobject for HighchartServicePlugin
   */
  var HighchartsServicePlugin = function() {
    // add stuff which all of your plugins should copy/pseuodo-inherit
    this.PLUGIN_VERSION = '0.0.0';

    return this;
  };

  /**
   * handles (un)registering of plugins and offers a callMethod method to call all registered plugins.
   * @return {object} Public API
   */
  var HighchartsPluginService = function HighchartsPluginService() {
    var plugins = [new HighchartsServicePlugin()];
    var callMethod = function callPlugins(methodName, thisContext, args) {
      for (var i = 0; i < plugins.length; i++) {
        if (!plugins[i]) {
          return false;
        }
        try {
          if (plugins[i][methodName]) {
            plugins[i][methodName].apply(thisContext, args);
          } else {
            if (debug) {
              console.log('HighchartsPluginService: method ' + methodName + ' not available on ', plugins[i]);
            }
          }
        } catch (e) {
          // if method not implemented or some error happened, do not abort processing.
          if (debug) {
            console.error('HighchartsPluginService', e);
          }
        }
      }
    };
    var registerPlugin = function registerPlugin(plugin) {
      if (plugins.length === 1 && plugins[0] instanceof HighchartsServicePlugin) {
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

  var HighchartService = [

    function(HighchartsChartConfig, HighchartsDiagram) {
      return function HighchartService() {
        if (HighchartsChartConfig) {}
        if (HighchartsDiagram) {}
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
  angular.module('ng-highchartsservice', [])
    .provider('HighChartsConfigService', HighChartsConfigService)
    .factory('HighchartsService', HighchartService)
    .factory('HighchartsServicePlugin', function() {
      // since this a factory, we must return a function (or provide a $get-handler, but we take the shortcut).
      // https://code.angularjs.org/1.3.8/docs/api/auto/service/$provide#factory
      return HighchartsServicePlugin;
    });
}());
