(function(){
    'use strict';

    angular
        .module('app.layout')
        .factory('shellservice', shellservice);

        shellservice.$inejct = ['$q'];
        function shellservice($q) {
            var service = {
                getPlayers: getPlayers
            };

            function getPlayers(){
                
            }

            return service;
        }
})(); 