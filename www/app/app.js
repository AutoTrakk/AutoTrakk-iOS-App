// Ionic AutoTrakk App
angular.module('autotrakk', ['ionic', 'ngCordova', 'ngMessages', 'angularMoment']);
(function () {
    'use strict';
    angular.module('autotrakk')
        .constant('$ionicLoadingConfig', {
            template: 'Processing request'
        })
        .constant('serverTimeZone', 'http://somedomain.com')
        .run(['$ionicPlatform', '$rootScope', '$localStorage', '$state', 'connectivityMonitor', 'APIWrapper', '$cordovaGeolocation','$ionicHistory', function ($ionicPlatform, $rootScope, $localStorage, $state, connectivityMonitor, APIWrapper, $cordovaGeolocation,$ionicHistory) {                                
            $ionicPlatform.registerBackButtonAction(function (event) {                
                  
                    
                    event.preventDefault();
                    var currentStateName = $ionicHistory.currentStateName();
                    if($rootScope.userLoggedCheck == true){
                      
                        $state.go('mainMenu');
                    }else if(currentStateName == 'enterPin' || currentStateName == 'emailLogin' || currentStateName == 'install' ){
                       navigator.app.exitApp();                        
                    }
                                         
            }, 100);
            $ionicPlatform.ready(function () {                
                var posOptions = { timeout: 1000, enableHighAccuracy: false };
                $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                    }, function (err) {
                    });
                var checkInterentOffline = connectivityMonitor.checkIsOffline();
                //check internet vconnectio and get auth token
                
                if (checkInterentOffline == false) {                    
                    connectivityMonitor.init();                    
                    APIWrapper.fetchAuthToken();
                }
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                    // Don't remove this line unless you know what you are doing. It stops the viewport
                    // from snapping when text inputs are focused. Ionic handles this internally for
                    // a much nicer keyboard experience.
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
                window.addEventListener('native.keyboardshow', function () {
                    document.body.classList.add('keyboard-open');
                });
                // define what happpens when app goes to background
                document.addEventListener("pause", function () {
                    $rootScope.userLoggedCheck = false;
                }, false);
                // define what happpens when app come back from background
                document.addEventListener("resume", function () {                    
                    var firstTimeEver = $localStorage.get('firstTimeEver');
                    if (firstTimeEver == 'false') {                        
                        $state.go('loginMaster');
                    }
                }, false);
                $rootScope.userLoggedCheck = false;
                $rootScope.hideHeader = true;
                $rootScope.dropDownHide = true;
                $rootScope.hasNextFreeOilChange = false;
                var firstTimeEver = $localStorage.get('firstTimeEver');
                if (firstTimeEver == 'false') {

                    var credentials = $localStorage.get('credentials');
                    if (credentials !== undefined) {
                        // user login email or PIN                        
                        $state.go('loginMaster');
                    }
                    else {
                        // user don't have verifed account                        
                        $state.go('loginSelect');
                    }
                }
                else {
                    // this is first timerun after install
                    var neverLogWithPIN = $localStorage.getObject('neverLogWithPIN');
             
                    // set to false 'notShowCreatePin' if this is first run of app
                    if (neverLogWithPIN.usernames === undefined) {
                        $localStorage.setObject('neverLogWithPIN', { 'usernames': [] });
                
                    }
                    $state.go('install');
                }
            });

        }]);
})();