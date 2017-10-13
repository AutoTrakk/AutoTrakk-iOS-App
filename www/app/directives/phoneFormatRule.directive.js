(function () {
    angular
        .module('autotrakk')
        .directive('phoneFormat', phoneFormatRule);
    function phoneFormatRule() {
        var directive = {
            require: 'ngModel',
            link: function (scope, elem, attr, ngModel) {

                ngModel.$parsers.unshift(function (value) {
                    var phoneNum = value;
                    var phoneError = false;
                        if (phoneNum.length ==0){
                            phoneError = true;
                        }
                        // else if (phoneNum.length == 8 && phoneNum.match((/-/g) || []).length < 2) {
                        //     phoneError = true;
                        // }
                        else if (phoneNum.length >= 12) {
                            phoneError = true;
                        } else {
                            phoneError = false;
                        }
                        ngModel.$setValidity('phoneformat', phoneError);
                    

                    return phoneNum;
                });
            }
        }
        return directive;
    }
})();