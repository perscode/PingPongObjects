(function(){
'use strict';

    angular
        .module('app.player')
        .controller('PlayerController', PlayerController);

        PlayerController.$inject = ['_', 'playerservice', 'dataservice', '$location','$sce'];

        function PlayerController(_, playerservice, dataservice,$location,$sce){
            var vm = this;
            vm.add = add;
            vm.view = {active: "modify"};


            activate();

            function activate(){
                return dataservice.getplayer().then(function(res){
                    console.log("getplayer: ", res);
                    vm.player = res;
                    vm.tabs = [
                        {
                            title: "view",
                            icon: 'glyphicon glyphicon-eye-open',
                            disabled: false,
                            player: vm.player
                            //template: cleanhtml('view')
                        },
                        {
                            title: "modify",
                            icon: 'glyphicon glyphicon-pencil',
                            disabled: dataservice.isadmin().then(function(res){
                                return res;
                            }),
                            player: vm.player
                            //template: cleanhtml('modify')
                        }
                        
                    ];
                    vm.hideplayers = true;
                    vm.addplayer = true;
                    vm.ready = true;                 
                });
            }

            function cleanhtml(attr){
                var templates = {
                    view: '<view-player content="tab"></view-player>',
                    modify: '<modify-player content="tab"></modify-player>'
                };
                return $sce.trustAsHtml(templates[attr]);
            }
            function add(playername){
                var player = {name: playername};
                return playerservice.addPlayer(player).then(function(res){
                    console.log("back in playercontroller");
                });
            }
        }
})();