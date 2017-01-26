(function(){
'use strict';

    angular
        .module('app.match')
        .controller('MatchController', MatchController);

        MatchController.$inject = ['shellservice', '_', '$location','$http', '$rootScope', '$timeout'];
        //shellservice

        function MatchController(shellservice, _, $location, $http,$rootScope,$timeout){
            var vm = this;
            vm.view = { active: "create"};
            vm.selectPlayer = selectPlayer;
            vm.removePlayer = removePlayer;
            vm.newmatch = {};
            vm.regWinner = regWinner;
            vm.contenders = [];
            vm.getPlayers = getPlayers;
            vm.twoselected = false;
            activate();

            function activate(){
                getPlayers();
                getMatches();
            }

            function getPlayers(){
                var config = {
                    url: "/api/players",
                    method: "GET"
                };
                return $http(config).then(function(res){
                    vm.error = false;
                    console.log("getting them players: ", res.data);
                    vm.players = res.data;
                    _.each(vm.players, function(p){
                        p.selected = false;
                    });
                }).catch(function(err){
                    console.log("err fetching players", err);
                });
            }

            function getMatches(){
                $http.get('/api/matches').then(function(res){
                    console.log("get matches: ", res.data);
                    vm.matches = [];
                    _.forEach(res.data, function(val, key){
                        var index = _.findIndex(val.players, {id: val.winner});
                        var winner = val.players[index];
                        var tmp = {player1: val.players[0], player2: val.players[1], date: val.date, winner: winner};
                        vm.matches.push(tmp);
                    });

                }).catch(function(err){
                    console.log("err fetching players", err);
                });
            }

            function selectPlayer(p){
                p.selected = !p.selected;
                
                if(p.selected){
                    var newopp = {name: p.name, id: p._id, elo:p.elo};
                    vm.newmatch[p._id] = p.name;
                    if(vm.contenders.length === 2){
                        var lastadded = vm.contenders[1];
                        var playerindex = _.findIndex(vm.players, {_id: lastadded.id});
                        vm.players[playerindex].selected = false;
                        vm.newmatch[lastadded.id] = {};
                        vm.contenders[1] = newopp;
                    }else{
                        vm.contenders.push(newopp);
                    }
                    if(vm.contenders.length === 2){
                        vm.twoselected = true;
                        getEloOutcome({players: [vm.contenders[0].id, vm.contenders[1].id]});
                    }
                }else {
                    vm.newmatch[p.id] = {};
                    vm.twoselected = false;
                    var index = _.findIndex(vm.contenders, {id: p._id});
                    vm.contenders.splice(index, 1);
                    
                }
            }

            function setPlayers(newdata){
                for(var key in newdata){
                    var index = _.findIndex(vm.contenders, {id: key});
                    var playerindex = _.findIndex(vm.players, {_id: key});
                    vm.contenders[index].loose = newdata[key].if_loose;
                    vm.contenders[index].win = newdata[key].if_win;
                    vm.contenders[index].odds = newdata[key].odds;
                    vm.newmatch[key] = vm.contenders[index];
                }
            }

            function updateView(res){
                for(var key in res.data){
                    var index = _.findIndex(vm.players, {_id: key});
                    vm.players[index].elo = res.data[key].elo;
                }
            }

            function regWinner(p){
                var looser = {};
                vm.winner = p;
                var index = "";
                if(vm.contenders[0].id === p.id){
                     index = 1
                }else{
                    index = 0;
                }
                looser = vm.contenders[index];

                var data = {
                    lost: looser,
                    won: p
                }
                _.each(vm.players, function(player){
                    player.selected = false;
                });
                console.log("data: ", data);
                var config = {
                    url: "/api/matches",
                    method: "POST",
                    data: data
                };
                return $http(config).then(function(res){
                    updateView(res);
                    $timeout(function(){
                        vm.contenders = [];
                        vm.newmatch = {};
                        vm.winner = {};
                    }, 1000);

                }).catch(function(err){
                    console.log("err", err);
                });
            }

            function getEloOutcome(query){
                var config = {
                    url: "/api/elo",
                    params: query,
                    method: "GET"
                };
                return $http(config).then(function(res){
                    setPlayers(res.data);
                    console.log(vm.contenders);
                }).catch(function(err){
                    vm.players = {};
                    vm.error = true;
                    console.log("err", err);
                });
            }

            function removePlayer(p){
                vm.newmatch[p._id] = "";
                if(vm.contenders[0].id === p._id){
                    vm.contenders.splice(0,1);
                }else{
                    vm.contenders.splice(1,1);
                }
            }

        }
})();