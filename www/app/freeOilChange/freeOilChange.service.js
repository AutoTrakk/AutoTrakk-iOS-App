(function () {
    angular
        .module('autotrakk')
        .factory('freeOilChangeService', freeOilChangeService);
    freeOilChangeService.$inject = ['userLocation', 'APIWrapper'];
    function freeOilChangeService(userLocation, APIWrapper) {
        var service = {
            checkForNewLocations: checkForNewLocations,
            isMapCenterInRange: isMapCenterInRange,
            getServicesList: getServicesList,
            getServiceBrandList: getServiceBrandList
        }
        return service;
        ///////////////////////////////

        function checkForNewLocations(serviceMarkers, serviceLocations) {
            var newMarkers = [];
            for (var prop in serviceLocations) {
                var flag = false;
                var serviceLat = parseFloat(serviceLocations[prop].lat).toFixed(5);
                var serviceLng = parseFloat(serviceLocations[prop].long).toFixed(5);
                for (var i in serviceMarkers) {
                    var markerLat = serviceMarkers[i].getPosition().lat().toFixed(5);
                    var markerLng = serviceMarkers[i].getPosition().lng().toFixed(5);
                    if (serviceLat == markerLng && serviceLng == markerLng) {
                        flag = true;
                    }
                }
                if (flag == false) {
                    newMarkers.push(serviceLocations[prop]);
                }
            }
            return newMarkers;
        }
        function isMapCenterInRange(distanceFromMyLocation, radius) {
            var METERS_PER_MILE = 1609.344;
            if (distanceFromMyLocation > (radius * METERS_PER_MILE)) {
                return false;
            } else {
                return true;
            }
        }
        function getServicesList(lat, long, radius) {
            var opt = {
                'lat': lat,
                'long': long,
                'radius': radius
            }
            return APIWrapper.postServiceLocation(opt);
        }
        function getServiceBrandList() {
            var radius = 100;
            return userLocation.getUserLocation().then(function (response) {
                if (response.error == false) {
                    var lat = response.location.lat;
                    var long = response.location.long;
                    return getServicesList(lat, long, radius).then(function (response) {
                        if (response.error == false && response.data.StatusCode == 100) {                            
                            var servicesList = response.data.Results;                            
                            brandList = _makeABrandList(servicesList);
                            var data = {
                                'error': false,
                                'brandList': brandList
                            }
                            return data;
                        } else {
                            return response;
                        }
                    });
                } else {
                    return response;
                }
            });
        }
        function _makeABrandList(servicesList) {
            var brandList = [];
            for (var prop in servicesList) {
                var flag = false;
                for (var i in brandList) {
                    if (brandList[i] == servicesList[prop].brand) {
                        flag = true;
                    }
                }
                if (flag == false) {
                    brandList.push(servicesList[prop].brand)
                }
            }
            return brandList;
        }
    }

})();