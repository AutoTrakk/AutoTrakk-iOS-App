(function () {
    angular.module('autotrakk')
        .controller('accidentReportOneCtrl', accidentReportOneCtrl);
    accidentReportOneCtrl.$inject = ['$state', 'accidentReport', 'handlingErrors', '$ionicLoading'];
    function accidentReportOneCtrl($state, accidentReport, handlingErrors, $ionicLoading) {
        var vm = this;
        vm.form = [];
        vm.formSubmit = function (accidentReportForm) {
            if (accidentReportForm.$valid == true) {
                $ionicLoading.show();                
                accidentReport.submitReport(vm.form)
                    .then(function (response) {
                        $ionicLoading.hide();
                        if (response.error == false && response.data.StatusCode == 100) {
                            $state.go('accidentReportTwo');
                        } else {
                            handlingErrors.errorInRespone(response);
                        }
                    });
            }
        }
    }
})();