(function () {
    angular.module('autotrakk')
        .controller('setNewUserPassOnPINCtrl', setNewUserPassOnPINCtrl);
    setNewUserPassOnPINCtrl.$inject = ['createAccount', '$localStorage', '$state', 'handlingErrors', '$ionicLoading'];
    function setNewUserPassOnPINCtrl(createAccount, $localStorage, $state, handlingErrors, $ionicLoading) {
        var vm = this;
        vm.formData = [];
        /////////////////////////////////////
        vm.submitForm = function (form) {
            if (form.$valid == true) {
                $ionicLoading.show();
                createAccount.checkAccount(vm.formData)
                    .then(function (response) {
                         $ionicLoading.hide();
                        if (response.error == false && response.data.StatusCode == 100) {
                            var localCredentials = $localStorage.getObject('credentials');
                            $localStorage.setObject('credentials', {
                                "email": vm.formData.email,
                                "password": vm.formData.password,
                                "pin": localCredentials.pin
                            });
                            $state.go('enterPin');
                        } else {
                            handlingErrors.errorInRespone(response);
                        }
                    });
            }
        }
    }
})();