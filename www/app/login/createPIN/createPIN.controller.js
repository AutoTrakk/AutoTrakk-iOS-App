(function () {
    angular.module('autotrakk')
        .controller('createPINCtrl', createPINCtrl);
    createPINCtrl.$inject = ['$localStorage', '$state', 'accountData'];
    function createPINCtrl($localStorage, $state, accountData) {
        var vm = this;
        vm.showPinError = false;
        vm.samePinError = false;
        vm.logPinForm = [];
        vm.notShowCreatePin = false;
        var account = accountData.getAccountData();
        /////////////////////////////////////    
        vm.pinChanged = function () {
            if (vm.pinChanged != undefined || vm.pinChanged != '') {
                vm.showPinError = false;
                vm.samePinError = false;
            }
        }
        vm.pinRepeatChanged = function () {
            if (vm.pinChanged != undefined || vm.pinChanged != '') {
                vm.showPinRepeatError = false;
                vm.samePinError = false;
            }
        }
        vm.savePin = function (createPINForm) {
            var pins = vm.logPinForm;
            if (pins.pin != pins.pinRepeat) {
                vm.samePinError = true;
                vm.showPinError = false;
                vm.showPinRepeatError = false;
            } else {
                if (createPINForm.$valid == true) {
                    var credentials = $localStorage.getObject('credentials');
                    $localStorage.setObject('credentials', {
                        "pin": pins.pin,
                        "email": credentials.email,
                        "password": credentials.password
                    });                                
                        $state.go('alertNotice');                    
                } else {
                    if (pins.pin === undefined) {
                        vm.showPinError = true;
                    }
                    if (pins.pinRepeat === undefined) {
                        vm.showPinRepeatError = true;
                    }

                }
            }

        }
        // User don't want to log with PIN 
        vm.noPin = function () {
            //$localStorage.setObject('credentials', {});
            var credentials = $localStorage.getObject('credentials');
            credentials.password = '';
            $localStorage.setObject('credentials', credentials);
            if (vm.notShowCreatePin == true) {
                addToNeverLogWithPIN(credentials.email);
            }
            $state.go('alertNotice');
        }

        function addToNeverLogWithPIN(username) {
            var neverLogWithPIN = $localStorage.getObject('neverLogWithPIN');

            neverLogWithPIN.usernames.push(username);
            $localStorage.setObject('neverLogWithPIN', neverLogWithPIN);
        }
        // if user what to verify account again and this is true he will not be able to create PIN
        // vm.changeNotShowCreatePin = function () {
        //     var credentials = $localStorage.getObject('credentials');

        //     $localStorage.set('notShowCreatePin', vm.notShowCreatePin);
        // }
    }
})();