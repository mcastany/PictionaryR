(function() {
    'use strict';

    // TODO: replace app with your module name
    angular.module('app').directive('chatDirective', ['$window', chatDirective]);
    
    function chatDirective ($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                messages: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {
            scope.$watch('messages', function () {
                element.scrollTop(element.scrollHeight);
            });
        }
    }

})();