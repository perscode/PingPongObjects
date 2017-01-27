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
            controllerAs: "vm",
            resolve: {
                isadmin: ['$rootScope', 'dataservice', function($rootScope,dataservice){
                    if(!$rootScope.isadmin){
                        dataservice.setadmin(false);
                        return false;
                    }
                    return true;
                }]
            }
        })
        .when("/players/:id", {
            templateUrl : "app/players/index.html",
            controller: "PlayerController",
            controllerAs: "vm",
            resolve: {
                isadmin: ['$rootScope', '$location','dataservice', function($rootScope,$location,dataservice){
                    if($location.search() === {modify: 'true'} && !$rootScope.isadmin){
                        $location.path("/highscore");
                    }else if(!$rootScope.isadmin){
                        dataservice.setadmin(false);
                        return false;
                    }
                }]
            }
        })
        .when("/matches", {
            templateUrl : "app/matches/index.html",
            controller: "MatchController",
            controllerAs: "vm",
            resolve: {
                isadmin: ['$rootScope','dataservice', function($rootScope,dataservice){
                    if(!$rootScope.isadmin){
                        dataservice.setadmin(false);
                        return false;
                    }
                    return true;
                }]
            }
        })
        .when("/admin", {
            template: "",
            controller: ["$rootScope", "$location", "dataservice", function($rootScope, $location, dataservice){
                $rootScope.isadmin = true;
                dataservice.setadmin(true);
                $location.path("/highscore");
                return "";
            }]
        });
        
        //.otherwise({redirectTo:'/highscore'});
    }

}());