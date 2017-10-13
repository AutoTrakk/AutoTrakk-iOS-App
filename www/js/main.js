// Ionic AutoTrakk App
angular.module('autotrakk', ['ionic', 'ngCordova', 'ngMessages', 'angularMoment']);
(function () {
    'use strict';
    angular.module('autotrakk')
        .constant('$ionicLoadingConfig', {
            template: 'Processing request'
        })
        .constant('serverTimeZone', 'http://somedomain.com')
        .run(['$ionicPlatform', '$rootScope', '$localStorage', '$state', 'connectivityMonitor', 'APIWrapper', '$cordovaGeolocation','$ionicHistory', function ($ionicPlatform, $rootScope, $localStorage, $state, connectivityMonitor, APIWrapper, $cordovaGeolocation,$ionicHistory) {                                
            $ionicPlatform.registerBackButtonAction(function (event) {                
                  
                    
                    event.preventDefault();
                    var currentStateName = $ionicHistory.currentStateName();
                    if($rootScope.userLoggedCheck == true){
                      
                        $state.go('mainMenu');
                    }else if(currentStateName == 'enterPin' || currentStateName == 'emailLogin' || currentStateName == 'install' ){
                       navigator.app.exitApp();                        
                    }
                                         
            }, 100);
            $ionicPlatform.ready(function () {                
                var posOptions = { timeout: 1000, enableHighAccuracy: false };
                $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                    }, function (err) {
                    });
                var checkInterentOffline = connectivityMonitor.checkIsOffline();
                //check internet vconnectio and get auth token
                
                if (checkInterentOffline == false) {                    
                    connectivityMonitor.init();                    
                    APIWrapper.fetchAuthToken();
                }
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                    // Don't remove this line unless you know what you are doing. It stops the viewport
                    // from snapping when text inputs are focused. Ionic handles this internally for
                    // a much nicer keyboard experience.
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
                window.addEventListener('native.keyboardshow', function () {
                    document.body.classList.add('keyboard-open');
                });
                // define what happpens when app goes to background
                document.addEventListener("pause", function () {
                    $rootScope.userLoggedCheck = false;
                }, false);
                // define what happpens when app come back from background
                document.addEventListener("resume", function () {                    
                    var firstTimeEver = $localStorage.get('firstTimeEver');
                    if (firstTimeEver == 'false') {                        
                        $state.go('loginMaster');
                    }
                }, false);
                $rootScope.userLoggedCheck = false;
                $rootScope.hideHeader = true;
                $rootScope.dropDownHide = true;
                $rootScope.hasNextFreeOilChange = false;
                var firstTimeEver = $localStorage.get('firstTimeEver');
                if (firstTimeEver == 'false') {

                    var credentials = $localStorage.get('credentials');
                    if (credentials !== undefined) {
                        // user login email or PIN                        
                        $state.go('loginMaster');
                    }
                    else {
                        // user don't have verifed account                        
                        $state.go('loginSelect');
                    }
                }
                else {
                    // this is first timerun after install
                    var neverLogWithPIN = $localStorage.getObject('neverLogWithPIN');
             
                    // set to false 'notShowCreatePin' if this is first run of app
                    if (neverLogWithPIN.usernames === undefined) {
                        $localStorage.setObject('neverLogWithPIN', { 'usernames': [] });
                
                    }
                    $state.go('install');
                }
            });

        }]);
})();
(function () {
    'use strict';
    angular.module('autotrakk')
        .config(autoTrakkConfig);
    autoTrakkConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider','$provide'];
    function autoTrakkConfig($stateProvider, $urlRouterProvider, $httpProvider,$provide) {
        $provide.decorator('$exceptionHandler',$exceptionHandlerConfig);
        $httpProvider.defaults.withCredentials = true;
        $urlRouterProvider.otherwise('/loginMaster');
        $stateProvider
            // create account
            .state('install', {
                url: '/install',
                templateUrl: 'app/app-install/app-install.html',
                controller: 'appInstallCtrl',
                controllerAs: 'appInstall',
                onEnter: function ($rootScope) {
                    $rootScope.hideHeader = false;
                    $rootScope.dropDownHide = false;
                }
            })                    
            .state('loginSelect', {
                cache: false,
                url: '/login-select',
                templateUrl: 'app/app-install/login-select.html',
                onEnter: function ($rootScope) {                    
                    $rootScope.dropDownHide = true;
                    $rootScope.hideHeader = false;                    
                }
            })
            .state('useUsernameLogin', {
                cache: false,
                url: '/use-username-login',
                controller: 'verifyAccountCtrl',
                controllerAs: 'verifyAccount',
                templateUrl: 'app/createAccount/verifyAccount/use-username-login.html'
            })                        
            .state('setNewUserPassOnPIN', {
                cache: false,
                url: '/set-new-user-pass-on-pin',
                controller: 'setNewUserPassOnPINCtrl',
                controllerAs: 'setNewUserPassOnPIN',
                templateUrl: 'app/createAccount/setNewUserPassOnPIN/setNewUserPassOnPIN.html'
            })
            .state('regStepOne', {
                cache: false,
                url: '/registration-step-1',
                controller: 'createAccountOneCtrl',
                controllerAs: 'createAccountOne',
                templateUrl: 'app/createAccount/step1/reg-step-1.html'
            })
            .state('regStepTwo', {
                cache: false,
                url: '/registration-step-2',
                controller: 'createAccountTwoCtrl',
                controllerAs: 'createAccountTwo',
                templateUrl: 'app/createAccount/step2/reg-step-2.html'
            })
            .state('regStepThree', {
                cache: false,
                url: '/registration-step-3',
                controller: 'createAccountThreeCtrl',
                controllerAs: 'createAccountThree',
                templateUrl: 'app/createAccount/step3/reg-step-3.html'
            })
            .state('errorAccount', {
                cache: false,
                url: '/error-account',
                controller: 'errorAccountCtrl',
                controllerAs: 'errorAccount',
                templateUrl: 'app/createAccount/errorAccount/error-account.html'
            })
            .state('loginMaster', {
                cache: false,
                url: '/login-master',
                controller: 'loginMasterCtrl',
                controllerAs: 'loginMaster'
            })
            // login pages
            .state('enterPin', {
                cache: false,
                url: '/enter-pin',
                controller: 'pinLoginCtrl',
                controllerAs: 'pinLogin',
                templateUrl: 'app/login/enterPIN/enter-pin.html',
                onEnter: function ($rootScope) {
                    $rootScope.hideHeader = true;
                }
            })
            .state('emailLogin', {
                cache: false,
                url: '/email-login',
                controller: 'emailLoginCtrl',
                controllerAs: 'emailLogin',
                templateUrl: 'app/login/emailLogin/email-login.html',
                onEnter: function ($rootScope) {
                    $rootScope.hideHeader = true;
                }
            })
            .state('logWithExistingAccount', {
                cache: false,
                url: '/log-with-existing-account',
                controller: 'emailLoginCtrl',
                controllerAs: 'emailLogin',
                templateUrl: 'app/login/emailLogin/log-with-existing-account.html',
                onEnter: function ($rootScope) {
                    $rootScope.hideHeader = true;
                }
            })
            .state('createPin', {
                cache: false,
                url: '/create-pin',
                controller: 'createPINCtrl',
                controllerAs: 'createPIN',
                templateUrl: 'app/login/createPIN/create-pin.html',
                onEnter: function ($rootScope) {
                    $rootScope.hideHeader = false;
                }
            })
            .state('alertNotice', {
                cache: false,
                url: '/alert-notice',
                controller: 'alertNoticeCtrl',
                controllerAs: 'alertNotice',
                templateUrl: 'app/login/alertNotice/alert-notice.html',
                onEnter: function ($rootScope) {
                    $rootScope.hideHeader = false;
                }
            })
            // free-oil-change
            .state('freeOilChangeOne', {
                cache: false,
                url: '/free-oil-change-1',
                controller: 'freeOilChangeCtrl',
                controllerAs: 'freeOilChange',
                templateUrl: 'app/freeOilChange/free-oil-change-1.html'
            })
            .state('freeOilChangeTwo', {
                cache: false,
                url: '/free-oil-change-2',
                controller: 'freeOilChangeMapCtrl',
                controllerAs: 'freeOilChangeMap',
                templateUrl: 'app/freeOilChange/free-oil-change-2.html'
            })
            .state('freeOilChangeThree', {
                cache: false,
                url: '/free-oil-change-3',
                controller: 'freeOilChangePONumberCtrl',
                controllerAs: 'freeOilChangePONumber',
                templateUrl: 'app/freeOilChange/free-oil-change-3.html'
            })
            // maintenance
            .state('maintenance', {
                cache: false,
                url: '/maintenance',
                controller: 'maintenanceCtrl',
                controllerAs: 'maintenance',
                templateUrl: 'app/maintenance/maintenance.html'
            })
            // make-a-payment
            .state('makeAPayment', {
                cache: false,
                url: '/make-a-payment',
                controller: 'makeAPaymentCtrl',
                controllerAs: 'makeAPayment',
                templateUrl: 'app/makeAPayment/makeAPayment/make-a-payment.html'
            })
            .state('paymentSummary', {
                cache: false,            
                url: '/payment-summary',
                controller: 'paymentSummaryCtrl',
                controllerAs: 'paymentSummary',
                templateUrl: 'app/makeAPayment/paymentSummary/payment-summary.html'
            })
            .state('paymentAmount', {       
                cache: false,        
                url: '/payment-amount',
                controller: 'paymentAmountCtrl',
                controllerAs: 'paymentAmount',
                templateUrl: 'app/makeAPayment/paymentAmount/payment-amount.html'
            })
            .state('payWithdebit', {        
                cache: false,    
                url: '/pay-with-debit',
                controller: 'payWithDebitCtrl',
                controllerAs: 'payWithDebit',
                templateUrl: 'app/makeAPayment/payWithDebit/pay-with-debit.html'
            })
            .state('paymentDeclined', {     
                cache: false,           
                url: '/payment-declined',
                controller: 'paymentDeclinedCtrl',
                controllerAs: 'paymentDeclined',
                templateUrl: 'app/makeAPayment/paymentDeclined/payment-declined.html'
            })
            .state('confirmPayment', {    
                cache: false,            
                url: '/confirm-payment',
                controller: 'confirmPaymentCtrl',
                controllerAs: 'confirmPayment',
                templateUrl: 'app/makeAPayment/confirmPayment/confirm-payment.html'
            })
            .state('paymentApproved', {   
                cache: false,             
                url: '/payment-approved',
                controller: 'paymentApprovedCtrl',
                controllerAs: 'paymentApproved',
                templateUrl: 'app/makeAPayment/paymentApproved/payment-approved.html'
            })
            .state('addCard', {       
                cache: false,         
                url: '/add-card',
                controller: 'addCardCtrl',
                controllerAs: 'addCard',
                templateUrl: 'app/makeAPayment/addCard/add-card.html'
            })
            .state('paymentActivity', {
                cache: false,                
                url: '/payment-activity',
                controller: 'paymentActivityCtrl',
                controllerAs: 'paymentActivity',
                templateUrl: 'app/makeAPayment/paymentActivity/payment-activity.html'
            })
            //mileage
            .state('mileage', {
                cache: false,
                url: '/mileage',
                controller: 'mileageCtrl',
                controllerAs: 'mileage',
                templateUrl: 'app/mileageCalc/mileage.html'
            })
            // report-an-accident
            .state('accidentReportOne', {
                cache: false,
                url: '/accident-report-1',
                controller: 'accidentReportOneCtrl',
                controllerAs: 'accidentReportOne',
                templateUrl: 'app/accidentReport/accident-report-1.html'
            })
            .state('accidentReportTwo', {
                cache: false,
                url: '/accident-report-2',
                controller: 'accidentReportTwoCtrl',
                controllerAs: 'accidentReportTwo',
                templateUrl: 'app/accidentReport/accident-report-2.html'
            })
            // My profile Tabs
            .state('myAccountTabs', {
                url: "/my-account",
                abstract: true,
                templateUrl: "app/myAccount/my-account-tabs.html"
            })
            .state('myAccountTabs.myProfile', {
                cache: false,
                url: "/my-profile",
                views: {
                    'myProfile': {
                        controller: 'myProfileCtrl',
                        controllerAs: 'myProfile',
                        templateUrl: "app/myAccount/myProfile/my-profile.html"
                    }
                }
            })
            .state('myAccountTabs.accountStatusEdit', {
                cache: false,
                url: "/account-status-edit",
                views: {
                    'accountStatusEdit': {
                        controller: 'accountStatusCtrl',
                        controllerAs: 'accountStatus',
                        templateUrl: "app/myAccount/accountStatus/account-status-edit.html"
                    }
                }
            })
            .state('myAccountTabs.vehicleInfo', {
                cache: false,
                url: "/vehicle-info",
                views: {
                    'vehicleInfo': {
                        controller: 'vehicleInfoCtrl',
                        controllerAs: 'vehicleInfo',
                        templateUrl: "app/myAccount/vehicleInfo/vehicle-info.html"
                    }
                }
            })
            .state('myAccountTabs.insuranceInfo', {
                cache: false,
                url: "/insurance-info",
                views: {
                    'insuranceInfo': {
                        controller: 'insuranceInfoCtrl',
                        controllerAs: 'insuranceInfo',
                        templateUrl: "app/myAccount/insurance-info/insurance-info.html"
                    }
                }
            })
            .state('myAccountTabs.bankInfoEdit', {
                cache: false,
                url: "/bank-info-edit",
                views: {
                    'bankInfoEdit': {
                        controller: 'bankInfoCtrl',
                        controllerAs: 'bankInfo',
                        templateUrl: "app/myAccount/bankInfo/bank-info-edit.html"
                    }
                }
            })
            .state('termsAndConditions', {
                url: '/termsandconditions',
                templateUrl: 'app/terms-conditions/terms-conditions.html',
                controller: 'termsConditionsCtrl',
                controllerAs: 'termsConditions',
            })
            .state('privacyPolicy', {
                cache: false,
                url: '/privacy-policy',                
                templateUrl: 'app/privacyPolicy/privacy-policy.html',
                controller: 'privacyPolicyCtrl',
                controllerAs: 'privacyPolicy',
            })
            // public pages
            .state('about', {
                cache: false,
                url: '/about',
                templateUrl: 'app/public/about.html'
            })
            .state('contact', {
                cache: false,
                url: '/contact',
                templateUrl: 'app/public/contact.html'
            })
            
            .state('mainMenu', {
                url: '/main-menu',
                controller: 'mainMenuCtrl',
                controllerAs: 'mainMenu',
                templateUrl: 'app/main-menu/main-menu.html',
                onEnter: function ($rootScope) {
                    $rootScope.hideHeader = false;
                }
            });
    }
    $exceptionHandlerConfig.$inject = ['$delegate','$log'];
    function $exceptionHandlerConfig($delegate,$log) {
        return function(exception, cause) {                          
            //$log.debug('Default exception handler.');
            $delegate(exception, cause);
        };
    }
})();

(function () {
    'use strict';
    angular.module('autotrakk')
        .controller('mainCtrl', mainCtrl);
    mainCtrl.$inject = ['$ionicPopover','$ionicPopup', '$scope', '$localStorage','$sessionStorage', '$state', '$rootScope','userLogin','$ionicHistory'];
    function mainCtrl($ionicPopover,$ionicPopup, $scope, $localStorage,$sessionStorage, $state, $rootScope,userLogin,$ionicHistory) {
        $ionicPopover.fromTemplateUrl('app/popover-menu/popover-menu.html', {
            scope: $scope,
        }).then(function (popover) {
            $scope.popover = popover;
        });
        $scope.logoutForm={
            eraseEverything: false
        };        
        $scope.confirmLogOut = function () {
            var confirmPopup = $ionicPopup.confirm({
                title:'Are you sure?',
                template:'<div class="row">'+
                            '<div class="col logoutPopUpBox">'+
                                '<div class="checkBoxWrapper">'+
                                    '<input type="checkbox" ng-model="logoutForm.eraseEverything" class="pullLeft" id="eraseEverything" name="eraseEverything">'+
                                    '<label for="eraseEverything">'+
                                '<i class="ion-checkmark checkmark "></i>'+
                            '</label>'+
                                '</div>'+                            
                                '<span class="fontSizeS clearApppDataMsg">Clear local app data</span>'+
                            '</div>'+
                        '</div>',  
                 scope: $scope              
            });                                        
            confirmPopup.then(function (res) {
                if (res) {
                    logOut();
                }
            });
        };
        // logout user and reset app        
        function logOut() {                
            $rootScope.userLoggedCheck = false;   
             
            var credentials = $localStorage.getObject('credentials');
            $localStorage.remove('account');      

            $sessionStorage.remove('token');
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });      
            if($scope.logoutForm.eraseEverything == false){                                
                if(credentials.pin){
                    $state.go('enterPin');
                }
                else {
                    $state.go('emailLogin');
                }                    
            }
            else {                    
                $localStorage.remove('credentials');
                userLogin.removeFromNeverLogWithPIN(credentials.email);                
                $scope.logoutForm = {
                    eraseEverything: false
                 }; 
                $state.go('loginSelect');
            }
        }
    }
})();
(function() {
angular
    .module('autotrakk')
    .factory('accidentReport',accidentReport);
    accidentReport.$inject =['$http','APIWrapper','dataFormatting']
    function accidentReport($http,APIWrapper,dataFormatting){

        var service={
            submitReport:submitReport
        }
        return service;
        ////////////////

        function submitReport(data){
            var accidentForm = data;          
            var accidentDate = dataFormatting.dateForAPI(accidentForm.date);
            var _phone = dataFormatting.phoneForAPI(accidentForm.adjusterPhone);
            var opt = {
                "date": accidentDate,
                "claimNumber": accidentForm.claimNumber,
                "insuranceCo": accidentForm.insuranceCo,
                "adjusterName": accidentForm.adjusterName,
                "adjusterPhone": _phone,
                "policeReport": accidentForm.policeReport
            }                
            return APIWrapper.postAccidentReport(opt)
                .then(function (response){
                     return response;
                });               
        }      
    }
})();
(function () {
    angular.module('autotrakk')
        .controller('accidentReportOneCtrl', accidentReportOneCtrl);
    accidentReportOneCtrl.$inject = ['$state', 'accidentReport', 'handlingErrors', '$ionicLoading'];
    function accidentReportOneCtrl($state, accidentReport, handlingErrors, $ionicLoading) {
        var vm = this;
        vm.form = [];
        vm.formSubmit = function (accidentReportForm) {
            if (accidentReportForm.$valid == true) {
                $ionicLoading.show();                
                accidentReport.submitReport(vm.form)
                    .then(function (response) {
                        $ionicLoading.hide();
                        if (response.error == false && response.data.StatusCode == 100) {
                            $state.go('accidentReportTwo');
                        } else {
                            handlingErrors.errorInRespone(response);
                        }
                    });
            }
        }
    }
})();
(function() {
    angular.module('autotrakk')
        .controller('accidentReportTwoCtrl', accidentReportTwoCtrl);
    //accidentReportTwoCtrl.$inject = ['accountData','dataFormatting']
    function accidentReportTwoCtrl() { //accountData,dataFormatting
        var vm = this;
        // var account = accountData.getAccountData();
        // var _phone = 'No phone number';        
        // if(account.profile.mobile.length>0 ){
        //     _phone = dataFormatting.phoneForHuman(account.profile.mobile);
        // }else if(account.profile.home.length>0) {
        //      _phone = dataFormatting.phoneForHuman(account.profile.home);
        // }else {
        //     _phone = 'No phone number';
        // }
        // vm.data = {
        //     'userPhone': _phone
        // }
    }
})();
(function () {
    angular.module('autotrakk')
        .controller('appInstallCtrl', appInstallCtrl);
    appInstallCtrl.$inject = ['$localStorage','$state','APIWrapper','$ionicLoading'];
    function appInstallCtrl($localStorage,$state,APIWrapper,$ionicLoading) {
        var vm = this;        
       
        /////////////////////////////////////     
        $ionicLoading.show();
        APIWrapper.getAppIntallContent().then(function(response){
           
            $ionicLoading.hide();            
            var tempHtml =  document.createElement('div');
            tempHtml.innerHTML = response.data;            
            var termsAndConditionsWrapper = document.getElementById('termsAndConditionsWrapper');
            termsAndConditionsWrapper.innerHTML = response.data;
            
        });
        
        vm.agreeInstall = function(){
            $localStorage.set('firstTimeEver',false);
            $state.go('loginSelect');
        }              
        vm.cancelInstall = function(){
            ionic.Platform.exitApp();            
        }              
    }
})();
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
(function() {
angular
    .module('autotrakk')
    .directive('moveNextOnMaxlength',moveNextOnMaxlength);

    function moveNextOnMaxlength(){
        var directive = {
            restrict: 'A',
            link: function($scope, element) {
                element.on("input", function(e) {
                    if(element.val().length == element.attr("maxlength")) {

                        var $nextElement = element.parent().next().children('.formInput');
                        if($nextElement.length) {
                            $nextElement[0].focus();
                        }else {
                            element[0].blur();
                        }
                    }
                });
            }
        }
        return directive;
    }
})();
(function() {
angular
    .module('autotrakk')
    .directive('onlyMaxLength',onlyMaxLength);

    function onlyMaxLength(){
        var directive = {
            restrict: 'A',
            link: function($scope, element) {
                element.on("input", function(e) {
                    if(element.val().length > element.attr("maxlength")) {
                        var sliced = element.val().substr(0,element.attr("maxlength"));
                        element.val(sliced)

                    }
                });
            }

        }
        return directive;
    }
})();
(function () {
    angular
        .module('autotrakk')
        .directive('phoneFormat', phoneFormatRule);
    function phoneFormatRule() {
        var directive = {
            require: 'ngModel',
            link: function (scope, elem, attr, ngModel) {

                ngModel.$parsers.unshift(function (value) {
                    var phoneNum = value;
                    var phoneError = false;
                        if (phoneNum.length ==0){
                            phoneError = true;
                        }
                        // else if (phoneNum.length == 8 && phoneNum.match((/-/g) || []).length < 2) {
                        //     phoneError = true;
                        // }
                        else if (phoneNum.length >= 12) {
                            phoneError = true;
                        } else {
                            phoneError = false;
                        }
                        ngModel.$setValidity('phoneformat', phoneError);
                    

                    return phoneNum;
                });
            }
        }
        return directive;
    }
})();
(function() {
angular
    .module('autotrakk')
    .directive('phoneMask',phoneMask);

function phoneMask(){
    var directive = {
        restrict: 'A',
        link: function($scope, element) {
            element.on("input", function(e) {
                var inputVal = element.val();
                var inputValLength = inputVal.length;
                if(inputValLength > 3  && inputValLength < 7){
                    if(inputVal.indexOf('-') === -1){
                        var newInputVal = inputVal.substring(0,3)+'-'+inputVal.substring(3);
                        element.val(newInputVal);
                    }
                }
                if(inputValLength > 7){
                    if(inputVal.indexOf('-',4) === -1){
                        var newInputVal = inputVal.substring(0,7)+'-'+inputVal.substring(7);
                        element.val(newInputVal);
                    }
                }
                if(element.val().length > 12) {
                    var sliced = element.val().substr(0,12);
                    element.val(sliced)

                }
            });
        }
    }
    return directive;
}
})();
(function () {
    angular.module('autotrakk')
        .controller('freeOilChangeCtrl', freeOilChangeCtrl);
    freeOilChangeCtrl.$inject = ['accountData', 'dataFormatting', 'freeOilChangeService', '$ionicLoading','handlingErrors','$state']
    function freeOilChangeCtrl(accountData, dataFormatting, freeOilChangeService, $ionicLoading,handlingErrors,$state) {
        var vm = this;
        var account = accountData.getAccountData();
        var _date  = '';
        if (account.nextFreeOilChange != null) {
            _date = dataFormatting.dateForHuman(account.nextFreeOilChange.date);
        }
        
        vm.nextOilChange = _date;

    }
})();
(function () {
    angular
        .module('autotrakk')
        .factory('freeOilChangeService', freeOilChangeService);
    freeOilChangeService.$inject = ['userLocation', 'APIWrapper'];
    function freeOilChangeService(userLocation, APIWrapper) {
        var service = {
            checkForNewLocations: checkForNewLocations,
            isMapCenterInRange: isMapCenterInRange,
            getServicesList: getServicesList,
            getServiceBrandList: getServiceBrandList
        }
        return service;
        ///////////////////////////////

        function checkForNewLocations(serviceMarkers, serviceLocations) {
            var newMarkers = [];
            for (var prop in serviceLocations) {
                var flag = false;
                var serviceLat = parseFloat(serviceLocations[prop].lat).toFixed(5);
                var serviceLng = parseFloat(serviceLocations[prop].long).toFixed(5);
                for (var i in serviceMarkers) {
                    var markerLat = serviceMarkers[i].getPosition().lat().toFixed(5);
                    var markerLng = serviceMarkers[i].getPosition().lng().toFixed(5);
                    if (serviceLat == markerLng && serviceLng == markerLng) {
                        flag = true;
                    }
                }
                if (flag == false) {
                    newMarkers.push(serviceLocations[prop]);
                }
            }
            return newMarkers;
        }
        function isMapCenterInRange(distanceFromMyLocation, radius) {
            var METERS_PER_MILE = 1609.344;
            if (distanceFromMyLocation > (radius * METERS_PER_MILE)) {
                return false;
            } else {
                return true;
            }
        }
        function getServicesList(lat, long, radius) {
            var opt = {
                'lat': lat,
                'long': long,
                'radius': radius
            }
            return APIWrapper.postServiceLocation(opt);
        }
        function getServiceBrandList() {
            var radius = 100;
            return userLocation.getUserLocation().then(function (response) {
                if (response.error == false) {
                    var lat = response.location.lat;
                    var long = response.location.long;
                    return getServicesList(lat, long, radius).then(function (response) {
                        if (response.error == false && response.data.StatusCode == 100) {                            
                            var servicesList = response.data.Results;                            
                            brandList = _makeABrandList(servicesList);
                            var data = {
                                'error': false,
                                'brandList': brandList
                            }
                            return data;
                        } else {
                            return response;
                        }
                    });
                } else {
                    return response;
                }
            });
        }
        function _makeABrandList(servicesList) {
            var brandList = [];
            for (var prop in servicesList) {
                var flag = false;
                for (var i in brandList) {
                    if (brandList[i] == servicesList[prop].brand) {
                        flag = true;
                    }
                }
                if (flag == false) {
                    brandList.push(servicesList[prop].brand)
                }
            }
            return brandList;
        }
    }

})();
// (function () {
//     angular.module('autotrakk')
//         .controller('freeOilChangeMapCtrl', freeOilChangeMapCtrl);
//     freeOilChangeMapCtrl.$inject = ['$cordovaGeolocation', '$scope', '$state', 'handlingErrors', '$ionicLoading', 'APIWrapper', 'freeOilChangeService'];
//     function freeOilChangeMapCtrl($cordovaGeolocation, $scope, $state, handlingErrors, $ionicLoading, APIWrapper, freeOilChangeService) {
//         var options = { timeout: 10000, enableHighAccuracy: true };
//         $ionicLoading.show();
//         $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
//             //$ionicLoading.hide();
//             // var myLocation = {
//             //     'lat': position.coords.latitude.toFixed(5),
//             //     'long': position.coords.longitude.toFixed(5)
//             // }            
//             var myLocation = {
//                 'lat': '41.259328',
//                 'long': '-76.949801'
//             }
//             var radius = 100;
//             var opt = {
//                 'lat': myLocation.lat,
//                 'long': myLocation.long,
//                 'radius': radius
//             };

//             var myLocationImage = 'img/my_location.png';
//             var latLng = new google.maps.LatLng(myLocation.lat, myLocation.long);
//             var mapOptions = {
//                 center: latLng,
//                 zoom: 8,
//                 disableDefaultUI: true,
//                 zoomControl: true,
//                 mapTypeId: google.maps.MapTypeId.ROADMAP,
//                 minZoom: 5,
//                 maxZoom: 15
//             };

//             // create map
//             $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
//             // set pin for user location
//             var myLocationMarker = new google.maps.Marker({
//                 position: new google.maps.LatLng(myLocation.lat, myLocation.long),
//                 icon: myLocationImage,
//                 map: $scope.map,

//             });
//             // set text for user location popup
//             myLocationMarker.info = new google.maps.InfoWindow({
//                 content: 'Your Location'
//             });
//             // get service locations first time

//             APIWrapper.postServiceLocation(opt).then(function (response) {
//                 $ionicLoading.hide();
//                 if (response.error == false && response.data.StatusCode == 100) {
//                     var serviceLocations = response.data.Results;
//                     var markers = [];
//                     if (serviceLocations == null) {
//                         // no services in area
//                         handlingErrors.showError('There is no service in your area');
//                     }
//                     else {                    
//                         var serviceMarkers = []; // all service markers/pin are stored in this array
//                         drawMarkers(serviceLocations, serviceMarkers);
                        
//                     }
//                     google.maps.event.addListener(myLocationMarker, 'click', function () {
//                         if (serviceLocations != null) {
//                             for (var i in serviceMarkers) {
//                                 serviceMarkers[i].info.close();
//                             }
//                         }
//                         myLocationMarker.info.open($scope.map, this);
//                     });
//                     var radiusStep = 1;  // after map idle state we will multiple radius with this step if distance is bigger
//                     google.maps.event.addListener($scope.map, 'idle', function () {
//                         var newCenter = $scope.map.getCenter();
//                         var distanceFromMyLocation = google.maps.geometry.spherical.computeDistanceBetween(newCenter, myLocationMarker.getPosition());
//                         var isMapCenterInRange = freeOilChangeService.isMapCenterInRange(distanceFromMyLocation, radius * radiusStep);
//                         if (isMapCenterInRange == false) {
//                             $ionicLoading.show();
//                             ++radiusStep;                          
//                             var newCenterLat = newCenter.lat().toFixed(5);
//                             var newCenterLng = newCenter.lng().toFixed(5);                        
//                             var newOpt = {
//                                 'lat': newCenterLat,
//                                 'long': newCenterLng,
//                                 'radius': radius * radiusStep
//                             };
//                             APIWrapper.postServiceLocation(newOpt).then(function (response) {
//                                 $ionicLoading.hide();
//                                 if (response.error == false && response.data.StatusCode == 100) {
//                                     var serviceLocations = response.data.Results;
//                                     if (serviceLocations == null) {
//                                         handlingErrors.showError('There is no service in this area');
//                                     } else {
//                                         // create array of services
//                                         var newServiceLocations = freeOilChangeService.checkForNewLocations(serviceMarkers, serviceLocations);                                        
//                                         drawMarkers(serviceLocations, serviceMarkers);
//                                     }
//                                 } else {
//                                     if (response.type == 'api') {
//                                         handlingErrors.showError(response.data.StatusMessage);
//                                     }
//                                 }                               
//                             });
//                         }
//                     });
//                 }
//                 else {
//                     if (response.type == 'api') {
//                         handlingErrors.showError(response.data.StatusMessage);
//                     }
//                 }
//             });

//         }, function (error) {
//             $ionicLoading.hide();
//             handlingErrors.showError('Please enable your location');
//             $state.go('freeOilChangeOne');
//         });

//         function drawMarkers(serviceLocations, serviceMarkers) {
//             var serviceMarkersLength = parseInt(serviceMarkers.length);
//             for (var prop in serviceLocations) {
//                 var mark = {
//                     "title": serviceLocations[prop].brand + ',' + serviceLocations[prop].address,
//                     "lat": parseFloat(serviceLocations[prop].lat).toFixed(5),
//                     "lng": parseFloat(serviceLocations[prop].long).toFixed(5)
//                 }
//                 var markPos = new google.maps.LatLng(mark.lat, mark.lng);
//                 var serviceMarkersProp = serviceMarkersLength + parseInt(prop);
//                 serviceMarkers[serviceMarkersProp] = new google.maps.Marker({
//                     map: $scope.map,
//                     position: markPos
//                 });
//                 serviceMarkers[serviceMarkersProp].info = new google.maps.InfoWindow({
//                     content: mark.title
//                 });
//                 google.maps.event.addListener(serviceMarkers[serviceMarkersProp], 'click', function () {
//                     for (var i in serviceMarkers) {
//                         serviceMarkers[i].info.close();
//                     }
//                     myLocationMarker.info.close();
//                     this.info.open($scope.map, this);
//                 });
//             }
//         }
//     }
// })();
(function () {
    angular.module('autotrakk')
        .controller('freeOilChangeMapCtrl', freeOilChangeMapCtrl);
    freeOilChangeMapCtrl.$inject = ['$scope', '$state', 'handlingErrors', '$ionicLoading', 'freeOilChangeService', 'userLocation'];
    function freeOilChangeMapCtrl($scope, $state, handlingErrors, $ionicLoading, freeOilChangeService, userLocation) {
        var options = { timeout: 10000, enableHighAccuracy: true };
        $ionicLoading.show();
        userLocation.getUserLocation().then(function (response) {
            if (response.error == false) {
                $ionicLoading.hide();
                var myLocation = {
                    'lat': response.location.lat,
                    'long': response.location.long
                }
                // var myLocation = {
                //     'lat': '41.259328',
                //     'long': '-76.949801'
                // }
                var radius = 100;
                var opt = {
                    'lat': myLocation.lat,
                    'long': myLocation.long,
                    'radius': radius
                };

                var myLocationImage = 'img/my_location.png';
                var latLng = new google.maps.LatLng(myLocation.lat, myLocation.long);
                var mapOptions = {
                    center: latLng,
                    zoom: 10,
                    disableDefaultUI: true,
                    zoomControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    minZoom: 5,
                    maxZoom: 15
                };

                // create map
                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                // set pin for user location
                var myLocationMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(myLocation.lat, myLocation.long),
                    icon: myLocationImage,
                    map: $scope.map,

                });
                // set text for user location popup
                myLocationMarker.info = new google.maps.InfoWindow({
                    content: 'Your Location'
                });

                freeOilChangeService.getServicesList(myLocation.lat, myLocation.long, radius).then(function (response) {
                    $ionicLoading.hide();
                    if (response.error == false && response.data.StatusCode == 100) {
                        var serviceLocations = response.data.Results;
                        var markers = [];
                        if (serviceLocations == null) {
                            // no services in area
                            handlingErrors.showError('There is no service in your area');
                        }
                        else {
                            var serviceMarkers = []; // all service markers/pin are stored in this array
                            drawMarkers(serviceLocations, serviceMarkers);

                        }
                        google.maps.event.addListener(myLocationMarker, 'click', function () {
                            if (serviceLocations != null) {
                                for (var i in serviceMarkers) {
                                    serviceMarkers[i].info.close();
                                }
                            }
                            myLocationMarker.info.open($scope.map, this);
                        });
                        var radiusStep = 1;  // after map idle state we will multiple radius with this step if distance is bigger
                        google.maps.event.addListener($scope.map, 'idle', function () {
                            var newCenter = $scope.map.getCenter();
                            var distanceFromMyLocation = google.maps.geometry.spherical.computeDistanceBetween(newCenter, myLocationMarker.getPosition());
                            var isMapCenterInRange = freeOilChangeService.isMapCenterInRange(distanceFromMyLocation, radius * radiusStep);
                            if (isMapCenterInRange == false) {
                                $ionicLoading.show();
                                ++radiusStep;
                                freeOilChangeService.getServicesList(myLocation.lat, myLocation.long, radius * radiusStep).then(function (response) {
                                    $ionicLoading.hide();
                                    if (response.error == false && response.data.StatusCode == 100) {
                                        var serviceLocations = response.data.Results;
                                        if (serviceLocations == null) {
                                            handlingErrors.showError('There is no service in this area');
                                        } else {
                                            // create array of services
                                            var newServiceLocations = freeOilChangeService.checkForNewLocations(serviceMarkers, serviceLocations);
                                            drawMarkers(serviceLocations, serviceMarkers);
                                        }
                                    } else {
                                        handlingErrors.errorInRespone(response);
                                    }
                                });
                            }
                        });
                    }
                    else {
                        handlingErrors.errorInRespone(response);
                    }
                });
                function drawMarkers(serviceLocations, serviceMarkers) {
                    var serviceMarkersLength = parseInt(serviceMarkers.length);
                    for (var prop in serviceLocations) {
                        var mark = {
                            "title": serviceLocations[prop].brand + ',' + serviceLocations[prop].address,
                            "lat": parseFloat(serviceLocations[prop].lat).toFixed(5),
                            "lng": parseFloat(serviceLocations[prop].long).toFixed(5)
                        }
                        var markPos = new google.maps.LatLng(mark.lat, mark.lng);
                        var serviceMarkersProp = serviceMarkersLength + parseInt(prop);
                        serviceMarkers[serviceMarkersProp] = new google.maps.Marker({
                            map: $scope.map,
                            position: markPos
                        });
                        serviceMarkers[serviceMarkersProp].info = new google.maps.InfoWindow({
                            content: mark.title+'<br/><a class="btn button-block btnCancel text-center" href="http://maps.google.com/maps?saddr='+myLocation.lat+','+myLocation.long+'&daddr='+mark.lat+','+mark.lng+'" >Open in Maps</a>'
                        });

                        google.maps.event.addListener(serviceMarkers[serviceMarkersProp], 'click', function () {
                            for (var i in serviceMarkers) {
                                serviceMarkers[i].info.close();
                            }
                            myLocationMarker.info.close();
                            this.info.open($scope.map, this);
                        });
                    }
                }
            } else {
                $ionicLoading.hide();
                handlingErrors.errorInRespone(response);
                $state.go('freeOilChangeOne');
            }

        });

    }
})();
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
(function () {
    angular
        .module('autotrakk')
        .factory('userLogin', userLogin);
    userLogin.$inject = ['APIWrapper', '$sessionStorage', '$localStorage','$rootScope', '$state', 'accountData','userLocation','handlingErrors'];
    function userLogin(APIWrapper, $sessionStorage, $localStorage,$rootScope, $state,accountData,userLocation,handlingErrors) {
        var opt = {};
        var service = {
            logInUser: logInUser,
            editNewPIN: editNewPIN,
            removeFromNeverLogWithPIN:removeFromNeverLogWithPIN,
            getUserCredentials:getUserCredentials
        }
        return service;
        /////////////
        function getUserCredentials(){
            return opt;
        }
        function logInUser(data) {
            opt = {
                "email": data.email,
                "password": data.password
            }
            return APIWrapper.postUserLogin(opt)
                .then(function (response) {
                    if (response.error == false && response.data.StatusCode == 100) {
                        var accountJSON = response.data.Results;
                                              
                        accountData.setAccountData(accountJSON);
                        
                        sendUserLocation();                                              
                        return response;                            
                        // return sendUserLocation().then(function (response) {                       
                        //     if (response.error == false && response.data.StatusCode == 100) {
                        //         accountData.setAccountData(accountJSON);    
                        //         return true;
                        //     } else {                            
                        //         return response;
                        //     }
                        // });
                    } else {
                        return response;
                    }
                })
        }
        function editNewPIN() {
            $rootScope.userLoggedCheck = false;
            var credentials =  $localStorage.getObject('credentials');
            removeFromNeverLogWithPIN(credentials.email);
            $sessionStorage.remove('token');
            $localStorage.remove('account');
            $localStorage.remove('credentials');
            $state.go('emailLogin');
        }
        function removeFromNeverLogWithPIN(username){
            var _username = username;
            var neverLogWithPIN = $localStorage.getObject('neverLogWithPIN');
            var userIndex;   
            for (var prop in neverLogWithPIN.usernames) {
                var storedUsername = neverLogWithPIN.usernames[prop];
                if (storedUsername == _username) {
                    userIndex = prop;                                    
                }
            }
            //console.log('before');
            //console.log(neverLogWithPIN.usernames);
            neverLogWithPIN.usernames.splice(userIndex,1);
            //console.log('after');
            //console.log(neverLogWithPIN.usernames);
            //console.log('saving');
            $localStorage.setObject('neverLogWithPIN',neverLogWithPIN);
            //console.log('after saving');
            //var t= $localStorage.getObject('neverLogWithPIN')
            //console.log(t);
            //console.log(t.usernames);
        }
        // Private //
        function sendUserLocation() {
             userLocation.getUserLocation().then(function (response) {
                if (response.error == false) {
                     APIWrapper.postUserLocation(response.location).then(function (response) {
                         console.log('sending location error');
                         if (response.error == false && response.data.StatusCode == 100) {
                            console.log("User location is sent"); 
                         }else {
                            console.log("Can't send user location from device to server"); 
                         }
                         console.log(response);                       
                    });
                }else {       
                    console.log("Can't get user location from device");             
                                       
                }
                // if (response.error == false) {
                //     return APIWrapper.postUserLocation(response.location).then(function (response) {
                //         return response;
                //     });
                // }else {
                //     return response;
                // }

            });
        }
    }
})();



(function () {
    angular
        .module('autotrakk')
        .controller('loginMasterCtrl', loginMasterCtrl);
    loginMasterCtrl.$inject = ['$state', '$localStorage', '$timeout'];
    function loginMasterCtrl($state, $localStorage, $timeout) {
        var credentialsRaw = $localStorage.getObject('credentials');
                 
        if (Object.keys(credentialsRaw).length != 0) {
            if (credentialsRaw.pin) {
                $state.go('enterPin');
            }
            else {
                $state.go('emailLogin');
            }
        }else {            
            $state.go('loginSelect');
        }
    }
})();
(function(){
    angular.module('autotrakk')
        .controller('mainMenuCtrl', mainMenuCtrl);
    function mainMenuCtrl() {
        var vm = this;               
        vm.year = new Date().getFullYear();
    }
})();
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
(function(){
    angular.module('autotrakk')
        .controller('mileageCtrl', mileageCtrl);
    function mileageCtrl() {
        var vm = this;
        vm.sum = 0;
        vm.minRequiredError = false
        vm.calc = []

        ////////////////////////
        
        vm.minRequired = function(){
            if(parseFloat(vm.calc.ending) < parseFloat(vm.calc.starting)){
                vm.minRequiredError = true;
            }else {
                vm.minRequiredError = false;
            }
        }
        vm.submitCalc = function(form){
            vm.minRequired()
            if((form.$valid == true) &&  vm.minRequiredError == false){
                vm.sum = (vm.calc.ending-vm.calc.starting) / vm.calc.gasUsed;
            }           
        }
    }
})();
(function(){
    angular.module('autotrakk')
        .controller('privacyPolicyCtrl', privacyPolicyCtrl);
    privacyPolicyCtrl.$inject = ['APIWrapper','$ionicLoading']
    function privacyPolicyCtrl(APIWrapper,$ionicLoading) {
        var vm = this;               
        $ionicLoading.show();
        APIWrapper.getPrivacyPolicy().then(function(response){
            $ionicLoading.hide();            
            var tempHtml =  document.createElement('div');
            tempHtml.innerHTML = response.data;            
            var privacyPolicyContent = document.getElementById('privacyPolicyContent');
            privacyPolicyContent.innerHTML = response.data;
        });
    }
})();
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
(function () {
    angular
        .module('autotrakk')
        .factory('APIWrapper', APIWrapper);
    APIWrapper.$inject = ['$http', '$sessionStorage', '$ionicLoading', 'handlingErrors', '$timeout', 'userLocation', '$localStorage'];
    function APIWrapper($http, $sessionStorage, $ionicLoading, handlingErrors, $timeout, userLocation, $localStorage) {
        //var apiEndPointUrl = 'https://devsecure.autotrakk.com/api/index.php';
        //var apiEndPointUrl = 'https://api.autotrakk.com/api/index.php';
        var apiEndPointUrl = 'http://api.autotrakk.local/API/index.php';
        //var apiEndPointUrl = '/api/';        
        var service = {
            fetchAuthToken: fetchAuthToken,
            postUserVerify: postUserVerify,
            postUserVerifyEmail: postUserVerifyEmail,
            postAccountVerify: postAccountVerify,
            postUserLogin: postUserLogin,
            postProfile: postProfile,
            postInsurancePlanUpdate: postInsurancePlanUpdate,
            postUpdateCardsList: postUpdateCardsList,
            postAccidentReport: postAccidentReport,
            postUserLocation: postUserLocation,
            postServiceLocation: postServiceLocation,
            postPaymentQuery: postPaymentQuery,
            postPaymentWithStoredCard: postPaymentWithStoredCard,
            postPaymentWithNewCard: postPaymentWithNewCard,
            getPrivacyPolicy: getPrivacyPolicy,
            getAppIntallContent:getAppIntallContent,
            _makeAPIcall:_makeAPIcall
        }
        return service;
        ////////////////////////////////////
        //  Public  //
        ///////////////////////////////////
        // ***App Login*** //   
        function fetchAuthToken() {                    
            _authToken();
        }
        // ***Create User Account*** //
        // Create Account Step 1
        function postUserVerify(params) {
            var _params = params;
            var _url = apiEndPointUrl + '/user/verify';
            var _method = 'post';
            var _withResults = true;
            return _makeAPIcall(_method, _url, _params,_withResults).then(function (response) {
                return response;
            });
        }

        // Create Account Step 3    
        function postUserVerifyEmail(params) {
            var _params = params;
            var _url = apiEndPointUrl + '/user/verify-email';
            var _method = 'post';
            var _withResults = false;
            return _makeAPIcall(_method, _url, _params,_withResults).then(function (response) {
                return response;
            });
        }
        // ***Account Verify*** //
        function postAccountVerify(params) {
            var _params = params;
            var _url = apiEndPointUrl + '/user/verify-existing-account';
            var _method = 'post';
            var _withResults = false;
            return _makeAPIcall(_method, _url, _params,_withResults).then(function (response) {
                return response;
            });
        }
        // ***User Login*** //
        function postUserLogin(params) {
            var _params = params;
            var _url = apiEndPointUrl + '/user/login';
            var _method = 'post';
            var _withResults = true;
            //console.log('we are sending to API');
            //console.log(_params);
            return _makeAPIcall(_method, _url, _params,_withResults).then(function (response) {                
                //console.log('API returns this');
                //console.log(response.data.Results.profile);                
               // console.log(response.data.Results.profile.email);                
                return response;

            });
        }
        // *** update Profile *** //
        function postProfile(params) {
            var _params = params;
            var _url = apiEndPointUrl + '/profile';
            var _method = 'post';
            var _withResults = true;
            return _makeAPIcall(_method, _url, _params,_withResults).then(function (response) {
                return response;
            });
        }
        // *** Update Insurance Plan *** //
        function postInsurancePlanUpdate(params) {
            var _params = params;
            var _url = apiEndPointUrl + '/insurance-info';
            var _method = 'post';
            var _withResults = false;
            return _makeAPIcall(_method, _url, _params,_withResults).then(function (response) {
                return response;
            });
        }
        // *** Update Bank Info - Cards List *** //
        function postUpdateCardsList(params) {
            var _params = params;
            //console.log(_params);
            var _url = apiEndPointUrl + '/card-list';
            var _method = 'post';
            var _withResults = false;
            // console.log('Before http:');    
            // console.log(_url);    
            // console.log('data:');                 
            // for(var prop in _params.Cards){
            //     console.log(_params.Cards[prop]);
            // }
            return _makeAPIcall(_method, _url, _params,_withResults).then(function (response) {
                return response;
            });
        }
        // *** Accident Repost *** //
        function postAccidentReport(params) {
            var _params = params;
            var _url = apiEndPointUrl + '/accident-report';
            var _method = 'post';
            var _withResults = false;
            return _makeAPIcall(_method, _url, _params,_withResults).then(function (response) {
                return response;
            });
        }
        // *** Post User Location *** //
        function postUserLocation(params) {
            var _params = params;
            var _url = apiEndPointUrl + '/location';
            var _method = 'post';
            var _withResults = false;
            return _makeAPIcall(_method, _url, _params,_withResults).then(function (response) {
                return response;
            });
        }
        // *** POST MONRO LOCATION ***  //
        // manroAPI - return response null if no services in area
        function postServiceLocation(params) {
            var _params = params;
            var _url = apiEndPointUrl + '/monro';
            var _method = 'post';
            var _withResults = true;
            return _makeAPIcall(_method, _url, _params,_withResults).then(function (response) {
                return response;
            });
        }
        // ** Make a Payment - Query ** //
        function postPaymentQuery(params) {
            var _params = params;
            var _url = apiEndPointUrl + '/submit-payment/query';
            var _method = 'post';
            var _withResults = true;
            return _makeAPIcall(_method, _url, _params,_withResults).then(function (response) {
                return response;
            });
        }
        // ** Make a Payment - Pay with stored card ** //
        function postPaymentWithStoredCard(params) {
            var _params = params;
            var _url = apiEndPointUrl + '/submit-payment/stored';
            var _method = 'post';
            var _withResults = true;
            return _makeAPIcall(_method, _url, _params,_withResults).then(function (response) {
                return response;
            });
        }
        // ** Make a Payment - Pay with new card ** //
        function postPaymentWithNewCard(params) {
            var _params = params;
            var _url = apiEndPointUrl + '/submit-payment/new';
            var _method = 'post';
            var _withResults = true;
            console.log(params.save);
            return _makeAPIcall(_method, _url, _params,_withResults).then(function (response) {
                return response;
            });
        }
        
        function getPrivacyPolicy() {
            var _params = '';
            var _url = apiEndPointUrl + '/privacypolicy?portfolio=001';
            var _method = 'get';
            var _withResults = false;              
            return _makeAPIcall(_method, _url, _params,_withResults).then(function (response) {
                return response;
            });
        }
        function getAppIntallContent() {
            var _params = '';
            var _url = apiEndPointUrl + '/disclaimer?portfolio=001';
            var _method = 'get';
            var _withResults = false;              
            return _makeAPIcall(_method, _url, _params,_withResults).then(function (response) {

                return response;
            });
        }
        ////////////////////////////////////
        //  Private  //
        ///////////////////////////////////    
        // get auth token and store in SessionStorage
        function _authToken() {
            var auth_token = _getTokenFromSession();
            if (auth_token.token === undefined || auth_token.expTime < Date.now()) {
                var url = apiEndPointUrl + '/authenticate?portfolio=001&db=1';
                var username = 'API_TOKEN';
                var password = 'XJX982HXF392JDXJD98XJS8XD83GXH92XHF8X';
                var encodedRes = btoa(username + ':' + password);
                $ionicLoading.show();
                $http.defaults.headers.common.Authorization = 'Basic ' + encodedRes;
                return $http.get(url)
                    .then(function (response) {
                        $ionicLoading.hide();
                        return handlingErrors.errorFromServer(response);
                    })
                    .catch(function response(response) {
                        if ((response.data.StatusCode == 100)) {
                            var token = response.data.Token;
                            var expTime = Date.now() + 45 * 60000;
                            var opt = {
                                'token': token,
                                'expTime': expTime
                            }
                            $sessionStorage.setObject('auth_token', opt);
                            if (auth_token.expTime < Date.now()) {
                                return _loginUserAgain().then(function (response) {
                                    if (response.error == false) {
                                        return token;
                                    } else {
                                        return response;
                                    }

                                });
                            } else {
                                $ionicLoading.hide();
                                return token;
                            }

                        } else {
                            $ionicLoading.hide();
                            return handlingErrors.errorFromServer(response);
                        }

                    });
            } else {
                return $timeout(function () {
                    return auth_token.token
                }, 500);
            }
        }
        // Auto login user with credentials stored in localStorage when new token is obtain
        function _loginUserAgain() {
            var localCredentials = $localStorage.getObject('credentials');
            data = {
                'email': localCredentials.email,
                'password': localCredentials.password
            }
            return postUserLogin(data).then(function (response) {
                if (response.error == false && response.data.StatusCode == 100) {
                    var accountJSON = response.data.Results;
                    return userLocation.getUserLocation().then(function (response) {
                        if (response.error == false) {
                            return postUserLocation(response.location).then(function (response) {
                                if (response.error == false && response.data.StatusCode == 100) {
                                    $localStorage.setObject('account', accountJSON);
                                    return response;
                                } else {
                                    return response;
                                }
                            });
                        }
                        else {
                            return response;
                        }
                    });
                } else {
                    return response;
                }
            });
        }
        // prepare for API call
        function _makeAPIcall(method, url, params,withResults) {
            var _method = method;
            var _url = url;
            var _params = params;
            var _withResults = withResults;                 
            return _authToken().then(function (response) {
                if (response.error === undefined) {
                    var _token = response;
                    $http.defaults.headers.common.Authorization = 'Bearer token: ' + _token;
                    if (_method == 'get') {                                        
                        return $http.get(_url, { params: _params })
                            .then(function (response) {   
                                                           
                                return _apiCallSuccess(response, _url,_withResults);
                            })
                            .catch(function (response) {   
                                                                                                                     
                                return _apiCallFail(response, _url)
                            });
                    } else {
                        return $http.post(_url, _params)
                            .then(function (response) {
                                return _apiCallSuccess(response, _url,_withResults);
                            })
                            .catch(function (response) {                                 
                                return _apiCallFail(response, _url)
                            });
                    }
                } else {
                    return response;
                }

            });

        }
        // API CALL SUCCESS
        function _apiCallSuccess(response, url,withResults) {
            var _withResults = withResults;            
            response.error = false;
            // manroAPI - return response null if no services in area
            var monroAPIurl =apiEndPointUrl+ '/monro';         
            var privacyPolicyAPIurl =apiEndPointUrl+ '/privacypolicy?portfolio=001';         
            var disclaimerAPIurl =apiEndPointUrl+ '/disclaimer?portfolio=001';         
            if (response.data == null) {
                console.log('service locations');
                return handlingErrors.errorFromAPI(response);
            }
            else if(url == privacyPolicyAPIurl || url == disclaimerAPIurl){
                return response;
            }
             else {
                if (response.data.StatusCode == 100) {
                    if (_withResults == true && url != monroAPIurl) {                                             
                        try {
                            if(response.data.Results === null || typeof response.data.Results !== 'object') throw 'API returned invalid response.data.Results';
                        } catch (e) {
                            console.log(e); 
                            console.log(url); 

                            var error = {
                                apiUrl: url,
                                data: {
                                    StatusCode: '000',
                                    StatusMessage: 'Server error, please try again.'
                                },
                                extraMessage: e,
                            }
                            return handlingErrors.errorFromAPI(error);;
                        }
                        return response;
                    } else {
                        return response;
                    }

                } else {                   
                    return handlingErrors.errorFromAPI(response);                                  
                }
            }

        }
        // API CALL FAIL
        function _apiCallFail(response, url) {      
            console.log('_apiCallFail');      
            console.log(url);      
            console.log(response);      
            response.apiUrl = url;            
            return handlingErrors.errorFromServer(response);
        }
        // Get auth token stored in SessionStorage    
        function _getTokenFromSession() {
            return $sessionStorage.getObject('auth_token');
        }
    }
})();
(function () {
    angular
        .module('autotrakk')
        .factory('connectivityMonitor', connectivityMonitor)
    connectivityMonitor.$inject = ['$cordovaNetwork', '$ionicPopup', '$rootScope']
    function connectivityMonitor($cordovaNetwork, $ionicPopup, $rootScope) {
        var service = {
            init: init,
            checkIsOffline:checkIsOffline
        }
        return service;
        function init() {             
            var type = $cordovaNetwork.getNetwork();                                                    
            // listen for Offline event
            $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                $ionicPopup.alert({
                    title: 'You lost internet connection',
                    template: ''
                }).then(function(responde){
                    ionic.Platform.exitApp();
                })
                var offlineState = networkState;
            });           
        }
        function checkIsOffline() {
            var isOffline = $cordovaNetwork.isOffline()
            if (isOffline == true) {
                $ionicPopup.alert({
                    title: "Internet Disconnected",
                    content: "The internet is disconnected on your device."
                }).then(function(responde){
                    ionic.Platform.exitApp();
                });
                return true;    
            }else{
                return false;
            }
            
        }
    }
})();
(function () {
    angular
        .module('autotrakk')
        .factory('dataFormatting', dataFormatting);      
    function dataFormatting(moment) {        
        //var LOCAL_TIMEZONE = moment.tz.guess();              
        var service = {
            phoneForHuman: phoneForHuman,
            phoneForAPI: phoneForAPI,
            dateForHuman: dateForHuman,
            dateForAPI: dateForAPI
        };
        return service;
        ///////////////////////////
        
        function phoneForHuman(phone) {
            if (phone) {
                var _phone = phone || '';
                var _forHuman;
                if (_phone.length > 3) {
                    _forHuman = _phone.substr(0, 3) + '-' + _phone.substr(3);
                    if (_forHuman.length > 8) {
                        _forHuman = _forHuman.substr(0, 7) + '-' + _forHuman.substr(7);
                    }
                }
                return _forHuman;
            } else {
                return '';
            }
        }
        function phoneForAPI(phone) {
            var _phone = phone || '';
            var _forAPI;
            if (_phone.length > 3) {
                _forAPI = phone.replace(/-?/g, "");
            }else{
                _forAPI='';
            }
            return _forAPI;
        }
        function dateForHuman(date) {            
            var offset = new Date().getTimezoneOffset();
            if (date) {
                var _date = date;
                
                if(_date.length <=6){
                    _date = _date.substr(0, 4) + '-' + _date.substr(4, 2)+'-05';
                }else {
                    _date = _date.substr(0, 4) + '-' + _date.substr(4, 2) + '-' + _date.substr(6, 2);
                }                          
            
                var localDate = moment(_date);                                                                                                                                            
                var _dateForHuman = localDate.toDate();                
                                                         
                return _dateForHuman;
            } else {
                return '';
            }
        }
        function dateForAPI(date,monthFormat) {     
            var localDate    = moment(date);                     
            if(monthFormat === undefined){
                var _forAPI =localDate.format('YYYYMMDD');
            }else{
                var _forAPI = localDate.format('YYYYMM');;
            }
            return _forAPI;
        }
        
    }
})();

(function () {
    angular
        .module('autotrakk')
        .factory('handlingErrors', handlingErrors);
    handlingErrors.$inject = ['$ionicPopup'];
    function handlingErrors($ionicPopup) {
        var service = {
            showError: showError,
            errorFromAPI: errorFromAPI,
            errorFromServer: errorFromServer,
            errorFromPlugin: errorFromPlugin,
            errorInRespone: errorInRespone
        }
        return service;
        /////////////
        function errorFromServer(response) {
            errorObj = {
                'error': true,
                'message': 'Server Error',
                'type': 'server',
                'status': response.status,
                'data': response.data
            }

            return errorObj;
        }
        function errorFromAPI(response) {
            var data = [];            
            if (response.data != null && response.data.StatusCode !== undefined) {
                data = response.data;
            } else {
                data.StatusCode = '';
                data.StatusMessage = 'API Error';
            }
            errorObj = {
                'error': true,
                'message': 'API Error',
                'type': 'api',
                'status': response.status,
                'data': data,
                'api url':response.apiUrl,
                'extraMessage':response.extraMessage
            }
            console.log('Error From API');            
            console.log(errorObj.status);
            console.log(errorObj.data);
            console.log(errorObj.data.StatusCode);
            console.log(errorObj.data.StatusMessage);
            console.log(errorObj.message);

            return errorObj;
        }
        function errorFromPlugin(response) {
            errorObj = {
                'error': true,
                'message': response.message,
                'type': 'plugin',
                'status': response.code,
                'data': response.data,
                'plugin': response.plugin,
            }            
            console.log(errorObj.status);
            console.log(errorObj.message);
                      
            return errorObj;
        }
        // Show PoPuP Box with error msg
        function showError(errorMsg) {
            $ionicPopup.alert({
                title: 'AutoTrakk System Message',
                template: errorMsg
            });
        }
        // handling errors in respond
        function errorInRespone(error, customMessage) {
            switch (error.type) {
                case 'server':
                    console.log('Error From Server');
                    console.log(error.status);
                    console.log(error.data);
                    console.log(error.message);
                    if (customMessage === undefined) {
                        showError(error.message);
                    } else {
                        showError(customMessage);
                    }
                    break;
                case 'api':
                    console.log('Error From API');
                    console.log(error.status);
                    console.log(error.data);
                    console.log(error.data.StatusCode);
                    console.log(error.data.StatusMessage);
                    console.log(error.message);
                    if (customMessage === undefined) {
                        showError(error.data.StatusMessage);
                    } else {
                        showError(customMessage);
                    }
                    break;
                case 'plugin':
                    console.log('Error From Plugin');
                    console.log(errorObj.status);
                    console.log(errorObj.message);
                    if (customMessage === undefined) {
                        showError(error.data);
                    } else {
                        showError(customMessage);
                    }
                    break;
                default:
                    break;
            }
        }

    }
})();
(function(){
    angular
        .module('autotrakk')
        .factory('$localStorage',localStorage);
    localStorage.$inject = ['$window'];
    function localStorage($window) {
        var service = {
            set:set,
            get:get,
            setObject:setObject,
            getObject:getObject,
            remove:remove
        }
        return service;
        ///////////////////////////////
        function set(key, value) {
            $window.localStorage[key] = value;
            return true;
        }
        function get(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        }
        function setObject(key, value) {            
            $window.localStorage[key] = JSON.stringify(value);
        }
        function getObject(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
        function remove(key){
            $window.localStorage.removeItem(key);
        }
    }
})();
(function(){
    angular
        .module('autotrakk')
        .factory('$sessionStorage',sessionStorage);
    sessionStorage.$inject = ['$window'];
    function sessionStorage($window) {
        var service = {
            set:set,
            get:get,
            setObject:setObject,
            getObject:getObject,
            remove:remove
        }
        return service;

        ///////////////////////////////

        function set(key, value) {
            $window.sessionStorage[key] = value;
            return true;
        }
        function get(key, defaultValue) {
            return $window.sessionStorage[key] || defaultValue;
        }
        function setObject(key, value) {
            $window.sessionStorage[key] = JSON.stringify(value);
        }
        function getObject(key) {
            return JSON.parse($window.sessionStorage[key] || '{}');
        }
        function remove(key){
            $window.sessionStorage.removeItem(key);
        }
    }
})();
(function () {
    angular
        .module('autotrakk')
        .factory('userLocation', userLocation);
    userLocation.$inject = ['$cordovaGeolocation', 'handlingErrors'];
    function userLocation($cordovaGeolocation, handlingErrors) {
        var service = {           
            getUserLocation: getUserLocation
        }
        return service;                
        function getUserLocation() {
            var posOptions = { timeout: 10000, enableHighAccuracy: false };
            return $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    var lat = position.coords.latitude.toFixed(5);
                    var long = position.coords.longitude.toFixed(5);
                    var accuracy = position.coords.accuracy;
                    var _location = {
                        'lat': lat,
                        'long': long,
                        'accuracy':accuracy
                    }        
                    var data = {
                        'location':_location,
                        'error': false
                    }
                    return data;
                }, function (response) {
                    response.data = 'Please enable your location';
                    response.plugin = "geolocation";                                        
                    var error = handlingErrors.errorFromPlugin(response);
                    return error;
                });
        }
    }
})();
(function () {
    angular.module('autotrakk')
        .controller('termsConditionsCtrl', termsConditionsCtrl);
    termsConditionsCtrl.$inject = ['APIWrapper','$ionicLoading'];
    function termsConditionsCtrl(APIWrapper,$ionicLoading) {
        var vm = this;               
        /////////////////////////////////////     
        $ionicLoading.show();
        APIWrapper.getAppIntallContent().then(function(response){
          
            $ionicLoading.hide();            
            var tempHtml =  document.createElement('div');
            tempHtml.innerHTML = response.data;            
            var termsAndConditionsWrapper = document.getElementById('termsWrapper');
            termsAndConditionsWrapper.innerHTML = response.data;            
        });             
    }
})();
(function(){
    angular
        .module('autotrakk')
        .controller('errorAccountCtrl',errorAccountCtrl);
    errorAccountCtrl.$inject = ['createAccount'];
    function errorAccountCtrl(createAccount){
        var vm = this;
    }
})();
(function () {
    angular.module('autotrakk')
        .controller('setNewUserPassOnPINCtrl', setNewUserPassOnPINCtrl);
    setNewUserPassOnPINCtrl.$inject = ['createAccount', '$localStorage', '$state', 'handlingErrors', '$ionicLoading'];
    function setNewUserPassOnPINCtrl(createAccount, $localStorage, $state, handlingErrors, $ionicLoading) {
        var vm = this;
        vm.formData = [];
        /////////////////////////////////////
        vm.submitForm = function (form) {
            if (form.$valid == true) {
                $ionicLoading.show();
                createAccount.checkAccount(vm.formData)
                    .then(function (response) {
                         $ionicLoading.hide();
                        if (response.error == false && response.data.StatusCode == 100) {
                            var localCredentials = $localStorage.getObject('credentials');
                            $localStorage.setObject('credentials', {
                                "email": vm.formData.email,
                                "password": vm.formData.password,
                                "pin": localCredentials.pin
                            });
                            $state.go('enterPin');
                        } else {
                            handlingErrors.errorInRespone(response);
                        }
                    });
            }
        }
    }
})();
(function () {
    angular.module('autotrakk')
        .controller('createAccountOneCtrl', createAccountOneCtrl);
    createAccountOneCtrl.$inject = ['$state', 'createAccount', '$ionicLoading']
    function createAccountOneCtrl($state, createAccount, $ionicLoading ) {
        var vm = this;
        vm.regStepOneFrom = [];
        /////////////////////////////////////
        vm.submit = function (form) {
            if (form.$valid == true) {
                $ionicLoading.show();
                createAccount.check(vm.regStepOneFrom).then(function (response) {
                    $ionicLoading.hide();
                    if (response.error == false && response.data.StatusCode == 100) {
                        createAccount.setAccountContractInfo(response.data.Results);
                        $state.go('regStepTwo');
                    } else {                        
                        $state.go('errorAccount');                        
                    }
                });
            }
        }
    }
})();
(function() {
    angular.module('autotrakk')
        .controller('createAccountTwoCtrl', createAccountTwoCtrl);
    createAccountTwoCtrl.$inject = ['createAccount'];
    function createAccountTwoCtrl(createAccount) {
        var vm = this;
        vm.accountContractInfo = [];
        /////////////////////////////////////        
        vm.accountContractInfo = createAccount.getAccountContractInfo();
    }
})();
(function () {
    angular.module('autotrakk')
        .controller('createAccountThreeCtrl', createAccountThreeCtrl);
    createAccountThreeCtrl.$inject = ['$state', 'createAccount', '$ionicLoading','handlingErrors'];
    function createAccountThreeCtrl($state, createAccount, $ionicLoading,handlingErrors) {
        var vm = this;
        vm.regLastStepForm = [];
        var userInfo = createAccount.getUserInfo();
        vm.sameEmailError = false;
        var accountInfo = createAccount.getAccountContractInfo();
        /////////////////////////////////
        vm.checkSameEmail = function () {
            if (vm.regLastStepForm.email != vm.regLastStepForm.emailConfirm) {
                vm.sameEmailError = true;
            } else {
                vm.sameEmailError = false;
            }
        }
        vm.submitRegLastStep = function (form) {
            vm.checkSameEmail();
            if ((form.$valid == true && vm.sameEmailError == false)) {
                var opt = {
                    "customerNo": accountInfo.cust_num,
                    "email": vm.regLastStepForm.email
                }
                $ionicLoading.show();
                createAccount.verifyEmail(opt).then(function (response) {
                    $ionicLoading.hide();
                    if (response.error == false && response.data.StatusCode == 100) {
                        $state.go('useUsernameLogin');
                    } else {
                        handlingErrors.errorInRespone(response);
                    }

                })
            }
        }
    }
})();
(function () {
    angular.module('autotrakk')
        .controller('verifyAccountCtrl', verifyAccountCtrl);
    verifyAccountCtrl.$inject = ['createAccount', 'userLogin', '$localStorage', '$state', 'handlingErrors', '$ionicLoading','$rootScope'];
    function verifyAccountCtrl(createAccount, userLogin, $localStorage, $state, handlingErrors, $ionicLoading,$rootScope) {
        var vm = this;
        vm.verifyAccountForm = [];
        var contractInfo = createAccount.getAccountContractInfo();
        var customerNo = contractInfo.cust_num;
       
        /////////////////////////////////////
        vm.verifyAccount = function (verifyAccountForm) {
            if (verifyAccountForm.$valid == true) {
                $ionicLoading.show();
                createAccount.checkAccount(vm.verifyAccountForm, customerNo)
                    .then(verifyAccountComplete)
            }

        }
        function verifyAccountComplete(response) {
            $ionicLoading.hide();
            if (response.error == false && response.data.StatusCode == 100) {
                var data = {
                    "email": vm.verifyAccountForm.email,
                    "password": vm.verifyAccountForm.password
                }

                // user now has verified account and he will be log in automatically                
                userLogin.logInUser(data).then(function(response){
               
                    if (response.error == false && response.data.StatusCode == 100) {
                            // this is user first log in
                            // if user don't want to use PIN redirect to alert notice
                            // else redirect to create PIN
                            $rootScope.userLoggedCheck = true;
                            var username = data.email;
                            var neverLogWithPIN = $localStorage.getObject('neverLogWithPIN');
                            var flag = false;
                            for(var prop in neverLogWithPIN.usernames){
                                var storedUsername = neverLogWithPIN.usernames[prop];
                                if (storedUsername == username){
                                   flag = true;
                                  
                                }
                            }      
                            if (flag == true) {                                
                                    $state.go('alertNotice');                                                            
                            } else {
                                $localStorage.setObject('credentials', data);
                                $state.go('createPin');
                            }                                                       
                    } else {              
                           
                        handlingErrors.errorInRespone(response);
                    }
                });
            } else {
  
                handlingErrors.errorInRespone(response);

            }

        }
    }
})();
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
(function () {
    angular.module('autotrakk')
        .controller('createPINCtrl', createPINCtrl);
    createPINCtrl.$inject = ['$localStorage', '$state', 'accountData'];
    function createPINCtrl($localStorage, $state, accountData) {
        var vm = this;
        vm.showPinError = false;
        vm.samePinError = false;
        vm.logPinForm = [];
        vm.notShowCreatePin = false;
        var account = accountData.getAccountData();
        /////////////////////////////////////    
        vm.pinChanged = function () {
            if (vm.pinChanged != undefined || vm.pinChanged != '') {
                vm.showPinError = false;
                vm.samePinError = false;
            }
        }
        vm.pinRepeatChanged = function () {
            if (vm.pinChanged != undefined || vm.pinChanged != '') {
                vm.showPinRepeatError = false;
                vm.samePinError = false;
            }
        }
        vm.savePin = function (createPINForm) {
            var pins = vm.logPinForm;
            if (pins.pin != pins.pinRepeat) {
                vm.samePinError = true;
                vm.showPinError = false;
                vm.showPinRepeatError = false;
            } else {
                if (createPINForm.$valid == true) {
                    var credentials = $localStorage.getObject('credentials');
                    $localStorage.setObject('credentials', {
                        "pin": pins.pin,
                        "email": credentials.email,
                        "password": credentials.password
                    });                                
                        $state.go('alertNotice');                    
                } else {
                    if (pins.pin === undefined) {
                        vm.showPinError = true;
                    }
                    if (pins.pinRepeat === undefined) {
                        vm.showPinRepeatError = true;
                    }

                }
            }

        }
        // User don't want to log with PIN 
        vm.noPin = function () {
            //$localStorage.setObject('credentials', {});
            var credentials = $localStorage.getObject('credentials');
            credentials.password = '';
            $localStorage.setObject('credentials', credentials);
            if (vm.notShowCreatePin == true) {
                addToNeverLogWithPIN(credentials.email);
            }
            $state.go('alertNotice');
        }

        function addToNeverLogWithPIN(username) {
            var neverLogWithPIN = $localStorage.getObject('neverLogWithPIN');

            neverLogWithPIN.usernames.push(username);
            $localStorage.setObject('neverLogWithPIN', neverLogWithPIN);
        }
        // if user what to verify account again and this is true he will not be able to create PIN
        // vm.changeNotShowCreatePin = function () {
        //     var credentials = $localStorage.getObject('credentials');

        //     $localStorage.set('notShowCreatePin', vm.notShowCreatePin);
        // }
    }
})();
(function () {
    angular.module('autotrakk')
        .controller('emailLoginCtrl', emailLoginCtrl);
    emailLoginCtrl.$inject = ['$state', 'userLogin', '$rootScope', 'handlingErrors', '$ionicLoading', '$localStorage'];
    function emailLoginCtrl($state, userLogin, $rootScope, handlingErrors, $ionicLoading, $localStorage) {
        var vm = this;
        vm.loginForm = [];
        var firstTimeEver = $localStorage.get('firstTimeEver');

        vm.submitForm = function (usernameLoginForm) {
            if (usernameLoginForm.$valid == true) {
                $ionicLoading.show();
                userLogin.logInUser(vm.loginForm)
                    .then(function (response) {
                        $ionicLoading.hide();
                        if (response.error == false && response.data.StatusCode == 100) {
                            $rootScope.userLoggedCheck = true;
                            var credentials = $localStorage.getObject('credentials');
                            var username = vm.loginForm.email;
                            var neverLogWithPIN = $localStorage.getObject('neverLogWithPIN');
                            var flag = false;
                   
                            if (credentials.email != vm.loginForm.email) {
                                saveCredentials(vm.loginForm.email, vm.loginForm.password);
                            }
                            for (var prop in neverLogWithPIN.usernames) {
                                var storedUsername = neverLogWithPIN.usernames[prop];
                                if (storedUsername == username) {
                                    flag = true;
                                }
                            }
                            if (flag == true) {                                
                                    $state.go('alertNotice');                                                            
                            } else {
                                saveCredentials(vm.loginForm.email, vm.loginForm.password);
                                $state.go('createPin');
                            }
                        } else {
                            handlingErrors.errorInRespone(response);
                        }

                    });
            }
        }
        function saveCredentials(username, password) {
            var data = {
                "email": username,
                "password": password
            }
            //save user data to localStorage              
            $localStorage.setObject('credentials', data);
        }
    }
})();
(function () {
    angular.module('autotrakk')
        .controller('pinLoginCtrl', pinLoginCtrl);
    pinLoginCtrl.$inject = ['$localStorage', 'userLogin', '$state', '$rootScope', 'handlingErrors', '$ionicLoading','$ionicHistory'];
    function pinLoginCtrl($localStorage, userLogin, $state, $rootScope, handlingErrors, $ionicLoading,$ionicHistory) {
        var vm = this;
        vm.form = [];
        vm.submitForm = function (pinLoginForm) {
            if (pinLoginForm.$valid == true) {
                var localCredentials = $localStorage.getObject('credentials');
                if (vm.form.pin == localCredentials.pin) {
                    data = {
                        'email': localCredentials.email,
                        'password': localCredentials.password
                    }                                        
                    $ionicLoading.show();                   
                    userLogin.logInUser(data)
                    .then(function (response) {
                         $ionicLoading.hide();
                         if (response.error == false && response.data.StatusCode == 100) {
                            $rootScope.userLoggedCheck = true;
                            
                                $state.go('alertNotice');
                                                                                  
                        } else {                            
                         
                            if (response.type == 'api' && (response.data.StatusCode == 301 || response.data.StatusCode == 317)) {
                                // When stored credentials are not valid user need to set new one                            
                                $state.go('setNewUserPassOnPIN');                                    
                            }else{
                                handlingErrors.errorInRespone(response);
                            }
                        }

                    });
                } else {
                    handlingErrors.showError('wrong pin')
                }
            } 
            // else {
            //     handlingErrors.showError('Form Error !')
            // }
        }
        vm.forgotPIN = function(){            
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            var credentials = $localStorage.getObject('credentials');
            userLogin.removeFromNeverLogWithPIN(credentials.email);    
            $localStorage.remove('credentials');                            
            $state.go('loginSelect');
        }
    }
})();
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
(function(){
    angular.module('autotrakk')
        .controller('confirmPaymentCtrl', confirmPaymentCtrl);
    confirmPaymentCtrl.$inject = ['makeAPayment','$ionicLoading','handlingErrors','$state'];
    function confirmPaymentCtrl(makeAPayment,$ionicLoading,handlingErrors,$state) {
        var vm = this;
        _cardInfo = makeAPayment.getCard();
        _totalPayAmount = makeAPayment.getTotalAmount();
        vm.cardInfo = _cardInfo;
        vm.totalPayAmount = _totalPayAmount;
        vm.submitPayment = function(){
            $ionicLoading.show();
            makeAPayment.submitPayment().then(function(response){
                $ionicLoading.hide();
                if (response.error == false && response.data.StatusCode == 100) {
                    
                         $state.go('paymentApproved');
                }else{
                    
                    if(response.type == 'unknown'){
                        makeAPayment.setErrorMsg('Something went wrong. Please try again.')
                        $state.go('paymentDeclined');
                                   
                    }else if(response.type == 'api'){
                        makeAPayment.setErrorMsg(response.data.StatusMessage)
                        $state.go('paymentDeclined');
                    }else {
                        handlingErrors.errorInRespone(response);
                        $state.go('makeAPayment');
                    }
                    
                }
                
            });
        }
    }
})();
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
(function(){
    angular.module('autotrakk')
        .controller('paymentAmountCtrl', paymentAmountCtrl);
    paymentAmountCtrl.$inject = ['makeAPayment','$state'];
    function paymentAmountCtrl(makeAPayment,$state) {
        var vm = this;
        vm.amount = makeAPayment.getTotalAmount();
        vm.payMethod = function(type){
                if(type=='creditCard'){
                    $state.go('payWithdebit');
                }else {
                    $state.go('addCard');
                }
        }
    }
})();
(function(){
    angular.module('autotrakk')
        .controller('paymentApprovedCtrl', paymentApprovedCtrl);
    paymentApprovedCtrl.$inject = ['$state','makeAPayment','dataFormatting','$ionicPopup'];
    function paymentApprovedCtrl($state,makeAPayment,dataFormatting,$ionicPopup) {
        var vm = this;      
        var submitPaymentData = makeAPayment.getPaymentSubmitData();
        var validPaymentData = makeAPayment.getValidPaymentData();
        vm.hasDeviceCode = makeAPayment.hasDeviceCode();      
          

        var _nextPaymentDate = dataFormatting.dateForHuman(submitPaymentData.nextDueDate);

        if(validPaymentData == false){
            $ionicPopup.alert({
                title: 'AutoTrakk Message',
                template: "Your Payment Has Been Received, But We're Still Awaiting Confirmation. Please, Check Back Later"
            });
        }

        vm.list = [];
        _codeList = submitPaymentData.releasedCodesList;        
        for(var prop in _codeList){
            _codeList[prop].dueDate = dataFormatting.dateForHuman(_codeList[prop].dueDate);
        }
        
        vm.list = _codeList;      
        vm.nextPayment = _nextPaymentDate;
    }

})();
(function(){
    angular.module('autotrakk')
        .controller('paymentDeclinedCtrl', paymentDeclinedCtrl);
    paymentDeclinedCtrl.$inject = ['makeAPayment','$state'];
    function paymentDeclinedCtrl(makeAPayment,$state) {
        var vm = this;        
        vm.errorMsg = makeAPayment.getErrorMsg();
    }
})();
(function () {
    angular.module('autotrakk')
        .controller('paymentSummaryCtrl', paymentSummaryCtrl);
    paymentSummaryCtrl.$inject = ['$state', 'makeAPayment', 'accountData'];
    function paymentSummaryCtrl($state, makeAPayment, accountData) {
        var vm = this;
        var _releasedCodesList = [];
        var paymentQueryData = makeAPayment.getPaymentQuery();
        vm.hasDeviceCode = makeAPayment.hasDeviceCode();        
        vm.totalAmount = makeAPayment.getTotalAmount();        
        vm.overPaymentInfo = paymentQueryData.overPaymentInfo;
        vm.paymentSummaryList = paymentQueryData.releasedCodesList;        
    }
})();
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
(function(){
    angular.module('autotrakk')
        .controller('accountStatusCtrl', accountStatusCtrl);
    accountStatusCtrl.$inject = ['accountData'];
    function accountStatusCtrl(accountData) {
        var vm = this;
        var account = accountData.getAccountData();
        var _contractTerm = account.accountStatus.contractTerm || 'No Data';
        var _weeklyRent = account.paymentInfo.weeklyRent!= '' ? ('$'+ account.paymentInfo.weeklyRent) : 'No Data';
        var _vehicleResidual =account.accountStatus.vehicleResidual!='' ? ('$'+ account.accountStatus.vehicleResidual) : 'No Data';
        var _paymentsMade = account.accountStatus.paymentsMade || 'No Data';
        var _paymentsRemaining = account.accountStatus.paymentsRemaining || 'No Data';
        var _extensions = account.accountStatus.extensions || 'No Data';
        vm.data = {
            contractTerm: _contractTerm,
            weeklyRent:_weeklyRent,
            vehicleResidual:_vehicleResidual,
            paymentsMade:_paymentsMade,
            paymentsRemaining:_paymentsRemaining,
            extensions:_extensions
        }     
    }
})();
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


(function () {
    angular.module('autotrakk')
        .controller('insuranceInfoCtrl', insuranceInfoCtrl);
    insuranceInfoCtrl.$inject = ['accountData', 'handlingErrors', '$ionicLoading', 'dataFormatting','$state'];
    function insuranceInfoCtrl(accountData, handlingErrors, $ionicLoading, dataFormatting,$state) {
        var vm = this;
        var account = accountData.getAccountData();
        var _phone = dataFormatting.phoneForHuman(account.insuranceInfo.agentPhone);    
        var _expirationDate = dataFormatting.dateForHuman(account.insuranceInfo.expirationDate);        
        vm.form = {
            "insuranceCo": account.insuranceInfo.insuranceCo,
            "agentPhone": _phone,
            "policyNo": account.insuranceInfo.policyNo,
            "expirationDate": _expirationDate,
        }
        vm.submitForm = function (insuranceInfoForm) {            
            if (insuranceInfoForm.$valid) {
                $ionicLoading.show();                
                accountData.saveInsurancePlan(vm.form).then(function (response) {
                    $ionicLoading.hide();
                    if (response.error != false && response.data.StatusCode != 100) {
                        if (response.type == 'api') {
                            handlingErrors.showError(response.data.StatusMessage);
                        }
                        // vm.form = {
                        //     "insuranceCo": account.insuranceInfo.insuranceCo,
                        //     "agentPhone": _phone,
                        //     "policyNo": account.insuranceInfo.policyNo,
                        //     "expirationDate": _expirationDate,
                        // }
                        // handlingErrors.showError('Thank you, we will verify the data and update your customer file');
                    }else {
                       // handlingErrors.showError('Thank you, we will verify the data and update your customer file');
                        $state.go('mainMenu');
                    }
                });
            }
        }
    }
})();
(function () {
    angular.module('autotrakk')
        .controller('myProfileCtrl', myProfileCtrl);
    myProfileCtrl.$inject = ['accountData', 'userLogin', 'handlingErrors', '$ionicLoading', 'dataFormatting','$state'];
    function myProfileCtrl(accountData, userLogin, handlingErrors, $ionicLoading, dataFormatting,$state) {
        var vm = this;
        var account = accountData.getAccountData();
        var phoneHome = dataFormatting.phoneForHuman(account.profile.home);
        var phoneMobile = dataFormatting.phoneForHuman(account.profile.mobile);
        var _userName = account.profile.name || '';
        var _name = '';
        if(_userName != ''){
            _userName = _userName.split(',') ;        
            _name = _userName[1] +' '+_userName[0]
        }
        

        vm.data = {
            "name": _name,            
            "contract": account.accountStatus.contract
        }
        vm.form = {
            "address1": account.profile.address1,
            "address2": account.profile.address2,
            "city": account.profile.city,
            "state": account.profile.state,
            "zip": account.profile.zip,
            "home": phoneHome,
            "mobile": phoneMobile,
            "email": account.profile.email
        }
        vm.submitForm = function (myProfileForm) {
            if (myProfileForm.$valid == true) {
                $ionicLoading.show();
                
                accountData.saveMyProfile(vm.form).then(function (response) {
                    $ionicLoading.hide();
                    if (response.error != false && response.data.StatusCode != 100) {
                        handlingErrors.errorInRespone(response);                    
                    }
                    else {
                        $state.go('mainMenu');
                    }
                    //account.profile = response.data.Results;
                    // saving new data to account in localStorage
                    // accountData.setAccountData(account);
                    // var phoneHome = dataFormatting.phoneForHuman(account.profile.home);
                    // var phoneMobile = dataFormatting.phoneForHuman(account.profile.mobile);
                    // vm.form = {
                    //     "address1": account.profile.address1,
                    //     "address2": account.profile.address2,
                    //     "city": account.profile.city,
                    //     "state": account.profile.state,
                    //     "zip": account.profile.zip,
                    //     "home": phoneHome,
                    //     "mobile": phoneMobile,
                    //     "email": account.profile.email,
                    // }
                });
            }
        }
        vm.editPIN = function () {
            userLogin.editNewPIN();
        }
    }
})();
// (function(){
//     angular.module('autotrakk')
//         .controller('vehicleInfoCtrl', vehicleInfoCtrl);
//     vehicleInfoCtrl.$inject = ['accountData'];
//     function vehicleInfoCtrl(accountData) {
//         var vm = this;
//         var account = accountData.getAccountData();
//         vm.data = {
//             "year":account.vehicleInfo.year,
//             "make":account.vehicleInfo.make,
//             "model":account.vehicleInfo.model
//         }
//         vm.form = {
//             "color":account.vehicleInfo.color,
//             "licensePlate":account.vehicleInfo.licensePlate,
//             "registrationExp":new Date(account.vehicleInfo.registrationExp*1000),
//             "inspectionExp":new Date(account.vehicleInfo.inspectionExp*1000),
//             "currentMileage":account.vehicleInfo.currentMileage
//         }
//         vm.submitForm = function(vehicleInfoForm){
//             if(vehicleInfoForm.$valid){
//            
//             }
//         }
//     }
// })();

(function(){
    angular.module('autotrakk')
        .controller('vehicleInfoCtrl', vehicleInfoCtrl);
    vehicleInfoCtrl.$inject = ['accountData','dataFormatting'];
    function vehicleInfoCtrl(accountData,dataFormatting) {
        var vm = this;
        var account = accountData.getAccountData();
        var _registrationExp = dataFormatting.dateForHuman(account.vehicleInfo.registrationExp) || 'No data';
        var _inspectionExp = dataFormatting.dateForHuman(account.vehicleInfo.inspectionExp) || 'No data';
        vm.data = {
            "year":account.vehicleInfo.year || 'No data',
            "make":account.vehicleInfo.make || 'No data',
            "model":account.vehicleInfo.model || 'No data',
            "color":account.vehicleInfo.color || 'No data',
            "licensePlate":account.vehicleInfo.licensePlate || 'No data',
            "registrationExp":_registrationExp,
            "inspectionExp":_inspectionExp,
            "currentMileage":account.vehicleInfo.currentMileage || 'No data'
        }
    }
})();

// (function(){
//     angular.module('autotrakk')
//         .controller('maintenanceCtrl', maintenanceCtrl);
//     maintenanceCtrl.$inject = ['accountData'];
//     function maintenanceCtrl(accountData) {
//         var vm = this;
//         vm.form = [];

//         var account = accountData.getAccountData();
//         vm.form.registrationExp = new Date(account.vehicleInfo.registrationExp*1000);
//         vm.form.inspectionExp= new Date(account.vehicleInfo.inspectionExp*1000);
//         vm.formSubmit = function(maintenanceForm){
//             if(maintenanceForm.$valid == true){
//                var opt = {
//                     "freeOilChange":{
//                         "date":vm.form.date,
//                         "miles":vm.form.miles
//                     },
//                     "registrationExp":vm.form.registrationExp,
//                     "inspectionExp":vm.form.inspectionExp
//                 }
//             
//             }else {
//              
//             }
//         }
//     }
// })();
(function () {
    angular.module('autotrakk')
        .controller('maintenanceCtrl', maintenanceCtrl);
    maintenanceCtrl.$inject = ['accountData', 'dataFormatting'];
    function maintenanceCtrl(accountData, dataFormatting) {
        var vm = this;
        vm.form = [];
        var account = accountData.getAccountData();
        var _lastOilChange = dataFormatting.dateForHuman(account.vehicleInfo.lastOilChange) || 'No data';
        var _registrationExp = dataFormatting.dateForHuman(account.vehicleInfo.registrationExp) || 'No data';
        var _inspectionExp = dataFormatting.dateForHuman(account.vehicleInfo.inspectionExp) || 'No data';
        vm.data = {
            lastOilChange: _lastOilChange,
            registrationExp: _registrationExp,
            inspectionExp: _inspectionExp
        }
    }
})();
