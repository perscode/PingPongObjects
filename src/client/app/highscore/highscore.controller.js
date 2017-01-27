(function(){
'use strict';

    angular
        .module('app.highscore')
        .controller('HighscoreController', HighscoreController);

        HighscoreController.$inject = ['_', '$http','$location','dataservice'];
        //shellservice

        function HighscoreController(_, $http, $location, dataservice){
            var vm = this;
            vm.view = view;
            vm.modify = modify;
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

            function modify(player){
                dataservice.setplayer(player);
                $location.url("/players?modify=true", player);
            }

            function view(player, $index){
                var p = player;
                var rating = 10-$index;
                if(rating < 1) { rating = 1;}
                p.rating = rating;
                dataservice.setplayer(player);
                $location.url("/players/"+p._id, player);
            }
        }
})();