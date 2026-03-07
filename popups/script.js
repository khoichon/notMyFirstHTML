// Inside the popup window
var checkParent = setInterval(function() {
    if (!window.opener || window.opener.closed) {
        clearInterval(checkParent);
        window.close();
    }
}, 1000); // Check every second
// If the popup is closed, close the parent window
