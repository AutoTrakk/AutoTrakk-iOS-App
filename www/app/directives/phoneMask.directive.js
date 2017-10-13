(function() {
angular
    .module('autotrakk')
    .directive('phoneMask',phoneMask);

function phoneMask(){
    var directive = {
        restrict: 'A',
        link: function($scope, element) {
            element.on("input", function(e) {
                var inputVal = element.val();
                var inputValLength = inputVal.length;
                if(inputValLength > 3  && inputValLength < 7){
                    if(inputVal.indexOf('-') === -1){
                        var newInputVal = inputVal.substring(0,3)+'-'+inputVal.substring(3);
                        element.val(newInputVal);
                    }
                }
                if(inputValLength > 7){
                    if(inputVal.indexOf('-',4) === -1){
                        var newInputVal = inputVal.substring(0,7)+'-'+inputVal.substring(7);
                        element.val(newInputVal);
                    }
                }
                if(element.val().length > 12) {
                    var sliced = element.val().substr(0,12);
                    element.val(sliced)

                }
            });
        }
    }
    return directive;
}
})();