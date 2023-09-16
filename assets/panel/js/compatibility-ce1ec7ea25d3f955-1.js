var CURRENT = /Edge?\/(8[5-9]|9\d|\d{3,})(\.\d+|)(\.\d+|)|Firefox\/(7[89]|[89]\d|\d{3,})\.\d+(\.\d+|)|Chrom(ium|e)\/(79|[89]\d|\d{3,})\.\d+(\.\d+|)|Maci.+ Version\/(12\.([1-9]|\d{2,})|(1[3-9]|[2-9]\d|\d{3,})\.\d+)([,.]\d+|)( Mobile\/\w+|) Safari\/|Chrome.+OPR\/(6[7-9]|[7-9]\d|\d{3,})\.\d+\.\d+|(CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS|CPU iPad OS)[ +]+(12[._]([2-9]|\d{2,})|(1[3-9]|[2-9]\d|\d{3,})[._]\d+)([._]\d+|)|Android:?[ /-](1{2}[4-9]|1[2-9]\d|[2-9]\d{2}|\d{4,})(\.\d+|)(\.\d+|)|Mobile Safari.+OPR\/(7[3-9]|[89]\d|\d{3,})\.\d+\.\d+|Android.+Firefox\/(1{2}[3-9]|1[2-9]\d|[2-9]\d{2}|\d{4,})\.\d+(\.\d+|)|Android.+Chrom(ium|e)\/(1{2}[4-9]|1[2-9]\d|[2-9]\d{2}|\d{4,})\.\d+(\.\d+|)|SamsungBrowser\/(1[3-9]|[2-9]\d|\d{3,})\.\d+/;
var FUTURE = /Edge?\/(8[5-9]|9\d|\d{3,})(\.\d+|)(\.\d+|)|Firefox\/(6[7-9]|[7-9]\d|\d{3,})\.\d+(\.\d+|)|Chrom(ium|e)\/(8[4-9]|9\d|\d{3,})\.\d+(\.\d+|)|Maci.+ Version\/(14\.([1-9]|\d{2,})|(1[5-9]|[2-9]\d|\d{3,})\.\d+)([,.]\d+|)( Mobile\/\w+|) Safari\/|Chrome.+OPR\/([7-9]\d|\d{3,})\.\d+\.\d+|(CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS|CPU iPad OS)[ +]+(14[._]([5-9]|\d{2,})|(1[5-9]|[2-9]\d|\d{3,})[._]\d+)([._]\d+|)|Android:?[ /-](1{2}[4-9]|1[2-9]\d|[2-9]\d{2}|\d{4,})(\.\d+|)(\.\d+|)|Mobile Safari.+OPR\/(7[3-9]|[89]\d|\d{3,})\.\d+\.\d+|Android.+Firefox\/(1{2}[3-9]|1[2-9]\d|[2-9]\d{2}|\d{4,})\.\d+(\.\d+|)|Android.+Chrom(ium|e)\/(1{2}[4-9]|1[2-9]\d|[2-9]\d{2}|\d{4,})\.\d+(\.\d+|)|SamsungBrowser\/(1[4-9]|[2-9]\d|\d{3,})\.\d+/;

if (typeof COOKIE_PREFIX === "undefined") {
    COOKIE_PREFIX = "UNKNOWN";
}

var cookieName = COOKIE_PREFIX + "_COMPATIBILITY";
var dismissDays = 1;
var warningElement = document.getElementById("compatibility-warning");
var buttonElement = document.getElementById("compatibility-warning-dismiss");
checkAndDisplay();

function checkAndDisplay() {
    if (isDismissed()) {
        return;
    }
    var userAgent = navigator.userAgent;
    if (!userAgent) {
        return;
    }
    if (FUTURE.test(userAgent)) {
        return;
    }
    if (typeof warningElement.style.removeProperty === "function") {
        warningElement.style.removeProperty("display");
    } else {
        warningElement.style.display = "block";
    }
    if (CURRENT.test(userAgent)) {
        dismissDays = 7;
        warningElement.classList.add("will-be-incompatible");
    }

    buttonElement.addEventListener("click", dismiss);
}

function isDismissed() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        if (typeof cookie.trim === "function") {
            cookie = cookie.trim();
        }
        if (cookie === cookieName + "=1") {
            return true;
        }
    }
    return false;
}

function dismiss() {
    var date = new Date();
    date.setTime(date.getTime() + dismissDays * 24 * 60 * 60 * 1000);
    document.cookie = cookieName + "=1; expires=" + date.toUTCString() + "; path=/";
    warningElement.style.display = "none";
}