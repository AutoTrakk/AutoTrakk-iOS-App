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