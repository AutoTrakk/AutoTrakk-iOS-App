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
