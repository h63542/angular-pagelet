
var globalVariable=0;
var sys = require('sys');
setTimeout(function () { globalVariable=1; },2000);
$waitUntil(
    function () {
        console.log("checking globalVariable="+globalVariable);
        return globalVariable==0;
    },
    function () {
        console.log("done");
    }
);

/// $waitUntil
///     waits until a certain function returns true and then executes a code. checks the function periodically
/// parameters
///     check - a function that should return false or true
///     onComplete - a function to execute when the check function returns true
///     delay - time in milliseconds, specifies the time period between each check. default value is 100
///     timeout - time in milliseconds, specifies how long to wait and check the check function before giving up
function $waitUntil(check,onComplete,delay,timeout) {
    // if the check returns true, execute onComplete immediately
    if (check()) {
        onComplete();
        return;
    }
    if (!delay) delay=100;
    var timeoutPointer;
    var intervalPointer=setInterval(function () {
        if (!check()) return; // if check didn't return true, means we need another check in the next interval
        // if the check returned true, means we're done here. clear the interval and the timeout and execute onComplete
        clearInterval(intervalPointer);
        if (timeoutPointer) clearTimeout(timeoutPointer);
        onComplete();
    },delay);
    // if after timeout milliseconds function doesn't return true, abort
    if (timeout) timeoutPointer=setTimeout(function () {
        clearInterval(intervalPointer);
    },timeout);
}
