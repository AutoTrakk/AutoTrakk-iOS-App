(function () {
    angular.module('autotrakk')
        .controller('emailLoginCtrl', emailLoginCtrl);
    emailLoginCtrl.$inject = ['$state', 'userLogin', '$rootScope', 'handlingErrors', '$ionicLoading', '$localStorage'];
    function emailLoginCtrl($state, userLogin, $rootScope, handlingErrors, $ionicLoading, $localStorage) {
        var vm = this;
        vm.loginForm = [];
        var firstTimeEver = $localStorage.get('firstTimeEver');

        vm.submitForm = function (usernameLoginForm) {
            if (usernameLoginForm.$valid == true) {
                $ionicLoading.show();
                userLogin.logInUser(vm.loginForm)
                    .then(function (response) {
                        $ionicLoading.hide();
                        if (response.error == false && response.data.StatusCode == 100) {
                            $rootScope.userLoggedCheck = true;
                            var credentials = $localStorage.getObject('credentials');
                            var username = vm.loginForm.email;
                            var neverLogWithPIN = $localStorage.getObject('neverLogWithPIN');
                            var flag = false;
                   
                            if (credentials.email != vm.loginForm.email) {
                                saveCredentials(vm.loginForm.email, vm.loginForm.password);
                            }
                            for (var prop in neverLogWithPIN.usernames) {
                                var storedUsername = neverLogWithPIN.usernames[prop];
                                if (storedUsername == username) {
                                    flag = true;
                                }
                            }
                            if (flag == true) {                                
                                    $state.go('alertNotice');                                                            
                            } else {
                                saveCredentials(vm.loginForm.email, vm.loginForm.password);
                                $state.go('createPin');
                            }
                        } else {
                            handlingErrors.errorInRespone(response);
                        }

                    });
            }
        }
        function saveCredentials(username, password) {
            var data = {
                "email": username,
                "password": password
            }
            //save user data to localStorage              
            $localStorage.setObject('credentials', data);
        }
    }
})();