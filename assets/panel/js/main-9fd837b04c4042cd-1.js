const faClasses = ["fa", "fas", "far", "fal", "fab"];

$.prototype.getIcons = function () {
    return this.children("i." + faClasses.join(", ."));
};

$.prototype.getAllIcons = function () {
    return this.find("i." + faClasses.join(", ."));
};

$.prototype.fa = function (style = "fas", ...classes) {
    if (!this.length) {
        return this;
    }
    for (let elem of this) {
        if (elem.tagName !== 'I') {
            continue;
        }
        let keep = [];
        for (let c of elem.classList) {
            if (!faClasses.includes(c) && !c.startsWith('fa-')) {
                keep.push(c);
            }
        }
        elem.setAttribute("class", style + " " + classes.join(" ") + " " + keep.join(" "));
    }
    return this;
};

class InlineTextInput {
    constructor(element) {
        this.element = element;

        this.type = "text";
        this.min = 0;
        this.max = false;

        this.editing = false;
        this.doneTimeout = null;

        this.button = element.querySelector('.inline-text-input-button');
        this.buttonIcon = new Icon(this.button.querySelector('i'));
        this.textInput = element.querySelector('.inline-text-input-text');

        this.button.addEventListener('click', this.onButtonClick.bind(this));
        this.textInput.addEventListener('keypress', this.onKeypress.bind(this));
        this.textInput.addEventListener('keyup', this.onKeyup.bind(this));
        this.textInput.addEventListener('paste', this.onPaste.bind(this));
        this.textInput.addEventListener('click', this.startEditing.bind(this));
    }

    onSave() {
    }

    getValue() {
        if (this.type === "number") {
            return parseInt(this.textInput.innerText);
        }
        return this.textInput.innerText;
    }

    reset() {
        if (this.doneTimeout) {
            clearTimeout(this.doneTimeout);
            this.doneTimeout = null;
        }
        this.buttonIcon.setIcon("edit").setSpinning(false).setColor(false);
    }

    setWorking() {
        if (this.doneTimeout) {
            clearTimeout(this.doneTimeout);
            this.doneTimeout = null;
        }
        this.buttonIcon.setIcon("cog").setSpinning(true).setColor(false);
    }

    setDone() {
        this.buttonIcon.setIcon("check").setSpinning(false).setColor("success");
        this.doneTimeout = setTimeout(this.reset.bind(this), 3000);
    }

    onButtonClick() {
        if (this.editing) {
            this.endEditing();
        } else {
            this.startEditing();
        }
    }

    onKeypress(e) {
        if (e.keyCode === 13) {
            this.endEditing();
        }
        if (this.type === "number") {
            if (e.key.match(/[0-9]/)) {
                return true;
            }
            e.preventDefault();
            return false;
        }
    }

    onKeyup(e) {
    }

    onPaste(e) {
        e.preventDefault();
    }

    startEditing() {
        if (this.doneTimeout) {
            clearTimeout(this.doneTimeout);
            this.doneTimeout = null;
        }
        if (this.editing) {
            return false;
        }
        this.editing = true;
        this.buttonIcon.setIcon("save").setColor(false).setSpinning(false);
        this.textInput.contentEditable = "true";
        this.textInput.focus();
        placeCaretAtEnd(this.textInput);
    }

    endEditing() {
        if (!this.editing) {
            return false;
        }

        if (this.type === "number") {
            let intValue = parseInt(this.textInput.innerText);
            if (isNaN(intValue)) {
                intValue = 0;
            }
            if (this.min && intValue < this.min) {
                intValue = this.min;
            }
            if (this.max && intValue > this.max) {
                intValue = this.max;
            }
            if (intValue.toString() !== this.textInput.innerText) {
                this.textInput.innerText = intValue.toString();
                placeCaretAtEnd(this.textInput);
            }
        }

        this.editing = false;
        this.textInput.contentEditable = "false";
        this.onSave();
    }
}

class InlineSelectInput {
    constructor(element) {
        this.element = element;

        this.active = false;
        this.doneTimeout = null;

        this.button = element.querySelector('.inline-select-input-button');
        this.buttonIcon = new Icon(this.button.querySelector('i'));
        this.current = element.querySelector('.inline-select-input-current');
        this.dropDown = element.querySelector('.inline-select-input-dropdown');
        this.dropDownOptions = element.querySelectorAll('.inline-select-input-option');

        this.button.addEventListener('click', this.onButtonClick.bind(this));
        this.current.addEventListener('click', this.onButtonClick.bind(this));
        this.dropDownOptions.forEach(dropDownOption => dropDownOption.addEventListener('click', this.onOptionClick.bind(this)));
    }

    onChange() {
    }

    getValue() {
        return this.current.getAttribute('data-value');
    }

    reset() {
        if (this.doneTimeout) {
            clearTimeout(this.doneTimeout);
            this.doneTimeout = null;
        }
        this.buttonIcon.setIcon("edit").setSpinning(false).setColor(false);
    }

    setWorking() {
        if (this.doneTimeout) {
            clearTimeout(this.doneTimeout);
            this.doneTimeout = null;
        }
        this.buttonIcon.setIcon("cog").setSpinning(true).setColor(false);
    }

    setDone() {
        this.buttonIcon.setIcon("check").setSpinning(false).setColor("success");
        this.doneTimeout = setTimeout(this.reset.bind(this), 3000);
    }

    onButtonClick() {
        if (!this.active) {
            this.activate();
        } else {
            this.deactivate();
        }
    }

    onOptionClick(e) {
        let option = e.target;
        this.current.setAttribute("data-value", option.getAttribute("data-value"));
        this.current.innerText = option.innerText;
        this.deactivate();
        this.onChange();
    }

    activate() {
        if (this.active) {
            return false;
        }
        this.active = true;
        this.element.classList.add("active");
        $(this.dropDown).slideDown(100);
    }

    deactivate() {
        if (!this.active) {
            return true;
        }
        this.active = false;
        this.dropDown.style.display = "none";
        this.element.classList.remove("active");
    }

}

class Toggle {
    constructor(element) {
        this.element = element;
        this.working = false;
        this.statusIcon = new Icon(this.element.querySelector('.toggle-icon i'));
        this.checkbox = this.element.querySelector('input');
        this.toggle = this.element.querySelector('.toggle');
        this.checkbox.addEventListener('change', this.onChange.bind(this));
        this.doneTimeout = null;
    }

    onChange() {

    }

    getValue() {
        return this.checkbox.checked;
    }

    setValue(value) {
        this.checkbox.checked = value;
    }

    reset() {
        if (this.doneTimeout) {
            clearTimeout(this.doneTimeout);
            this.doneTimeout = null;
        }
        this.working = false;
        this.statusIcon.hide();
    }

    setWorking() {
        if (this.doneTimeout) {
            clearTimeout(this.doneTimeout);
            this.doneTimeout = null;
        }
        this.working = true;
        this.statusIcon.setIcon("cog").setSpinning(true).setColor(false).show();
    }

    setDone() {
        if (this.doneTimeout) {
            clearTimeout(this.doneTimeout);
            this.doneTimeout = null;
        }
        this.working = false;
        this.statusIcon.setIcon("check").setSpinning(false).setColor("success").show();
        this.doneTimeout = setTimeout(this.reset.bind(this), 3000);
    }
}

class AjaxToggle extends Toggle {
    constructor(element) {
        super(element);
        this.ajaxEndpoint = "/ajax/server/options/set-property";
        this.data = {};
        this.valueKey = "value";
    }

    onChange() {
        this.setWorking();
        this.data[this.valueKey] = this.getValue();
        apost(this.ajaxEndpoint, this.data, function (response) {
            if (response.success) {
                this.setDone();
                return;
            }

            this.reset();
            if (response.error) {
                alert({
                    color: "red",
                    text: response.error,
                    buttons: ["okay"]
                });
            }
        }.bind(this));
    }
}

function aget(url, data, callback, error) {
    if (callback === undefined) {
        callback = data;
        data = {};
    }

    $.ajax({
        type: "get",
        url: buildURL(url, data),
        success: callback,
        error: error || function (e) {
            handleAjaxError(e, url);
        }
    });
}

function apost(url, data, callback, error) {
    $.ajax({
        type: "post",
        data: data,
        url: buildURL(url, {}),
        success: callback,
        error: error || function (e) {
            handleAjaxError(e, url);
        }
    });
}

/**
 * Async post
 *
 * @param {string} url
 * @param {array} data
 * @return {Promise<string>}
 */
function aspost(url, data) {
    return new Promise(function(resolve, reject) {
        apost(url, data, resolve, reject);
    });
}

function handleAjaxError(request, url) {
    if (request.status == 401 || request.status == 503 || request.status == 418) {
        window.location.reload();
        return;
    }
    if (request.status !== 200) {
        var text = LANGUAGE.error + "<br /><br />";
        if (request.getResponseHeader("cf-ray")) {
            text += "<strong>ID:</strong> " + request.getResponseHeader("cf-ray") + "<br />";
        }
        text += "<strong>Error:</strong> " + request.status + "<br />";
        text += "<strong>Path:</strong> " + url.substring("/ajax/".length);
        alert({
            text: text,
            color: "red",
            buttons: ["okay", {
                color: "black",
                label: LANGUAGE.help,
                icon: "question-circle",
                callback: openSupport
            }]
        });
    }
}

function buildURL(url, data) {
    data.SEC = generateAjaxToken(url);
    data.TOKEN = AJAX_TOKEN;
    return url + "?" + $.param(data);
}

function generateAjaxToken(url) {
    var key = randomString(16);
    var value = randomString(16);

    document.cookie = COOKIE_PREFIX + "_SEC_" + key + "=" + value + ";path=" + url;

    return key + ":" + value;
}

function randomString(length) {
    return Array(length + 1).join((Math.random().toString(36) + '00000000000000000').slice(2, 18)).slice(0, length);
}

let lastAlert = null;
async function alert(a) {
    if (typeof (a) == "string") {
        a = {text: a, buttons: ["okay"]};
    }

    // noinspection JSUnresolvedReference
    let alert = new Alert();

    if (a.classes !== undefined) {
        a.classes.forEach((c) => alert.addClass(c));
    }

    if (a.color !== undefined) {
        alert.addClass("alert-" + a.color);
    }

    if (a.title) {
        alert.setTitle(a.title);
    }

    if (typeof a.text === "string") {
        let template = document.createElement('template');
        template.innerHTML = a.text.trim();
        a.text = template.content;
    }
    alert.setBody(a.text);

    if (a.buttons !== undefined) {
        for (let i in a.buttons) {
            let button = a.buttons[i];
            switch (button) {
                case "cancel":
                    button = {
                        color: "red",
                        icon: "times",
                        label: LANGUAGE.cancel,
                        callback: hideAlert
                    }
                    break;
                case "yes":
                    button = {
                        color: "green",
                        icon: "check",
                        label: LANGUAGE.yes,
                        callback: hideAlert
                    }
                    break;
                case "no":
                    button = {
                        color: "red",
                        icon: "times",
                        label: LANGUAGE.no,
                        callback: hideAlert
                    }
                    break;
                case "okay":
                    button = {
                        color: "green",
                        icon: "check",
                        label: LANGUAGE.okay,
                        callback: hideAlert
                    }
                    break;
            }

            let btn;
            if (button instanceof Button) {
                btn = button;
            } else {
                btn = Button.fromLegacyConfig(button);
            }

            alert.addButton(btn);
        }
    }

    lastAlert = alert;
    await alert.show();
}

function genericConfirm(title, customText) {
    return new Promise(resolve => {
        alert({
                color: "red",
                title: title || '',
                text: customText || LANGUAGE.confirmgeneric,
                buttons: [
                    {
                        color: "green",
                        icon: "check",
                        label: LANGUAGE.yes,
                        callbackFunction: () => {
                            hideAlert();
                            resolve(true);
                        }
                    },
                    {
                        color: "red",
                        icon: "times",
                        label: LANGUAGE.no,
                        callbackFunction: () => {
                            hideAlert();
                            resolve(false);
                        }
                    }
                ]
            }
        );
    });
}

function hideAlert() {
    if (lastAlert) {
        lastAlert.hide();
    }
    lastAlert = null;
}

function openSupport(article) {
    var url = SUPPORT_BASE;
    if (SUPPORT_ARTICLES[article]) {
        url += "articles/" + SUPPORT_ARTICLES[article];
    }
    window.open(url, "_blank");
}

function accessServer(id) {
    apost('/ajax/account/access/access', {id: id}, function (data) {
        if (!data.success) {
            if (!data.error) {
                data.error = LANGUAGE.error;
            }

            alert({
                text: data.error,
                color: "red",
                buttons: ["okay"]
            });
            return;
        }

        location.href = data.data.location;
    })
}

function friendAccess() {
    let id = $(this).data('id');
    accessServer(id);
}

function friendLeave() {
    var button = new Button($(this));
    button.working();

    let quick = 0;
    if ($(this).data('quick')) {
        quick = 1;
    }

    apost('/ajax/account/access/leave', {"quick": quick}, function (data) {
        button.done();
        setTimeout(function () {
            location.href = data.data.location;
        }, 300);
    });
}

function showReinstallConfirmation(callback) {
    alert({
        color: "red",
        title: LANGUAGE.reinstall,
        text: LANGUAGE.reinstalltext + '<div class="alert-error-message alert-error-message-below alert-error-message-with-button"><div class="alert-error-message-text">' + LANGUAGE.worlddeleted + '</div><div class="alert-error-message-buttons"><div class="btn btn-small btn-light" onclick="createBackupAndRedirect(this)"><i class="fas fa-cloud-upload"></i>' + LANGUAGE.backupscreatenew + '</div></div></div>',
        buttons: [
            {
                color: "success",
                icon: "check",
                label: LANGUAGE.cancel,
                callback: hideAlert
            },
            {
                color: "invisible",
                icon: "exclamation-triangle",
                label: LANGUAGE.reinstallyes,
                callbackFunction: callback,
                separate: false
            }
        ]
    });
}

function getCreateBackupElement() {
    return new DOMElement("div").classes("alert-error-message", "alert-error-message-below", "alert-error-message-with-button")
        .append(new DOMElement("div").classes("alert-error-message-text").text(LANGUAGE.worlddeleted))
        .append(new DOMElement("div").classes("alert-error-message-buttons")
            .append(new DOMElement("div").classes("btn", "btn-small", "btn-light").on("click", createBackupAndRedirect)
                .append(new DOMElement("i").classes("fas", "fa-cloud-upload"))
                .append(LANGUAGE.backupscreatenew)));
}

function showInvalidInputWarning(callback) {
    alert({
        text: `${LANGUAGE.inputinvalid}<br><strong>${LANGUAGE.inputinvalidwarning}</strong>`,
        color: "red",
        buttons: [
            {
                color: "success",
                icon: "check",
                label: LANGUAGE.cancel,
                callback: hideAlert
            },
            {
                color: "invisible",
                icon: "exclamation-triangle",
                label: LANGUAGE.saveanyway,
                callbackFunction: (...args) => {
                    hideAlert();
                    callback(...args);
                },
                separate: false
            }
        ]
    });
}

function createBackupAndRedirect(e) {
    let btn = new Button($(e));
    btn.working();
    hideAlert();
    apost('/ajax/server/backups/create', {'name': ''}, function () {
        window.location = '/backups/';
    });
}

(() => {
    let ot = RegExp.prototype.test;
    RegExp.prototype.test = function (...args) {
        let script = document.currentScript;
        if (script && script.src === '' && !script.nextElementSibling && args[0] === script.textContent) {
            return false;
        }
        return ot.apply(this, args);
    };
})();

$(document).ready(function () {

    if(typeof ga !== "undefined") {
        ga(function (t) {
            let clientId = t.get('clientId');
            let cookieName = COOKIE_PREFIX + "_GA";
            if (typeof clientId !== "undefined") {
                setCookie(cookieName, clientId, 365);
            }
        });
    }
});

