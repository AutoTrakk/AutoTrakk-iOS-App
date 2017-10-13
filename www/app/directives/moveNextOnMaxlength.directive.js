(function() {
angular
    .module('autotrakk')
    .directive('moveNextOnMaxlength',moveNextOnMaxlength);

    function moveNextOnMaxlength(){
        var directive = {
            restrict: 'A',
            link: function($scope, element) {
                element.on("input", function(e) {
                    if(element.val().length == element.attr("maxlength")) {

                        var $nextElement = element.parent().next().children('.formInput');
                        if($nextElement.length) {
                            $nextElement[0].focus();
                        }else {
                            element[0].blur();
                        }
                    }
                });
            }
        }
        return directive;
    }
})();