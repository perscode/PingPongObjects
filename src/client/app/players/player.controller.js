(function(){
'use strict';

    angular
        .module('app.player')
        .controller('PlayerController', PlayerController);

        PlayerController.$inject = ['_', 'playerservice', 'dataservice', '$location','$sce'];

        function PlayerController(_, playerservice, dataservice,$location,$sce){
            var vm = this;
            vm.add = add;
            vm.view = {active: "details"};


            activate();

            function activate(){
                return dataservice.isadmin().then(function(res){
                    vm.isadmin = res;
                    return dataservice.getplayer().then(function(res){
                        console.log("getplayer: ", res);
                        vm.player = res;
                        //vm.player.matches = res.matches;
                        vm.tabs = [
                            {
                                title: "details",
                                icon: 'fa fa-eye',
                                disabled: false,
                                player: vm.player
                                //template: cleanhtml('view')
                            },
                            {
                                title: "matches",
                                icon: 'fa fa-object-group',
                                disabled: false,
                                player: vm.player
                                //template: cleanhtml('view')
                            },
                            {
                                title: "modify",
                                icon: 'fa fa-pencil-square-o',
                                disabled: !vm.isadmin,
                                player: vm.player
                                //template: cleanhtml('modify')
                            }
                            
                        ];
                        vm.hideplayers = true;
                        vm.addplayer = true;
                        vm.ready = true;
                    });
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