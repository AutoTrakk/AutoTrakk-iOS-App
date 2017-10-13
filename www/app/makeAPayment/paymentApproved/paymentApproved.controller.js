(function(){
    angular.module('autotrakk')
        .controller('paymentApprovedCtrl', paymentApprovedCtrl);
    paymentApprovedCtrl.$inject = ['$state','makeAPayment','dataFormatting','$ionicPopup'];
    function paymentApprovedCtrl($state,makeAPayment,dataFormatting,$ionicPopup) {
        var vm = this;      
        var submitPaymentData = makeAPayment.getPaymentSubmitData();
        var validPaymentData = makeAPayment.getValidPaymentData();
        vm.hasDeviceCode = makeAPayment.hasDeviceCode();      
          

        var _nextPaymentDate = dataFormatting.dateForHuman(submitPaymentData.nextDueDate);

        if(validPaymentData == false){
            $ionicPopup.alert({
                title: 'AutoTrakk Message',
                template: "Your Payment Has Been Received, But We're Still Awaiting Confirmation. Please, Check Back Later"
            });
        }

        vm.list = [];
        _codeList = submitPaymentData.releasedCodesList;        
        for(var prop in _codeList){
            _codeList[prop].dueDate = dataFormatting.dateForHuman(_codeList[prop].dueDate);
        }
        
        vm.list = _codeList;      
        vm.nextPayment = _nextPaymentDate;
    }

})();