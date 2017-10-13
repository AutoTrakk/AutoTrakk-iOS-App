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