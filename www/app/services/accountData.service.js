(function () {
    angular
        .module('autotrakk')
        .factory('accountData', accountData);
    accountData.$inject = ['$http', '$localStorage', 'APIWrapper', 'dataFormatting','$rootScope'];
    function accountData($http, $localStorage, APIWrapper, dataFormatting,$rootScope) {
        var service = {
            setAccountData: setAccountData,
            getAccountData: getAccountData,
            saveMyProfile: saveMyProfile,
            saveInsurancePlan: saveInsurancePlan,
            updateCardsList: updateCardsList            
        };
        return service;
        ///////////////////////////
        function setAccountData(accountData) {
            // console.log('we are in setData');
            // console.log('we need to save this');
            // console.log(accountData.profile);
            // console.log('we have in storage this:');
            // var t =$localStorage.getObject('account');
            // console.log(t.profile);
            $localStorage.setObject('account', accountData);
            _setHasNextFreeOilChange(accountData.nextFreeOilChange);
            // console.log('we saved in storage this:');
            // var z =$localStorage.getObject('account');
            // console.log(z);           
            // console.log(z.profile);      
            // console.log('/////////////////////////////');      
            // console.log($localStorage.getObject());      

        }
        function getAccountData() {
            return $localStorage.getObject('account');
        }
        function saveMyProfile(data) {            
            var _home = dataFormatting.phoneForAPI(data.home);
            var _mobile = dataFormatting.phoneForAPI(data.mobile);          
            var opt = {                       
                'address1':data.address1,
                'address2':data.address2,
                'city':data.city,
                'state':data.state,
                'zip':data.zip,
                'home':_home,
                'mobile':_mobile,
                'email':data.email            
            };            
            return APIWrapper.postProfile(opt).then(function (response) {
                 if (response.error == false && response.data.StatusCode == 100) {
                    var account = getAccountData();
                    account.profile = opt;                        
                    setAccountData(account);
                }
                return response;
            })
        }
        function saveInsurancePlan(data) {
            var _phoneForAPI = dataFormatting.phoneForAPI(data.agentPhone);
            var _expirationDateForAPI = dataFormatting.dateForAPI(data.expirationDate);                           
            var opt = {
                'insuranceCo': data.insuranceCo,
                'agentPhone': _phoneForAPI,
                'policyNo': data.policyNo,
                'expirationDate': _expirationDateForAPI
            };
            return APIWrapper.postInsurancePlanUpdate(opt).then(function (response) {
                if (response.error == false && response.data.StatusCode == 100) {
                    var account = getAccountData();
                    account.insuranceInfo = opt;                        
                    setAccountData(account);
                }
                return response;
            })
        }
        function updateCardsList(data) {
            var cards = [];            
            for (var prop in data) {
                var _expDateForAPI = dataFormatting.dateForAPI(data[prop].expDate, true);
                var _deleteVal = data[prop].deleteValue.toString();
                cards[prop] = {
                    seq: data[prop].seq,
                    expDate: _expDateForAPI,
                    delete: _deleteVal
                }
            }
            var opt = {
                'Cards': cards
            }            
            return APIWrapper.postUpdateCardsList(opt).then(function (response) {                
                return response;
            })
        }
        function _setHasNextFreeOilChange(data){
            if (data != null && data.date) {            
                $rootScope.hasNextFreeOilChange = true;                    
            }else {
                $rootScope.hasNextFreeOilChange = false;
            }            
        }

    }
})();