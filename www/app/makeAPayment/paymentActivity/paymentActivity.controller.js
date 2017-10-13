(function(){
    angular.module('autotrakk')
        .controller('paymentActivityCtrl', paymentActivity);
    paymentActivity.$inject = ['makeAPayment','dataFormatting','accountData']
    function paymentActivity(makeAPayment,dataFormatting,accountData) {
        var vm = this;
       
        vm.hasDeviceCode = makeAPayment.hasDeviceCode();
       
        var account = accountData.getAccountData();        
        vm.groups = []
        var activities = account.accountActivity;
        for(var prop in activities){
            var activity = activities[prop];
            var _date = dataFormatting.dateForHuman(activity.date);
            vm.groups[prop] = {
                "code":activity.code,
                "date":_date,
                "itemList":activity.itemList
            }
        }

        vm.toggleGroup = function(group) {
            if (vm.isGroupShown(group)) {
                vm.shownGroup = null;
            } else {
                vm.shownGroup = group;
            }
        };
        vm.isGroupShown = function(group) {
            return vm.shownGroup === group;
        };

    }
})();