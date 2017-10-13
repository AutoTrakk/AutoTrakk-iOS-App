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