$(document).ready( function () {
    $('.subscribe').attr('action', submit_url);
    var a = $('.subscribe').ajaxChimp();
    a.done(function (data, textStatus, jqXhr, form) {
        console.log(data);
    });

    $('.subscribe-2').ajaxChimp({
        language: 'it',
        errorDiv: '#email-response',
        successDiv: '#email-response',
        url: submit_url,
        token: 'b_88179bccb52af04eb42b11da2_0316d82e30'
    });
});
