(function(){
'use strict';

    angular
        .module('app.player')
        .controller('PlayerMatchesController', PlayerMatchesController)
        .directive('matchesPlayer', matchesPlayer);

    PlayerMatchesController.$inject = ['$scope', '$http', '$location'];
    function PlayerMatchesController($scope, $http, $location){
        var vm = this;
        activate();

        function activate(){
            vm.matches = $scope.content.player.matches;
            vm.playerid = $scope.content.player._id;
            console.log("vm.matches: ", vm.matches);
        }

       
    }
    function matchesPlayer(){
        var directive = {
            link: link,
            restrict: 'EA',
            controller: PlayerMatchesController,
            controllerAs: "vm",
            templateUrl: '/app/players/matches.html',
            scope: {
                content: '='
            }
        }

        function link(scope, element, attrs){
        }
        
        return directive;
    }

})();