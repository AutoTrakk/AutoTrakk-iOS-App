(function() {
angular
    .module('autotrakk')
    .factory('createAccount',createAccount);
    createAccount.$inject = ['$http','APIWrapper'];
function createAccount($http,APIWrapper){
    var userInfo;
    var errorMsg;
    var accountContractInfo=accountContractInfo || [] ;

    var service = {
        check: check,
        verifyEmail:verifyEmail,
        getAccountContractInfo:getAccountContractInfo,
        setAccountContractInfo:setAccountContractInfo,
        getUserInfo:getUserInfo,
        checkAccount:checkAccount,

    }
    return service;
    function verifyEmail(data){
        var opt = {
                    "customerNo": data.customerNo,
                    "email": data.email
                }
        return APIWrapper.postUserVerifyEmail(opt);
    }
    function check(userInfoFormData){

            var one = setSSNtoString(userInfoFormData.ssnOne,3);
            var two = setSSNtoString(userInfoFormData.ssnTwo,2);
            var three = setSSNtoString(userInfoFormData.ssnThree.toString(),4);
            userInfoFormData.ssn = one.concat(two);
            userInfoFormData.ssn = userInfoFormData.ssn.concat(three);
         
            delete userInfoFormData.ssnOne;
            delete userInfoFormData.ssnTwo;
            delete userInfoFormData.ssnThree;
            setUserInfo(userInfoFormData);
        var opt = {
            "lastName":userInfoFormData.lastName,
            "ssn":userInfoFormData.ssn,
        }

        return APIWrapper.postUserVerify(opt)
            .then(userInfoComplete)                                    
    }
    function userInfoComplete(response) {
                return response;     
    }    
    //////////////////////////////
    function setSSNtoString(part, partMaxLength){
        var ssnPart = String(part)
        if(ssnPart.length < partMaxLength){
            while(ssnPart.length <partMaxLength){
                ssnPart = '0'+ssnPart;
            }
            return ssnPart;
        }else{
            return ssnPart;
        }
    }
    // This returns API and we are showing on Reg Step 2
    function getAccountContractInfo(){
        return accountContractInfo;
    }
    // This returns API and we are showing on Reg Step 2
    function setAccountContractInfo(data){
        if(data == false){
            accountContractInfo = [];    
        }else{
            accountContractInfo = data;    
        }        
    }
    function setUserInfo(data){
        userInfo = data;
    }
    function getUserInfo(){
        return userInfo;
    }
    function checkAccount(accountInfo,customerNo) {
            var opt = {
                "customerNo": customerNo,
                "email": accountInfo.email,
                "password": accountInfo.password,
            }
            return APIWrapper.postAccountVerify(opt)
                    .then(function(response){
                        return response;
                    });                    
        }

}
})();