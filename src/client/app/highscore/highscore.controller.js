(function(){
'use strict';

    angular
        .module('app.highscore')
        .controller('HighscoreController', HighscoreController);

        HighscoreController.$inject = ['_', '$http','$location','dataservice','$route'];
        //shellservice

        function HighscoreController(_, $http, $location, dataservice,$route){
            var vm = this;
            vm.view = view;
            vm.modify = modify;
            vm.filtering = {};
            vm.newPlayer = newPlayer;
            activate();

            function activate(){
                return dataservice.isadmin().then(function(res){
                    vm.isadmin = res;                
                    var config = {
                        url: "/api/players",
                        method: "GET"
                    };
                    return $http(config).then(function(res){
                        vm.players = [];
                        _.each(res.data, function(player){
                            player.firstname = player.name.split(" ")[0];
                            player.lastname = player.name.split(" ")[1];
                            vm.players.push(player);
                        });
                        //vm.players = res.data;
                    }).catch(function(err){
                        console.log("err fetching players", err);
                    });
                });
            }

            function modify(player){
                dataservice.setplayer(player); 
                $location.url("/players?modify=true", player); 
            }
            function newPlayer(str){
                vm.isopen = false;
                var cleanstr = str.replace(/[`~!@#$%^&*()_|+\-=?;:.,'"<>\{\}\[\]\\\/]/gi, '');
                var config = {
                    url: "/api/players",
                    data: {name: cleanstr},
                    method: "POST"
                };
                $http(config).then(function(res){
                    $route.reload();
                }).catch(function(err){
                    console.log("err saving nickname: ", err);
                });
            } 
            function view(player, $index){
                var p = player;
                var rating = 10-$index;
                if(rating < 1) { rating = 1;}
                p.rating = rating;
                //dataservice.setplayer(player);
                $location.url("/players/"+p._id, player);
            }
        }
})();