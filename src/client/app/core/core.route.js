(function() {
  'use strict';

  angular
    .module('app.core')
    .config(config);
    
    config.$inject = ['$routeProvider','$locationProvider'];
    function config($routeProvider,$locationProvider){
        $locationProvider.html5Mode(true);

        $routeProvider
        .when("/highscore", {
            templateUrl : "app/highscore/index.html",
            controller: "HighscoreController",
            controllerAs: "vm"
        })
        .when("/players", {
            templateUrl : "app/players/index.html",
            controller: "PlayerController",
            controllerAs: "vm",
            resolve: {
                isadmin: ['$rootScope', '$location', function($rootScope,$location){
                    if(!$rootScope.isadmin){
                        $location.path("/highscore");
                    }
                }]
            }
        })
        .when("/matches", {
            templateUrl : "app/matches/index.html",
            controller: "MatchController",
            controllerAs: "vm"
        })
        .when("/admin", {
            template: "",
            controller: ["$rootScope", "$location", "dataservice", function($rootScope, $location, dataservice){
                $rootScope.isadmin = true;
                dataservice.setadmin(true);
                $location.path("/highscore");
            }]
        });
        
        //.otherwise({redirectTo:'/highscore'});
    }

}());