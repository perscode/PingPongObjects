(function(){
'use strict';

    angular
        .module('app.highscore')
        .controller('HighscoreController', HighscoreController);

        HighscoreController.$inject = ['_', '$http','$location','dataservice'];
        //shellservice

        function HighscoreController(_, $http, $location, dataservice){
            var vm = this;
            vm.update = update;
            vm.filtering = {};
            activate();

            function activate(){
                var config = {
                    url: "/api/players",
                    method: "GET"
                };
                return $http(config).then(function(res){
                    vm.players = res.data;
                }).catch(function(err){
                    console.log("err fetching players", err);
                });
            }

            function update(player){
                dataservice.setplayer(player);
                $location.url("/players", player);
            }
        }
})();