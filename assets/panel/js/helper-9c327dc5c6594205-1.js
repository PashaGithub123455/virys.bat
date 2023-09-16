/**
 * Pad a string to a certain length with another string.
 *
 * Source: https://gist.github.com/wafflesnatcha/3694295
 *
 * @param {Number} size The resulting padded string length.
 * @param {String} [str=" "] String to use as padding.
 * @returns {String} The padded string.
 */
if (!String.prototype.padStart) {
    String.prototype.padStart = function (length, str) {
        if (this.length >= length) {
            return this;
        }
        str = str || ' ';
        return (new Array(Math.ceil((length - this.length) / str.length) + 1).join(str)).substring(0, (length - this.length)) + this;
    };
}

if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function(str, newStr){
        if (str instanceof RegExp) {
            str.global = true;
            return this.replace(str, newStr);
        }
        return this.split(str).join(newStr);
    }
}

function playSound(sound) {
    var audio = new Audio('/panel/sound/' + sound + '.mp3');
    audio.play();
}

function requestNotificationPermissions() {
    if (isNewNotificationSupported()) {
        if (Notification.permission !== "granted") {
            alert({
                text: LANGUAGE.allownotifications,
                buttons: [
                    {
                        label: LANGUAGE.okay,
                        color: "green",
                        icon: "check",
                        callback: requestnotification
                    },
                    "cancel"
                ]
            });
        }
    }
}

function requestnotification() {
    hideAlert();
    if (isNewNotificationSupported()) {
        try {
            Notification.requestPermission().then(function (result) {
                if (result === 'default' || result === 'denied') {
                    return;
                }
            });
        } catch (error) {
            if (error instanceof TypeError) {
                Notification.requestPermission(function () {
                    if (Notification.permission == "granted") {

                    } else {
                        return;
                    }
                });
            } else {
                throw error;
            }
        }
    }
}

function sendNotification(text, callback) {
    try {
        if (isNewNotificationSupported()) {
            if (Notification.permission == "granted") {
                var notification = new Notification(BRAND_NAME, {
                    icon: NOTIFICATION_ICON,
                    body: text,
                });
                notification.onclick = function () {
                    notification.close();
                    window.focus();
                    if (typeof (callback) !== "undefined") {
                        callback(status);
                    }
                };
            }
        }
    } catch (e) {
        alert({
            text: LANGUAGE.error + "<br /><br />" + e.message,
            color: "red",
            buttons: ["okay"]
        });
    }
}

function isNewNotificationSupported() {
    if (!window.Notification || !Notification.requestPermission) {
        return false;
    }
    if (location.hostname.endsWith(".local")) {
        return false;
    }
    if (Notification.permission == 'granted') {
        return true;
    }
    try {
        new Notification('');
    } catch (e) {
        if (e.name == 'TypeError')
            return false;
    }
    return true;
}

function setCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    setCookie(name, "", -1);
}

function htmlentities(str) {
    let el = document.createElement('div');
    el.textContent = str;
    return el.innerHTML.replace(/["']/g, m => m === '"' ? "&quot;" : "&apos;");
}

function copyToClipboard(text) {
    if (typeof navigator.clipboard !== "undefined") {
        return navigator.clipboard.writeText(text);
    }
    let range = document.createRange();

    var tmpElem = $('<div>');
    tmpElem.css({
        position: "absolute",
        left: "-1000px",
        top: "-1000px",
    });
    tmpElem.text(text);
    $("body").append(tmpElem);
    range.selectNodeContents(tmpElem.get(0));
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy", false, null);
    tmpElem.remove();
}

function humanReadableSize(bytes, decimals = 2, base = 1024) {
    let size = [' B', ' kB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
    let factor = Math.floor((String(bytes).length - 1) / 3);
    return `${(bytes / Math.pow(base, factor)).toFixed(2)}` + (size[factor] || '');
}

function updateCountH() {
    $('[data-counth]').each(function (i, element) {
        element = $(element);
        let finish = element.data("counth");
        let timeLeft = finish - Math.round(Date.now() / 1000);
        let hoursLeft = Math.floor(timeLeft / 60 / 60);
        let text;
        if (hoursLeft > 1) {
            text = "in ca. " + hoursLeft + " hours";
        } else if (hoursLeft === 1) {
            text = "in ca. 1 hour";
        } else {
            text = "in less than 1 hour";
        }
        element.text(text);
    });
}

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
        let range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        let textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

function parseRegExp(str) {
    let char = str.charAt(0);
    let last = str.lastIndexOf(char);
    return new RegExp(str.substring(1, last), str.substring(last + 1));
}

function fileAccessPossible(status = lastStatus) {
    return ![3, 5, 8].includes(status.status);
}

function isServerOffline(status = lastStatus) {
    return [0, 10, 7].includes(status.status);
}

function setBackgroundBar(element, percent) {
    percent = Math.max(Math.min(percent, 100), 0);
    element.css({backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1) " + percent + "%, rgba(0, 0, 0, 0) " + percent + "%)"});
}

function getRandomId() {
    let id;
    do {
        id = "id-" + Math.random().toString(36).substring(2, 12)
    } while (document.getElementById(id) !== null);
    return id;
}

$(document).ready(function () {
    $('.js-date').each(function () {
        var date = new Date($(this).data('date') * 1000);
        $(this).text(date.toLocaleDateString());
    });

    $('.js-date-time').each(function () {
        var date = new Date($(this).data('date') * 1000);
        $(this).text(date.toLocaleString());
    });
});