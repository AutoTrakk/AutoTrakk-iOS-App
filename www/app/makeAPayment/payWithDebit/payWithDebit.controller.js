(function(){
    angular.module('autotrakk')
        .controller('payWithDebitCtrl', payWithDebitCtrl);
    payWithDebitCtrl.$inject = ['accountData','makeAPayment','$state'];
    function payWithDebitCtrl(accountData,makeAPayment,$state) {
        var vm = this;
        var account = accountData.getAccountData();
        vm.noCards = false;
        vm.cardList  =[];        
        if (account.cardsList != null) {
            vm.cardList = account.cardsList.cards;
        }else{
            vm.noCards = true;
        }

        vm.confirmPayment = function(form){
            if(form.$valid == true){
                makeAPayment.setSelectedCardId(vm.selectedCard);
                $state.go('confirmPayment');
            }       
        }
    }
})();