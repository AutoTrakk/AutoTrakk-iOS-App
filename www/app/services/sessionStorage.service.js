(function(){
    angular
        .module('autotrakk')
        .factory('$sessionStorage',sessionStorage);
    sessionStorage.$inject = ['$window'];
    function sessionStorage($window) {
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
            $window.sessionStorage[key] = value;
            return true;
        }
        function get(key, defaultValue) {
            return $window.sessionStorage[key] || defaultValue;
        }
        function setObject(key, value) {
            $window.sessionStorage[key] = JSON.stringify(value);
        }
        function getObject(key) {
            return JSON.parse($window.sessionStorage[key] || '{}');
        }
        function remove(key){
            $window.sessionStorage.removeItem(key);
        }
    }
})();