(function () {
    angular
        .module('autotrakk')
        .factory('makeAPayment', makeAPayment);
    makeAPayment.$inject = ['accountData', 'APIWrapper', 'dataFormatting','$localStorage','userLogin'];
    function makeAPayment(accountData, APIWrapper, dataFormatting,$localStorage,userLogin) {
        var totalAmount, errorMsg;
        var card = [];
        var paymentQuery = [];
        var paymentSubmitData = [];
        var validPaymentData = true;
        var service = {
            setTotalPayment: setTotalPayment,
            getTotalAmount: getTotalAmount,
            setSelectedCardId: setSelectedCardId,
            setCard: setCard,
            getCard: getCard,
            getPaymentQuery: getPaymentQuery,
            resetPayment: resetPayment,
            submitPayment: submitPayment,
            getPaymentSubmitData: getPaymentSubmitData,
            setErrorMsg: setErrorMsg,
            getErrorMsg: getErrorMsg,
            checkCreditCardNumber: checkCreditCardNumber,
            hasDeviceCode: hasDeviceCode,
            getValidPaymentData:getValidPaymentData
        }
        return service;
        /////////////////////////
        function setTotalPayment(total) {
            setTotalAmount(total);
            var opt = {
                'totalPaymentToday': total
            }
            return APIWrapper.postPaymentQuery(opt).then(function (response) {
                if (response.error == false && response.data.StatusCode == 100) {
                    setPaymentQuery(response.data.Results);
                }
                return response;
            });
        }
        function setTotalAmount(data) {
            totalAmount = data;
        }
        function getTotalAmount() {
            return totalAmount;
        }
        function setSelectedCardId(seq) {
            var _cardSeq = seq;
            var account = accountData.getAccountData();
            var cardList = account.cardsList.cards;
            for (var prop in cardList) {
                var savedCard = cardList[prop];
                if (savedCard.seq == _cardSeq) {
                    setCard(savedCard, false, false)
                }
            }
            // return false;
        }
        function setCard(selectedCard, save, newCard) {
            var _newCard = newCard;
            var _selectedCard = selectedCard;
            var _save = save;
            var _saveCard = 'N';
            // console.log('in service set a card');    
            // console.log(save);    
            // console.log(_save);
            // console.log(_saveCard);        
            if (_save == true) {
                _saveCard = 'Y';
            }
            //console.log(_saveCard);              
            if (_newCard == false) {
                var _date = dataFormatting.dateForHuman(_selectedCard.expDate);
                card = {
                    'cardNo': _selectedCard.cardNo,
                    'seq': _selectedCard.seq,
                    'expDate': _date
                };
            } else {
                var type = parseInt(_selectedCard.cardType);
                card = {
                    'type': type,
                    'nameOnCard': _selectedCard.nameOnCard,
                    'cardNumber': _selectedCard.cardNumber,
                    'cvv': _selectedCard.cvv,
                    'expDate': _selectedCard.expDate,
                    'address1': _selectedCard.billingAddress,
                    'address2': _selectedCard.address,
                    'city': _selectedCard.city,
                    'state': _selectedCard.state,
                    'zip': _selectedCard.zip,
                    'phoneNumber': _selectedCard.phoneNumber
                };

            }
            card.save = _saveCard;
            card.newCard = _newCard;
        }
        function getCard() {
            return card;
        }
        function setPaymentQuery(data) {
            var _paymentQuery = [];
            var _entered = data.paymentAmtEntered != '' ? ('$ ' + data.paymentAmtEntered) : '$ 0';
            var _applied = data.paymentAmtApplied != '' ? ('$ ' + data.paymentAmtApplied) : '$ 0';
            var _toOverpayment = data.toOverpayment != '' ? ('$ ' + data.toOverpayment) : '$ 0';
            var _balance = data.overPaymentBalance != '' ? ('$ ' + data.overPaymentBalance) : '$ 0';
            _paymentQuery.overPaymentInfo = {
                "entered": _entered,
                "applied": _applied,
                "toOverpayment": _toOverpayment,
                "balance": _balance
            }
            _paymentQuery.releasedCodesList = [];
            for (var prop in data.releasedCodesList) {
                var _date = dataFormatting.dateForHuman(data.releasedCodesList[prop].dueDate);
                _paymentQuery.releasedCodesList[prop] = {
                    'code': data.releasedCodesList[prop].code,
                    'date': _date
                }
                _paymentQuery.releasedCodesList[prop].list = [];
                for (var i in data.releasedCodesList[prop].itemList) {
                    _paymentQuery.releasedCodesList[prop].list[i] = {
                        'name': data.releasedCodesList[prop].itemList[i].name,
                        'paid': '$ ' + data.releasedCodesList[prop].itemList[i].paid
                    }
                }
            }
            paymentQuery = _paymentQuery;
        }
        function getPaymentQuery() {
            return paymentQuery;
        }
        function setPaymentSubmitData(data,saveNewCard) {      
            console.log('setPaymentSubmitData response');
            console.log('data');
            console.log(data);
            console.log('releasedCodesList');
            console.log(data.releasedCodesList);
            console.log('nextDueDate');
            console.log(data.nextDueDate);
            console.log('-------------------------------');          
            paymentSubmitData = data;     
            var opt = userLogin.getUserCredentials();
            return APIWrapper.postUserLogin(opt)
                .then(function (response) {
                    console.log('save card -----> api postUserLogin ');                         
                    if (response.error == false && response.data.StatusCode == 100) {
                        var accountJSON = response.data.Results;                               
                            console.log('response after submitpayment with new card and save ');
                            console.log('card list');
                        for(var prop in accountJSON.cardsList.cards)      {
                            console.log(accountJSON.cardsList.cards[prop]);
                        }                                    
                        accountData.setAccountData(accountJSON);                            
                    }
                }); 
            // if(saveNewCard == 'Y'){
            //     var opt = userLogin.getUserCredentials();
            //      return APIWrapper.postUserLogin(opt)
            //          .then(function (response) {
            //              console.log('save card -----> api postUserLogin ');                         
            //               if (response.error == false && response.data.StatusCode == 100) {
            //                   var accountJSON = response.data.Results;                               
            //                      console.log('response after submitpayment with new card and save ');
            //                      console.log('card list');
            //                   for(var prop in accountJSON.cardsList.cards)      {
            //                       console.log(accountJSON.cardsList.cards[prop]);
            //                   }                                    
            //                   accountData.setAccountData(accountJSON);                            
            //               }
            //          });
            // }
            // else {
            //     var account = accountData.getAccountData();
            //     var _paymentQuery = getPaymentQuery();
            //     //console.log(_paymentQuery.releasedCodesList[0]);

            //     var flagValidAPIDate = false;
            //     for (var i in account.accountActivity) {
                    
            //         if (account.accountActivity[i].date != data.accountActivity[i].date) {
            //             flagValidAPIDate = true;
            //         }
            //     }
            //     //console.log('flagValidAPIDate ' + flagValidAPIDate);
            //     if (flagValidAPIDate != false) {
            //         account.accountActivity = data.accountActivity;
            //     } else {
            //         var _localCredentials = $localStorage.getObject('credentials');
            //         var errorObj ={
            //             'username':  _localCredentials.email
            //         };

            //         setValidPaymentData(false);
            //         var _paymentItem = {};

            //         for (var prop in _paymentQuery.releasedCodesList) {

            //             var _item = _paymentQuery.releasedCodesList[prop];
            //             var _itemList = [];
            //             for (var i in _item.list) {

            //                 _itemList[i] = {
            //                     'name': _item.list[i].name,
            //                     'due': _item.list[i].paid.substring(1),
            //                     'paid': _item.list[i].paid.substring(1),
            //                 }
            //             }
            //             var _date = dataFormatting.dateForAPI(_item.date);
            //             var flagPaymentDate = false;
            //             for (var counter in account.accountActivity) {
            //                 if (account.accountActivity[counter].date == _date) {
            //                     account.accountActivity[counter].itemList.concat(_itemList);
            //                     flagPaymentDate = true;
            //                 }
            //             }
            //             //console.log(_date);
            //             //console.log('flagPaymentDate: ' + flagPaymentDate);
            //             if (flagPaymentDate == false) {
            //                 _paymentItem = {
            //                     'date': _date,
            //                     'code': '',
            //                     'itemList': _itemList,
            //                 }
            //                 account.accountActivity.unshift(_paymentItem);
            //             }
            //         }                
            //     }
            //     console.log(data);
            //     console.log(data.accountStatus);

            //     account.accountStatus = data.accountStatus;
            //     account.paymentInfo = data.paymentInfo;
            //     accountData.setAccountData(account);
                                
            // } 
                   
            
        }
        function getPaymentSubmitData() {
            return paymentSubmitData;
        }
        function resetPayment() {
            setTotalAmount('');
            card = [];
            paymentQuery = [];
        }
        function submitPayment() {
            var _totalAmount = getTotalAmount();
            var _card = getCard();

            if (_card.newCard == false) {
                var opt = {
                    'seq': _card.seq,
                    'totalPaymentToday': _totalAmount
                }
                return APIWrapper.postPaymentWithStoredCard(opt).then(function (response) {
                    if (response.error == false && response.data.StatusCode == 100) {
                        setPaymentSubmitData(response.data.Results,'N');
                    }
                    return response;
                })
            }
            else if (_card.newCard == true) {

                var _expDate = dataFormatting.dateForAPI(_card.expDate, true);
                var _phoneNumber = dataFormatting.phoneForAPI(_card.phoneNumber);
                var _totalPaymentToday = _totalAmount;
                opt = {
                    'type': _card.type,
                    'nameOnCard': _card.nameOnCard,
                    'cardNumber': _card.cardNumber,
                    'cvv': _card.cvv,
                    'expDate': _expDate,
                    'address1': _card.address1,
                    'address2': _card.address2,
                    'city': _card.city,
                    'state': _card.state,
                    'zip': _card.zip,
                    'phoneNumber': _phoneNumber,
                    'save': _card.save,
                    'totalPaymentToday': _totalPaymentToday
                };                               
                return APIWrapper.postPaymentWithNewCard(opt).then(function (response) {
                    if (response.error == false && response.data.StatusCode == 100) {
                        console.log('submitPayment ->');
                        console.log(response.data.Results);
                        console.log('releasedCodesList');
                        console.log(response.data.Results.releasedCodesList);
                        console.log('nextDueDate');
                        console.log(response.data.Results.nextDueDate);
                        console.log('accountActivity');
                        console.log(response.data.Results.accountActivity);
                        console.log('accountStatus');
                        console.log(response.data.Results.accountStatus);
                        console.log('paymentInfo');
                        console.log(response.data.Results.paymentInfo);
                        console.log('----------------------------');
                        var saveNewCard = 'N';
                        if(_card.save == 'Y'){
                            saveNewCard = 'Y';
                        }
                        setPaymentSubmitData(response.data.Results,saveNewCard);
                        
                    }
                    return response;
                })
            }
            else {
                var response = {
                    'error': true,
                    'type': 'unknown'
                }
                return response;
            }
        }
        function setErrorMsg(msg) {
            errorMsg = msg;
        }
        function getErrorMsg() {
            return errorMsg;
        }
        function checkCreditCardNumber(creditCard, cardType) {
            _cardNumber = String(creditCard);
            _firstChar = _cardNumber.charAt(0);            
            if (_cardNumber.match(/^[0-9]+$/) == null) {

                return false;
            }
            if (_cardNumber.length == 16) {
                switch (cardType) {                   
                    case '2':
                        if (_firstChar != 6) {
                            return false;
                        }
                        break;
                    case '3':
                        if (_firstChar != 5) {
                            return false;
                        }
                        break;
                    case '4':
                        if (_firstChar != 4) {
                            return false;
                        }
                        break;
                }
                return true;
            }else if(_cardNumber.length == 15){
                if (_firstChar != 3) {
                    return false;
                }
                 return true;
                       
            }
             else {
                return false;
            }
        }
        function hasDeviceCode() {
            var account = accountData.getAccountData();
            console.log('hasDeviceCodes :' + account.accountStatus.hasDeviceCodes);
            if (account.accountStatus.hasDeviceCodes) {
                return account.accountStatus.hasDeviceCodes;
            } else {
                return 'Y';
            }
        }
        function getValidPaymentData(){
            return validPaymentData;
        }
        function setValidPaymentData(data){
            validPaymentData = data;
        }
    };
})();