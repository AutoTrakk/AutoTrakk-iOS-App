(function() {
angular
    .module('autotrakk')
    .directive('onlyMaxLength',onlyMaxLength);

    function onlyMaxLength(){
        var directive = {
            restrict: 'A',
            link: function($scope, element) {
                element.on("input", function(e) {
                    if(element.val().length > element.attr("maxlength")) {
                        var sliced = element.val().substr(0,element.attr("maxlength"));
                        element.val(sliced)

                    }
                });
            }

        }
        return directive;
    }
})();