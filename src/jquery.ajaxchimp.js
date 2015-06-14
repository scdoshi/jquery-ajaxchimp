/*!
Mailchimp Ajax Submit
jQuery Plugin
Author: Siddharth Doshi

Use:
===
$('#form_id').ajaxChimp(options);

- Form should have one <input> element with attribute 'type=email'
- Error and success messages will be displayed in elements within the form
    found by errorSelector, successSelector respectively
- The init function returns a deferred object onto which callbacks can be
    attached similar to the jqXhr object returned by $.ajax (done/fail/always)
- All options are optional :).

Options:
=======
options = {
    language: 'en',
    errorSelector: '.error-message',
    successSelector: '.success-message',
    url: 'http://blahblah.us1.list-manage.com/subscribe/post?u=5afsdhfuhdsiufdba6f8802&id=4djhfdsh99f',
    token: 'anti-bot token from mailchimp form'
}

Notes:
=====
To get the mailchimp JSONP url (undocumented), change 'post?' to 'post-json?' and add '&c=?' to the end.
For e.g. 'http://blahblah.us1.list-manage.com/subscribe/post-json?u=5afsdhfuhdsiufdba6f8802&id=4djhfdsh99f&c=?',
*/

;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    $.ajaxChimp = {
        regexPatterns: {
            success: /Please confirm by clicking on the link we just sent to (.+@.+)/,
            submit: /Submitting.../,
            error: {
                1: /Please enter a value/,
                2: /An email address must contain a single @/,
                3: /The domain portion of the email address is invalid \(the portion after the @: (.+)\)/,
                4: /The username portion of the email address is invalid \(the portion before the @: (.+)\)/,
                5: /This email address looks fake or invalid. Please enter a real email address/,
                6: /.+\#6592.+/,
                7: /(.+@.+) is already subscribed to list (.+)\..+<a href.+/
            }
        },
        defaultTranslations: {
            en: {
                success: 'Please confirm by clicking on the link we just sent to $1',
                submit: 'Submitting...',
                error: {
                    1: 'Please enter a value',
                    2: 'An email address must contain a single @',
                    3: 'The domain portion of the email address is invalid (after the @: $1)',
                    4: 'The username portion of the email address is invalid (before the @: $1)',
                    5: 'This email address looks fake or invalid. Please enter a real email address',
                    6: 'Too many subscribe attempts for this email address. Please try again in about 5 minutes.',
                    7: '$1 is already subscribed to the list $2'
                }
            }
        },
        translations: {},
        defaultOptions: {
            language: 'en',
            errorSelector: '#mce-error-response',
            successSelector: '#mce-success-response',
            token: null,
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
                var matchedId = $.ajaxChimp.getRegexMatch(str, string_key);
                if (matchedId && regexPattern[matchedId] && translation[matchedId]) {
                    return str.replace(regexPattern[matchedId], translation[matchedId]);
                }
            }
        }
        if (language !== 'en') {
            return $.ajaxChimp.getTranslation(str, 'en', string_key);
        }
        return str;
    };

    $.ajaxChimp.getRegexMatch = function(str, string_key) {
        var regexPatterns = $.ajaxChimp.regexPatterns[string_key];
        var matchedId;
        $.each(regexPatterns, function(id, regexPattern) {
            if (str.match(regexPattern) !== null){
                matchedId = id;
                // break the loop
                return false;
            }
        });
        return matchedId;
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

            // Create settings object from default and passed in options
            var settings = $.extend({
                url: form.attr('action')
            }, $.ajaxChimp.defaultOptions, options);

            var email = form.find('input[type=email]');
            email.attr('name', 'EMAIL');

            // Add or update token input if anti-bot token passed in from settings
            if (settings.token) {
                var tokenInput = form.find('input[name="' + settings.token + '"]');
                if (tokenInput.length === 0) {
                    var tokenDiv = $('<div/>', {
                        style: 'position: absolute; left: -5000px;',
                    });
                    tokenDiv.append($('<input>', {
                        type: 'text',
                        name: settings.token,
                        tabindex: '-1',
                        value: ''
                    }));
                    form.append(tokenDiv);
                } else {
                    tokenInput.attr('name', settings.token);
                }
            }

            // Add hidden submit element if none present
            if (form.find('input[type="submit"]').length === 0) {
                var submitInput = $('<input>', {
                    type: 'submit',
                    style: 'display: none;',
                });
                form.append(submitInput);
            }

            var error_div = form.find(settings.errorSelector);
            var success_div = form.find(settings.successSelector);

            // Convert url to jsonp url
            var url = settings.url.replace('/post?', '/post-json?').concat('&c=?');

            form.on('submit', function (event) {
                event.preventDefault();

                var msg;
                var request_data = {};
                $.each(form.serializeArray(), function (index, item) {
                    request_data[item.name] = item.value;
                });

                $.ajax({
                    url: url,
                    data: request_data,
                    dataType: 'jsonp'
                }).done(function (data, textStatus, jqXHR) {
                    if (data.result === 'success') {
                        email.removeClass('error').addClass('valid');
                        if (success_div.length !== 0) {
                            msg = $.ajaxChimp.getTranslation(
                                ($.ajaxChimp.successMessage + request_data.EMAIL),
                                settings.language,
                                'success'
                            );
                            error_div.text('').hide();
                            success_div.text(msg).show(500);
                        }
                    } else{
                        email.removeClass('valid').addClass('error');
                        if (error_div.length !== 0) {
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
                    }
                    deferred.resolve(data, textStatus, jqXHR, form);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    deferred.reject(jqXHR, textStatus, errorThrown, form);
                });

                // Display submit message
                email.removeClass('valid error');
                if (success_div.length !== 0) {
                    var submitMsg = $.ajaxChimp.getTranslation(
                        $.ajaxChimp.submitMessage,
                        settings.language,
                        'submit'
                    );
                    error_div.text('').hide();
                    success_div.text(submitMsg).show(500);
                }
            });
            return deferred;
        });
        if (deferreds.length === 1){
            return deferreds[0];
        }
        return deferreds;
    };
}));
