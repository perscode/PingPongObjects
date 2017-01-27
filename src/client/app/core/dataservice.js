(function(){
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

        dataservice.$inejct = ['$q', '$http', '$routeParams'];
        function dataservice($q, $http,$location, $routeParams) {
            var storedplayer = "";
            var deferred = $q.defer();
            var isadmin;
            var service = {
                setplayer: setplayer,
                getplayer: getplayer,
                setadmin: setadmin,
                isadmin: isadmin
            };

            function getplayer(){
                if(storedplayer){
                    var player = storedplayer;
                    return $q.when(player);
                }else{
                    if(!$routeParams.id){
                        $location.url('/highscore');
                    }else{
                        var config = {
                            url: '/api/players/'+$routeParams.id,
                            method: "GET"
                        };
                        return $http(config).then(function(res){
                            console.log("/api/getplayer", res);
                            return res.data;
                        });
                    }
                }
                return storedplayer;
            }

            function setadmin(bool){
                isadmin = bool;
                deferred.resolve(isadmin);
            }

            function isadmin(){
                //return $q.when(true);
                return deferred.promise;
            }

            function setplayer(player){
                storedplayer = player;
            }

            return service;
        }
})();