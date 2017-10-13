(function () {
    angular.module('autotrakk')
        .controller('createAccountThreeCtrl', createAccountThreeCtrl);
    createAccountThreeCtrl.$inject = ['$state', 'createAccount', '$ionicLoading','handlingErrors'];
    function createAccountThreeCtrl($state, createAccount, $ionicLoading,handlingErrors) {
        var vm = this;
        vm.regLastStepForm = [];
        var userInfo = createAccount.getUserInfo();
        vm.sameEmailError = false;
        var accountInfo = createAccount.getAccountContractInfo();
        /////////////////////////////////
        vm.checkSameEmail = function () {
            if (vm.regLastStepForm.email != vm.regLastStepForm.emailConfirm) {
                vm.sameEmailError = true;
            } else {
                vm.sameEmailError = false;
            }
        }
        vm.submitRegLastStep = function (form) {
            vm.checkSameEmail();
            if ((form.$valid == true && vm.sameEmailError == false)) {
                var opt = {
                    "customerNo": accountInfo.cust_num,
                    "email": vm.regLastStepForm.email
                }
                $ionicLoading.show();
                createAccount.verifyEmail(opt).then(function (response) {
                    $ionicLoading.hide();
                    if (response.error == false && response.data.StatusCode == 100) {
                        $state.go('useUsernameLogin');
                    } else {
                        handlingErrors.errorInRespone(response);
                    }

                })
            }
        }
    }
})();