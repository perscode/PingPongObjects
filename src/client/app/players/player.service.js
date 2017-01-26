(function(){
    'use strict';

    angular
        .module('app.player')
        .factory('playerservice', playerservice);

        playerservice.$inejct = ['$q', '$http'];
        function playerservice($q,$http) {
            var service = {
                getPlayers: getPlayers,
                addPlayer: addPlayer
            };

            function getPlayers(){
                
            }

            function addPlayer(player){
                var config = {
                    url: "/api/players",
                    data: player,
                    method: "POST"
                };
                return $http(config).then(function(res){
                    console.log("new player added: ", res);
                    return res.data;
                }).catch(function(err){
                    console.log("err adding new player: ", err);
                });
            }

            return service;
        }
})();