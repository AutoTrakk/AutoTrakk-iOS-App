(function(){
    angular
        .module('autotrakk')
        .controller('errorAccountCtrl',errorAccountCtrl);
    errorAccountCtrl.$inject = ['createAccount'];
    function errorAccountCtrl(createAccount){
        var vm = this;
    }
})();