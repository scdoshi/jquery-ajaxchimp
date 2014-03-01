# ajaxChimp

AjaxChimp is a jQuery plugin that lets you ajaxify your mailchimp form.

Use this if you hate the jarring transition to the mailchimp website upon submitting an email address to mailchimp.

**Note**: This relies on an undocumented feature at mailchimp that uses JSONP to allow cross-domain ajax to work. You have been warned. (It has however, been around for at least 3 years that I know of, and probably more.)


## Install

Just add the script to your webpage (along with jQuery ofcourse). Get it here:

```
curl -O https://raw.github.com/scdoshi/jquery-ajaxchimp/master/jquery.ajaxchimp.js
```

#### bower

```
bower install ajaxchimp
```


## Requirements

* jQuery

**Note**: Developed with 1.9.1, but it should work with earlier versions. If it does or does not work with a particular version, please open an issue on github.

## Use

#### On the mailchimp form element

```js
$('form-selector').ajaxChimp();
```

## Label

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

### Callback

Optionally, you can specify a callback with either method to run after the
ajax query to mailchimp succeeds or fails.

```js
$('form-selector').ajaxChimp({
    callback: callbackfunction
});
```

The JSONP response from mailchimp will be passed to the callback function

```js
function callbackFunction (resp) {
    if (resp.result === 'success') {
        // Do stuff
    }
}
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

### Language Support

For success and error messages in different languages:

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
    'submit': 'Grabación en curso...',
    0: 'Te hemos enviado un email de confirmación',
    1: 'Por favor, introduzca un valor',
    2: 'Una dirección de correo electrónico debe contener una sola @',
    3: 'La parte de dominio de la dirección de correo electrónico no es válida (la parte después de la @:)',
    4: 'La parte de usuario de la dirección de correo electrónico no es válida (la parte antes de la @:)',
    5: 'Esta dirección de correo electrónico se ve falso o no válido. Por favor, introduce una dirección de correo electrónico real'
}
```

The mapping to english for mailchimp responses and the submit message are as follows:

```js
    // Submit Message
    // 'submit': 'Submitting...'

    // Mailchimp Responses
    // 0: 'We have sent you a confirmation email'
    // 1: 'Please enter a value'
    // 2: 'An email address must contain a single @'
    // 3: 'The domain portion of the email address is invalid (the portion after the @: )'
    // 4: 'The username portion of the email address is invalid (the portion before the @: )'
    // 5: 'This email address looks fake or invalid. Please enter a real email address'

```

