(function () {
    angular.module('autotrakk')
        .controller('alertNoticeCtrl', alertNoticeCtrl);
    alertNoticeCtrl.$inject = ['accountData', 'dataFormatting']
    function alertNoticeCtrl(accountData, dataFormatting) {
        var vm = this;
        var account = accountData.getAccountData();
        var _date = '';
        if (account.loginMessage && account.loginMessage != '') {
            var loginMessageContent = document.getElementById('loginMessageContent');
            loginMessageContent.innerHTML = account.loginMessage;
        }
        if (account.nextFreeOilChange != null && account.nextFreeOilChange.date) {
            _date = dataFormatting.dateForHuman(account.nextFreeOilChange.date);
        }
        vm.nextFreeCahnge = _date;
        
    }
})();