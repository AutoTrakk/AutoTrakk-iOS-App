(function(){
    angular
        .module('autotrakk')
        .factory('$localStorage',localStorage);
    localStorage.$inject = ['$window'];
    function localStorage($window) {
        var service = {
            set:set,
            get:get,
            setObject:setObject,
            getObject:getObject,
            remove:remove
        }
        return service;
        ///////////////////////////////
        function set(key, value) {
            $window.localStorage[key] = value;
            return true;
        }
        function get(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        }
        function setObject(key, value) {            
            $window.localStorage[key] = JSON.stringify(value);
        }
        function getObject(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
        function remove(key){
            $window.localStorage.removeItem(key);
        }
    }
})();