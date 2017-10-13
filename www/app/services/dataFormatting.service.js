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
