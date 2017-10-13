(function () {
    angular.module('autotrakk')
        .controller('bankInfoCtrl', bankInfoCtrl);
    bankInfoCtrl.$inject = ['accountData', 'dataFormatting', 'handlingErrors', '$ionicLoading','$state'];
    function bankInfoCtrl(accountData, dataFormatting, handlingErrors, $ionicLoading,$state) {
        var vm = this;
        var account = accountData.getAccountData();
        var cardsListData = [];
        vm.noCards = false;        
        if (account.cardsList != null) {
            cardsListData = account.cardsList.cards;
        }else{
            vm.noCards = true;
        }
        vm.formError = false;        
        vm.formData = prepareDataForForm(cardsListData);
        vm.updateCardList = function () {
            if (vm.formError == false) {
                callAPI(vm.formData)
            }
        }        
        var deleteCardList = [];
        // vm.softDelete = function (cardID, expDate, deleteValue) {
        //     for(var prop in vm.formData){
        //         if(vm.formData[prop].deleteValue == true){
        //             vm.formData[prop].softDelete = true;
        //         }
        //     }

        // }
        // vm.resetDeleteCards = function () {
        //     deleteCardList = [];
        //     for (var prop in cardsListData) {
        //         var card = cardsListData[prop];
        //         for (var prop in vm.formData) {
                    
        //             if (vm.formData[prop].seq == card.seq) {
        //                 vm.formData[prop].deleteValue = false;
        //                 vm.formData[prop].softDelete = false;
        //             }
        //         }
        //     }
        //     $state.go('mainMenu');
        // }
        vm.dateCheck = function (date) {
            var error = false;
            for (var prop in vm.formData) {
                if (vm.formData[prop].expDate == undefined) {
                    error = true;
                }
            }
            vm.formError = error
        }

        function callAPI(data) {
          
            $ionicLoading.show();            
            accountData.updateCardsList(data).then(function (response) {
                $ionicLoading.hide();
                if (response.error == false && response.data.StatusCode == 100) {                   
                    //deleteCardList = [];
                    for(var prop in data){                        
                        for(var i in cardsListData){
                            
                            if(data[prop].seq == cardsListData[i].seq){                                
                                _date = dataFormatting.dateForAPI(data[prop].expDate,true);
                                if(cardsListData[i].expDate != _date){
                                    cardsListData[i].expDate = _date;
                                }
                                if(data[prop].deleteValue==true){
                                    cardsListData.splice(i,1);
                                }                        
                            }                            
                        }                                                
                    }                                                                                           
                    account.cardsList.cards = cardsListData;
                    accountData.setAccountData(account);
                    vm.formData = prepareDataForForm(cardsListData);                                                     
                 
                    $state.go('mainMenu');
                    //handlingErrors.showError('Thank you, we will verify the data and update your customer file');
                   
                } else {
                    handlingErrors.errorInRespone(response);
                }

            });
        }
        function prepareDataForForm(cardsListData){
            var cardsListDataForForm = [];
            for (var prop in cardsListData) {
                var _date = dataFormatting.dateForHuman(cardsListData[prop].expDate);
                cardsListDataForForm[prop] = {
                    seq: cardsListData[prop].seq,
                    cardNo: cardsListData[prop].cardNo,
                    expDate: _date,
                    deleteValue: false
                }
            }
            return cardsListDataForForm;
        }
    }
})();

