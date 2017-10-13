(function(){
    angular.module('autotrakk')
        .controller('mainMenuCtrl', mainMenuCtrl);
    function mainMenuCtrl() {
        var vm = this;               
        vm.year = new Date().getFullYear();
    }
})();