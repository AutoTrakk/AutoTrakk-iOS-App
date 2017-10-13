(function() {
    angular.module('autotrakk')
        .controller('createAccountTwoCtrl', createAccountTwoCtrl);
    createAccountTwoCtrl.$inject = ['createAccount'];
    function createAccountTwoCtrl(createAccount) {
        var vm = this;
        vm.accountContractInfo = [];
        /////////////////////////////////////        
        vm.accountContractInfo = createAccount.getAccountContractInfo();
    }
})();