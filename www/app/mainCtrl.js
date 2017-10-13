(function () {
    'use strict';
    angular.module('autotrakk')
        .controller('mainCtrl', mainCtrl);
    mainCtrl.$inject = ['$ionicPopover','$ionicPopup', '$scope', '$localStorage','$sessionStorage', '$state', '$rootScope','userLogin','$ionicHistory'];
    function mainCtrl($ionicPopover,$ionicPopup, $scope, $localStorage,$sessionStorage, $state, $rootScope,userLogin,$ionicHistory) {
        $ionicPopover.fromTemplateUrl('app/popover-menu/popover-menu.html', {
            scope: $scope,
        }).then(function (popover) {
            $scope.popover = popover;
        });
        $scope.logoutForm={
            eraseEverything: false
        };        
        $scope.confirmLogOut = function () {
            var confirmPopup = $ionicPopup.confirm({
                title:'Are you sure?',
                template:'<div class="row">'+
                            '<div class="col logoutPopUpBox">'+
                                '<div class="checkBoxWrapper">'+
                                    '<input type="checkbox" ng-model="logoutForm.eraseEverything" class="pullLeft" id="eraseEverything" name="eraseEverything">'+
                                    '<label for="eraseEverything">'+
                                '<i class="ion-checkmark checkmark "></i>'+
                            '</label>'+
                                '</div>'+                            
                                '<span class="fontSizeS clearApppDataMsg">Clear local app data</span>'+
                            '</div>'+
                        '</div>',  
                 scope: $scope              
            });                                        
            confirmPopup.then(function (res) {
                if (res) {
                    logOut();
                }
            });
        };
        // logout user and reset app        
        function logOut() {                
            $rootScope.userLoggedCheck = false;   
             
            var credentials = $localStorage.getObject('credentials');
            $localStorage.remove('account');      

            $sessionStorage.remove('token');
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });      
            if($scope.logoutForm.eraseEverything == false){                                
                if(credentials.pin){
                    $state.go('enterPin');
                }
                else {
                    $state.go('emailLogin');
                }                    
            }
            else {                    
                $localStorage.remove('credentials');
                userLogin.removeFromNeverLogWithPIN(credentials.email);                
                $scope.logoutForm = {
                    eraseEverything: false
                 }; 
                $state.go('loginSelect');
            }
        }
    }
})();