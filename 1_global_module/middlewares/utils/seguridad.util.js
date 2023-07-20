var path       = require('path');
var fs         = require('fs');
var _          = require('underscore');
var Promise    = require('promise');
var request    = require('request');
var moment     = require('moment')
var CryptoJS   = require("crypto-js");
var zlib       = require('zlib');
var crypto     = require('crypto');
var AppendInitVect    = require('./AppendInitVect');
//var log        = console.log

const keySize = 15360;
const vSize = 128;
const iterations = 100;

exports.encriptar = function(msg, pass) {
  var salt = CryptoJS.lib.WordArray.random(128/8);
  
  var key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize/32,
      iterations: iterations
    });

  var iv = CryptoJS.lib.WordArray.random(128/8);
  
  var encrypted = CryptoJS.AES.encrypt(msg, key, { 
    iv: iv, 
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
    
  });
  
  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  var transitmessage = salt.toString()+ iv.toString() + encrypted.toString();

	return transitmessage;
}

exports.desencriptar = function(transitmessage, pass){
	var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
  var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
  var encrypted = transitmessage.substring(64);
  
  var key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize/32,
      iterations: iterations
    });

  var decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
    iv: iv, 
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
    
  })
  return decrypted;
}

//https://medium.com/@brandonstilson/lets-encrypt-files-with-node-85037bea8c0e
function getCipherKey(password) {
  return crypto.createHash('sha256').update(password).digest();
}

exports.encriptarArchivo = function(filePath, originalName, password) {
  return new Promise(function(resolve,reject) {

    const initVect = crypto.randomBytes(16);
  
    // Generate a cipher key from the password.
    const CIPHER_KEY = getCipherKey(password);
    const readStream = fs.createReadStream(filePath+"/"+originalName);
    const gzip = zlib.createDeflate();
    const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect);
    const appendInitVect = new AppendInitVect(initVect);
    // Create a write stream with a different file extension.
    const writeStream = fs.createWriteStream(path.join(filePath+"/"+originalName + ".enc"));
    
    //log("Previo encriptación")
    readStream
      //.pipe(gzip)
      .pipe(cipher)
      .pipe(appendInitVect)
      .pipe(writeStream).on('finish', () => {
        ////log('All writes are now complete.');
        //log("Finalizando encriptación")
        fs.access(filePath+"/"+originalName, fs.F_OK, (err) => {
          if (err) {
            console.error(err)
            resolve({type:"ENCRYPT", msg:"ERROR", error: err})
          }

          fs.unlink(filePath+"/"+originalName, (err) => {
            if (err) {
              console.error(err)
              resolve({type:"ENCRYPT", msg:"ERROR", error: err})
            }

            resolve({type:"ENCRYPT", msg:"OK", error: null})
            
          })
        })
       
      });
  });
}

exports.desencriptarArchivo = function(filePath, originalName, password) {
  return new Promise(function(resolve,reject) {
    // log("Empezando des encriptación")
    // log(filePath)
    // log(originalName)

    const readInitVect = fs.createReadStream(filePath+"/"+originalName + ".enc", { end: 15 });


    let initVect;
    readInitVect.on('data', (chunk) => {
      initVect = chunk;
    });


    // Once we’ve got the initialization vector, we can decrypt the file.
    readInitVect.on('close', () => {
      const cipherKey = getCipherKey(password);
      const readStream = fs.createReadStream(filePath+"/"+originalName + ".enc", { start: 16 });
      const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);
      const unzip = zlib.Inflate();
      const writeStream = fs.createWriteStream(filePath+"/des_"+originalName);

      readStream
        .pipe(decipher)
        //.pipe(unzip)
        .pipe(writeStream).on('finish', () => {
         ////log('All writes are now complete.');
         //log("Finalizando des encriptación")
         resolve({type:"ENCRYPT", msg:"OK", error: null})
        });
    });
  });
}