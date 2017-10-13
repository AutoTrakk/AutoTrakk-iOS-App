(function () {
    angular.module('autotrakk')
        .controller('verifyAccountCtrl', verifyAccountCtrl);
    verifyAccountCtrl.$inject = ['createAccount', 'userLogin', '$localStorage', '$state', 'handlingErrors', '$ionicLoading','$rootScope'];
    function verifyAccountCtrl(createAccount, userLogin, $localStorage, $state, handlingErrors, $ionicLoading,$rootScope) {
        var vm = this;
        vm.verifyAccountForm = [];
        var contractInfo = createAccount.getAccountContractInfo();
        var customerNo = contractInfo.cust_num;
       
        /////////////////////////////////////
        vm.verifyAccount = function (verifyAccountForm) {
            if (verifyAccountForm.$valid == true) {
                $ionicLoading.show();
                createAccount.checkAccount(vm.verifyAccountForm, customerNo)
                    .then(verifyAccountComplete)
            }

        }
        function verifyAccountComplete(response) {
            $ionicLoading.hide();
            if (response.error == false && response.data.StatusCode == 100) {
                var data = {
                    "email": vm.verifyAccountForm.email,
                    "password": vm.verifyAccountForm.password
                }

                // user now has verified account and he will be log in automatically                
                userLogin.logInUser(data).then(function(response){
               
                    if (response.error == false && response.data.StatusCode == 100) {
                            // this is user first log in
                            // if user don't want to use PIN redirect to alert notice
                            // else redirect to create PIN
                            $rootScope.userLoggedCheck = true;
                            var username = data.email;
                            var neverLogWithPIN = $localStorage.getObject('neverLogWithPIN');
                            var flag = false;
                            for(var prop in neverLogWithPIN.usernames){
                                var storedUsername = neverLogWithPIN.usernames[prop];
                                if (storedUsername == username){
                                   flag = true;
                                  
                                }
                            }      
                            if (flag == true) {                                
                                    $state.go('alertNotice');                                                            
                            } else {
                                $localStorage.setObject('credentials', data);
                                $state.go('createPin');
                            }                                                       
                    } else {              
                           
                        handlingErrors.errorInRespone(response);
                    }
                });
            } else {
  
                handlingErrors.errorInRespone(response);

            }

        }
    }
})();