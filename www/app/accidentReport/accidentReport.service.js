(function() {
angular
    .module('autotrakk')
    .factory('accidentReport',accidentReport);
    accidentReport.$inject =['$http','APIWrapper','dataFormatting']
    function accidentReport($http,APIWrapper,dataFormatting){

        var service={
            submitReport:submitReport
        }
        return service;
        ////////////////

        function submitReport(data){
            var accidentForm = data;          
            var accidentDate = dataFormatting.dateForAPI(accidentForm.date);
            var _phone = dataFormatting.phoneForAPI(accidentForm.adjusterPhone);
            var opt = {
                "date": accidentDate,
                "claimNumber": accidentForm.claimNumber,
                "insuranceCo": accidentForm.insuranceCo,
                "adjusterName": accidentForm.adjusterName,
                "adjusterPhone": _phone,
                "policeReport": accidentForm.policeReport
            }                
            return APIWrapper.postAccidentReport(opt)
                .then(function (response){
                     return response;
                });               
        }      
    }
})();