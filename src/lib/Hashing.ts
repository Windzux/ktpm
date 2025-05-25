var crypto = require('crypto-js');
var AES = require("crypto-js/aes");

export const enPassword = ( password : string ) : string => {
    let passwordHashing = AES.encrypt( password, process.env.SECRET ).toString();
    return passwordHashing;

}
export const dePassword = ( passwordHasing : string) : string => {
    let decrypt = AES.decrypt( passwordHasing , process.env.SECRET );
    let password = decrypt.toString(crypto.enc.Utf8);
    return password;
}