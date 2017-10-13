(function () {
    angular.module('autotrakk')
        .controller('myProfileCtrl', myProfileCtrl);
    myProfileCtrl.$inject = ['accountData', 'userLogin', 'handlingErrors', '$ionicLoading', 'dataFormatting','$state'];
    function myProfileCtrl(accountData, userLogin, handlingErrors, $ionicLoading, dataFormatting,$state) {
        var vm = this;
        var account = accountData.getAccountData();
        var phoneHome = dataFormatting.phoneForHuman(account.profile.home);
        var phoneMobile = dataFormatting.phoneForHuman(account.profile.mobile);
        var _userName = account.profile.name || '';
        var _name = '';
        if(_userName != ''){
            _userName = _userName.split(',') ;        
            _name = _userName[1] +' '+_userName[0]
        }
        

        vm.data = {
            "name": _name,            
            "contract": account.accountStatus.contract
        }
        vm.form = {
            "address1": account.profile.address1,
            "address2": account.profile.address2,
            "city": account.profile.city,
            "state": account.profile.state,
            "zip": account.profile.zip,
            "home": phoneHome,
            "mobile": phoneMobile,
            "email": account.profile.email
        }
        vm.submitForm = function (myProfileForm) {
            if (myProfileForm.$valid == true) {
                $ionicLoading.show();
                
                accountData.saveMyProfile(vm.form).then(function (response) {
                    $ionicLoading.hide();
                    if (response.error != false && response.data.StatusCode != 100) {
                        handlingErrors.errorInRespone(response);                    
                    }
                    else {
                        $state.go('mainMenu');
                    }
                    //account.profile = response.data.Results;
                    // saving new data to account in localStorage
                    // accountData.setAccountData(account);
                    // var phoneHome = dataFormatting.phoneForHuman(account.profile.home);
                    // var phoneMobile = dataFormatting.phoneForHuman(account.profile.mobile);
                    // vm.form = {
                    //     "address1": account.profile.address1,
                    //     "address2": account.profile.address2,
                    //     "city": account.profile.city,
                    //     "state": account.profile.state,
                    //     "zip": account.profile.zip,
                    //     "home": phoneHome,
                    //     "mobile": phoneMobile,
                    //     "email": account.profile.email,
                    // }
                });
            }
        }
        vm.editPIN = function () {
            userLogin.editNewPIN();
        }
    }
})();