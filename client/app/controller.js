//'use strict';

app.controller('MainCtrl', ['$scope', '$location', '$timeout', function( $scope, $location, $timeout )
{
    Meteor.subscribe("promises");
    Meteor.subscribe("chats");
    Meteor.subscribe("questions");
    Meteor.subscribe("votes");
    Meteor.subscribe("credits");

    $scope.$on('selectMenuBroadcast', function()
    {
        $scope.selectMenu( sharedService.phase );
    });

    $scope.$on('dataBroadcast', function()
    {
        //alert('$location called:::'+'/' + sharedService.route + '/' + sharedService.data['_id'])
        Route = function() { $location.url('/' + sharedService.route + '/' + sharedService.data['_id']); }
        var func = new Route();
        $scope.$apply(func);
    });

    $scope.selectMenu = function( phase )
    {
        switch ( phase )
        {
            case 'my' :
                $scope.title = 'My';
                $scope.naviSelected1 = true;
                $scope.naviSelected2 = false;
                $scope.naviSelected3 = false;
                break;
            case 'new' :
                $scope.title = 'New';
                $scope.naviSelected1 = false;
                $scope.naviSelected2 = true;
                $scope.naviSelected3 = false;
                break;
            case 'credit' :
                $scope.title = 'Credit';
                $scope.naviSelected1 = false;
                $scope.naviSelected2 = false;
                $scope.naviSelected3 = true;
                break;
            case 'detail' :
                $scope.title = 'Promise';
                break;
            case 'chat' :
                $scope.title = 'Chat about ' + sharedService.data['promise'];
                break;
            case 'vote' :
                $scope.title = 'View Vote';
                break;
            case 'alarm' :
                $scope.title = 'Set Alarm';
                break;
            case 'location' :
                $scope.title = 'View Locations';
                break;
        }
    }
}]);

app.controller('MyCtrl', ['$scope', '$meteor', '$routeParams', '$rootScope', '$timeout', function( $scope, $meteor, $routeParams, $rootScope, $timeout )
{
    sharedService.selectMenuBroadcast( 'my', $rootScope );

    $scope.Promises = $meteor('promises');
    $scope.promises = $scope.Promises.find({});

//    var collection = ddp.getCollection('promises');
//    var list = [];
//    for ( var obj in collection )
//    {
//        list.push( collection[obj] )
//    }
    //alert("ddp.getCollection('promises').length:::"+list.length)
    //$scope.promises = list;

    //$timeout( function(){

    var events = [];

    var promises = $scope.promises;
    var len = promises.length;

    var str = ''
    for ( var i = 0; i < len; i++ )
    {
        var promise = promises[i];
        var date = promise['date'];
        var startDate = new Date( date.substr(0,4), parseInt(date.substr(4,2), 10)-1, date.substr(6,2), 0, 0, 0 );

        str += promise['promise'] +','+ date+'(' +date.substr(0,4)+'/'+ parseInt(date.substr(4,2), 10)-1+'/'+ date.substr(6,2) + ')\n'
        events.push( {
                title: promise['promise'],
                start : startDate,
                data : promise
            }
        )
    }
        //alert('len:::'+len)
        //alert(str)
//
//    var date = new Date();
//    var d = date.getDate();
//    var m = date.getMonth();
//    var y = date.getFullYear();

    var $calendar = $("#calendar");
    $calendar.fullCalendar({
        header: {
            left: 'prev,next',
            center: 'title',
            right: ''
//            left: 'prev,next today',
//            center: 'title',
//            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
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
//            {
//                title: 'Click for Google',
//                start: new Date(y, m, 28),
//                end: new Date(y, m, 31),
//                url: 'http://google.com/'
//            }
//        ],
        eventClick: function(event,jsEvent,view){
            console.log(event);

            sharedService.route =  "promise";
            sharedService.dataBroadcast( event.data, $rootScope );
        },
        eventDrop: function(event,jsEvent,view){
            console.log(event);
        },
        eventResize: function(event,jsEvent,view){
            console.log(event);
        }
    });


    //},1000)
}]);

app.controller('NewCtrl', ['$scope', '$meteor', '$routeParams', '$rootScope', function( $scope, $meteor, $routeParams, $rootScope )
{
    sharedService.selectMenuBroadcast( 'new', $rootScope );

    $scope.newMode = true;

    //Handling Promisies
    $scope.promise = {};
    var dt = new Date();
    var datetime = new Date( Date.UTC( dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), 0 ) );
    $('#dpkDate').datetimepicker('setDate', datetime);
    $('#dpkTime').datetimepicker('setDate', datetime);

    $scope.clickActivity = function( phase )
    {
        if ( $scope.promise.promise && $scope.promise.location && phase == 'save' )
        {
            var date = $("#dpkDate").data('date').replace(/\-/g, '');
            var time = $("#dpkTime").data('date').replace(/\:/g, '');

            var data = {
                promise : $scope.promise.promise,
                location : $scope.promise.location,
                date : date,
                time : time,
                memo : $scope.promise.memo,
                participants : $scope.promise.participants,
                notified : false
            }
            $scope.Promises = $meteor('promises')
            if ( $scope.Promises.insert( data ) )
            {
                alert('New promise is Saved.');
                sharedService.route =  'my';
                sharedService.dataBroadcast( sharedService.data, $rootScope  );
            }
        }
    }

}]);

app.controller('ChatCtrl', ['$scope', '$meteor', '$routeParams', '$rootScope', function( $scope, $meteor, $routeParams, $rootScope )
{
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
            if ( strParticipants.indexOf( chats[i]['user'] ) == -1 )
            {
                participants.push( chats[i]['user'] + ', ' );
                strParticipants += chats[i]['user'] + ', ';
            }
            //chats[i]['style'] = { 'background-image': 'url(images/chat/'+chats[i]['user']+'.jpg)' }
        }
        if ( participants.length > 0 )
            participants[participants.length-1] = participants[participants.length-1].substr(0, participants[participants.length-1].length-2)

        $scope.participants = participants;
        $scope.me = 'hong'
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
                $scope.sendMessage = '';
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

app.controller('VoteCtrl', ['$scope', '$meteor', '$routeParams', '$rootScope', function( $scope, $meteor, $routeParams, $rootScope )
{
    sharedService.selectMenuBroadcast( 'vote', $rootScope );

    $scope.editMode = false;

    //Handling Questions
    $scope.Questions = $meteor('questions');

    if ( $routeParams.promise_id )
        $scope.questions = $scope.Questions.find( { promise_id : $routeParams.promise_id } );
    else
        $scope.questions = $scope.Questions.find({});

    if ( $scope.questions.length > 0 )
    {
        $scope.question = $scope.questions[0];

        $scope.Votes = $meteor('votes');
        $scope.votes = $scope.Votes.find( { promise_id : $scope.question.promise_id } );

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

    }
    else
    {
        $scope.question = {};
    }

    $scope.backToDetail = function( phase )
    {
        sharedService.route =  phase;
        sharedService.dataBroadcast( sharedService.data, $rootScope  );
    }

}]);

app.controller('CreditCtrl', ['$scope', '$meteor', '$routeParams', '$http', '$rootScope', function( $scope, $meteor, $routeParams, $http, $rootScope )
{
    sharedService.selectMenuBroadcast( 'credit', $rootScope );

    $scope.Credits = $meteor('credits');
    $scope.credits = $scope.Credits.find({});

    $scope.selectView = function( idx )
    {

        if ( idx == 1 ) {
            $scope.template = {url:"partials/credit/creditTable.html"};
            $scope.dropSelected1 = true;
            $scope.dropSelected2 = false;
            $scope.dropSelected3 = false;
        } else if ( idx == 2 ) {
            $scope.template = {url:"partials/credit/creditVisual1.html"};
            $scope.dropSelected1 = false;
            $scope.dropSelected2 = true;
            $scope.dropSelected3 = false;
        } else if ( idx == 3 ) {
            $scope.template = {url:"partials/credit/creditVisual2.html"};
            $scope.dropSelected1 = false;
            $scope.dropSelected2 = false;
            $scope.dropSelected3 = true;
        } else {

        }
    }

    $http.get("partials/charts/basicChart.json").success(function(data)
    {
        var categories = [];
        var credits = $scope.credits;
        var len = credits.length;
        for ( var i = 0; i < len; i++ )
        {
            categories.push( credits[i]["user"] );
        }
        data.xAxis.categories = categories;

        var series1 = { name : "Plan", data : [] };
        var series2 = { name : "Actual", data : [] };
        for ( var i = 0; i < len; i++ )
        {
            series1.data.push( credits[i]["plan"] );
            series2.data.push( credits[i]["actual"] );
        }
        data.series = [ series1, series2 ];

        $scope.basicChart = data;
    });

}]);

app.controller('PromiseDetailCtrl', ['$scope', '$meteor', '$routeParams', '$rootScope', function( $scope, $meteor, $routeParams, $rootScope )
{
    //alert('PromiseDetailCtrl called')

    sharedService.selectMenuBroadcast( 'detail', $rootScope );

    $scope.newMode = false;

    //Handling Promisies
    if ( $routeParams.promise_id )
    {
        $scope.promise = sharedService.data;

        //Handling Date and Time Picker
        var date = $scope.promise['date'];
        var time = $scope.promise['time'];
        var datetime = new Date( Date.UTC(parseInt(date.substr(0,4)), parseInt(date.substr(4,2))-1, parseInt(date.substr(6,2)), parseInt(time.substr(0,2)), parseInt(time.substr(2,2)), 0) );
        $('#dpkDate').datetimepicker('setDate', datetime);
        $('#dpkTime').datetimepicker('setDate', datetime);
    }

    $scope.clickActivity = function( phase )
    {
        switch ( phase )
        {
            case 'notify' :

                break;
            case 'chat' :
            case 'location' :
            case 'vote' :
            case 'alarm' :
                sharedService.route =  phase;
                sharedService.dataBroadcast( sharedService.data, $rootScope );
                break;
        }
    }

    $scope.backToDetail = function( phase )
    {
        sharedService.route =  phase;
        sharedService.dataBroadcast( sharedService.data, $rootScope );
    }

}]);

app.controller('AlarmCtrl', ['$scope', '$meteor', '$routeParams', '$rootScope', function( $scope, $meteor, $routeParams, $rootScope )
{
    //alert('AlarmCtrl called')

    sharedService.selectMenuBroadcast( 'alarm', $rootScope );

    if ( $routeParams.promise_id )
    {

    }

    $scope.backToDetail = function( phase )
    {
        sharedService.route =  phase;
        sharedService.dataBroadcast( sharedService.data, $rootScope );
    }
}]);

app.controller('LocationCtrl', ['$scope', '$meteor', '$routeParams', '$timeout', '$rootScope', function( $scope, $meteor, $routeParams, $timeout, $rootScope )
{
    //alert('LocationCtrl called')

    sharedService.selectMenuBroadcast( 'location', $rootScope );

    if ( $routeParams.promise_id )
    {
        $scope.promise = sharedService.data;

        var loc1 = new google.maps.LatLng(37.52334163941946, 126.97586059570312);
        var loc2 = new google.maps.LatLng(37.541310686527986, 126.98169708251953);
        var loc3 = new google.maps.LatLng(37.536682709556395, 127.00813293457031);
        var loc4 = new google.maps.LatLng(37.503461742362994, 126.95903778076172);
        var loc5 = new google.maps.LatLng(37.50073805642874, 126.98650360107422);
        var loc6 = new google.maps.LatLng(37.50291701312484, 127.01911926269531);
        var loc7 = new google.maps.LatLng(37.47921744485059, 126.97380065917969);
        var loc8 = new google.maps.LatLng(37.52415850820588, 126.92710876464844);

        var locationArray = [];
        var locationNameArray = [];
        var colorArray = ['blue', 'brown', 'orange', 'green', 'yellow', 'paleblue', 'pink', 'purple', 'red', 'darkgreen'];
        var alphabetArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

        var tempParticipants = sharedService.data['participants'];
        //tempParticipants = ['man1', 'man2', 'man3', 'man4']
        var participants = []
        var len = tempParticipants.length;
        for ( var i = 0; i < len; i++ )
        {
            locationArray.push( eval('loc'+(i+1)) );
            locationNameArray.push( tempParticipants[i] )
            participants.push( { user : '('+alphabetArray[i]+') '+tempParticipants[i], style : {
                'background-color' : colorArray[i],
                'background-image' : '-webkit-gradient(linear,0 0,0 100%,from('+colorArray[i]+'),to('+colorArray[i]+'))',
                'color' : '#ffffff'
            } } )
        }

        $scope.participants = participants;


        function initialize() {

            var map;

            var mapOptions = {
                zoom: 12,
                center: loc1,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions);

            var coord;
            for (coord in locationArray) {
                var marker = new google.maps.Marker({
                    position: locationArray[coord],
                    map: map,
                    title: locationNameArray[coord],
                    icon: 'images/markers/'+colorArray[coord]+'_Marker'+alphabetArray[coord]+'.png'
                });

                $scope.style = {
                    "background-color" : colorArray[coord],
                    "background-image" : "-webkit-gradient(linear,0 0,0 100%,from("+colorArray[coord]+"),to("+colorArray[coord]+"))",
                    "color" : "#ffffff"
                }

//                var contentString =  '<div class="alert alert-success" style="margin: 0px;float: right">' +
//                                        '<a class="close"></a>' +
//                                        '<strong>Success</strong> You successfully read this important alert message.' +
//                                     '</div>'
//                var infowindow = new google.maps.InfoWindow({
//                    content: contentString,
//                    width: 50,
//                    height: 50
//                });
//                infowindow.open(map, marker);

//                google.maps.event.addListener(map, 'zoom_changed', function() {
//                    infowindow.open(map, marker);
//                });
            }


            google.maps.event.addListener(map, 'click', function(event) {
                //alert('Point.X.Y: ' + event.latLng);
            });
        }

        $timeout(function() { initialize(); }, 10);
        //google.maps.event.addDomListener(window, 'load', initialize);
    }

    $scope.backToDetail = function( phase )
    {
        sharedService.route =  phase;
        sharedService.dataBroadcast( sharedService.data, $rootScope );
    }
}]);