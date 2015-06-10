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
        regexPatterns: {
            success: /Please confirm by clicking on the link we just sent to (.+@.+)/,
            submit: /Submitting.../,
            error: {
                1: /Please enter a value/,
                2: /An email address must contain a single @/,
                3: /The domain portion of the email address is invalid (the portion after the @:(.+))/,
                4: /The username portion of the email address is invalid (the portion before the @:(.+))/,
                5: /This email address looks fake or invalid. Please enter a real email address/,
                6: /.+\#6592.+/,
                7: /(.+@.+) is already subscribed to list (.+)\..+/
            }
        },
        defaultTranslations: {
            en: {
                success: 'Please confirm by clicking on the link we just sent to $1',
                submit: 'Submitting...',
                error: {
                    1: 'Please enter a value',
                    2: 'An email address must contain a single @',
                    3: 'The domain portion of the email address is invalid (the portion after the @: $1)',
                    4: 'The username portion of the email address is invalid (the portion before the @: $1)',
                    5: 'This email address looks fake or invalid. Please enter a real email address',
                    6: 'Too many subscribe attempts for this email address. Please try again in about 5 minutes.',
                    7: '$1 is already subscribed to list $2'
                }
            }
        },
        translations: {},
        defaultOptions: {
            language: 'en',
            errorDiv: '#mce-error-response',
            successDiv: '#mce-success-response',
        },
        successMessage: 'Please confirm by clicking on the link we just sent to ',
        submitMessage: 'Submitting...',
        init: function (selector, options) {
            $(selector).ajaxChimp(options);
        }
    };

    $.ajaxChimp.getTranslation = function(str, language, string_key) {
        if(
            $.ajaxChimp.all_translations[language] &&
            $.ajaxChimp.all_translations[language][string_key]
        ) {
            var regexPattern = $.ajaxChimp.regexPatterns[string_key];
            var translation = $.ajaxChimp.all_translations[language][string_key];
            if ($.type(regexPattern) === 'regexp') {
                return str.replace(regexPattern, translation);
            } else {
                var matchedRegex, matchedTranslation;
                $.each(regexPattern, function(id, regex) {
                    if (translation[id] && str.match(regex) !== null){
                        matchedRegex = regex;
                        matchedTranslation = translation[id];
                        // break the loop
                        return false;
                    }
                });
                return str.replace(matchedRegex, matchedTranslation);
            }
        }
        if (language !== 'en') {
            return $.ajaxChimp.getTranslation(str, 'en', string_key);
        }
        return str;
    };

    $.fn.ajaxChimp = function (options) {
        $.ajaxChimp.all_translations = $.extend(
            {},
            $.ajaxChimp.defaultTranslations,
            $.ajaxChimp.translations
        );

        var deferreds = $(this).map(function(i, elem) {
            var deferred = new $.Deferred();
            var form = $(elem);
            form.attr('novalidate', 'true');

            // Create settings object from default and passed
            //  in options
            var settings = $.extend({
                url: form.attr('action')
            }, $.ajaxChimp.defaultOptions, options);

            var email = form.find('input[type=email]');
            email.attr('name', 'EMAIL');
            var error_div = $(settings.errorDiv);
            var success_div = $(settings.successDiv);

            // Convert ajax call to jsonp
            var url = settings.url.replace('/post?', '/post-json?').concat('&c=?');

            form.on('submit', function (event) {
                event.preventDefault();

                var msg;
                var request_data = {};
                var dataArray = form.serializeArray();
                $.each(dataArray, function (index, item) {
                    request_data[item.name] = item.value;
                });

                $.ajax({
                    url: url,
                    data: request_data,
                    dataType: 'jsonp'
                }).done(function (data, textStatus, jqXHR) {
                    if (data.result === 'success') {
                        email.removeClass('error').addClass('valid');
                        msg = $.ajaxChimp.getTranslation(
                            ($.ajaxChimp.successMessage + request_data.EMAIL),
                            settings.language,
                            'success'
                        );
                        error_div.text('').hide();
                        success_div.text(msg).show(500);
                    } else{
                        email.removeClass('valid').addClass('error');
                        try {
                            var parts = data.msg.split(' - ', 2);
                            if (parts[1] === undefined) {
                                msg = data.msg;
                            } else {
                                msg = parts[1];
                            }
                        }
                        catch (e) {
                            msg = data.msg;
                        }
                        msg = $.ajaxChimp.getTranslation(msg, settings.language, 'error');
                        success_div.text('').hide();
                        error_div.text(msg).show(500);
                    }
                    deferred.resolve(data, textStatus, jqXHR);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    console.log('mailchimp ajax submit error: ' + errorThrown);
                    deferred.reject(jqXHR, textStatus, errorThrown);
                });

                // Translate and display submit message
                var submitMsg = $.ajaxChimp.getTranslation(
                    $.ajaxChimp.submitMessage,
                    settings.language,
                    'submit'
                );
                error_div.text('').hide();
                success_div.text(submitMsg).show(500);

                // return false;
            });
            return deferred;
        });
        if (deferreds.length === 1){
            return deferreds[0];
        }
        return deferreds;
        // return this;
    };
})(jQuery);
