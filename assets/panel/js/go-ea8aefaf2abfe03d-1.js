
$('#user').focus();

$('#user').keydown(function(e){
    if(e.keyCode === 13) {
        login();
    }
});

$('#password').keydown(function(e){
    if(e.keyCode === 13) {
        login();
    }
});

$('#twofactor-code').keydown(function(e){
    if(e.keyCode === 13) {
        login();
    }
});

function login() {
    var user = $('#user').val();
    var password = md5($('#password').val());
    if (!user || !password) {
        return;
    }
    var arguments = { user: user, password: password };
    if($('.login-twofactor').css("display") !== "none") {
        arguments.code = $('#twofactor-code').val();
    }
    var btn = new Button($('#login'));
    btn.working();

    apost('/ajax/account/login', arguments, function(data){
        if (data.success && data.data.show2FA) {
            btn.reset();
            $('.login-twofactor').css({display: "flex"});
            $('#twofactor-code').focus();
            return;
        }

        if(data.success) {
            btn.done();
            var goto = getCookie(COOKIE_PREFIX + "_GOTO");
            if(goto) {
                eraseCookie(COOKIE_PREFIX + "_GOTO");
                location.href = atob(decodeURIComponent(goto));
            } else {
                location.href = '/servers/';
            }
        } else {
            if(data.error) {
                $('.login-error').html('<i class="fas fa-exclamation-triangle"></i> ' + data.error);
                $('.login-error').show();
                btn.reset();
            }
        }
    });
}

let loginError = getCookie(COOKIE_PREFIX + "_LOGIN_ERROR");
if(location.pathname.split("/")[2] === "error" || loginError) {
    eraseCookie(COOKIE_PREFIX + "_LOGIN_ERROR");
    alert({
        color: "red",
        text: loginError ? decodeURIComponent(loginError) : LANGUAGE.error,
        buttons: ["okay"]
    });
}
