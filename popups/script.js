// Inside the popup window
var checkParent = setInterval(function() {
    if (!window.opener || window.opener.closed) {
        clearInterval(checkParent);
        window.close();
    }
}, 1000); // Check every second

// Make a function that the parent window can use to eval javascript in the popup
function evalInPopup(code) {
    eval(code);
}
window.evalInPopup = evalInPopup;