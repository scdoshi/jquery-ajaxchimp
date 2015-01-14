/*!
Mailchimp Ajax Submit
jQuery Plugin
Author: Siddharth Doshi

Use:
===
$('#form_id').ajaxchimp(options);

- Form should have one <input> element with attribute 'type=email'
- Form should have one label element with attribute 'for=email_input_id' (used to display error/success message)
- All options are optional.

Options:
=======
options = {
    language: 'en',
    callback: callbackFunction,
    url: 'http://blahblah.us1.list-manage.com/subscribe/post?u=5afsdhfuhdsiufdba6f8802&id=4djhfdsh99f'
}

Notes:
=====
To get the mailchimp JSONP url (undocumented), change 'post?' to 'post-json?' and add '&c=?' to the end.
For e.g. 'http://blahblah.us1.list-manage.com/subscribe/post-json?u=5afsdhfuhdsiufdba6f8802&id=4djhfdsh99f&c=?',
*/

(function ($) {
    'use strict';

    $.ajaxChimp = {
        responses: {
            0: 'We have sent you a confirmation email',
            1: 'Please enter a value',
            2: 'An email address must contain a single @',
            3: 'The domain portion of the email address is invalid',
            4: 'The username portion of the email address is invalid',
            5: 'This email address looks fake or invalid. Please enter a real email address',
            6: 'is already subscribed to list'
        },
        translations: {
            'en': null
        },
        init: function (selector, options) {
            $(selector).ajaxChimp(options);
        }
    };

    $.fn.ajaxChimp = function (options) {
        $(this).each(function(i, elem) {
            var form = $(elem);
            var email = form.find('input[type=email]');
            var label = form.find('label[for=' + email.attr('id') + ']');

            var settings = $.extend({
                'url': form.attr('action'),
                'language': 'en'
            }, options);

            var url = settings.url.replace('/post?', '/post-json?').concat('&c=?');

            form.attr('novalidate', 'true');
            email.attr('name', 'EMAIL');

            form.submit(function () {
                var msg;
                function successCallback(resp) {
                    if (resp.result === 'success') {
                        msg = 'We have sent you a confirmation email';
                        label.removeClass('error').addClass('valid');
                        email.removeClass('error').addClass('valid');
                    } else {
                        email.removeClass('valid').addClass('error');
                        label.removeClass('valid').addClass('error');
                        var index = -1;
                        try {
                            var parts = resp.msg.split(' - ', 2);
                            if (parts[1] === undefined) {
                                msg = resp.msg;
                            } else {
                                var i = parseInt(parts[0], 10);
                                if (i.toString() === parts[0]) {
                                    index = parts[0];
                                    msg = parts[1];
                                } else {
                                    index = -1;
                                    msg = resp.msg;
                                }
                            }
                        }
                        catch (e) {
                            index = -1;
                            msg = resp.msg;
                        }
                    }


                    // Translate and display message
                    var length = 0, msgnr;

                    if(Object.keys){
                        length = Object.keys($.ajaxChimp.responses).length
                    }
                    else {
                        for (var key in $.ajaxChimp.responses){
                            if ($.ajaxChimp.responses.hasOwnProperty(key)) {
                              length++;
                            }
                        }
                    }

                    while(length--) {
                        if (msg.indexOf($.ajaxChimp.responses[length])!==-1) {
                            msgnr = length;
                        }
                    }

                    if (
                        settings.language !== 'en' && msgnr > -1 && $.ajaxChimp.translations && $.ajaxChimp.translations[settings.language] && $.ajaxChimp.translations[settings.language][msgnr]
                    ) {
                        msg = $.ajaxChimp.translations[settings.language][msgnr];
                    }
                    label.html(msg);

                    label.show(2000);
                    if (settings.callback) {
                        settings.callback(resp);
                    }
                }

                var data = {};
                var dataArray = form.serializeArray();
                $.each(dataArray, function (index, item) {
                    data[item.name] = item.value;
                });

                $.ajax({
                    url: url,
                    data: data,
                    success: successCallback,
                    dataType: 'jsonp',
                    error: function (resp, text) {
                        window.console.log('mailchimp ajax submit error: ' + text);
                    }
                });

                // Translate and display submit message
                var submitMsg = 'Submitting...';
                if(
                    settings.language !== 'en' && $.ajaxChimp.translations && $.ajaxChimp.translations[settings.language] && $.ajaxChimp.translations[settings.language].submit
                ) {
                    submitMsg = $.ajaxChimp.translations[settings.language].submit;
                }
                label.html(submitMsg).show(2000);

                return false;
            });
        });
        return this;
    };
})(jQuery);
