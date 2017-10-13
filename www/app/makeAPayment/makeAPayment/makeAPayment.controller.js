(function () {
    angular.module('autotrakk')
        .controller('makeAPaymentCtrl', makeAPaymentCtrl);
    makeAPaymentCtrl.$inject = ['accountData', 'makeAPayment', '$state', '$ionicLoading', 'handlingErrors'];
    function makeAPaymentCtrl(accountData, makeAPayment, $state, $ionicLoading, handlingErrors) {
        var vm = this;
        //ng-pattern="/^[0-9]+(\.[0-9]{1,2})?/"
        vm.amountErrorMsg = '';
        vm.amountCheck = false;
        var account = accountData.getAccountData();
       
        var defaultAmount = parseFloat(account.paymentInfo.totalDue);
        vm.hasDeviceCode = makeAPayment.hasDeviceCode();
      
        // set everything on null
        makeAPayment.resetPayment();
     
        vm.paymentInfo = {
            amount: defaultAmount || 0,
            weeklyPayment: account.paymentInfo.weeklyRent || 0,
            overPaymentBal: account.paymentInfo.overpaymentBalance || 0,
            minimumPayment: account.paymentInfo.totalDue || 0,
            amountToCurrent: account.paymentInfo.amountToCurrent || 0,
            maxPayment: account.paymentInfo.maxPayment || 0,
        };
        vm.amountValCheck = function () {
            if (vm.paymentInfo.amount == undefined || vm.paymentInfo.amount == '') {
                vm.amountErrorMsg = 'This field is required';
                vm.amountCheck = true;
            }
            else if (isNaN(vm.paymentInfo.amount) == true) {
                vm.amountErrorMsg = 'Please enter valid amount';
                vm.amountCheck = true;
            }
            else if (parseFloat(vm.paymentInfo.amount) < parseFloat(vm.paymentInfo.minimumPayment)) {
                vm.amountErrorMsg = 'Must be at least $ ' + vm.paymentInfo.minimumPayment;
                vm.amountCheck = true;
            }
            else if (parseFloat(vm.paymentInfo.amount) > parseFloat(vm.paymentInfo.maxPayment)) {
                vm.amountErrorMsg = 'Max amount is $ ' + vm.paymentInfo.maxPayment;
                vm.amountCheck = true;
            }
            else {
                vm.amountErrorMsg = '';
                vm.amountCheck = false;
            }
        }
        vm.submitForm = function (paymentForm) {
            vm.amountValCheck();
            if (vm.amountCheck == false) {
                $ionicLoading.show();
                var amount = parseFloat(vm.paymentInfo.amount).toFixed(2);
                makeAPayment.setTotalPayment(amount).then(function (response) {
                    $ionicLoading.hide();
                    if (response.error == false && response.data.StatusCode == 100) {
                      
                        $state.go('paymentSummary');
                    }
                    else {
                        handlingErrors.errorInRespone(response);
                    }
                });

            }
        };
    }
})();
