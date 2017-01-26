(function(){
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

        dataservice.$inejct = ['$q'];
        function dataservice($q) {
            var storedplayer = {};
            var deferred = $q.defer();
            var isadmin;
            var service = {
                setplayer: setplayer,
                getplayer: getplayer,
                setadmin: setadmin,
                isadmin: isadmin
            };

            function getplayer(){
                return storedplayer;
            }

            function setadmin(bool){
                isadmin = true;
                deferred.resolve(isadmin);
            }

            function isadmin(){
                return deferred.promise;
            }

            function setplayer(player){
                storedplayer = player;
            }

            return service;
        }
})();