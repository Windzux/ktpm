
import { HttpBadRequest } from "./http";
    
const CHECK = {
    SPECIALCHAR:   /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/ ,
    CHECKNUMBER: /\d/
}
function isPasswordSpecial(password: string) : boolean{
         if( CHECK.SPECIALCHAR.test(password) == true){
                return true;
            }
}
function isPasswordNumber(password: string) : boolean{
    if( CHECK.CHECKNUMBER.test(password) == true){
           return true;
       }
}
export const formLoginValidate  = {
    ValidateInputUsername( obj : any , key1: string, key2: string, min = 6 , max = 20){
               for( const [key, value] of Object.entries(obj)){
                          if( key ===  key1){
                            if( typeof value !== 'string'){
                                 throw HttpBadRequest(` http bad request because  not string `);

                            }else if( value.length < 6){
                                 throw HttpBadRequest( `http bad request because ${key1} least ${min}`);
                            }else if(value.length > 20){
                                 throw HttpBadRequest(`http bad request because ${key1} ${max}`);
                            }
                            
                          }
                          if( key ===  key2){
                            if( typeof value !== 'string'){
                                 throw HttpBadRequest(` http bad request because ${key2} no string`);

                            }
                            if( value.length < 8){
                                 throw HttpBadRequest( `http bad request because ${key2} least ${min}`);
                            }
                            if(!isPasswordSpecial(value)){
                                  throw HttpBadRequest( `http bad request because ${key2} hasn't special`);
                            }
                            if(!isPasswordNumber(value)){
                                throw HttpBadRequest( `http bad request because ${key2} hasn't number`);
                            }
                            
               } 
               return obj;
        }
    }
}


    
