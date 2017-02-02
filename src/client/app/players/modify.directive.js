(function(){
'use strict';

    angular
        .module('app.player')
        .controller('ModifyController', ModifyController)
        .directive('modifyPlayer', modifyPlayer);

    ModifyController.$inject = ['$scope', '$http', '$location'];
    function ModifyController($scope, $http, $location){
        var vm = this;
        vm.addNickname = addNickname;
        vm.addQuote = addQuote;
        activate();

        function activate(){
            vm.player = $scope.content.player;
            console.log("scope.content: ", $scope.content);
        }

        function addQuote(str){
            var cleanstr = str.replace(/[`~!@#$%^&*()_|+\-=?;:'"<>\{\}\[\]\\\/]/gi, '');
            var config = {
                url: "/api/players/"+vm.player._id+"/quote",
                data: {quote: cleanstr},
                method: "POST"
            };
            $http(config).then(function(res){
                console.log("new quote set: ", res);
                $location.url("/players/"+vm.player._id);
            }).catch(function(err){
                console.log("err saving quote: ", err);
            });
        }

        function addNickname(str){
            var cleanstr = str.replace(/[`~!@#$%^&*()_|+\-=?;:'"<>\{\}\[\]\\\/]/gi, '');
            var config = {
                url: "/api/players/"+vm.player._id+"/nickname",
                data: {nickname: cleanstr},
                method: "POST"
            };
            $http(config).then(function(res){
                console.log("new nickname set: ", res);
                $location.url("/players/"+vm.player._id);
            }).catch(function(err){
                console.log("err saving nickname: ", err);
            });
        }
       
    }
    function modifyPlayer(){
        var directive = {
            link: link,
            restrict: 'EA',
            controller: ModifyController,
            controllerAs: "vm",
            templateUrl: '/app/players/modify.html',
            scope: {
                content: '='
            }
        }

        function link(scope, element, attrs){
        }
        
        return directive;
    }

})();