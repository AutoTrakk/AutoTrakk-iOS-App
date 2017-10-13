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
