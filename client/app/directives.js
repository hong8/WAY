app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

////////////////////////////////////////////////////////////////////////////////////////////////

app.directive('highcharts', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            value: "="
        },
        transclude:true,
        replace: true,

        link: function (scope, element, attrs) {
            var chartsDefaults = {
                chart: {
                    renderTo: element[0],
                    type: attrs.type || null,
                    height: attrs.height || null,
                    width: attrs.width || null
                }
            };

            //Update when charts data changes
            scope.$watch(function() {
                return scope.value;
            }, function(value) {
                if(!value) return;
                // We need deep copy in order to NOT override original chart object.
                // This allows us to override chart data member and still the keep
                // our original renderTo will be the same
                var deepCopy = true;
                var newSettings = {};
                $.extend(deepCopy, newSettings, chartsDefaults, scope.value);
                var chart = new Highcharts.Chart(newSettings);
            });
        }
    };
});

////////////////////////////////////////////////////////////////////////////////////////////////

app.directive('pseudoElements', function()
{
    return {
        link: function( scope, elm, attrs, model )
        {
            var options = scope.$eval( attrs.pseudoElements );
            scope.$watch( attrs.ngModel, function( value )
            {
                if ( sharedService['user']['photo'] && sharedService['user']['photo'] != '' )
                {
                    var userName = value['user']['name'];
                    var className = value['user']['user_id'] == sharedService['user']['id'] ? 'bubbledLeft' : 'bubbledRight';
                    elm.removeClass( className );
                    var modclass = className + userName;

                    $('<style type="text/css"> .' + modclass + ':after{z-index: -1; position: absolute; right: -36px; width: 32px; bottom: 0px; height: 32px; content:" "; background-image: url(../images/chat/'+userName+'.jpg); background-size: 32px 32px; background-position: bottom left; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; -o-border-radius: 3px; -ms-border-radius: 3px;}'+'</style>').appendTo('head');
                    elm.addClass(modclass);
                }
            });

        }
    };
});

////////////////////////////////////////////////////////////////////////////////////////////////

app.directive('scrollGlue', function(){
    return {
        priority: 1,
        require: ['?ngModel'],
        restrict: 'A',
        link: function(scope, $el, attrs, ctrls){
            var el = $el[0],
                ngModel = ctrls[0] || fakeNgModel(true);

            function scrollToBottom(){
                el.scrollTop = el.scrollHeight;
            }

            function shouldActivateAutoScroll(){
                return el.scrollTop + el.clientHeight == el.scrollHeight;
            }

            scope.$watch(function(){
                if(ngModel.$viewValue){
                    scrollToBottom();
                }
            });

            $el.bind('scroll', function(){
                scope.$apply(ngModel.$setViewValue.bind(ngModel, shouldActivateAutoScroll()));
            });
        }
    };
});

function fakeNgModel(initValue){
    return {
        $setViewValue: function(value){
            this.$viewValue = value;
        },
        $viewValue: initValue
    };
}

////////////////////////////////////////////////////////////////////////////////////////////////

app.directive('focusOn', function() {
    return function(scope, elem, attr) {
        scope.$on(attr.focusOn, function(e) {
            elem[0].focus();
        });
    };
});

////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////