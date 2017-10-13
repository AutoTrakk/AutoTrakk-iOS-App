(function () {
    angular
        .module('autotrakk')
        .factory('userLogin', userLogin);
    userLogin.$inject = ['APIWrapper', '$sessionStorage', '$localStorage','$rootScope', '$state', 'accountData','userLocation','handlingErrors'];
    function userLogin(APIWrapper, $sessionStorage, $localStorage,$rootScope, $state,accountData,userLocation,handlingErrors) {
        var opt = {};
        var service = {
            logInUser: logInUser,
            editNewPIN: editNewPIN,
            removeFromNeverLogWithPIN:removeFromNeverLogWithPIN,
            getUserCredentials:getUserCredentials
        }
        return service;
        /////////////
        function getUserCredentials(){
            return opt;
        }
        function logInUser(data) {
            opt = {
                "email": data.email,
                "password": data.password
            }
            return APIWrapper.postUserLogin(opt)
                .then(function (response) {
                    if (response.error == false && response.data.StatusCode == 100) {
                        var accountJSON = response.data.Results;
                                              
                        accountData.setAccountData(accountJSON);
                        
                        sendUserLocation();                                              
                        return response;                            
                        // return sendUserLocation().then(function (response) {                       
                        //     if (response.error == false && response.data.StatusCode == 100) {
                        //         accountData.setAccountData(accountJSON);    
                        //         return true;
                        //     } else {                            
                        //         return response;
                        //     }
                        // });
                    } else {
                        return response;
                    }
                })
        }
        function editNewPIN() {
            $rootScope.userLoggedCheck = false;
            var credentials =  $localStorage.getObject('credentials');
            removeFromNeverLogWithPIN(credentials.email);
            $sessionStorage.remove('token');
            $localStorage.remove('account');
            $localStorage.remove('credentials');
            $state.go('emailLogin');
        }
        function removeFromNeverLogWithPIN(username){
            var _username = username;
            var neverLogWithPIN = $localStorage.getObject('neverLogWithPIN');
            var userIndex;   
            for (var prop in neverLogWithPIN.usernames) {
                var storedUsername = neverLogWithPIN.usernames[prop];
                if (storedUsername == _username) {
                    userIndex = prop;                                    
                }
            }
            //console.log('before');
            //console.log(neverLogWithPIN.usernames);
            neverLogWithPIN.usernames.splice(userIndex,1);
            //console.log('after');
            //console.log(neverLogWithPIN.usernames);
            //console.log('saving');
            $localStorage.setObject('neverLogWithPIN',neverLogWithPIN);
            //console.log('after saving');
            //var t= $localStorage.getObject('neverLogWithPIN')
            //console.log(t);
            //console.log(t.usernames);
        }
        // Private //
        function sendUserLocation() {
             userLocation.getUserLocation().then(function (response) {
                if (response.error == false) {
                     APIWrapper.postUserLocation(response.location).then(function (response) {
                         console.log('sending location error');
                         if (response.error == false && response.data.StatusCode == 100) {
                            console.log("User location is sent"); 
                         }else {
                            console.log("Can't send user location from device to server"); 
                         }
                         console.log(response);                       
                    });
                }else {       
                    console.log("Can't get user location from device");             
                                       
                }
                // if (response.error == false) {
                //     return APIWrapper.postUserLocation(response.location).then(function (response) {
                //         return response;
                //     });
                // }else {
                //     return response;
                // }

            });
        }
    }
})();


