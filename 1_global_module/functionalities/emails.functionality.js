var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var Promise = require('promise');
var request = require('request');
var log = console.log

var sendgrid = require("sendgrid")("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");

//var email_reply = "no_reply@autocompartido.com";
var email_reply = "novusTec@SistemaNOVUS"
//var email_reply = "meeplabstudio@gmail.com";

exports.SendCompanyCode = async function(correo, nameUser,link) {
    log(correo,link)
    return new Promise(function(resolve, reject) {
        log("Entrando promesa correo");

        //log(path.resolve(__dirname, '../../../correos_transaccionales/recuperar_contrasena.html'))
        const tmpl = fs.readFileSync(path.resolve(__dirname, '../../transactional_emails/codigo_empresa.html'), 'utf8')
        var html = tmpl;

        html = html.replace('{{code}}', link);
        html = html.replace('{{name}}', nameUser);

        console.log("Previo emails to send");
        var emailAEnviar = [];
        if (process.env.NODE_ENV === "production") {
            console.log("ENVIRONMENT PRODUCTION");
            emailAEnviar = [{
                "email": correo
            }];

        } else if (process.env.NODE_ENV === "development") {
            console.log("ENVIRONMENT DEVELOPMENT");
            /*emailAEnviar = [
                {
                "email": "pruebas@meeplab.com"
                }
            ];*/
            emailAEnviar = [{
                "email": correo
            }];
        }

        console.log("Previo request " + emailAEnviar[0].email);
        var request = sendgrid.emptyRequest();
        request.body = {
            "content": [{
                "type": "text/html",
                "value": html
            }],
            "from": {
                "email": email_reply,
                "name": "Novus Tec"
            },
            "reply_to": {
                "email": email_reply,
                "name": "Novus Tec"
            },
            "subject": "Registration to Novus Tec",
            "personalizations": [{
                "custom_args": {
                    "New Argument 1": "New Value 1",
                    "activationAttempt": "1",
                    "customerAccountNumber": "[CUSTOMER ACCOUNT NUMBER GOES HERE]"
                },
                "headers": {
                    "X-Accept-Language": "es",
                    "X-Mailer": "Registration to Novus Tec"
                },
                "subject": "Registration to Novus Tec",
                "to": emailAEnviar
            }],
        };
        request.method = 'POST';
        request.path = '/v3/mail/send';

        console.log("Después sendgrid request");
        sendgrid.API(request, function(respuesta, error) {
            console.log("Antes de resolver " + JSON.stringify(error));
            resolve({ type: "EMAIL", data: respuesta, error: null });
        });
    });
}