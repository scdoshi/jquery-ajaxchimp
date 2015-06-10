(function ($) {
    'use strict';

    // ISO-693-1 Language codes: http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes

    // Submit Message
    //  submit: 'Submitting...'

    // Success Message
    //  success: 'Please confirm by clicking on the link we just sent to $1.'

    // Note: The actual success message sent by mailchimp is too long
    //  so it has been changed. The actual mesage is this: "Almost finished... We need
    //  to confirm your email address. To complete the subscription process, please
    //  click the link in the email we just sent you."

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

    $.ajaxChimp.translations = {
        // Translation via https://github.com/lifeisfoo
        it: {
            submit: 'Registrazione in corso...',
            success: 'Ti abbiamo inviato una mail di conferma',
            errors: {
                1: 'Per favore inserisci una mail',
                2: 'Un indirizzo valido contiene una sola @',
                3: 'Il dominio della tua mail non è valido (la porzione dopo la @: $1 )',
                4: 'Il nome della mail non è valido (la porzione prima della @: $1 )',
                5: 'L\'indirizzo email sembra finto o non valido: per favore inseriscine uno reale',
                6: 'gflyuigiug'
            }
        },
        // Translation via https://github.com/Cube42
        de: {
            submit: 'Senden...',
            success: 'Wir haben Ihnen eine Bestätigungs-E-Mail geschickt',
            errors: {
                1: 'Bitte geben Sie Ihre E-Mail-Adresse ein',
                2: 'Eine E-Mail-Adresse muss ein @ enthalten',
                3: 'Der Domain-Teil der E-Mail-Adresse ist ungültig (der Teil nach dem @: $1)',
                4: 'Der Benutzername der E-Mail-Adresse ist ungültig (der Teil vor dem @: $1)',
                5: 'Diese E-Mail-Adresse scheint gefälscht oder ungültig zu sein. Bitte geben Sie eine echte E-Mail-Adresse an!'
            }
        },
        // Translation via https://github.com/designorant
        pl: {
            submit: 'Wysyłanie...',
            success: 'Email z potwierdzeniem został wysłany',
            errors: {
                1: 'Proszę podać adres email',
                2: 'Adres email musi zawierać jeden znak @',
                3: 'Część adresu z domeną jest niepoprawna (część po znaku @: $1)',
                4: 'Część adresu z użytkownikiem jest niepoprawna (część przed znakiem @: $1)',
                5: 'Ten adres wygląda na nieprawdziwy lub niepoprawny. Proszę podać prawdziwy adres email.'
            }
        },
        // The translations below are from google translate, and may not be accurate.
        // Pull requests with translations for other languages as well as corrections are welcome.
        es: {
            submit: 'Grabación en curso...',
            success: 'Te hemos enviado un email de confirmación',
            errors: {
                1: 'Por favor, introduzca un valor',
                2: 'Una dirección de correo electrónico debe contener una sola @',
                3: 'La parte de dominio de la dirección de correo electrónico no es válida (la parte después de la @: $1)',
                4: 'La parte de usuario de la dirección de correo electrónico no es válida (la parte antes de la @: $1)',
                5: 'Esta dirección de correo electrónico se ve falso o no válido. Por favor, introduce una dirección de correo electrónico real'
            }
        },
        fr: {
            submit: 'Enregistrement en cours...',
            success: 'Nous vous avons envoyé un e-mail de confirmation',
            errors: {
                1: 'S\'il vous plaît entrer une valeur',
                2: 'Une adresse e-mail doit contenir un seul @',
                3: 'La partie domaine de l\'adresse e-mail n\'est pas valide (la partie après le @: $1)',
                4: 'La partie nom d\'utilisateur de l\'adresse email n\'est pas valide (la partie avant le signe @: $1)',
                5: 'Cette adresse e-mail semble faux ou non valides. S\'il vous plaît entrer une adresse email valide'
            }
        }
    };
})(jQuery);
