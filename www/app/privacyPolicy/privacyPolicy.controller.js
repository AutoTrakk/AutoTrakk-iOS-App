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