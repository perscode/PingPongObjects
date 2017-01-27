(function(){
'use strict';

    angular
        .module('app.player')
        .directive('modifyPlayer', modifyPlayer);

    function modifyPlayer(){
        var directive = {
            link: link,
            restrict: 'EA',
            templateUrl: '/app/players/modify.html',
            scope: {
                content: '='
            }
        }

        function link(scope, element, attrs){
            console.log("attrs.content: ", scope.content);
        }
        
        return directive;
    }

})();