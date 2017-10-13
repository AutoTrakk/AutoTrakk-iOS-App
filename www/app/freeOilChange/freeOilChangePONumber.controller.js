(function(){
    angular.module('autotrakk')
        .controller('freeOilChangePONumberCtrl', freeOilChangePONumberCtrl);
    freeOilChangePONumberCtrl.$inject = ['accountData']
    function freeOilChangePONumberCtrl(accountData){
        var vm = this;
        var account = accountData.getAccountData();
        vm.vehicle = {
            "year":account.vehicleInfo.year || 'No data',
            "make":account.vehicleInfo.make || 'No data',
            "model":account.vehicleInfo.model || 'No data',
            "vin":account.vehicleInfo.vin || 'No data',
            "po":account.accountStatus.contract || 'No data'
        }

    }
})();