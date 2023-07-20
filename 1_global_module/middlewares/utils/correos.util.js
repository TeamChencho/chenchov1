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

exports.RecuperarContrasena = function(correo, codigo) {
    log(correo, codigo)
    return new Promise(function(resolve, reject) {
        log("Entrando promesa correo");

        //log(path.resolve(__dirname, '../../../public/assets/transactional_emails/recuperar_contrasena.html'))
        log(path.resolve(__dirname, '../../../transactional_emails/recuperar_contrasena.html'))
        const tmpl = fs.readFileSync(path.resolve(__dirname, '../../../transactional_emails/recuperar_contrasena.html'), 'utf8')
        var html = tmpl;

        html = html.replace('{{code}}', codigo);

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
                "name": "NOVUS Tec System"
            },
            "reply_to": {
                "email": email_reply,
                "name": "NOVUS Tec System"
            },
            "subject": "Password recovery in NOVUS Tec System",
            "personalizations": [{
                "custom_args": {
                    "New Argument 1": "New Value 1",
                    "activationAttempt": "1",
                    "customerAccountNumber": "[CUSTOMER ACCOUNT NUMBER GOES HERE]"
                },
                "headers": {
                    "X-Accept-Language": "es",
                    "X-Mailer": "Password recovery in NOVUS Tec System"
                },
                "subject": "Password recovery in NOVUS Tec System",
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

exports.VerificarCuenta = function(correo) {
    return new Promise(function(resolve, reject) {
        console.log("Entrando promesa ");

        const tmpl = fs.readFileSync(path.resolve(__dirname, '../../../correos_transaccionales/verificar_cuenta.html'), 'utf8')
        var html = tmpl;

        const IP_SERVER = process.env.IP_SERVER || TESTING_ENVIRONMENT.IP_SERVER
        const PORT = process.env.PORT || TESTING_ENVIRONMENT.PORT
        var url = "http://" + IP_SERVER + "/app/validar_verificar_correo_electronico?c=" + correo
            //url = "http://localhost:7071/users/activateAccount/"+user.id+"/index"
        html = html.replace('{{url}}', url);

        console.log("Previo emails to send ");
        var emailAEnviar = [];
        if (process.env.NODE_ENV === "production") {
            console.log("ENVIRONMENT PRODUCTION");
            emailAEnviar = [{
                "email": user.get("email")
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
                "name": "Sistema LMS"
            },
            "reply_to": {
                "email": email_reply,
                "name": "Sistema LMS"
            },
            "subject": "Activación Cuenta",
            "personalizations": [{
                "custom_args": {
                    "New Argument 1": "New Value 1",
                    "activationAttempt": "1",
                    "customerAccountNumber": "[CUSTOMER ACCOUNT NUMBER GOES HERE]"
                },
                "headers": {
                    "X-Accept-Language": "es",
                    "X-Mailer": "Activación cuenta"
                },
                "subject": "Activación cuenta",
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

exports.RecuperarCodigo = function(correo, codigo) {
    return new Promise(function(resolve, reject) {
        log("Entrando promesa correo");

        //log(path.resolve(__dirname, '../../../correos_transaccionales/recuperar_contrasena.html'))
        const tmpl = fs.readFileSync(path.resolve(__dirname, '../../../correos_transaccionales/recuperar_codigo_empresa.html'), 'utf8')
        var html = tmpl;

        html = html.replace('{{code}}', codigo);

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
                "name": "Sistema LMS"
            },
            "reply_to": {
                "email": email_reply,
                "name": "Sistema LMS"
            },
            "subject": "Recuperación de Código de Empresa",
            "personalizations": [{
                "custom_args": {
                    "New Argument 1": "New Value 1",
                    "activationAttempt": "1",
                    "customerAccountNumber": "[CUSTOMER ACCOUNT NUMBER GOES HERE]"
                },
                "headers": {
                    "X-Accept-Language": "es",
                    "X-Mailer": "Recuperación de Código de Empresa"
                },
                "subject": "Recuperación de Código de Empresa",
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

exports.EnviarCodigoEmpresa = function(correo, codigo) {
    return new Promise(function(resolve, reject) {
        log("Entrando promesa correo");

        //log(path.resolve(__dirname, '../../../correos_transaccionales/recuperar_contrasena.html'))
        const tmpl = fs.readFileSync(path.resolve(__dirname, '../../../correos_transaccionales/codigo_empresa.html'), 'utf8')
        var html = tmpl;

        html = html.replace('{{code}}', codigo);

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
                "name": "Sistema LMS"
            },
            "reply_to": {
                "email": email_reply,
                "name": "Sistema LMS"
            },
            "subject": "Código de Empresa",
            "personalizations": [{
                "custom_args": {
                    "New Argument 1": "New Value 1",
                    "activationAttempt": "1",
                    "customerAccountNumber": "[CUSTOMER ACCOUNT NUMBER GOES HERE]"
                },
                "headers": {
                    "X-Accept-Language": "es",
                    "X-Mailer": "Código de Empresa"
                },
                "subject": "Código de Empresa",
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