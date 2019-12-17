"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
if (typeof (forge) === "undefined") {
    console.log("forge not supported");
}
else {
    console.log("forge supported");
}
var Convert = /** @class */ (function () {
    function Convert() {
    }
    Convert.uni2hex = function (s) {
        var hex = "";
        __spread(s).forEach(function (c) {
            hex += ("000" + c.charCodeAt(0).toString(16)).slice(-4);
        });
        return hex;
    };
    ;
    Convert.hex2ascii = function (s) {
        var hexes = s.match(/.{1,2}/g) || [];
        var back = "";
        for (var i = 0; i < hexes.length; i++) {
            back += String.fromCharCode(parseInt(hexes[i], 16));
        }
        return back;
    };
    ;
    Convert.hex2uni = function (s) {
        var hexes = s.match(/.{1,4}/g) || [];
        var back = "";
        for (var i = 0; i < hexes.length; i++) {
            back += String.fromCharCode(parseInt(hexes[i], 16));
        }
        return back;
    };
    ;
    Convert.bin2dec = function (s) { return parseInt(s, 2).toString(10); };
    Convert.bin2hex = function (s) { return parseInt(s, 2).toString(16); };
    Convert.dec2bin = function (s) { return parseInt(s, 10).toString(2); };
    Convert.dec2hex = function (s) { return parseInt(s, 10).toString(16); };
    Convert.hex2bin = function (s) { return parseInt(s, 16).toString(2); };
    Convert.hex2dec = function (s) { return parseInt(s, 16).toString(10); };
    Convert.ascii2hex = function (s) {
        var hex = "";
        __spread(s).some(function (c) {
            var t = c.charCodeAt(0).toString(16);
            if (t.length < 4) {
                hex += t;
            }
            else {
                return true;
            }
            return false;
        });
        return hex;
    };
    return Convert;
}());
var AES = /** @class */ (function () {
    function AES() {
    }
    AES.Encrypt = function (inputText, password) {
        if (password === void 0) { password = ""; }
        var returnValue = "";
        try {
            var salt = password === "" ? forge.random.getBytesSync(128) : forge.util.hexToBytes(Convert.ascii2hex(this.Padding(password, 128)));
            var rDec = parseInt(Convert.hex2dec(forge.util.bytesToHex(salt).substr(0, 2)));
            var pass = forge.util.bytesToHex(salt).substr(0, 64);
            var key = forge.pkcs5.pbkdf2(pass, salt, rDec > 0 ? rDec : 100, 32);
            var iv = salt.substr(0, 32);
            var input = forge.util.createBuffer(inputText, 'utf8');
            var cipher = forge.cipher.createCipher('AES-CBC', key);
            cipher.start({ iv: iv });
            cipher.update(input);
            cipher.finish();
            returnValue = password === "" ? (cipher.output.toHex() + forge.util.bytesToHex(salt)).trim() : cipher.output.toHex().trim();
        }
        catch (e) {
            returnValue = e;
        }
        finally {
            return returnValue;
        }
    };
    AES.Decrypt = function (inputText, password) {
        if (password === void 0) { password = ""; }
        var returnValue = "";
        try {
            var salt = password === "" ? this.Right(inputText, 256) : Convert.ascii2hex(this.Padding(password, 128));
            var rDec = parseInt(Convert.hex2dec(salt.substr(0, 2)));
            var pass = salt.substr(0, 64);
            var saltByte = forge.util.hexToBytes(salt);
            var key = forge.pkcs5.pbkdf2(pass, saltByte, rDec > 0 ? rDec : 100, 32);
            var iv = saltByte.substr(0, 32);
            var enc = password === "" ? inputText.substr(0, inputText.length - 256) : inputText;
            var hexData = forge.util.hexToBytes(enc);
            var encrypted = forge.util.createBuffer(hexData);
            var decipher = forge.cipher.createDecipher('AES-CBC', key);
            decipher.start({ iv: iv });
            decipher.update(encrypted);
            decipher.finish();
            returnValue = decipher.output.toString();
        }
        catch (e) {
            returnValue = e;
        }
        finally {
            return returnValue;
        }
    };
    AES.Padding = function (word, len) { return String(word).length > len ? word.substr(0, len) : word.padEnd(len); };
    AES.Right = function (str, num) {
        if (num <= 0)
            return "";
        else if (num > String(str).length)
            return str;
        else {
            var iLen = String(str).length;
            return String(str).substring(iLen, iLen - num);
        }
    };
    return AES;
}());
var SHA = /** @class */ (function () {
    function SHA() {
    }
    SHA.SHA256 = function (inputText) {
        var returnValue = "";
        try {
            var md = forge.md.sha256.create();
            md.update(inputText);
            returnValue = md.digest().toHex();
        }
        catch (e) {
            returnValue = e;
        }
        finally {
            return returnValue;
        }
    };
    SHA.SHA512 = function (inputText) {
        var returnValue = "";
        try {
            var md = forge.md.sha512.create();
            md.update(inputText);
            returnValue = md.digest().toHex();
        }
        catch (e) {
            returnValue = e;
        }
        finally {
            return returnValue;
        }
    };
    return SHA;
}());
var Security = /** @class */ (function () {
    function Security(url) {
        this.method = "POST";
        this.url = url;
        this.data = {};
        this.beforeSend = function () { };
        this.success = function () { };
        this.error = function () { };
        this.complete = function () { };
        this.headers = Array();
    }
    Object.defineProperty(Security.prototype, "onBeforeSend", {
        set: function (fn) {
            this.beforeSend = function () { return fn.apply(this.data, arguments); };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Security.prototype, "onSuccess", {
        set: function (fn) {
            var _this = this;
            this.success = function (enc) { return fn.call(_this, enc /*, AES.Decrypt(enc)*/); };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Security.prototype, "onComplete", {
        set: function (fn) {
            var _this = this;
            this.complete = function () { return fn.apply(_this); };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Security.prototype, "onError", {
        set: function (fn) {
            var _this = this;
            this.error = function (err) { return fn.call(_this, err); };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Security.prototype, "Headers", {
        set: function (addHeaders) {
            this.headers = addHeaders;
        },
        enumerable: true,
        configurable: true
    });
    Security.prototype.Send = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var headers, hasFile_1, formData, _data_1, _file_1, tempFormData_1, response_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.url.trim() === "") {
                            this.error("전송 URL이 누락되었습니다.");
                        }
                        headers = new Headers();
                        headers.append('Content-Type', 'application/json');
                        headers.append('Accept', 'application/json; odata=verbose');
                        this.headers.forEach(function (x) {
                            headers.append(x.key, x.value);
                        });
                        if (data.toString().indexOf("FormData") > -1) {
                            console.info("Fatch Data Type is FormData");
                            hasFile_1 = false;
                            formData = data;
                            _data_1 = {};
                            _file_1 = new Array();
                            formData.forEach(function (v, k) {
                                if (v.toString() === "[object File]") {
                                    if (v.name !== "") {
                                        hasFile_1 = true;
                                        _file_1.push({ key: k, value: v });
                                    }
                                }
                                else {
                                    _data_1[k] = v;
                                }
                            });
                            if (hasFile_1) {
                                tempFormData_1 = new FormData();
                                tempFormData_1.append("_", AES.Encrypt(JSON.stringify(_data_1)));
                                _file_1.forEach(function (f) {
                                    tempFormData_1.append(f.key, f.value);
                                });
                                this.data = tempFormData_1;
                                headers.delete('Content-Type');
                            }
                            else {
                                this.data = JSON.stringify({ _: AES.Encrypt(JSON.stringify(_data_1)) });
                            }
                        }
                        else {
                            this.data = JSON.stringify({ _: AES.Encrypt(JSON.stringify(data)) });
                        }
                        if (!(this.beforeSend() !== false)) return [3 /*break*/, 2];
                        return [4 /*yield*/, fetch(this.url, { method: this.method, mode: "cors", headers: headers, body: this.data }).then(function (res) {
                                response_1 = res;
                                response_1.contentsType = "html";
                                if (res.headers && res.headers.get("Content-Type")) {
                                    var ct = res.headers.get("Content-Type") || "";
                                    if (ct.indexOf("json") > -1) {
                                        response_1.contentsType = "json";
                                        return res.json();
                                    }
                                    else {
                                        return res.text();
                                    }
                                }
                                else {
                                    return res.text();
                                }
                            }).then(function (body) {
                                if (response_1.ok) {
                                    response_1.parsedBody = body;
                                    if (response_1.contentsType === "json") {
                                        if (response_1.parsedBody && Object.getOwnPropertyNames(response_1.parsedBody).indexOf("error") > -1) {
                                            return _this.error("error");
                                        }
                                        else {
                                            return _this.success(JSON.stringify(response_1.parsedBody));
                                        }
                                    }
                                    else {
                                        return _this.success(response_1.parsedBody);
                                    }
                                }
                                else {
                                    return _this.error(response_1.statusText);
                                }
                            })
                                .catch(function (err) {
                                console.error(err.stack);
                            })
                                .finally(function () {
                                return _this.complete();
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return Security;
}());
