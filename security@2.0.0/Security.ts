declare let forge:any;

if (typeof(forge) === "undefined")
{
    console.log("forge not supported");
}
else
{
    console.log("forge supported");
}



class Convert {
    public static bin2dec = (s:string) => parseInt(s, 2).toString(10);
    public static bin2hex = (s:string) => parseInt(s, 2).toString(16);
    public static dec2bin = (s:string) => parseInt(s, 10).toString(2);
    public static dec2hex = (s:string) => parseInt(s, 10).toString(16);
    public static hex2bin = (s:string) => parseInt(s, 16).toString(2);
    public static hex2dec = (s:string) => parseInt(s, 16).toString(10);
    public static ascii2hex = (s:string) =>
    {
        let hex = "";
        [...s].some(c => {
            const t = c.charCodeAt(0).toString(16);
            if (t.length < 4)
            {
                hex += t;
            }
            else
            {
                return true;
            }
            return false;
        });        
        return hex;        
    };

    public static uni2hex(s:string) { 
        let hex = "";
        [...s].forEach(c=>{
            hex += ("000" + c.charCodeAt(0).toString(16)).slice(-4);
        });
        return hex;
    };
    public static hex2ascii(s:string) { 
        let hexes = s.match(/.{1,2}/g) || [];
        let back = "";
        for(let i= 0; i < hexes.length; i++)
        {
            back += String.fromCharCode(parseInt(hexes[i],16));
        }
        return back;
    };
    public static hex2uni(s:string) { 
        let hexes = s.match(/.{1,4}/g) || [];
        let back = "";
        for(let i= 0; i < hexes.length; i++)
        {
            back += String.fromCharCode(parseInt(hexes[i],16));
        }
        return back;
    };    
}

class AES {
    private static Padding = (word:string,len:number) => String(word).length > len ? word.substr(0,len) : word.padEnd(len);
    private static Right = (str:string, num:number) => {
        if (num <= 0)
            return "";
        else if (num > String(str).length)
            return str;
        else {
            const iLen = String(str).length;
            return String(str).substring(iLen, iLen - num);
        }
    }

    public static Encrypt(inputText:string,password:string = "")
    {
        let returnValue = "";

        try
        {
            const salt = password === "" ? forge.random.getBytesSync(128) : forge.util.hexToBytes(Convert.ascii2hex(this.Padding(password, 128)));            
            const rDec = parseInt(Convert.hex2dec(forge.util.bytesToHex(salt).substr(0,2)));
            const pass = forge.util.bytesToHex(salt).substr(0, 64);
            const key = forge.pkcs5.pbkdf2(pass,salt, rDec > 0 ? rDec : 100 , 32);
            const iv = salt.substr(0, 32)
            const input = forge.util.createBuffer(inputText, 'utf8');
            const cipher = forge.cipher.createCipher('AES-CBC', key);
            cipher.start({ iv: iv });
            cipher.update(input);
            cipher.finish();            
            returnValue = password === "" ? (cipher.output.toHex() + forge.util.bytesToHex(salt)).trim() : cipher.output.toHex().trim();
        }
        catch(e)
        {
            returnValue = e;
        }
        finally
        {
            return returnValue;
        }
    }

    public static Decrypt(inputText:string,password:string = "")
    {
        let returnValue = "";        
        try
        {
            const salt = password === "" ?  this.Right(inputText, 256) : Convert.ascii2hex(this.Padding(password, 128))
            const rDec = parseInt(Convert.hex2dec(salt.substr(0,2)));
            const pass = salt.substr(0,64);
            const saltByte = forge.util.hexToBytes(salt);
            const key = forge.pkcs5.pbkdf2(pass, saltByte, rDec > 0 ? rDec : 100, 32);
            const iv = saltByte.substr(0,32);
            const enc = password === "" ? inputText.substr(0, inputText.length - 256) : inputText;
            const hexData = forge.util.hexToBytes(enc);
            const encrypted = forge.util.createBuffer(hexData);
            const decipher = forge.cipher.createDecipher('AES-CBC',key);
            decipher.start({iv:iv});
            decipher.update(encrypted);
            decipher.finish();
            returnValue = decipher.output.toString();
        }
        catch(e)
        {
            returnValue = e;            
        }
        finally
        {
            return returnValue;
        }
    }
}

class SHA {
    public static SHA256(inputText:string)
    {
        let returnValue = "";

        try
        {
            const md = forge.md.sha256.create();
            md.update(inputText);
            returnValue = md.digest().toHex();
        }
        catch(e)
        {
            returnValue = e;
        }
        finally
        {
            return returnValue;
        }
    }

    public static SHA512(inputText:string)
    {
        let returnValue = "";

        try
        {
            const md = forge.md.sha512.create();
            md.update(inputText);
            returnValue = md.digest().toHex();
        }
        catch(e)
        {
            returnValue = e;
        }
        finally
        {
            return returnValue;
        }
    }
}

interface IHttpResponse<T> extends Response {
    parsedBody?: T;
    contentsType?:"json"|"html";
}

class Security {
    private method:"GET"|"POST";
    private url:string;    
    private data:any;
    private beforeSend:Function;
    private success:Function;
    private error:Function;
    private complete:Function; 
    private headers:{key:string, value:string}[];
    
    public set onBeforeSend(fn:Function)
    {
        this.beforeSend = function (){ return fn.apply(this.data,arguments)};
    }

    public set onSuccess(fn:Function) 
    {        
        this.success = (enc:string) => fn.call(this,enc /*, AES.Decrypt(enc)*/);
    }

    public set onComplete(fn:Function)
    {
        this.complete = () => fn.apply(this);
    }

    public set onError(fn:Function)
    {
        this.error = (err:any) => fn.call(this,err);
    }

    public set Headers(addHeaders:{key:string, value:string}[])
    {
        this.headers = addHeaders;
    }

    constructor(url:string)
    {
        this.method = "POST";
        this.url = url;
        this.data = {};
        this.beforeSend = ()=>{};
        this.success = ()=>{};
        this.error = ()=>{};
        this.complete = ()=>{};
        this.headers = Array<{key:string,value:string}>();
    }

    public async Send<T extends FormData|{}>(data:T) 
    {
        if (this.url.trim() === "")
        {
            this.error("전송 URL이 누락되었습니다.");
        }

        const headers:Headers = new Headers();
        headers.append('Content-Type','application/json');
        headers.append('Accept','application/json; odata=verbose');
        
        this.headers.forEach(x=>{
            headers.append(x.key,x.value);
        });        

        if (data.toString().indexOf("FormData") > -1 )
        {
            console.info("Fatch Data Type is FormData");

            let hasFile:boolean = false;
            const formData = data as FormData;

            let _data:any = {};
            let _file = new Array<{key:string,value:FormDataEntryValue}>();

            formData.forEach((v,k)=>{                
                if (v.toString() === "[object File]")
                {
                    if ((v as File).name !== "")
                    {
                        hasFile = true;
                        _file.push({key:k, value:v});
                    }                    
                }
                else
                {
                    _data[k] = v;                    
                }
            });
            
            if (hasFile)
            {
                const tempFormData = new FormData();
                tempFormData.append("_",AES.Encrypt(JSON.stringify(_data)))
                _file.forEach(f => {
                    tempFormData.append(f.key,f.value);
                })
                this.data = tempFormData;
                headers.delete('Content-Type');
            }
            else
            {
                this.data = JSON.stringify({_:AES.Encrypt(JSON.stringify(_data))});
                
            }
        }
        else
        {            
            this.data = JSON.stringify({_:AES.Encrypt(JSON.stringify(data))});                        
        }
        
        

        if (this.beforeSend() !== false)
        {
            let response:IHttpResponse<T>;            
            return await fetch(this.url,{method:this.method,mode:"cors",headers:headers,body:this.data}).then(res => {
                response = res;  
                response.contentsType = "html";                
                if (res.headers && res.headers.get("Content-Type"))
                {
                    const ct = res.headers.get("Content-Type")||"";
                    if (ct.indexOf("json") > -1)
                    {
                        response.contentsType = "json";
                        return res.json();
                    }
                    else
                    {                        
                        return res.text();
                    }                    
                }
                else
                {
                    
                    return res.text();
                }
            }).then(body => {                
                if(response.ok)
                {                    
                    response.parsedBody = body;
                    if (response.contentsType === "json")
                    {
                        if (response.parsedBody && Object.getOwnPropertyNames(response.parsedBody).indexOf("error") > -1)
                        {   
                            return this.error("error");
                        }
                        else
                        {                   
                            return this.success(JSON.stringify(response.parsedBody));                                 
                        }
                    }
                    else
                    {
                        return this.success(response.parsedBody);
                    }                    
                }
                else
                {
                    return this.error(response.statusText);                    
                }
            })
            .catch((err:Error)=>{
                console.error(err.stack);
            })            
            .finally(()=>{                
                return this.complete();
            });
        }
        
    }
    
}