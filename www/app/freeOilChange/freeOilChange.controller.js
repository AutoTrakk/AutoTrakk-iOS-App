(function () {
    angular.module('autotrakk')
        .controller('freeOilChangeCtrl', freeOilChangeCtrl);
    freeOilChangeCtrl.$inject = ['accountData', 'dataFormatting', 'freeOilChangeService', '$ionicLoading','handlingErrors','$state']
    function freeOilChangeCtrl(accountData, dataFormatting, freeOilChangeService, $ionicLoading,handlingErrors,$state) {
        var vm = this;
        var account = accountData.getAccountData();
        var _date  = '';
        if (account.nextFreeOilChange != null) {
            _date = dataFormatting.dateForHuman(account.nextFreeOilChange.date);
        }
        
        vm.nextOilChange = _date;

    }
})();