define(['jquery.cookie', 'utility'], function() {
    'use strict';
    return function (homepageURL) {
        function postJSON(url, data, callback) {
            $.ajax({
                type:'POST',
                url: url,
                dataType: 'json',
                data: data,
                success: callback,
            });
        }

        // Clear the login error message when credentials are edited
        $('input#email').on('input',function() {
            $('#login_error').removeClass('is-shown');
        });

        $('input#password').on('input',function() {
            $('#login_error').removeClass('is-shown');
        });

        $('form#login_form').submit(function(event) {
            event.preventDefault();
            var submit_data = $('#login_form').serialize();

            postJSON('/login_post', submit_data, function(json) {
                if(json.success) {
                    var next = /next=([^&]*)/g.exec(decodeURIComponent(window.location.search));
                    // homepageURL="/"
                    if (next &&   next.length > 1 && !isExternal(next[1])) {
                        location.href = next[1];
                    } else {
                        location.href = homepageURL;
                    }
                } else if($('#login_error').length === 0) {
                    $('#login_form').prepend(
                        '<div id="login_error" class="message message-status error">' +
                        json.value +
                        '</span></div>'
                    );
                    $('#login_error').addClass('is-shown');
                } else {
                    $('#login_error')
                        .stop()
                        .addClass('is-shown')
                        .html(json.value);
                }
            });
        });
    };
});
