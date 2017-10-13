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