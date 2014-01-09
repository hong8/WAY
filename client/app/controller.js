//'use strict';

app.controller('RouteCtrl', [ '$scope','$routeParams', '$rootScope', function( $scope, $routeParams, $rootScope )
{
    if ( $routeParams.user_id )
    {
        //alert('$routeParams.user_id:::'+$routeParams.user_id)
        sharedService.isDirectRoute = true;
        sharedService.data['direct_phase'] =  $routeParams.phase;
        sharedService.data['direct_promise_id'] = $routeParams.promise_id;

        //http://localhost:3000/#/route/+821067351365/location/hMivzXsacAhfwRxdy
        sharedService.user['id'] = $routeParams.user_id;
        sharedService.route =  'login';
        sharedService.dataBroadcast( sharedService.data, $rootScope );
    }
}]);

app.controller('SplashCtrl', ['$scope', '$location', '$routeParams', '$window', '$rootScope', '$dialog', function( $scope, $location, $routeParams, $window, $rootScope, $dialog )
{
    sharedService.i18nApply( 'splash', $scope );

    var telephoneNumberMethodFromPhonegap = 'callTelePhoneNumber()';
    $window.parent.postMessage(telephoneNumberMethodFromPhonegap, '*');

    var eventMethod = $window.addEventListener ? 'addEventListener' : 'attachEvent';
    var eventer = $window[eventMethod];
    var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';
    eventer( messageEvent, add, false );

    function add( event )
    {
        var id = event.data;

        if ( event.data == 'pickupError' )
        {
            id = '+821011111111';

            //alert('callTelePhoneNumber::::'+id);
        }

        if ( id )
        {
            //login from web
            if ( id == telephoneNumberMethodFromPhonegap )
            {
                openLoginDialog();
            }
            else //login from phonegap app
            {
                sharedService.user['id'] = id;
                sharedService.route =  'login';
                sharedService.dataBroadcast( sharedService.data, $rootScope );
            }
        }

        var eventMethod = $window.addEventListener ? 'removeEventListener' : 'removeEvent';
        var eventer = $window[eventMethod];
        var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';
        eventer( messageEvent, add )

        $window.parent.postMessage('callInitNotify()', '*');
    }

    function openLoginDialog()
    {
        var opts =
        {
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: 'partials/popup/login.html',
            controller: 'LoginDialogCtrl'
        };

        var d = $dialog.dialog( opts );
        d.open().then( function( phonenumber )
        {
            if( phonenumber )
            {
                sharedService.isWeb = true;

                sharedService.user['id'] = phonenumber;
                sharedService.route =  'login';
                sharedService.dataBroadcast( sharedService.data, $rootScope );
            }
        });
    };
}]);

app.controller('LoginDialogCtrl', ['$scope', 'dialog', function( $scope, dialog )
{
    sharedService.i18nApply( 'logindialog', $scope );

    $scope.title = jQuery.i18n.prop('logindialog_login_title');
    //TO-DO delete!!
    $scope.phonenumber = '+821067351365';

    $scope.close = function()
    {
        dialog.close(null);
    };

    $scope.signIn = function()
    {
        sharedService.data['register_phonenumner'] = $scope.phonenumber;

        dialog.close( $scope.phonenumber );
    };
}]);

app.controller('LoginCtrl', ['$scope', '$meteor', '$location', '$routeParams', '$timeout', '$rootScope', '$dialog', '$window', function( $scope, $meteor, $location, $routeParams, $timeout, $rootScope, $dialog, $window )
{
    sharedService.i18nApply( 'login', $scope );

    Meteor.login( sharedService.user['id'] , loginResult );

    function loginResult( error )
    {
        if ( error && error.message && error.message.indexOf('login') != -1 )
        {
            $scope.$apply( function()
            {
                var title = jQuery.i18n.prop('common_information');
                var msg = jQuery.i18n.prop('login_no_result');
                var btns = [{result:'cancel', label: jQuery.i18n.prop('common_cancel')}, {result:'ok', label: jQuery.i18n.prop('common_ok'), cssClass: 'btn-primary'}];
                var msgBox = $dialog.messageBox(title, msg, btns)
                var open = msgBox.open();
                open.then(function(result){
                    if ( result == 'ok' )
                    {
                        openRegisterDialog();
                    }
                });
            })
        }
        else
        {
            sharedService.user = this.userCallback.caller.arguments[1];

            if ( sharedService.user['id'] == '+821022222222' )
            {
                openRegisterDialog();
                return;
            }

            Meteor.subscribe('users');
            Meteor.subscribe('wayusers');
            Meteor.subscribe('mypromises');
            Meteor.subscribe('promises');
            Meteor.subscribe('chats');
            Meteor.subscribe('questions');
            Meteor.subscribe('votes');
            Meteor.subscribe('credits');
            Meteor.subscribe('wayfiles');

            sharedService.showMenuBroadcast( $rootScope );

            $timeout( function()
                {
                    $scope.$apply( function()
                    {
                        if ( sharedService.isDirectRoute )
                        {
                            sharedService.route = sharedService.data['direct_phase'];
                            sharedService.promise_id = sharedService.data['direct_promise_id'];
                            sharedService.dataBroadcast( sharedService.data, $rootScope );
                        }
                        else
                        {
                            sharedService.route =  'my';
                            sharedService.dataBroadcast( sharedService.data, $rootScope );
                        }
                    })
                }
            , 500)
        }
    }

    function openRegisterDialog()
    {
        var opts =
        {
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: 'partials/popup/login.html',
            controller: 'RegisterDialogCtrl'
        };

        var d = $dialog.dialog( opts );
        d.open().then( function( result )
        {
            if( result.name && result.phonenumber )
            {
                var eventMethod = $window.addEventListener ? 'addEventListener' : 'attachEvent';
                var eventer = $window[eventMethod];
                var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';
                var obj = {
                    userId : sharedService.user['id']
                }
                var methodName = 'callRegistNotify()';
                $window.parent.postMessage(methodName, '*');
                eventer( messageEvent, regist, false );

                function regist( event )
                {
                    var eventResult = event.data;
                    //get registration_id or return callRegistNotify() method
                    var data = { name : result.name, id : result.phonenumber, email :'', photo : '', registration_id : eventResult == methodName ? '' : eventResult };
                    $scope.WayUsers = $meteor('wayusers');
                    var user_id = $scope.WayUsers.insert( data );
                    if ( user_id )
                    {
                        sharedService.user['id'] = result.phonenumber;
                        Meteor.login( sharedService.user['id'] , loginResult );
                    }
                    var eventMethod = $window.addEventListener ? 'removeEventListener' : 'removeEvent';
                    var eventer = $window[eventMethod];
                    var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';
                    eventer( messageEvent, regist );
                }
            }
        });
    };
}]);

app.controller('RegisterDialogCtrl', ['$scope', 'dialog', '$rootScope', function( $scope, dialog, $rootScope )
{
    sharedService.i18nApply( 'registerdialog', $scope );

    $scope.title = jQuery.i18n.prop('registerdialog_register_title');
    $scope.isResiter = true;

    $scope.logindialog_login_signin = jQuery.i18n.prop('logindialog_login_signin');
    $scope.phonenumber = sharedService.data['register_phonenumner'];

    $scope.close = function()
    {
        dialog.close(null);
        sharedService.route =  'splash';
        sharedService.dataBroadcast( sharedService.data, $rootScope );
    };

    $scope.signIn = function()
    {
        dialog.close( { name : $scope.name, phonenumber : $scope.phonenumber } );
    };
}]);

app.controller('MainCtrl', ['$scope', '$location', function( $scope, $location )
{
    jQuery(document).ready(function() {
        loadBundles();
        sharedService.i18nApply( 'main', $scope );
//        importSources(
//            function() {
//                loadBundles();
//                sharedService.i18nApply( 'main', $scope );
//            }
//        )
    });

    $scope.$on('selectMenuBroadcast', function()
    {
        $scope.selectMenu( sharedService.phase );
    });

    $scope.$on('dataBroadcast', function()
    {
        if ( sharedService.route == 'my' || sharedService.route == 'new' || sharedService.route == 'login' || sharedService.route == 'splash' )
            Route = function() { $location.url('/' + sharedService.route ); }
        else
            Route = function() { $location.url('/' + sharedService.route + '/' + sharedService.promise_id); }
        var func = new Route();
        $scope.$apply(func);
    });

    $scope.$on('showMenuBroadcast', function()
    {
        $scope.isShowMenu = true;
    });

    $scope.$on('hideMenuBroadcast', function()
    {
        //$scope.isShowMenu = false;
    });

    $scope.selectMenu = function( phase )
    {
        switch ( phase )
        {
            case 'my' :
                $scope.title = jQuery.i18n.prop('my_main_title');
                $scope.naviSelected1 = true;
                $scope.naviSelected2 = false;
                $scope.naviSelected3 = false;
                $scope.naviSelected4 = false;
                break;
            case 'new' :
                $scope.title = jQuery.i18n.prop('new_main_title');
                $scope.naviSelected1 = false;
                $scope.naviSelected2 = true;
                $scope.naviSelected3 = false;
                $scope.naviSelected4 = false;
                break;
            case 'credit' :
                $scope.title = jQuery.i18n.prop('credit_main_title');
                $scope.naviSelected1 = false;
                $scope.naviSelected2 = false;
                $scope.naviSelected3 = true;
                $scope.naviSelected4 = false;
                break;
            case 'profile' :
                $scope.title = jQuery.i18n.prop('profile_main_title');
                $scope.naviSelected1 = false;
                $scope.naviSelected2 = false;
                $scope.naviSelected3 = false;
                $scope.naviSelected4 = true;
                break;
            case 'detail' :
                $scope.title = jQuery.i18n.prop('detail_main_title')// + sharedService.data['promise'];
                break;
            case 'chat' :
                $scope.title = jQuery.i18n.prop('chat_main_title');
                break;
            case 'vote' :
                $scope.title = jQuery.i18n.prop('vote_main_title');
                break;
            case 'alarm' :
                $scope.title = jQuery.i18n.prop('alarm_main_title');
                break;
            case 'location' :
                $scope.title = jQuery.i18n.prop('location_main_title');
                break;
        }
    }

}]);

app.controller('MyCtrl', ['$scope', '$meteor', '$routeParams', '$rootScope', '$window', function( $scope, $meteor, $routeParams, $rootScope, $window )
{
    if ( !didYouLogin() ) return;

    sharedService.i18nApply( 'my', $scope );
    sharedService.selectMenuBroadcast( 'my', $rootScope );

    $scope.MyPromises = $meteor('mypromises');
    $scope.mypromises = $scope.MyPromises.find( { user_id : sharedService.user['id'] } );

    $scope.$watch( 'mypromises', applyCalendar, true );

    function applyCalendar()
    {
        var events = [];
        var events = [];

        var mypromises = $scope.mypromises;
        var len = mypromises.length;

        var eventMap = {};

        var str = ''
        for ( var i = 0; i < len; i++ )
        {
            var promise = mypromises[i];
            var date = promise['date'];
            var startDate = new Date( date.substr(0,4), parseInt(date.substr(4,2), 10)-1, date.substr(6,2), 0, 0, 0 );

            //str += promise['promise'] +','+ date+'(' +date.substr(0,4)+'/'+ parseInt(date.substr(4,2), 10)-1+'/'+ date.substr(6,2) + ')\n'
            events.push( {
                    title: promise['promise'],
                    start : startDate,
                    data : promise
                        }
                    )
            if ( !eventMap[date] ) eventMap[date] = [];

            eventMap[date].push(promise);
        }

            //alert('len:::'+len)
            //alert(str)
    //
    //    var date = new Date();
    //    var d = date.getDate();
    //    var m = date.getMonth();
    //    var y = date.getFullYear();

        var $calendar = $('#calendar');
        $('#calendar').empty(); //remove all inner element
        $calendar.fullCalendar({
            header: {
                left: 'prev,next',
                center: 'title',
                right: 'month,agendaWeek'
    //            left: 'prev,next today',
    //            center: 'title',
    //            right: 'month,agendaWeek,agendaDay'
            },
            titleFormat: {
                month: 'yyyy.MM',
                week: "yyyy.MM.dd{'&#8210;'dd}",
                day: 'dd, MM d, yyyy'
            },
            editable: false,
            events : events,
    //        events: [
    //            {
    //                title: 'All Day Event',
    //                start: new Date(y, m, 1-3)
    //            },
    //            {
    //                title: 'Long Event',
    //                start: new Date(y, m, d-5),
    //                end: new Date(y, m, d-2)
    //            },
    //            {
    //                id: 999,
    //                title: 'Repeating Event',
    //                start: new Date(y, m, d-3, 16, 0),
    //                allDay: false
    //            },
    //            {
    //                id: 999,
    //                title: 'Repeating Event',
    //                start: new Date(y, m, d+4, 16, 0),
    //                allDay: false
    //            },
    //            {
    //                title: 'Meeting',
    //                start: new Date(y, m, d, 10, 30),
    //                allDay: false
    //            },
    //            {
    //                title: 'Lunch',
    //                start: new Date(y, m, d, 12, 0),
    //                end: new Date(y, m, d, 14, 0),
    //                allDay: false
    //            },
    //            {
    //                title: 'Birthday Party',
    //                start: new Date(y, m, d+1, 19, 0),
    //                end: new Date(y, m, d+1, 22, 30),
    //                allDay: false
    //            },
    //            },
    //            {
    //                title: 'Click for Google',
    //                start: new Date(y, m, 28),
    //                end: new Date(y, m, 31),
    //                url: 'http://google.com/'
    //            }
    //        ],
            eventClick: function(event, jsEvent, view){
                console.log(event);

                sharedService.route =  'promise';
                sharedService.promise_id = event.data['promise_id'];
                sharedService.dataBroadcast( event.data, $rootScope );
            },
            dayClick: function(date, allDay, jsEvent, view){
                var strDate = yyyymmdd(date);
                if ( eventMap[strDate] && eventMap[strDate].length > 0 )
                {
                    var data = eventMap[strDate][0];
                    sharedService.route =  'promise';
                    sharedService.promise_id = data['promise_id'];
                    sharedService.dataBroadcast( data, $rootScope );
                }
                else //empty
                {
                    sharedService.data['clickedDate'] = date;
                    sharedService.route = 'new';
                    sharedService.dataBroadcast( sharedService.data, $rootScope );
                }
            },
            eventDrop: function(event,jsEvent,view){
                console.log(event);
            },
            eventResize: function(event,jsEvent,view){
                console.log(event);
            }
        });
    }
}]);

app.controller('NewCtrl', ['$scope', '$meteor', '$routeParams', '$rootScope', '$window', '$dialog', '$timeout', function( $scope, $meteor, $routeParams, $rootScope, $window, $dialog, $timeout )
{
    if ( !didYouLogin() ) return;

    sharedService.i18nApply( 'new', $scope );
    sharedService.selectMenuBroadcast( 'new', $rootScope );

    $scope.newMode =  $scope.editMode = $scope.locationViewMode = true;

    //Handling Promisies
    $scope.promise = {};
    var dt = new Date();
    if ( sharedService.data['clickedDate'] )
    {
        var clickeddt = sharedService.data['clickedDate'];
        clickeddt.setHours(dt.getHours());
        clickeddt.setMinutes(dt.getMinutes());
        dt = clickeddt;
        delete sharedService.data['clickedDate'];
    }
    var datetime = new Date( Date.UTC( dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), 0 ) );
    $('#dpkDate').datetimepicker('setDate', datetime);
    $('#dpkTime').datetimepicker('setDate', datetime);

    $scope.savePromise = function()
    {
        if ( $scope.promise.promise && $scope.promise.promise != '' && $scope.promise.location && $scope.promise.location.title != '' )
        {
            var date = $('#dpkDate').data('date').replace(/\-/g, '');
            var time = $('#dpkTime').data('date').replace(/\:/g, '');

            var data = {
                owner : sharedService.user,
                promise : $scope.promise.promise,
                location : $scope.promise.location,
                date : date,
                time : time,
                memo : $scope.promise.memo,
                participants : $scope.promise.participants ? $scope.promise.participants : [],
                notified : false,
                registration_id : ''
            }

            var newParticipants = [];
            for ( var i = 0; i < data.participants.length; i++)
            {
                var row = data.participants[i];
                var obj = {};
                for ( var p in row )
                {
                    if ( p != '$$hashKey')
                        obj[p] = row[p];
                    //else
                    //    alert(p)
                }
                newParticipants.push(obj);
            }
            newParticipants.push( sharedService.user ) //add me as participants
            data.participants = newParticipants;

            $scope.Promises = $meteor('promises');
            var promise_id = $scope.Promises.insert( data );
            //alert(promise_id+':::'+objToString(data)+'\n\n'+objToString(data.participants[0]))
            if ( promise_id )
            {
                $scope.MyPromises = $meteor('mypromises');
                $scope.MyPromises.insert( { user_id : sharedService.user['id'], promise_id : promise_id, promise : data['promise'], date : data['date'] } );

                var title = jQuery.i18n.prop('common_information');
                var msg = jQuery.i18n.prop('new_promise_saved');
                var btns = [{result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-info'}];
                var msgBox = $dialog.messageBox(title, msg, btns)
                var open = msgBox.open();

                $timeout( function(){
                    msgBox.close(null);

                    sharedService.data['mustnotify'] = true;
                    sharedService.route = 'promise';
                    sharedService.promise_id = promise_id;
                    sharedService.dataBroadcast( sharedService.data, $rootScope );
                }, 1000);

                //sharedService.route =  'my';
                //sharedService.dataBroadcast( sharedService.data, $rootScope  );
            }
        }
        else
        {
            var title = jQuery.i18n.prop('common_information');
            var msg = jQuery.i18n.prop('new_input_promise');
            var btns = [{result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-info'}];

            var msgBox = $dialog.messageBox(title, msg, btns)
            var open = msgBox.open();
            return;
        }
    }

    $scope.addPaticipant = function()
    {
        //alert('window.parent.callContactView();:::'+window.parent.callContactView());
        $window.parent.postMessage('callContactView()', '*');

        var eventMethod = $window.addEventListener ? 'addEventListener' : 'attachEvent';
        var eventer = $window[eventMethod];
        var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';
        eventer( messageEvent, add, false );

        function add( event )
        {
            //alert('controller.js:::\n'+objToString(event.data));
            if ( event.data && event.data['name'] )
            {
                var contact = event.data;
                $scope.$apply( function()
                {
                    var participants = $scope.promise.participants ? $scope.promise.participants : [];
                    var len = participants.length;
                    for ( var i = 0; i < len; i++ )
                    {
                        if ( participants[i]['id'] == contact['id'] )
                            return;
                    }

                    var regID = '';
                    $scope.WayUsers = $meteor('wayusers');
                    var users = $scope.WayUsers.find( { id : contact['id'] } );
                    if ( users && users.length > 0 )
                    {
                        regID = users[0]['registration_id'];
                        //alert('regID:::'+regID)
                    }

                    var parti = { id : contact['id'], phone : contact['phone'], name : contact['name'], email :'', photo : '', registration_id : regID }
                    participants.splice( participants.length, 0, parti );

                    $scope.promise.participants = participants;
                })
            }

            var eventMethod = $window.addEventListener ? 'removeEventListener' : 'removeEvent';
            var eventer = $window[eventMethod];
            var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';
            eventer( messageEvent, add )
        }
    }

    $scope.removeParticipant = function( user_id )
    {
        var participants = $scope.promise.participants;
        var len = participants.length;
        for ( var i = 0; i < len; i++ )
        {
            if ( participants[i]['id'] == user_id )
            {
                participants.splice( i, 1 );
                break;
            }
        }
    }

    $scope.opts =
    {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'partials/popup/search.html',
        controller: 'SearchCtrl'
    };

    $scope.openLocationDialog = function()
    {
        sharedService.data['mode'] = 'Search';

        var d = $dialog.dialog( $scope.opts );
        d.open().then( function( result )
        {
            if( result )
            {
                //alert( 'result:::'+objToString(result) )
                $scope.promise.location = { title : result['title'], latLng : result['latLng'] };
            }
        });
    };

}]);

app.controller('SearchCtrl', ['$scope', '$meteor', '$timeout', '$http', '$window', 'dialog', function( $scope, $meteor, $timeout, $http, $window, dialog )
{
    sharedService.i18nApply( 'search', $scope );

    if ( sharedService.data['mode'] == 'Search' )
    {
        $scope.title = jQuery.i18n.prop('search_searchmode_title');;
        $scope.searchMode = true;
    }
    else
    {
        $scope.title = jQuery.i18n.prop('search_viewmode_title');;
        $scope.searchMode = false;
    }


    $scope.close = function()
    {
        dialog.close(null);
    };

    $scope.setLocation = function( result )
    {
        dialog.close( result );
    };

    function initialize( latitude, longitude )
    {
        //alert('initialize:::'+latitude+','+ longitude)
        var mapOptions = { mapTypeId: google.maps.MapTypeId.ROADMAP };
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng((latitude-0.005), (longitude-0.005)),
            new google.maps.LatLng((latitude+0.005), (longitude+0.005)))
//
//        new google.maps.LatLng(latitude, longitude),
//            new google.maps.LatLng(latitude, longitude));
        map.fitBounds(defaultBounds);

        //alert('initialize:::'+latitude+'/'+longitude)
        var promise_marker = null;

        if ( $scope.searchMode )
        {
            var input = /** @type {HTMLInputElement} */(document.getElementById('target'));
            var searchBox = new google.maps.places.SearchBox(input);
            var markers = [];

            google.maps.event.addListener(searchBox, 'places_changed', function() {
                var places = searchBox.getPlaces();

                for (var i = 0, marker; marker = markers[i]; i++) {
                    marker.setMap(null);
                }

                markers = [];
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0, place; place = places[i]; i++) {
                    var image = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };

                    var marker = new google.maps.Marker({
                        map: map,
                        icon: image,
                        title: place.name,
                        position: place.geometry.location
                    });

                    google.maps.event.addListener(marker, 'click', function()
                    {
                        //alert( 'marker clicked:::'+objToString(this) )
                        markPromiseLocation( this.title, this.position );
                    });

                    markers.push(marker);
                    bounds.extend(place.geometry.location);
                }

                map.fitBounds(bounds);
            });

            google.maps.event.addListener(map, 'bounds_changed', function()
            {
                var bounds = map.getBounds();
                searchBox.setBounds(bounds);
            });

            google.maps.event.addListener(map, 'click', function(event)
            {
                var latLng = event.latLng;
                var strLatLng = '';
                for ( var p in latLng )
                {
                    if ( latLng.hasOwnProperty(p) )
                        strLatLng += latLng[p] + ',';
                }
                strLatLng = strLatLng.substr(0, strLatLng.length-1);

                //alert(strLatLng)
                var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+strLatLng+'&sensor=true'

                $http.defaults.useXDomain = true;
                delete $http.defaults.headers.common['X-Requested-With'];
                $http.defaults.headers.post['Content-Type'] = 'application/json';//NOT WORKING
                $http({
                    url: url,
                    method: 'GET'
                }).success(function (data, status, headers, config) {
                        var title = data.results[0]['formatted_address'];
                        markPromiseLocation( title, latLng );
                    }).error(function (data, status, headers, config) {
                        alert('Location Error')
                    });
            });

            if ( sharedService.data['detail'] && sharedService.data['location'] )
                markPromiseLocation( sharedService.data['location']['title'], new google.maps.LatLng(latitude, longitude) );
        }
        else  //viewMode
        {
            markPromiseLocation( sharedService.data['location']['title'], new google.maps.LatLng(latitude, longitude) );
        }

        function markPromiseLocation( title, latLng )
        {
            if ( promise_marker ) promise_marker.setMap(null);

            promise_marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: title,
                icon: 'images/markers/marker_white.png'
            });

            $scope.result = { title : title, latLng : latLng };
        }
    }

    if ( $scope.searchMode )
    {
        if ( sharedService.data['detail'] )
        {
            var latlng = getLatLng(sharedService.data['location']);
            if ( latlng )
                $timeout(function() { initialize( latlng['lat'] , latlng['lng']); }, 10);
        }
        else
        {
            if ($window.navigator.geolocation)
            {
                $window.navigator.geolocation.getCurrentPosition( successCallback, errorCallback )

                //alert($window.navigator.geolocation)
                function successCallback( position ) {
                    $timeout(function() { initialize( position.coords.latitude, position.coords.longitude ); }, 10);
                }

                function errorCallback(error) {
                    var strMessage = '';

                    // Check for known errors
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            strMessage = 'Access to your location is turned off. '  +
                                'Change your settings to turn it back on.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            strMessage = 'Data from location services is ' +
                                'currently unavailable.';
                            break;
                        case error.TIMEOUT:
                            strMessage = 'Location could not be determined ' +
                                'within a specified timeout period.';
                            break;
                        default:
                            break;
                    }

                    //console.log( strMessage );
                }
            }
        }
    }
    else
    {
        var latlng = getLatLng(sharedService.data['location']);

        if ( latlng )
            $timeout(function() { initialize( latlng['lat'] , latlng['lng'] ); }, 10);
    }
}]);

function getLatLng( location )
{
    if ( location['latLng'] )
    {
        var latLng = location['latLng'];
        var strLatLng = '';
        for ( var p in latLng )
        {
            if ( latLng.hasOwnProperty(p) )
                strLatLng += latLng[p] + ',';
        }
        var lat = strLatLng.split(',')[0];
        var lng = strLatLng.split(',')[1];
        return { lat : parseFloat(lat), lng : parseFloat(lng) };
    }
    else
    {
        return null;
    }
}

app.controller('ChatCtrl', ['$scope', '$meteor', '$routeParams', '$rootScope', '$window', function( $scope, $meteor, $routeParams, $rootScope, $window )
{
    if ( !didYouLogin() ) return;

    sharedService.i18nApply( 'chat', $scope );
    sharedService.selectMenuBroadcast( 'chat', $rootScope );

    if ( $routeParams.promise_id )
    {
        $scope.Chats = $meteor('chats');
        $scope.chats = $scope.Chats.find( { promise_id : $routeParams.promise_id } );

        var participants = [];
        var strParticipants = '';
        var chats = $scope.chats;
        var len = chats.length;
        for ( var i = 0; i < len; i++ )
        {
            if ( strParticipants.indexOf( chats[i]['user']['name'] ) == -1 )
            {
                participants.push( chats[i]['user']['name'] + ', ' );
                strParticipants += chats[i]['user']['name'] + ', ';
            }
            //chats[i]['style'] = { 'background-image': 'url(images/chat/'+chats[i]['user']+'.jpg)' }
        }
        if ( participants.length > 0 )
            participants[participants.length-1] = participants[participants.length-1].substr(0, participants[participants.length-1].length-2)

        $scope.participants = participants;
        $scope.me = sharedService.user;

        if ( sharedService.isDirectRoute )
        {
            $scope.isDirectRoute = true;
            sharedService.hideMenuBroadcast( $rootScope );
        }
    }

    $scope.backToDetail = function( phase )
    {
        sharedService.route =  phase;
        sharedService.dataBroadcast( sharedService.data, $rootScope  );
    }

    $scope.clickSend = function()
    {
        if ( $scope.sendMessage )
        {
            var data = { promise_id : $routeParams.promise_id, user : $scope.me, message : $scope.sendMessage };
            if ( $scope.Chats.insert( data ) )
            {
                //Push Notification~!!
                var param = '';
                var msgcnt = $scope.chats.length;
                var userName = sharedService.user['name'];

                $scope.Promises = $meteor('promises');
                $scope.promise = $scope.Promises.find({ _id : $routeParams.promise_id })[0];
                var participants = $scope.promise.participants ? $scope.promise.participants : [];
                var len = participants.length;
                for ( var i = 0; i < len; i++ )
                {
                    var regId = participants[i]['registration_id'];
                    if ( regId )
                    {
                        var preTitle = jQuery.i18n.prop('chat_notify_pretitle', userName);
                        var phase = 'chat'
                        var obj = {
                            regId : regId, phase : phase,
                            promiseId : $routeParams.promise_id, title : preTitle+$scope.promise.promise, message : $scope.sendMessage, msgcnt : msgcnt
                        }
                        param = JSON.stringify(obj);
                        //alert(param)
                        $window.parent.postMessage('callNotifyToAll('+param+')', '*');
                    }
                }
                $scope.sendMessage = '';
            }
        }
    }

    $scope.clickActivity = function( phase )
    {
        switch ( phase )
        {
            case 'vote' :
                sharedService.route =  phase;
                sharedService.dataBroadcast( sharedService.data, $rootScope  );
                break;
        }
    }

}]);

app.controller('VoteCtrl', ['$scope', '$meteor', '$routeParams', '$rootScope', '$dialog', '$route', '$timeout', '$window', function( $scope, $meteor, $routeParams, $rootScope, $dialog, $route, $timeout, $window )
{
    if ( !didYouLogin() ) return;

    sharedService.i18nApply( 'vote', $scope );
    sharedService.selectMenuBroadcast( 'vote', $rootScope );

    //Handling Questions
    if ( $routeParams.promise_id )
    {
        $scope.Questions = $meteor('questions');
        $scope.questions = $scope.Questions.find( { promise_id : $routeParams.promise_id } );

        $scope.Votes = $meteor('votes');
        $scope.votes = $scope.Votes.find( { promise_id : $routeParams.promise_id } );

        $scope.$watch( 'questions', applyQuestions, true );
        $scope.$watch( 'votes', applyVotes, true );

        if ( sharedService.isDirectRoute )
        {
            $scope.isDirectRoute = true;
            sharedService.hideMenuBroadcast( $rootScope );
        }

        function applyQuestions()
        {
            if ( $scope.questions.length > 0 )
            {
                $scope.question = $scope.questions[0];

                //change mode!!
                $scope.editMode = ($scope.question.owner['id'] == sharedService.user['id']);

                if ( $scope.question && $scope.question.options.length > 0 && $scope.votes.length > 0 )
                {
                    var options = $scope.question.options;
                    var len = options.length;
                    for ( var i = 0; i < len; i++ )
                    {
                        var count = 0;

                        var option_id = options[i]['id'];
                        var votes = $scope.votes;
                        var votelen = votes.length;
                        for ( var j = 0; j < votelen; j++ )
                        {
                            if ( option_id == votes[j]['vote'] )
                                count++;
                        }
                        options[i]['count'] = count;
                    }

                }
                else
                {
                    $scope.votes = {}
                }

                $('input.chk').prettyCheckable({
                    color: 'blue'
                });

            }
            else
            {
                $scope.question = {};
                $scope.editMode = true;
            }
        }


        function applyVotes()
        {
            if ( $scope.questions.length > 0 )
            {
                if ( $scope.question && $scope.question.options.length > 0 && $scope.votes.length > 0 )
                {
                    var options = $scope.question.options;
                    var len = options.length;
                    for ( var i = 0; i < len; i++ )
                    {
                        var count = 0;

                        var option_id = options[i]['id'];
                        var votes = $scope.votes;
                        var votelen = votes.length;
                        for ( var j = 0; j < votelen; j++ )
                        {
                            if ( option_id == votes[j]['vote'] )
                                count++;
                        }
                        options[i]['count'] = count;
                    }

                }
                else
                {
                    $scope.votes = {}
                }

                $('input.chk').prettyCheckable({
                    color: 'blue'
                });

            }
            else
            {
                $scope.question = {};
                $scope.editMode = true;
            }
        }
    }

    $scope.setCheck = function(element)
    {
        var index = parseInt(element.id, 10);
        $scope.question.options[index]['checked'] = element.checked
    };

    $scope.addOption = function()
    {
        if ( !$scope.question.options )
            $scope.question.options = [];

        var options = $scope.question.options;
        options.splice( options.length, 0, {} );

        $timeout(function() {
            $scope.$broadcast('newItemAdded');
        }, 10);
    }

    $scope.removeOption = function( index )
    {
        var options = $scope.question.options;
        if ( index > -1 && index < options.length )
            options.splice( index, 1 )
    }

    $scope.sendQuestion = function()
    {
        if ( $scope.question.question && $scope.question.question != '' && $scope.question.options && $scope.question.options.length > 0 )
        {
            var title = jQuery.i18n.prop('vote_send_question_title');
            var msg = jQuery.i18n.prop('vote_send_question_message');
            var btns = [{result:'cancel', label: jQuery.i18n.prop('common_cancel')}, {result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-primary'}];

            var msgBox = $dialog.messageBox(title, msg, btns)
            var open = msgBox.open();
            open.then(function(result){
                if ( result == 'ok' )
                {
                    var newOptions = valideOptions();

                    if ( newOptions.length == 0 )
                    {
                        var title = jQuery.i18n.prop('common_information');
                        var msg = jQuery.i18n.prop('vote_input_options');
                        var btns = [{result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-info'}];

                        var msgBox = $dialog.messageBox(title, msg, btns)
                        var open = msgBox.open();
                        return;
                    }

                    var data = {
                        promise_id : $routeParams.promise_id,
                        question : $scope.question.question,
                        options : newOptions,
                        owner : sharedService.user,
                        timestamp : (new Date()).getTime()
                    }
                    $scope.Questions = $meteor('questions')

                    //existing question
                    if ( $scope.question['_id'] )
                    {
                        $scope.Questions.update( { _id : $scope.question._id }, data );
                        var title = jQuery.i18n.prop('common_information');
                        var msg = jQuery.i18n.prop('vote_send_question');
                        var btns = [{result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-info'}];

                        var msgBox = $dialog.messageBox(title, msg, btns)
                        var open = msgBox.open();
                    }
                    else //new question
                    {
                        if ( $scope.Questions.insert( data ) )
                        {
                            var title = jQuery.i18n.prop('common_information');
                            var msg = jQuery.i18n.prop('vote_send_question');
                            var btns = [{result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-info'}];

                            var msgBox = $dialog.messageBox(title, msg, btns)
                            var open = msgBox.open();
                        }
                    }

                    //Push Notification~!!
                    var param = '';
                    var msgcnt = data.options.length;

                    $scope.Promises = $meteor('promises');
                    $scope.promise = $scope.Promises.find({ _id : $routeParams.promise_id })[0];
                    var participants = $scope.promise.participants ? $scope.promise.participants : [];
                    var len = participants.length;
                    for ( var i = 0; i < len; i++ )
                    {
                        var regId = participants[i]['registration_id'];
                        if ( regId )
                        {
                            var preTitle = jQuery.i18n.prop('vote_question_notify_pretitle');;
                            var phase = 'vote'
                            var obj = {
                                regId : regId, phase : phase,
                                promiseId : $routeParams.promise_id, title : preTitle+$scope.promise.promise, message : $scope.question.question, msgcnt : msgcnt
                            }
                            param = JSON.stringify(obj);
                            //alert( regId+':::'+param)
                            $window.parent.postMessage('callNotifyToAll('+param+')', '*');
                        }
                    }

                    $scope.$apply(function()
                    {
                        $route.reload();
                    });
                }
            });
        }
        else
        {
            var newOptions = valideOptions();

            if ( newOptions.length == 0 )
            {
                var title = jQuery.i18n.prop('common_information');
                var msg = jQuery.i18n.prop('vote_input_options');
                var btns = [{result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-info'}];

                var msgBox = $dialog.messageBox(title, msg, btns)
                var open = msgBox.open();
                return;
            }

            var title = jQuery.i18n.prop('common_information');
            var msg = $scope.question.question == undefined || $scope.question.question == '' ? jQuery.i18n.prop('vote_input_question') : jQuery.i18n.prop('vote_input_options');
            var btns = [{result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-info'}];

            var msgBox = $dialog.messageBox(title, msg, btns)
            var open = msgBox.open();
        }

        function valideOptions()
        {
            var newOptions = [];

            var options = $scope.question.options;
            if ( options )
            {
                var len = options.length;
                var num = 0;
                for ( var i = 0; i < len; i++ )
                {
                    var option = options[i];
                    if ( option.option && option.option != '' )
                        newOptions.push( { id : option.id, idx : num++, option : option.option } );
                }
            }

            return newOptions;
        }
    }

    $scope.sendVote = function()
    {
        $scope.Votes = $meteor('votes')

        var options = $scope.question.options;
        var len = options.length;
        var checkedOption = [];
        var checkedOptionStr = '';
        var timestamp = (new Date()).getTime();
        for ( var i = 0; i < len; i++ )
        {
            if ( options[i].checked )
            {
                var data = {
                    promise_id : $scope.question.promise_id,
                    vote : options[i]['id'],
                    user : sharedService.user,
                    timestamp : timestamp++
                }
                checkedOption.push( data )
                checkedOptionStr += options[i]['option'] + ', '
            }
        }

        if ( checkedOption.length > 0 )
        {
            var title = jQuery.i18n.prop('vote_send_vote_title');
            var msg = jQuery.i18n.prop('vote_send_vote_message');
            var btns = [{result:'cancel', label: jQuery.i18n.prop('common_cancel')}, {result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-primary'}];

            var msgBox = $dialog.messageBox(title, msg, btns)
            var open = msgBox.open();
            open.then(function(result){
                if ( result == 'ok' )
                {
                    var len = checkedOption.length;
                    for ( var i = 0; i < len; i++ )
                    {
                        $scope.Votes.insert( checkedOption[i] )
                    }
                    var title = jQuery.i18n.prop('common_information');
                    var msg = jQuery.i18n.prop('vote_send_vote');
                    var btns = [{result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-info'}];

                    var msgBox = $dialog.messageBox(title, msg, btns)
                    var open = msgBox.open();

                    //Push Notification~!!
                    var param = '';
                    var msgcnt = data.options.length;
                    var userName = sharedService.user['name'];

                    $scope.Promises = $meteor('promises');
                    $scope.promise = $scope.Promises.find({ _id : $routeParams.promise_id })[0];
                    var participants = $scope.promise.participants ? $scope.promise.participants : [];
                    var len = participants.length;
                    for ( var i = 0; i < len; i++ )
                    {
                        var regId = participants[i]['registration_id'];
                        if ( regId )
                        {
                            var preTitle = jQuery.i18n.prop('vote_new_notify_pretitle', userName);
                            var phase = 'vote'
                            var obj = {
                                regId : regId, phase : phase,
                                promiseId : $routeParams.promise_id, title : preTitle+$scope.promise.promise, message : $scope.question.question, msgcnt : msgcnt
                            }
                            param = JSON.stringify(obj);
                            $window.parent.postMessage('callNotifyToAll('+param+')', '*');
                        }
                    }

                    $scope.$apply(function()
                    {
                        $route.reload();
                    });
                }
            });
        }
        else
        {
            var title = jQuery.i18n.prop('common_information');
            var msg = jQuery.i18n.prop('vote_select_options');
            var btns = [{result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-info'}];

            var msgBox = $dialog.messageBox(title, msg, btns)
            var open = msgBox.open();
        }
    }

    $scope.backToDetail = function( phase )
    {
        sharedService.route =  phase;
        sharedService.dataBroadcast( sharedService.data, $rootScope  );
    }

}]);

app.controller('CreditCtrl', ['$scope', '$meteor', '$routeParams', '$http', '$rootScope', function( $scope, $meteor, $routeParams, $http, $rootScope )
{
    if ( !didYouLogin() ) return;

    sharedService.i18nApply( 'credit', $scope );
    sharedService.selectMenuBroadcast( 'credit', $rootScope );

    $scope.durations = [
        {name:jQuery.i18n.prop('credit_12m'), value:-12},
        {name:jQuery.i18n.prop('credit_6m'), value:-6},
        {name:jQuery.i18n.prop('credit_3m'), value:-3},
        {name:jQuery.i18n.prop('credit_1m'), value:-1}];
    $scope.duration = $scope.durations[0];

    $scope.changeDuration = function()
    {
        $scope.search();
    }

    $scope.search = function()
    {
        $scope.Credits = $meteor('credits');

        var dt = new Date();
        var date = new Date( Date.UTC( dt.getFullYear(), dt.getMonth() + $scope.duration.value, dt.getDate() ) );

        $scope.tempcredits = $scope.Credits.find( { promise_date : { $gte : yyyymmdd(date) } } );

        $scope.$watch( 'tempcredits', applyCredits, true );

        function applyCredits()
        {
            var arrExist = [];

            var credits = [];
            var creditList = $scope.tempcredits;
            var len = creditList.length;
            for ( var i = 0; i < len; i++ )
            {
                var user = creditList[i]['user'];
                var id = user['id'];
                var distance = creditList[i]['distance'];
                var isActual = distance <= 0.1; //if distance is smaller 100m

                var idx = arrExist.indexOf(id);
                if ( idx != -1 )
                {
                    var data = credits[idx];
                    data['plan'] += 1;
                    data['actual'] += (isActual ? 1 : 0);
                }
                else
                {
                    arrExist.push(id);

                    credits.push( { user : user, plan : 1, actual : isActual ? 1 : 0 } )
                }
            }
            $scope.credits = credits;
        }

        function getUniqueUsers( list )
        {
            var retList = [];

            var len = list.length;
            for ( var i = 0; i < len; i++ )
            {

            }
        }
    }

    $scope.selectView = function( idx )
    {
        if ( idx == 1 ) {
            $scope.template = {url:'partials/credit/creditTable.html'};
            $scope.dropSelected1 = true;
            $scope.dropSelected2 = false;
            $scope.dropSelected3 = false;
        } else if ( idx == 2 ) {
            $scope.template = {url:'partials/credit/creditVisual1.html'};
            $scope.dropSelected1 = false;
            $scope.dropSelected2 = true;
            $scope.dropSelected3 = false;
        } else if ( idx == 3 ) {
            $scope.template = {url:'partials/credit/creditVisual2.html'};
            $scope.dropSelected1 = false;
            $scope.dropSelected2 = false;
            $scope.dropSelected3 = true;
        } else {

        }
    }

    if ( sharedService.isDirectRoute )
    {
        $scope.isDirectRoute = true;
        sharedService.hideMenuBroadcast( $rootScope );
    }

    $scope.sendReport = function()
    {
        var title = jQuery.i18n.prop('credit_send_credit_title');
        var msg = jQuery.i18n.prop('credit_send_credit_message');
        var btns = [{result:'cancel', label: jQuery.i18n.prop('common_cancel')}, {result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-primary'}];

        var msgBox = $dialog.messageBox(title, msg, btns)
        var open = msgBox.open();
        open.then(function(result){
            if ( result == 'ok' )
            {
                //Push Notification~!!
                var param = '';
                var msgcnt = -1;

                $scope.Promises = $meteor('promises');
                $scope.promise = $scope.Promises.find({ _id : $routeParams.promise_id })[0];
                var participants = $scope.promise.participants ? $scope.promise.participants : [];
                var len = participants.length;
                for ( var i = 0; i < len; i++ )
                {
                    var regId = participants[i]['registration_id'];
                    if ( regId )
                    {
                        var preTitle = jQuery.i18n.prop('credit_notify_pretitle');;
                        var phase = 'credit'
                        var obj = {
                            regId : regId, phase : phase,
                            promiseId : $routeParams.promise_id, title : preTitle+$scope.promise.promise, message : $scope.promise.location.title+'/'+formatteddate+time, msgcnt : msgcnt
                        }
                        param = JSON.stringify(obj);
                        $window.parent.postMessage('callNotifyToAll('+param+')', '*');
                    }
                }

                var title = jQuery.i18n.prop('common_information');
                var msg = jQuery.i18n.prop('credit_send_credit_report');
                var btns = [{result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-info'}];
                var msgBox = $dialog.messageBox(title, msg, btns)
                var open = msgBox.open();

            }
        });
    }

    $scope.drawChart = function(flag)
    {
        var url = 'partials/charts/basicChart.json';
        if ( flag == 'pie' )
            url = 'partials/charts/basicChart.json'

        $http.get(url).success(function(data)
        {
            var categories = [];
            var credits = $scope.credits;
            var len = credits.length;
            for ( var i = 0; i < len; i++ )
            {
                categories.push( credits[i]['user']['name'] );
            }
            data.xAxis.categories = categories;

            var series1 = { name : jQuery.i18n.prop('credit_chart_plan'), data : [] };
            var series2 = { name : jQuery.i18n.prop('credit_chart_actual'), data : [] };
            for ( var i = 0; i < len; i++ )
            {
                series1.data.push( credits[i]['plan'] );
                series2.data.push( credits[i]['actual'] );
            }
            data.series = [ series1, series2 ];

            $scope.basicChart = data;
        });
    }

    $scope.search();

}]);

app.controller('DetailCtrl', ['$scope', '$meteor', '$routeParams', '$rootScope', '$dialog', '$window', '$timeout', '$route', function( $scope, $meteor, $routeParams, $rootScope, $dialog, $window, $timeout, $route )
{
    if ( !didYouLogin() ) return;

    sharedService.i18nApply( 'new', $scope );
    sharedService.selectMenuBroadcast( 'detail', $rootScope );

    $scope.newMode = false;

    //Handling Promisies
    if ( $routeParams.promise_id )
    {
        $scope.Promises = $meteor('promises');
        $scope.promise = $scope.Promises.find({ _id : $routeParams.promise_id })[0];

        if ( $scope.promise )
        {
            //alert( '$scope.promise.registration_id:::'+$scope.promise.registration_id)
            //Handling Date and Time Picker
            var date = $scope.promise['date'];
            var time = $scope.promise['time'];
            var datetime = new Date( Date.UTC(parseInt(date.substr(0,4), 10), parseInt(date.substr(4,2), 10)-1, parseInt(date.substr(6,2), 10), parseInt(time.substr(0,2), 10), parseInt(time.substr(2,2), 10), 0) );
            $('#dpkDate').datetimepicker('setDate', datetime);
            $('#dpkTime').datetimepicker('setDate', datetime);

            //alert( $routeParams.promise_id+':::'+objToString($scope.promise))
            $scope.editMode = $scope.locationViewMode = ($scope.promise.owner['id'] == sharedService.user['id']);

            var participants = $scope.promise.participants;
            var len = participants.length;
            for ( var i = 0; i < len; i++ )
            {
                if ( participants[i]['id'] == sharedService.user['id'] )
                {
                    participants.splice( i, 1 );
                    break;
                }
            }
        }

        if ( sharedService.isDirectRoute )
        {
            $scope.isDirectRoute = true;
            sharedService.hideMenuBroadcast( $rootScope );
        }
    }

    $scope.clickActivity = function( phase )
    {
        switch ( phase )
        {
            case 'notify' :
                var title = jQuery.i18n.prop('detail_notify_title');
                var msg = jQuery.i18n.prop('detail_notify_message');
                var btns = [{result:'cancel', label: jQuery.i18n.prop('common_cancel')}, {result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-primary'}];

                var msgBox = $dialog.messageBox(title, msg, btns)
                var open = msgBox.open();
                open.then(function(result){
                    //alert('dialog closed with result: ' + result);
                    if ( result == 'ok' )
                    {
                        var date = $('#dpkDate').data('date').replace(/\-/g, '');
                        var time = $('#dpkTime').data('date').replace(/\:/g, '');
                        var formatteddate = date.substr(0,4) + '.' + date.substr(4,2) + '.' + date.substr(6,2) + ' ';
                        var formattedtime = time.substr(0,2) + ':' + time.substr(2,2);

                        //Push Notification~!!
                        var param = '';
                        var msgcnt = 1;

                        var participants = $scope.promise.participants ? $scope.promise.participants : [];
                        var len = participants.length;
                        for ( var i = 0; i < len; i++ )
                        {
                            var regId = participants[i]['registration_id'];
                            if ( regId )
                            {
                                var preTitle = jQuery.i18n.prop('detail_notify_pretitle');;
                                var phase = 'promise'
                                var obj = {
                                    regId : regId, phase : phase,
                                    promiseId : $routeParams.promise_id, title : preTitle+$scope.promise.promise, message : $scope.promise.location.title+'/'+formatteddate+formattedtime, msgcnt : msgcnt
                                }
                                param = JSON.stringify(obj);
                                $window.parent.postMessage('callNotifyToAll('+param+')', '*');
                            }

                            $scope.MyPromises = $meteor('mypromises');
                            var isExist = $scope.MyPromises.find( { user_id : participants[i]['id'], promise_id : $routeParams.promise_id})[0] ? true : false;
                            if ( !isExist )
                                $scope.MyPromises.insert( { user_id : participants[i]['id'], promise_id : $routeParams.promise_id, promise : $scope.promise.promise, date : date } );
                        }

                        var title = jQuery.i18n.prop('common_information');
                        var msg = jQuery.i18n.prop('detail_notify_send');
                        var btns = [{result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-info'}];
                        var msgBox = $dialog.messageBox(title, msg, btns)
                        var open = msgBox.open();

//                        var title = 'Go to Alarm';
//                        var msg = 'Do you want to set alarm?';
//                        var btns = [{result:'cancel', label: jQuery.i18n.prop('common_cancel')}, {result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-primary'}];
//
//                        var msgBox = $dialog.messageBox(title, msg, btns)
//                        var open = msgBox.open();
//                        open.then(function(result){
//                            //alert('dialog closed with result: ' + result);
//                            if ( result == 'ok' )
//                            {
//                                sharedService.route = 'alarm';
//                                sharedService.promise_id = $routeParams.promise_id;
//                                sharedService.dataBroadcast( sharedService.data, $rootScope );
//                            }
//                        });
                    }
                });
                break;
            case 'chat' :
            case 'location' :
            case 'vote' :
            case 'alarm' :
                sharedService.route =  phase;
                sharedService.promise_id = $routeParams.promise_id;
                sharedService.dataBroadcast( sharedService.data, $rootScope );
                break;
        }
    }

    $scope.savePromise = function()
    {
        if ( $scope.promise.promise && $scope.promise.promise != '' && $scope.promise.location && $scope.promise.location.title != '' )
        {
            var date = $('#dpkDate').data('date').replace(/\-/g, '');
            var time = $('#dpkTime').data('date').replace(/\:/g, '');
            var formatteddate = date.substr(0,4) + '.' + date.substr(4,2) + '.' + date.substr(6,2) + ' ';
            var formattedtime = time.substr(0,2) + ':' + time.substr(2,2);

            var data = {
                owner : sharedService.user,
                promise : $scope.promise.promise,
                location : $scope.promise.location,
                date : date,
                time : time,
                memo : $scope.promise.memo,
                participants : $scope.promise.participants ? JSON.parse(JSON.stringify($scope.promise.participants)): [],
                notified : $scope.promise.notified
            }

            data.participants.push( sharedService.user ) //add me as participants

            $scope.Promises = $meteor('promises')
            $scope.Promises.update( { _id : $routeParams.promise_id }, data );
            //if ( $scope.Promises.update( { _id : $scope.promise._id }, data ) )
            //{
            $scope.MyPromises = $meteor('mypromises');
            var mypromises = $scope.MyPromises.find( { promise_id : $routeParams.promise_id } );
            var len = mypromises ? mypromises.length : 0;
            for ( var i = 0; i < len; i++ )
            {
                var mypromise = mypromises[i];
                $scope.MyPromises.update( { _id : mypromise['_id'] }, { user_id : mypromise['id'], promise_id : $routeParams.promise_id, promise : data['promise'], date : data['date'] } );
            }

            var title = jQuery.i18n.prop('common_information');
            var msg = jQuery.i18n.prop('detail_promise_save');
            var btns = [{result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-info'}];
            var msgBox = $dialog.messageBox(title, msg, btns)
            var open = msgBox.open();

            //sharedService.route =  'my';
            //sharedService.dataBroadcast( sharedService.data, $rootScope  )

            $timeout( function(){
                msgBox.close(null);
                $route.reload();
                $scope.clickActivity('notify');
            }, 1000);
        }
        else
        {
            var title = jQuery.i18n.prop('common_information');
            var msg = jQuery.i18n.prop('detail_input_promise');
            var btns = [{result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-info'}];

            var msgBox = $dialog.messageBox(title, msg, btns)
            var open = msgBox.open();
            return;
        }
    }

    $scope.removePromise = function()
    {
        var title = jQuery.i18n.prop('detail_promise_remove_title');
        var msg = jQuery.i18n.prop('detail_promise_remove_message');
        var btns = [{result:'cancel', label: jQuery.i18n.prop('common_cancel')}, {result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-primary'}];

        var msgBox = $dialog.messageBox(title, msg, btns)
        var open = msgBox.open();
        open.then(function(result){
            //alert('dialog closed with result: ' + result);
            if ( result == 'ok' )
            {
                var date = $('#dpkDate').data('date').replace(/\-/g, '');
                var time = $('#dpkTime').data('date').replace(/\:/g, '');
                var formatteddate = date.substr(0,4) + '.' + date.substr(4,2) + '.' + date.substr(6,2) + ' ';
                var formattedtime = time.substr(0,2) + ':' + time.substr(2,2);

                //if ( $scope.Promises.remove( { _id : $scope.promise._id } ) )
                //{
                $scope.MyPromises = $meteor('mypromises');
                var mypromises = $scope.MyPromises.find( { promise_id : $routeParams.promise_id } );
                var len = mypromises ? mypromises.length : 0;
                for ( var i = len-1; i >= 0 ; i-- )
                {
                    $scope.MyPromises.remove( { _id : mypromises[i]['_id'] } );
                }

                $scope.Promises = $meteor('promises');
                $scope.Promises.remove( { _id : $routeParams.promise_id } );

                //Push Notification~!!
                var param = '';
                var msgcnt = 1;

                var participants = $scope.promise.participants ? $scope.promise.participants : [];
                var len = participants.length;
                for ( var i = 0; i < len; i++ )
                {
                    //alert((i+1)+'/'+len)
                    //alert('registration_id:::'+participants[i]['registration_id'])
                    var regId = participants[i]['registration_id'];
                    if ( regId )
                    {
                        var preTitle = jQuery.i18n.prop('detail_remove_pretitle');
                        var phase = 'my'
                        var obj = {
                            regId : regId, phase : phase,
                            promiseId : $routeParams.promise_id, title : preTitle+$scope.promise.promise, message : $scope.promise.location.title+'/'+formatteddate+formattedtime, msgcnt : msgcnt
                        }
                        param = JSON.stringify(obj);
                        $window.parent.postMessage('callNotifyToAll('+param+')', '*');
                    }
                }

                var title = jQuery.i18n.prop('common_information');
                var msg = jQuery.i18n.prop('detail_promise_remove');
                var btns = [{result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-info'}];
                var msgBox = $dialog.messageBox(title, msg, btns)
                var open = msgBox.open();

                sharedService.route =  'my';
                sharedService.dataBroadcast( sharedService.data, $rootScope  );
                //}
            }
        });
    }

    $scope.addPaticipant = function()
    {
        //alert('window.parent.callContactView();:::'+window.parent.callContactView());
        $window.parent.postMessage('callContactView()', '*');

        var eventMethod = $window.addEventListener ? 'addEventListener' : 'attachEvent';
        var eventer = $window[eventMethod];
        var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';
        eventer( messageEvent, add, false );

        function add( event )
        {
            //alert('controller.js:::\n'+objToString(event.data));
            if ( event.data && event.data['name'] )
            {
                var contact = event.data;
                $scope.$apply( function()
                {
                    var participants = $scope.promise.participants ? $scope.promise.participants : [];
                    var len = participants.length;
                    for ( var i = 0; i < len; i++ )
                    {
                        if ( participants[i]['id'] == contact['id'] )
                            return;
                    }

                    var regID = '';
                    $scope.WayUsers = $meteor('wayusers');
                    var users = $scope.WayUsers.find( { id : contact['id'] } );
                    if ( users && users.length > 0 )
                        regID = users[0]['registration_id'];

                    var parti = { id : contact['id'], phone : contact['phone'], name : contact['name'], email :'', photo : '', registration_id : regID }
                    participants.splice( participants.length, 0, parti );

                    $scope.promise.participants = participants;
                })
            }

            var eventMethod = $window.addEventListener ? 'removeEventListener' : 'removeEvent';
            var eventer = $window[eventMethod];
            var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';
            eventer( messageEvent, add )
        }
    }

    $scope.removeParticipant = function( user_id )
    {
        var participants = $scope.promise.participants;
        var len = participants.length;
        for ( var i = 0; i < len; i++ )
        {
            if ( participants[i]['id'] == user_id )
            {
                participants.splice( i, 1 );
                break;
            }
        }
    }

    $scope.opts =
    {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'partials/popup/search.html',
        controller: 'SearchCtrl'
    };

    $scope.viewLocationDialog = function()
    {
        sharedService.data['detail'] = false;

        if ( $scope.promise.location['latLng'] )
        {
            sharedService.data['mode'] = 'View';
            sharedService.data['location'] = $scope.promise.location;

            var d = $dialog.dialog( $scope.opts );
            d.open().then( function( result )
            {
            });
        }
        else
        {
            var title = jQuery.i18n.prop('common_information');
            var msg = jQuery.i18n.prop('detail_no_location');
            var btns = [{result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-info'}];
            var msgBox = $dialog.messageBox(title, msg, btns)
            var open = msgBox.open();
        }
    };

    $scope.openLocationDialog = function()
    {
        sharedService.data['mode'] = 'Search';
        sharedService.data['detail'] = true;

        if ( $scope.promise.location['latLng'] )
            sharedService.data['location'] = $scope.promise.location;

        var d = $dialog.dialog( $scope.opts );
        d.open().then( function( result )
        {
            if( result )
            {
                //alert( 'result:::'+objToString(result) )
                $scope.promise.location = { title : result['title'], latLng : result['latLng'] };
            }
        });
    };

    $scope.backToDetail = function( phase )
    {
        sharedService.route =  phase;
        sharedService.dataBroadcast( sharedService.data, $rootScope );
    }

    if ( sharedService.data['mustnotify'] )
    {
        sharedService.data['mustnotify'] = false;
        $scope.clickActivity( 'notify' );
    }

}]);

app.controller('AlarmCtrl', ['$scope', '$meteor', '$routeParams', '$rootScope', '$route', '$timeout', '$window', '$dialog', function( $scope, $meteor, $routeParams, $rootScope, $route, $timeout, $window, $dialog )
{
    if ( !didYouLogin() ) return;

    sharedService.i18nApply( 'alarm', $scope );
    sharedService.selectMenuBroadcast( 'alarm', $rootScope );

    $scope.types = [
        {name:jQuery.i18n.prop('alarm_type_melody'), value:'m'},
        {name:jQuery.i18n.prop('alarm_type_vibration'), value:'v'},
        {name:jQuery.i18n.prop('alarm_type_mv'), value:'mv'}];
    $scope.type = $scope.types[0];

    $scope.tones = [
        {name:'Melody 1', value:'1'},
        {name:'Melody 2', value:'2'},
        {name:'Melody 3', value:'3'},
        {name:'Melody 4', value:'4'},
        {name:'Melody 5', value:'5'}];
    $scope.tone = $scope.tones[0];

    $scope.snoozes = [
        {name:jQuery.i18n.prop('alarm_snooze_3m'), value:'3'},
        {name:jQuery.i18n.prop('alarm_snooze_10m'), value:'10'},
        {name:jQuery.i18n.prop('alarm_snooze_15m'), value:'15'},
        {name:jQuery.i18n.prop('alarm_snooze_30m'), value:'30'},
        {name:jQuery.i18n.prop('alarm_snooze_60m'), value:'60'},
        {name:jQuery.i18n.prop('alarm_snooze_90m'), value:'90'},
        {name:jQuery.i18n.prop('alarm_snooze_120m'), value:'120'},
        {name:jQuery.i18n.prop('alarm_snooze_150m'), value:'150'},
        {name:jQuery.i18n.prop('alarm_snooze_180m'), value:'180'}];
    $scope.snooze = $scope.snoozes[0];

    if ( $routeParams.promise_id )
    {
        $scope.Promises = $meteor('promises');
        $scope.promise = $scope.Promises.find({ _id : $routeParams.promise_id })[0];

        var dt = new Date();
        var datetime = new Date( Date.UTC( dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), 0 ) );
        $('#dpkDate').datetimepicker('setDate', datetime);
        $('#dpkTime').datetimepicker('setDate', datetime);

        var date = $scope.promise['date'];
        var time = $scope.promise['time'];
        var datetimeTo = new Date( Date.UTC(parseInt(date.substr(0,4), 10), parseInt(date.substr(4,2), 10)-1, parseInt(date.substr(6,2), 10), parseInt(time.substr(0,2), 10), parseInt(time.substr(2,2), 10), 0) );
        $('#dpkDateTo').datetimepicker('setDate', datetimeTo);
        $('#dpkTimeTo').datetimepicker('setDate', datetimeTo);

        var alarmStorage = new AlarmStorage( $routeParams.promise_id );
        alarmStorage.loadItems();

        if ( alarmStorage.items.length > 0 )
        {
            $scope.isSet = true;
            $scope.alarm = alarmStorage.items[0];

            date = $scope.alarm.start.substr(0, 8);
            time = $scope.alarm.start.substr(8);
            datetimeTo = new Date( Date.UTC(parseInt(date.substr(0,4), 10), parseInt(date.substr(4,2), 10)-1, parseInt(date.substr(6,2), 10), parseInt(time.substr(0,2), 10), parseInt(time.substr(2,2), 10), 0) );
            $('#dpkDate').datetimepicker('setDate', datetimeTo);
            $('#dpkTime').datetimepicker('setDate', datetimeTo);

            $scope.start = $scope.alarm.start;
            $scope.type = idxOf($scope.types, $scope.alarm.type);
            $scope.tone = idxOf($scope.tones, $scope.alarm.tone);
            $scope.snooze = idxOf($scope.snoozes, $scope.alarm.snooze);
        }
        else
        {
            $scope.isSet = false;
            $scope.alarm = {};
        }
    }

    $scope.setAlarm = function( operation )
    {
        //Alarm Notification~!!
        var date = $scope.promise['date'];
        var time = $scope.promise['time'];
        var formatteddate = date.substr(0,4) + '.' + date.substr(4,2) + '.' + date.substr(6,2) + ' ';
        var formattedtime = time.substr(0,2) + ':' + time.substr(2,2);

        var sDate = $('#dpkDate').data('date').replace(/\-/g, '');
        var sTtime = $('#dpkTime').data('date').replace(/\:/g, '');

        var from = new Date( Date.UTC(parseInt(sDate.substr(0,4), 10), parseInt(sDate.substr(4,2), 10)-1, parseInt(sDate.substr(6,2), 10), parseInt(sTtime.substr(0,2), 10), parseInt(sTtime.substr(2,2), 10), 0) );
        var to = new Date( Date.UTC(parseInt(date.substr(0,4), 10), parseInt(date.substr(4,2), 10)-1, parseInt(date.substr(6,2), 10), parseInt(time.substr(0,2), 10), parseInt(time.substr(2,2), 10), 0) );

        var msg = '';

        var alarmStorage = new AlarmStorage( $routeParams.promise_id );
        var notificationId = alarmStorage.getNotificationId();
        if ( operation == 'set' )
        {
            if ( from < to && new Date() < to && to > new Date() )
            {
                alarmStorage.addItem( notificationId, sDate+sTtime, $scope.type,  $scope.tone, $scope.snooze );
                msg = jQuery.i18n.prop('alarm_set_message');
            }
            else
            {
                var msg1 = jQuery.i18n.prop('alarm_not_set_message');
                var title1 = jQuery.i18n.prop('common_information');
                var btns1 = [{result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-info'}];
                var msgBox1 = $dialog.messageBox(title1, msg1, btns1)
                var open1 = msgBox1.open();
                return;
            }
        }
        else
        {
            notificationId = $scope.alarm['id'];
            alarmStorage.clearItems();
            msg = jQuery.i18n.prop('alarm_cancel_message');
        }
        var title = jQuery.i18n.prop('common_information');
        var btns = [{result:'ok', label : jQuery.i18n.prop('common_ok'), cssClass: 'btn-info'}];
        var msgBox = $dialog.messageBox(title, msg, btns)
        var open = msgBox.open();

        $timeout( function()
        {
            $route.reload();
        }, 1000 );

        var preTitle = jQuery.i18n.prop('location_notify_pretitle');
        var obj = {
            operation : operation,
            notificationId : notificationId, start : sDate+sTtime, end : date+time, type : $scope.type['value'], tone : $scope.tone['value'], snooze : $scope.snooze['value'],
            phase : 'location', promiseId : $routeParams.promise_id, title : preTitle+$scope.promise.promise, message : $scope.promise.location.title+'/'+formatteddate+formattedtime, msgcnt : 1
        }
        var param = JSON.stringify(obj);
        $window.parent.postMessage('callSetAlarm('+param+')', '*');
    }

    $scope.backToDetail = function( phase )
    {
        sharedService.route =  phase;
        sharedService.dataBroadcast( sharedService.data, $rootScope );
    }
}]);

app.controller('LocationCtrl', ['$scope', '$meteor', '$routeParams', '$timeout', '$rootScope', '$window', function( $scope, $meteor, $routeParams, $timeout, $rootScope, $window )
{
    if ( !didYouLogin() ) return;

    sharedService.i18nApply( 'location', $scope );
    sharedService.selectMenuBroadcast( 'location', $rootScope );

    if ( sharedService.isDirectRoute )
    {
        $scope.isDirectRoute = true;
        sharedService.hideMenuBroadcast( $rootScope );
    }

    if ( $routeParams.promise_id )
    {
        $scope.Promises = $meteor('promises');
        $scope.promise = $scope.Promises.find({ _id : $routeParams.promise_id })[0];

        var map;
        $timeout(function() { initialize(); }, 10);

        var regIds = [];
        var participants = $scope.promise.participants ? $scope.promise.participants : [];
        var len = participants.length;
        var cnt = 0;
        for ( var i = 0; i < len; i++ )
        {
            //alert("sharedService.user['registration_id']:::"+sharedService.user['registration_id'])
            //alert("participants[i]['registration_id']:::"+participants[i]['registration_id'])
            var regId = participants[i]['registration_id'];
            if ( regId )
                regIds.push( regId );
        }

        if ( regIds.length > 0 )
        {
            var param = JSON.stringify( { regIds : regIds, caller : sharedService.user['registration_id'] }) ;
            $window.parent.postMessage('callGetLocation('+param+')', '*');

            var eventMethod = $window.addEventListener ? 'addEventListener' : 'attachEvent';
            var eventer = $window[eventMethod];
            var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';
            eventer( messageEvent, getLoc, false );
            //alert('callGetLocation:::'+param)
        }

        function getLoc( event )
        {
            var result = event.data ? JSON.parse(event.data) : null;
            if ( result && result.length > 0 )
            {
                var resultCnt = 0;

                var rLen = result.length;
                for ( var i = 0; i < rLen; i++ )
                {
                    var rRegId = result[i]['regId'];

                    var participants = $scope.promise.participants ? $scope.promise.participants : [];
                    var pLen = participants.length;
                    for ( var j = 0; j < pLen; j++ )
                    {
                        var pRegId = participants[j]['registration_id'];
                        if ( rRegId == pRegId )
                        {
                            participants[j]['location'] = {};
                            participants[j]['location']['title'] = $scope.promise.location['title'];
                            participants[j]['location']['latLng'] = { lat : result[i]['lat'], lng : result[i]['lng'] };

                            //alert("participants[j]['location']['latLng']:::"+objToString(participants[j]['location']['latLng']))

                            resultCnt++;
                        }
                    }
                    $scope.promise.participants = participants;
                }
                var eventMethod = $window.addEventListener ? 'removeEventListener' : 'removeEvent';
                var eventer = $window[eventMethod];
                var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';
                eventer( messageEvent, getLoc );

                //alert('resultCnt:::'+resultCnt)
                if ( resultCnt > 0 )
                    putParticipantsLocation();
            }
        }

        function initialize() {

            //alert('initialize()')

            var latlng = getLatLng($scope.promise.location);
            var promise_loc = new google.maps.LatLng( latlng['lat'] , latlng['lng'] );

            var mapOptions = {
                zoom: 12,
                center: promise_loc,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            var promise_marker = new google.maps.Marker({
                position: promise_loc,
                map: map,
                title: $scope.promise['location']['title'],
                icon: 'images/markers/marker_white.png'
            });

            //google.maps.event.addListener(map, 'click', function(event) {
                //alert('Point.X.Y: ' + event.latLng);
            //});
        }

        function putParticipantsLocation() {

            var minBounds = { lat : 999, lng : 999 };
            var maxBounds = { lat : 0, lng : 0 };
            var latlng = getLatLng($scope.promise.location);
            calcMinMaxBounds( latlng );

            var locationArray = [];
            var locationNameArray = [];
            var colorArray = ['blue', 'brown', 'orange', 'green', 'red', 'paleblue', 'pink', 'purple', 'darkgreen', 'yellow'];
            var alphabetArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

            var tempParticipants = $scope.promise.participants;
            var participants = []
            var len = tempParticipants.length;
            for ( var i = 0; i < len; i++ )
            {
                if ( tempParticipants[i]['location'] )
                {
                    var location = getLatLng(tempParticipants[i]['location']);
                    calcMinMaxBounds( location );
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng( location['lat'] , location['lng']),
                        map: map,
                        title: tempParticipants[i]['name'],
                        icon: 'images/markers/'+colorArray[i]+'_Marker'+alphabetArray[i]+'.png'
                    });

                    participants.push( { name : '('+alphabetArray[i]+') '+tempParticipants[i]['name'],
                        style : { 'background-image' : '-webkit-gradient(linear,0 0,0 10%,from('+colorArray[i]+'),to('+colorArray[i]+'))',
                                  'color' : '#ffffff' }, location : location } )


                    var dist = calcDistance( latlng,location );
                }
            }

            $scope.$apply( function()
            {
                $scope.participants = participants;
            })

            var defaultBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(minBounds['lat'], minBounds['lng']),
                new google.maps.LatLng(maxBounds['lat'], maxBounds['lng']) )
            map.fitBounds(defaultBounds);

            function calcMinMaxBounds( minMax )
            {
                minBounds['lat'] = Math.min( minBounds['lat'], minMax['lat'] );
                minBounds['lng'] = Math.min( minBounds['lng'], minMax['lng'] );
                maxBounds['lat'] = Math.max( maxBounds['lat'], minMax['lat'] );
                maxBounds['lng'] = Math.max( maxBounds['lng'], minMax['lng'] );
            }
        }
    }

    $scope.backToDetail = function( phase )
    {
        sharedService.route =  phase;
        sharedService.dataBroadcast( sharedService.data, $rootScope );
    }

    $scope.setCenter = function( loc )
    {
        map.setCenter( new google.maps.LatLng(loc['lat'], loc['lng']) );
    }

}]);

Meteor.subscribe('wayfiles');

app.controller('ProfileCtrl', ['$scope', '$meteor', '$location', '$routeParams', '$window', '$rootScope', '$dialog', function( $scope, $meteor, $location, $routeParams, $window, $rootScope, $dialog )
{
    if ( !didYouLogin() ) return;

    sharedService.i18nApply( 'profile', $scope );
    sharedService.selectMenuBroadcast( 'profile', $rootScope );

    if ( sharedService.isDirectRoute )
    {
        $scope.isDirectRoute = true;
        sharedService.hideMenuBroadcast( $rootScope );
    }

    $scope.WayUsers = $meteor('wayusers');
    var users = $scope.WayUsers.find( { id : sharedService.user['id'] } );

    $scope.WayUsers = $meteor('wayusers');
    $scope.profile = $scope.WayUsers.find( { id : sharedService.user['id'] } )[0];

//    var aaa1 = WayFliesFS.findOne({_id:'b47b3atpkSjJG2FGB'})
//    var aaa2 = WayFliesFS.findOne('avatar')
//    var aaa3 = WayFliesFS.find();
//    var aaa4 = WayFliesFS.find({})

    var profileFile = WayFliesFS.findOne({ metadata : { owner :  sharedService.user['id'] } });
    if ( profileFile )
    {
        WayFliesFS.retrieveBlob(profileFile['_id'], function(fileItem) {

            //loadImage(fileItem.file);

            var getURL = $window.URL || $window.webkitURL || $window;
            var object_url = getURL.createObjectURL(fileItem.blob);

            var imgtag = document.getElementById('imgPhoto');
            imgtag.title = fileItem.filename;
            imgtag.src = object_url;

//            if (fileItem.blob)
//                saveAs(fileItem.blob, fileItem.filename)
//            else
//                saveAs(fileItem.file, fileItem.filename);

        });

//        var imgtag = document.getElementById('imgPhoto');
//        imgtag.title = profileFile.filename;
//        //imgtag.src = getBaseURL() + profileFile.fileHandler.default1['url'];
//        imgtag.src = profileFile.fileHandler.default1['url'];
//        alert('imgtag.src:::'+imgtag.src)
    }

    $scope.setFiles = function(element)
    {
        $scope.$apply(function(scope)
        {
            console.log('files:', element.files);
            // Turn the FileList object into an Array
            scope.files = [element.files[0]];

            var selectedFile = scope.files[0];
            loadImage( selectedFile );

            scope.progressVisible = false;

        });
    };

    function loadImage(file)
    {
        var reader = new FileReader();

        var imgtag = document.getElementById('imgPhoto');
        imgtag.title = file.name;

        reader.onload = function(event) {
            imgtag.src = event.target.result;
        };

        reader.readAsDataURL(file);
    }

    $scope.uploadFile = function()
    {
        var file = $scope.files[0];
        var fileId = WayFliesFS.storeFile(file, { owner : sharedService.user['id'] });
    }

    function uploadProgress(evt) {
        $scope.$apply(function(){
            if (evt.lengthComputable) {
                $scope.progress = Math.round(evt.loaded * 100 / evt.total)
            } else {
                $scope.progress = 'unable to compute'
            }
        })
    }

    function uploadComplete(evt)
    {
        /* This event is raised when the server send back a response */
        alert(evt.target.responseText)
    }

    function uploadFailed(evt)
    {
        alert("There was an error attempting to upload the file.")
    }

    function uploadCanceled(evt)
    {
        $scope.$apply(function(){
            $scope.progressVisible = false
        })
        alert("The upload has been canceled by the user or the browser dropped the connection.")
    }
}]);