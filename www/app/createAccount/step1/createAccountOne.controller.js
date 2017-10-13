(function () {
    angular.module('autotrakk')
        .controller('createAccountOneCtrl', createAccountOneCtrl);
    createAccountOneCtrl.$inject = ['$state', 'createAccount', '$ionicLoading']
    function createAccountOneCtrl($state, createAccount, $ionicLoading ) {
        var vm = this;
        vm.regStepOneFrom = [];
        /////////////////////////////////////
        vm.submit = function (form) {
            if (form.$valid == true) {
                $ionicLoading.show();
                createAccount.check(vm.regStepOneFrom).then(function (response) {
                    $ionicLoading.hide();
                    if (response.error == false && response.data.StatusCode == 100) {
                        createAccount.setAccountContractInfo(response.data.Results);
                        $state.go('regStepTwo');
                    } else {                        
                        $state.go('errorAccount');                        
                    }
                });
            }
        }
    }
})();