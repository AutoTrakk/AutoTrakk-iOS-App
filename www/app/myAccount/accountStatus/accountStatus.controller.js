(function(){
    angular.module('autotrakk')
        .controller('accountStatusCtrl', accountStatusCtrl);
    accountStatusCtrl.$inject = ['accountData'];
    function accountStatusCtrl(accountData) {
        var vm = this;
        var account = accountData.getAccountData();
        var _contractTerm = account.accountStatus.contractTerm || 'No Data';
        var _weeklyRent = account.paymentInfo.weeklyRent!= '' ? ('$'+ account.paymentInfo.weeklyRent) : 'No Data';
        var _vehicleResidual =account.accountStatus.vehicleResidual!='' ? ('$'+ account.accountStatus.vehicleResidual) : 'No Data';
        var _paymentsMade = account.accountStatus.paymentsMade || 'No Data';
        var _paymentsRemaining = account.accountStatus.paymentsRemaining || 'No Data';
        var _extensions = account.accountStatus.extensions || 'No Data';
        vm.data = {
            contractTerm: _contractTerm,
            weeklyRent:_weeklyRent,
            vehicleResidual:_vehicleResidual,
            paymentsMade:_paymentsMade,
            paymentsRemaining:_paymentsRemaining,
            extensions:_extensions
        }     
    }
})();