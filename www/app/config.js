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
