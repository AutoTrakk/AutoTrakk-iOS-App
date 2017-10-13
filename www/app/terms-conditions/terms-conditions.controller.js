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