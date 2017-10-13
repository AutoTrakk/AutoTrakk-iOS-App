(function(){
    angular.module('autotrakk')
        .controller('paymentAmountCtrl', paymentAmountCtrl);
    paymentAmountCtrl.$inject = ['makeAPayment','$state'];
    function paymentAmountCtrl(makeAPayment,$state) {
        var vm = this;
        vm.amount = makeAPayment.getTotalAmount();
        vm.payMethod = function(type){
                if(type=='creditCard'){
                    $state.go('payWithdebit');
                }else {
                    $state.go('addCard');
                }
        }
    }
})();