(function () {
    angular.module('autotrakk')
        .controller('insuranceInfoCtrl', insuranceInfoCtrl);
    insuranceInfoCtrl.$inject = ['accountData', 'handlingErrors', '$ionicLoading', 'dataFormatting','$state'];
    function insuranceInfoCtrl(accountData, handlingErrors, $ionicLoading, dataFormatting,$state) {
        var vm = this;
        var account = accountData.getAccountData();
        var _phone = dataFormatting.phoneForHuman(account.insuranceInfo.agentPhone);    
        var _expirationDate = dataFormatting.dateForHuman(account.insuranceInfo.expirationDate);        
        vm.form = {
            "insuranceCo": account.insuranceInfo.insuranceCo,
            "agentPhone": _phone,
            "policyNo": account.insuranceInfo.policyNo,
            "expirationDate": _expirationDate,
        }
        vm.submitForm = function (insuranceInfoForm) {            
            if (insuranceInfoForm.$valid) {
                $ionicLoading.show();                
                accountData.saveInsurancePlan(vm.form).then(function (response) {
                    $ionicLoading.hide();
                    if (response.error != false && response.data.StatusCode != 100) {
                        if (response.type == 'api') {
                            handlingErrors.showError(response.data.StatusMessage);
                        }
                        // vm.form = {
                        //     "insuranceCo": account.insuranceInfo.insuranceCo,
                        //     "agentPhone": _phone,
                        //     "policyNo": account.insuranceInfo.policyNo,
                        //     "expirationDate": _expirationDate,
                        // }
                        // handlingErrors.showError('Thank you, we will verify the data and update your customer file');
                    }else {
                       // handlingErrors.showError('Thank you, we will verify the data and update your customer file');
                        $state.go('mainMenu');
                    }
                });
            }
        }
    }
})();