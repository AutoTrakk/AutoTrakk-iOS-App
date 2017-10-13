(function () {
    angular
        .module('autotrakk')
        .controller('loginMasterCtrl', loginMasterCtrl);
    loginMasterCtrl.$inject = ['$state', '$localStorage', '$timeout'];
    function loginMasterCtrl($state, $localStorage, $timeout) {
        var credentialsRaw = $localStorage.getObject('credentials');
                 
        if (Object.keys(credentialsRaw).length != 0) {
            if (credentialsRaw.pin) {
                $state.go('enterPin');
            }
            else {
                $state.go('emailLogin');
            }
        }else {            
            $state.go('loginSelect');
        }
    }
})();