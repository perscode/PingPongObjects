(function(){
'use strict';

    angular
        .module('app.player')
        .controller('PlayerController', PlayerController);

        PlayerController.$inject = ['_', 'playerservice', 'dataservice'];

        function PlayerController(_, playerservice, dataservice){
            var vm = this;
            vm.add = add;
            vm.view = {active: "modify"};
            activate();

            function activate(){
                vm.hideplayers = true;
                vm.addplayer = true;
                vm.player = dataservice.getplayer();
            }

            function add(playername){
                var player = {name: playername};
                return playerservice.addPlayer(player).then(function(res){
                    console.log("back in playercontroller");
                });
            }
        }
})();