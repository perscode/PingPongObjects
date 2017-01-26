(function() {
  'use strict';

  angular
    .module('blocks.lodash', [])
    .run(['$rootScope', function($rootScope){
        $rootScope._ = window._;
    }]);
  
})();
