(function () {
    angular.module('autotrakk')
        .controller('maintenanceCtrl', maintenanceCtrl);
    maintenanceCtrl.$inject = ['accountData', 'dataFormatting'];
    function maintenanceCtrl(accountData, dataFormatting) {
        var vm = this;
        vm.form = [];
        var account = accountData.getAccountData();
        var _lastOilChange = dataFormatting.dateForHuman(account.vehicleInfo.lastOilChange) || 'No data';
        var _registrationExp = dataFormatting.dateForHuman(account.vehicleInfo.registrationExp) || 'No data';
        var _inspectionExp = dataFormatting.dateForHuman(account.vehicleInfo.inspectionExp) || 'No data';
        vm.data = {
            lastOilChange: _lastOilChange,
            registrationExp: _registrationExp,
            inspectionExp: _inspectionExp
        }
    }
})();