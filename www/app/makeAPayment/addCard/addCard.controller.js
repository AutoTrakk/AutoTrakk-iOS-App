(function(){
    angular.module('autotrakk')
        .controller('addCardCtrl', addCardCtrl);
    addCardCtrl.$inject = ['makeAPayment','$state','accountData','$ionicPopup'];
    function addCardCtrl(makeAPayment,$state,accountData,$ionicPopup) {
        var vm = this;
        vm.form = [];
        vm.form.cardType ='4';
        vm.creditCardCheck = true;
        vm.payWithCard = function(newCardForm,save){
             newCardForm.$setSubmitted();
             vm.checkCardNumber();
             if(newCardForm.$valid == true && vm.creditCardCheck == true){
              
                var account = accountData.getAccountData();
                var _userName = account.profile.name || '';
                var _name = '';
                if(_userName != ''){
                        _userName = _userName.split(',') ;
                   
                        if(_userName[1].substring(0,1) == ' '){
                            _name = _userName[1].slice(1) +' '+_userName[0]
                        }else {
                            _name = _userName[1]+' '+_userName[0]
                        }        
                        
                    }
             
                    var newName = vm.form.nameOnCard.toUpperCase();       
                    
                if(save == true){                    
                       if(newName !== _name){
                        $ionicPopup.alert({
                            title: 'Form Error',
                            template: 'Wrong name on card'
                        });
                        return false;
                    }                                     
                }                              
                vm.form.nameOnCard = newName;
       
                makeAPayment.setCard(vm.form,save,true);
                $state.go('confirmPayment')
            }
        }
        /////////////////////////
        vm.checkCardNumber = function(){            
            var cardNumber = vm.form.cardNumber;
            var cardType = vm.form.cardType;
            vm.creditCardCheck = makeAPayment.checkCreditCardNumber(cardNumber,cardType);
                                            
        }
    }
})();