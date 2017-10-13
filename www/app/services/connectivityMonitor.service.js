(function () {
    angular
        .module('autotrakk')
        .factory('connectivityMonitor', connectivityMonitor)
    connectivityMonitor.$inject = ['$cordovaNetwork', '$ionicPopup', '$rootScope']
    function connectivityMonitor($cordovaNetwork, $ionicPopup, $rootScope) {
        var service = {
            init: init,
            checkIsOffline:checkIsOffline
        }
        return service;
        function init() {             
            var type = $cordovaNetwork.getNetwork();                                                    
            // listen for Offline event
            $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                $ionicPopup.alert({
                    title: 'You lost internet connection',
                    template: ''
                }).then(function(responde){
                    ionic.Platform.exitApp();
                })
                var offlineState = networkState;
            });           
        }
        function checkIsOffline() {
            var isOffline = $cordovaNetwork.isOffline()
            if (isOffline == true) {
                $ionicPopup.alert({
                    title: "Internet Disconnected",
                    content: "The internet is disconnected on your device."
                }).then(function(responde){
                    ionic.Platform.exitApp();
                });
                return true;    
            }else{
                return false;
            }
            
        }
    }
})();