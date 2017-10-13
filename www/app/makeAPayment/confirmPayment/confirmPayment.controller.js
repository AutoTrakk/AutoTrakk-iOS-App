(function(){
    angular.module('autotrakk')
        .controller('confirmPaymentCtrl', confirmPaymentCtrl);
    confirmPaymentCtrl.$inject = ['makeAPayment','$ionicLoading','handlingErrors','$state'];
    function confirmPaymentCtrl(makeAPayment,$ionicLoading,handlingErrors,$state) {
        var vm = this;
        _cardInfo = makeAPayment.getCard();
        _totalPayAmount = makeAPayment.getTotalAmount();
        vm.cardInfo = _cardInfo;
        vm.totalPayAmount = _totalPayAmount;
        vm.submitPayment = function(){
            $ionicLoading.show();
            makeAPayment.submitPayment().then(function(response){
                $ionicLoading.hide();
                if (response.error == false && response.data.StatusCode == 100) {
                    
                         $state.go('paymentApproved');
                }else{
                    
                    if(response.type == 'unknown'){
                        makeAPayment.setErrorMsg('Something went wrong. Please try again.')
                        $state.go('paymentDeclined');
                                   
                    }else if(response.type == 'api'){
                        makeAPayment.setErrorMsg(response.data.StatusMessage)
                        $state.go('paymentDeclined');
                    }else {
                        handlingErrors.errorInRespone(response);
                        $state.go('makeAPayment');
                    }
                    
                }
                
            });
        }
    }
})();