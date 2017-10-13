(function () {
    angular
        .module('autotrakk')
        .factory('userLocation', userLocation);
    userLocation.$inject = ['$cordovaGeolocation', 'handlingErrors'];
    function userLocation($cordovaGeolocation, handlingErrors) {
        var service = {           
            getUserLocation: getUserLocation
        }
        return service;                
        function getUserLocation() {
            var posOptions = { timeout: 10000, enableHighAccuracy: false };
            return $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    var lat = position.coords.latitude.toFixed(5);
                    var long = position.coords.longitude.toFixed(5);
                    var accuracy = position.coords.accuracy;
                    var _location = {
                        'lat': lat,
                        'long': long,
                        'accuracy':accuracy
                    }        
                    var data = {
                        'location':_location,
                        'error': false
                    }
                    return data;
                }, function (response) {
                    response.data = 'Please enable your location';
                    response.plugin = "geolocation";                                        
                    var error = handlingErrors.errorFromPlugin(response);
                    return error;
                });
        }
    }
})();