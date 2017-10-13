(function () {
    angular.module('autotrakk')
        .controller('pinLoginCtrl', pinLoginCtrl);
    pinLoginCtrl.$inject = ['$localStorage', 'userLogin', '$state', '$rootScope', 'handlingErrors', '$ionicLoading','$ionicHistory'];
    function pinLoginCtrl($localStorage, userLogin, $state, $rootScope, handlingErrors, $ionicLoading,$ionicHistory) {
        var vm = this;
        vm.form = [];
        vm.submitForm = function (pinLoginForm) {
            if (pinLoginForm.$valid == true) {
                var localCredentials = $localStorage.getObject('credentials');
                if (vm.form.pin == localCredentials.pin) {
                    data = {
                        'email': localCredentials.email,
                        'password': localCredentials.password
                    }                                        
                    $ionicLoading.show();                   
                    userLogin.logInUser(data)
                    .then(function (response) {
                         $ionicLoading.hide();
                         if (response.error == false && response.data.StatusCode == 100) {
                            $rootScope.userLoggedCheck = true;
                            
                                $state.go('alertNotice');
                                                                                  
                        } else {                            
                         
                            if (response.type == 'api' && (response.data.StatusCode == 301 || response.data.StatusCode == 317)) {
                                // When stored credentials are not valid user need to set new one                            
                                $state.go('setNewUserPassOnPIN');                                    
                            }else{
                                handlingErrors.errorInRespone(response);
                            }
                        }

                    });
                } else {
                    handlingErrors.showError('wrong pin')
                }
            } 
            // else {
            //     handlingErrors.showError('Form Error !')
            // }
        }
        vm.forgotPIN = function(){            
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            var credentials = $localStorage.getObject('credentials');
            userLogin.removeFromNeverLogWithPIN(credentials.email);    
            $localStorage.remove('credentials');                            
            $state.go('loginSelect');
        }
    }
})();