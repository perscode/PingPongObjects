(function(){
'use strict';

    angular
        .module('app.layout')
        .controller('ShellController', ShellController);

        ShellController.$inject = ['shellservice', '_', '$location','dataservice'];
        //shellservice

        function ShellController(shellservice, _, $location, dataservice){
            var vm = this;
            vm.goto = goto;

            activate();
            
            function activate(){
                vm.isbusy = true;
                vm.tabs = [
                    {name: "Highscore", url: "/highscore", selected: true},
                    {name: "Matches", url: "/matches", selected: false}
                ];
                vm.isbusy = false;
                dataservice.isadmin().then(function(res){
                    if(res){
                        vm.tabs.push({name: "Players", url: "/players", selected: false});
                    }
                });
            }

            function goto(url, index){
                _.each(vm.tabs, function(link){
                    link.selected = false;
                });
                vm.tabs[index].selected = true;
                console.log("vm.tabs: ", vm.tabs);
                $location.path(url);
            }
        }
})();