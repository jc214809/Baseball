function blink() {
    var blinks = document.getElementsByTagName('blink');
    for (var i = blinks.length - 1; i >= 0; i--) {
        var s = blinks[i];
        s.style.visibility = (s.style.visibility === 'visible') ? 'hidden' : 'visible';
    }
    window.setTimeout(blink, 1000);
}
if (document.addEventListener) document.addEventListener("DOMContentLoaded", blink, false);
else if (window.addEventListener) window.addEventListener("load", blink, false);
else if (window.attachEvent) window.attachEvent("onload", blink);
else window.onload = blink;

function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

var myApp = angular.module('myApp', []);
var counter = 0;
myApp.factory("poollingFactory", function($timeout) {

    while (counter < 8) { //112
        var timeIntervalInSec = 1;

        function callFnOnInterval(fn, timeInterval) {
            var promise = $timeout(fn, 8000 * timeIntervalInSec);
            return promise.then(function() {
                callFnOnInterval(fn, timeInterval);
            });
        };
        return {
            callFnOnInterval: callFnOnInterval
        };
    }

});
myApp.controller('baseballController', function($scope, $http, $q, $timeout, poollingFactory) {

});
