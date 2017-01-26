(function(){
'use strict';

    angular
        .module('app.match')
        .controller('MatchController', MatchController);

        MatchController.$inject = ['shellservice', '_', '$location','$http', '$rootScope'];
        //shellservice

        function MatchController(shellservice, _, $location, $http,$rootScope){
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
                if((vm.newmatch[p._id] && vm.newmatch[p._id] !== "") || vm.contenders.length === 2){
                    return;
                }
                vm.newmatch[p._id] = p.name;
                vm.contenders.push({name: p.name, id: p._id, elo:p.elo});
                if(vm.contenders.length === 2){
                    vm.twoselected = true;
                    getEloOutcome({players: [vm.contenders[0].id, vm.contenders[1].id]});
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
                console.log("data: ", data);
                var config = {
                    url: "/api/matches",
                    method: "POST",
                    data: data
                };
                return $http(config).then(function(res){
                    updateView(res);
                    vm.contenders = [];
                    vm.newmatch = {};
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