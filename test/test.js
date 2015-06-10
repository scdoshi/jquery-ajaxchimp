$(document).ready( function () {
    $('.subscribe').attr('action', submit_url);
    var a = $('.subscribe').ajaxChimp();
    a.done(function (data, textStatus, jqXhr) {
        console.log(data);
    });

    $('.subscribe-2').ajaxChimp({
        language: 'it',
        errorDiv: '#email-response',
        successDiv: '#email-response',
        url: submit_url
    });
});
