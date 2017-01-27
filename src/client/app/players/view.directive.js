(function(){
'use strict';

    angular
        .module('app.player')
        .controller('ViewPlayerController', ViewPlayerController)
        .directive('viewPlayer', viewPlayer);
        

    ViewPlayerController.$inject = ['$scope','$http', '$location'];
    function ViewPlayerController($scope, $http,$location){
        var vm = this;
        vm.content = $scope.content;
        vm.navback = navback;

        activate();

        function activate(){
            return $http.get('/api/players/'+vm.content.player._id+'/pos').then(function(res){
                vm.pos = res.data.pos;
                var pos = 10-res.data.pos;
                vm.sharedby = res.data.sharedby;
                if(pos<1){
                    pos = 1;
                }
                vm.firstname = vm.content.player.name.split(" ")[0];
                console.log("vm.stars: ", pos); 
                vm.stars = pos;
                console.log("vm.stars: ", vm.stars);  
            }).catch(function(err){
                console.log("err", err);
            });
        }
        function navback(){
            $location.url('/highscore');
        }
    }

    function viewPlayer(){
        var directive = {
            link: link,
            restrict: 'EA',
            templateUrl: '/app/players/view.html',
            controller: 'ViewPlayerController',
            controllerAs: 'vm',
            scope: {
                content: '='
            }
        }

        function link(scope, element, attrs){
            
        }
        
        return directive;
    }

})();