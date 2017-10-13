(function(){
    angular.module('autotrakk')
        .controller('vehicleInfoCtrl', vehicleInfoCtrl);
    vehicleInfoCtrl.$inject = ['accountData','dataFormatting'];
    function vehicleInfoCtrl(accountData,dataFormatting) {
        var vm = this;
        var account = accountData.getAccountData();
        var _registrationExp = dataFormatting.dateForHuman(account.vehicleInfo.registrationExp) || 'No data';
        var _inspectionExp = dataFormatting.dateForHuman(account.vehicleInfo.inspectionExp) || 'No data';
        vm.data = {
            "year":account.vehicleInfo.year || 'No data',
            "make":account.vehicleInfo.make || 'No data',
            "model":account.vehicleInfo.model || 'No data',
            "color":account.vehicleInfo.color || 'No data',
            "licensePlate":account.vehicleInfo.licensePlate || 'No data',
            "registrationExp":_registrationExp,
            "inspectionExp":_inspectionExp,
            "currentMileage":account.vehicleInfo.currentMileage || 'No data'
        }
    }
})();
