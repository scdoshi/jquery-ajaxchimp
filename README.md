# ajaxChimp

AjaxChimp is a jQuery plugin that lets you ajaxify your mailchimp form.

Use this if you hate the jarring transition to the mailchimp website on submitting a mailchimp.

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

#### Method 1: Use the mailchimp form

```js
$('form-selector').ajaxChimp();
```

#### Method 2: Use a blank form with an input of type email

```js
$('form-selector').ajaxChimp({
    url: 'mailchimp-post-url'
});
```

The mailchimp post url will look like this:

```
http://blahblah.us1.list-manage.com/subscribe/post?u=5afsdhfuhdsiufdba6f8802&id=4djhfdsh99f
```

**Note**: The advantage of using method 1 is that even if ajax or javascript fails, the form will fallback and work as a normal mailchimp form.

## Callback

Optionally, you can specify a callback with either method to run after the
ajax query to mailchimp succeeds or fails.

```js
$('form-selector').ajaxChimp({
    callback: callbackfunction,
    url: 'mailchimp-post-url'
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

## Label

If a label element is included in the form for the email input, then the success or error message will be displayed in it. A `valid` or `error` class will also be added accordingly.

## Example Form (method 2)

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
