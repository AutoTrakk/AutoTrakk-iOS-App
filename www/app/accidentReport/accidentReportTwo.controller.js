(function() {
    angular.module('autotrakk')
        .controller('accidentReportTwoCtrl', accidentReportTwoCtrl);
    //accidentReportTwoCtrl.$inject = ['accountData','dataFormatting']
    function accidentReportTwoCtrl() { //accountData,dataFormatting
        var vm = this;
        // var account = accountData.getAccountData();
        // var _phone = 'No phone number';        
        // if(account.profile.mobile.length>0 ){
        //     _phone = dataFormatting.phoneForHuman(account.profile.mobile);
        // }else if(account.profile.home.length>0) {
        //      _phone = dataFormatting.phoneForHuman(account.profile.home);
        // }else {
        //     _phone = 'No phone number';
        // }
        // vm.data = {
        //     'userPhone': _phone
        // }
    }
})();