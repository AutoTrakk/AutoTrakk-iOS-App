(function(){
    angular.module('autotrakk')
        .controller('paymentDeclinedCtrl', paymentDeclinedCtrl);
    paymentDeclinedCtrl.$inject = ['makeAPayment','$state'];
    function paymentDeclinedCtrl(makeAPayment,$state) {
        var vm = this;        
        vm.errorMsg = makeAPayment.getErrorMsg();
    }
})();