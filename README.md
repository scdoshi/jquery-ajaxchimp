# ajaxChimp

AjaxChimp is a jQuery plugin that lets you ajaxify your mailchimp form.

Use this if you hate the jarring transition to the mailchimp website upon submitting an email address to mailchimp.

**Note**: This relies on an undocumented feature at mailchimp that uses JSONP to allow cross-domain ajax to work. You have been warned. (It has however, been around for at least 4 years that I know of, and probably more.)


## Install

Just add the script to your webpage (along with jQuery ofcourse). Get it here:

```
curl -O https://raw.githubusercontent.com/scdoshi/jquery-ajaxchimp/master/jquery.ajaxchimp.js
```

##### or via bower

```
bower install ajaxchimp
```

## Requirements

* jQuery

**Note**: Developed with 2.1.4, but it should work with earlier versions. If it does or does not work with a particular version, please open an issue on github.


## Use

#### On the mailchimp form element

```js
$('form-selector').ajaxChimp();
```

## Error / Success messages

If a label element is included in the form for the email input, then the success or error message will be displayed in it. A `valid` or `error` class will also be added accordingly.

#### Example Form

```html
    <form id="mc-form">
        <input id="mc-email" type="email" placeholder="email">
        <label for="mc-email"></label>
        <button type="submit">Submit</button>
    </form>
```

```js
$('#mc-form').ajaxChimp({
    url: 'http://blahblah.us1.list-manage.com/subscribe/post?u=5afsdhfuhdsiufdba6f8802&id=4djhfdsh9'
});
```


## Options

### Callbacks

Optionally, you can specify a callback with either method to run after the ajax query to mailchimp succeeds or fails.

The form element that triggered the ajax call is also passed in to the callbacks as the last argument.

```js
var formAjaxChimp = $('form-selector').ajaxChimp({
    callback: callbackFunction
});

formAjaxChimp.done(function (data, textStatus, jqXHR, form) {
    // success callback code here
});

formAjaxChimp.fail(function (jqXHR, textStatus, errorThrown, form) {
    // failure callback code here
});

formAjaxChimp.always(function () {
    var form = arguments[3];
    // always callback code here
});

```

### URL

You can specify the mailchimp URL to post to (or override the url provided on the form element)

```js
$('form-selector').ajaxChimp({
    url: 'mailchimp-post-url'
});
```

The mailchimp post url will look like this:

```
http://blahblah.us1.list-manage.com/subscribe/post?u=5afsdhfuhdsiufdba6f8802&id=4djhfdsh99f
```

### Custom messages

To display custom messages, override the default english translations.

Notice the use of `$1`, `$2` etc. These are regular expression groups from the original messages for the parts that are dynamic, such as the email address. You can omit them if you want to use a constant message.

For e.g., to change the success message:

```js
$.ajaxChimp.translations.en = {
    success: 'Why not say this instead, for the email address $1',
}

```

### Multiple language support

- Specify the language as an option.
- Include `jquery.ajaxchimp.langs.js` in the html file

```js
$('form-selector').ajaxChimp({
    language: 'es'
});
```

**Note**: If the language you want is not supported out of the box, or the translations are wrong, open a pull request with the required language and I will add it in.

You can also add custom translations just for your website:

```js
$.ajaxChimp.translations.es = {
    submit: 'Grabación en curso...',
    success: 'Te hemos enviado un email de confirmación $1',
    error: {
        1: 'Por favor, introduzca un valor',
        2: 'Una dirección de correo electrónico debe contener una sola @',
        3: 'La parte de dominio de la dirección de correo electrónico no es válida (la parte después de la @: $1)',
        4: 'La parte de usuario de la dirección de correo electrónico no es válida (la parte antes de la @: $1)',
        5: 'Esta dirección de correo electrónico se ve falso o no válido. Por favor, introduce una dirección de correo electrónico real',
        6: 'blah blah',
        7: 'blah',
    }
}
```

The mapping to english for mailchimp responses and the submit message are as follows:

```js
    // Submit Message
    //  submit: 'Submitting...'

    // Success Message
    //  success: 'Please confirm by clicking on the link we just sent to $1.'

    // Error Messages
    // errors: {
    //    1: 'Please enter a value',
    //    2: 'An email address must contain a single @',
    //    3: 'The domain portion of the email address is invalid (the portion after the @: $1 )',
    //    4: 'The username portion of the email address is invalid (the portion before the @: $1 )',
    //    5: 'This email address looks fake or invalid. Please enter a real email address',
    //    6: 'Too many subscribe attempts for this email address. Please try again in about 5 minutes.',
    //    7: '$1 is already subscribed to list $2'
    // }

```

