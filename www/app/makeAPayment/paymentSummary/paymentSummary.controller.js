(function () {
    angular.module('autotrakk')
        .controller('paymentSummaryCtrl', paymentSummaryCtrl);
    paymentSummaryCtrl.$inject = ['$state', 'makeAPayment', 'accountData'];
    function paymentSummaryCtrl($state, makeAPayment, accountData) {
        var vm = this;
        var _releasedCodesList = [];
        var paymentQueryData = makeAPayment.getPaymentQuery();
        vm.hasDeviceCode = makeAPayment.hasDeviceCode();        
        vm.totalAmount = makeAPayment.getTotalAmount();        
        vm.overPaymentInfo = paymentQueryData.overPaymentInfo;
        vm.paymentSummaryList = paymentQueryData.releasedCodesList;        
    }
})();