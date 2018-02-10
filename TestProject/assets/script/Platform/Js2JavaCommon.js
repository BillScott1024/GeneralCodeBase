var CC_JSB = false;
var className = "com.wepie.wespy.cocosnew.Js2JavaCommon";

function WConfig() {
    this.use_native = CC_JSB;
    this.CODE_SUCCESS = 200;
    this.YES = 1;
    this.last_end_director_time = 0;
}
window.WConfig = new WConfig();

function CommonUtil() {
}
window.CommonUtil = new CommonUtil();

CommonUtil.prototype.decode = function(input) {
    return window.Base64Decode(input);
}

CommonUtil.prototype.NativeCapture = function(callback) {       
    console.log("-------in game NativeCapture start-----");     
    window.Java2JsCommon.seqNativeCapture = window.JavaCallback.addCallback(callback);
    jsb.reflection.callStaticMethod(className, "NativeCapture", "()V");
    console.log("-------in game NativeCapture end-----");
}

CommonUtil.prototype.InterceptBackEvent = function(target) {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, 
        function (event) { 
            parseInt
            switch (event.keyCode) { 
                case cc.KEY.back: {
                    var onBackPress = window.JavaCallback.getCallback(window.Java2JsCommon.seqOnBackPress, false);
                    window.CommonUtil.WPLog("in game keyCode back onBackPress="+onBackPress);
                    onBackPress(); 
                    break; 
                }
            } 
        }, target); 
}

CommonUtil.prototype.WPLog = function(msg) {
    //var date = new Date(); 
    //var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "-" + date.getMilliseconds();
    console.log(msg);
}

function JavaCallback() {
    this.seq = 0;
    this.dic = new Array();
}
window.JavaCallback = new JavaCallback();

JavaCallback.prototype.addCallback = function(callback) {
    this.seq++;
    this.dic[this.seq] = callback;
    window.CommonUtil.WPLog("in game JavaCallback addCallback seq=" + this.seq);
    return this.seq;
}

JavaCallback.prototype.getCallback = function(seq, remove) {
    var callback = this.dic[seq];
    if(remove) {
        delete this.dic[seq];
    }
    //window.CommonUtil.WPLog("in game JavaCallback getCallback seq=" + seq+" callback="+callback);
    return callback;
}

function Java2JsCommon() { 
}
window.Java2JsCommon = new Java2JsCommon();

Java2JsCommon.prototype.RegisterCallback = function(onPushRoomMsg, onVolumeChange, onUserSpeak, onBackPress, onResume) {
    this.seqOnPushRoomMsg = window.JavaCallback.addCallback(onPushRoomMsg);
    this.seqOnVolumeChange = window.JavaCallback.addCallback(onVolumeChange);
    this.seqOnUserSpeak = window.JavaCallback.addCallback(onUserSpeak);
    this.seqOnBackPress = window.JavaCallback.addCallback(onBackPress);
    this.seqOnResume= window.JavaCallback.addCallback(onResume);
}

//异步获取用户信息响应
Java2JsCommon.prototype.GetUserInfoRsp = function (response) {
    window.CommonUtil.WPLog('in game Java2JsCommon GetUserInfoRsp:' + response);
    var json = JSON.parse(window.CommonUtil.decode(response));
    if (json.code == window.WConfig.CODE_SUCCESS) {
        var headImgUrl = json.data.headimgurl;
        var nickname = json.data.nickname;

        var seq = json.seq;
        var callback = window.JavaCallback.getCallback(seq, true);
        if(callback) {
            callback(headImgUrl, nickname);
        }
    }
}

//客户端结束activity通知
Java2JsCommon.prototype.EndDirector = function() {
    var timestamp = Date.parse(new Date());
    window.CommonUtil.WPLog("in game EndDirector timestamp="+timestamp+" lastTime="+window.WConfig.last_end_director_time);
    if(timestamp - window.WConfig.last_end_director_time < 1000) {
        window.CommonUtil.WPLog("-----------------call EndDirector too frequently, return------------");
        return;
    }
    window.WConfig.last_end_director_time = timestamp;

    jsb.reflection.callStaticMethod(className, "jsBeforeEndDirector", "()V");
    cc.director.end();
}

//媒体音量调节
Java2JsCommon.prototype.ChangeMediaVolume = function (data) {
    window.CommonUtil.WPLog('in game Java2JsCommon ChangeMediaVolume:' + data);
    var json = JSON.parse(window.CommonUtil.decode(data));
    if (json.code == window.WConfig.CODE_SUCCESS) {
        var volume = json.data.volume;
        var onVolumeChange = window.JavaCallback.getCallback(this.seqOnVolumeChange, false);
        onVolumeChange(volume);
    }
}

//语音状态改变
Java2JsCommon.prototype.RefreshUserSpeakVolume = function (data) {
    //window.CommonUtil.WPLog('in game Java2JsCommon RefreshUserSpeakVolume:' + data);
    var json = JSON.parse(window.CommonUtil.decode(data));
    if (json.code == window.WConfig.CODE_SUCCESS) {
        var volumeUidList = json.data.volumeList;
        var onUserSpeak = window.JavaCallback.getCallback(this.seqOnUserSpeak, false);
        if(onUserSpeak) onUserSpeak(volumeUidList);
    }
}

Java2JsCommon.prototype.OnResume = function (data) {
    window.CommonUtil.WPLog('in game Java2JsCommon OnResume');
    var onResume = window.JavaCallback.getCallback(this.seqOnResume, false);
    onResume();
}

Java2JsCommon.prototype.OnPushRoomMsg = function (data) {
    window.CommonUtil.WPLog('in game Java2JsCommon OnPushRoomMsg:' + data);
    var json = JSON.parse(window.CommonUtil.decode(data));
    if (json.code == window.WConfig.CODE_SUCCESS) {
        var send_uid = json.data.send_uid;
        var msg_content = json.data.msg_content;

        var onPushRoomMsg = window.JavaCallback.getCallback(this.seqOnPushRoomMsg, false);
        onPushRoomMsg(send_uid, msg_content);
    }
}

Java2JsCommon.prototype.CaptureSuccess = function () {
    window.CommonUtil.WPLog('in game Java2JsCommon CaptureSuccess');
    var callback = window.JavaCallback.getCallback(window.Java2JsCommon.seqNativeCapture, true);
    if(callback) callback();
}

Java2JsCommon.prototype.CallLoadHeadImg = function (data) {
    window.CommonUtil.WPLog('in game Java2JsCommon CallLoadHeadImg:' + data);
    var json = JSON.parse(window.CommonUtil.decode(data));
    if (json.code == window.WConfig.CODE_SUCCESS) {
        var res_name = json.data.res_name;
        var seq = json.data.seq;
        var callback = window.JavaCallback.getCallback(seq, true);
        if(callback) callback(res_name);
    }
}

function Js2JavaCommon() {
    
}
window.Js2JavaCommon = new Js2JavaCommon();

Js2JavaCommon.prototype.HideLoadingView = function() {
    window.CommonUtil.WPLog('in game Js2JavaCommon HideLoadingView');
    jsb.reflection.callStaticMethod(className, "HideLoadingView", "()V");
}

Js2JavaCommon.prototype.GetRid = function(callback) {
    window.CommonUtil.WPLog('in game Js2JavaCommon GetRid');
    var rid = jsb.reflection.callStaticMethod(className, "GetRid", "()I");
    callback(rid); 
}

Js2JavaCommon.prototype.GetSelfUid = function(callback) {
    window.CommonUtil.WPLog('in game Js2JavaCommon GetSelfUid');
    var uid = jsb.reflection.callStaticMethod(className, "GetSelfUid", "()I");
    window.CommonUtil.WPLog('in game Js2JavaCommon GetSelfUid uid='+uid);
    callback(uid);
}

Js2JavaCommon.prototype.GetUserInfo = function(uid, callback) {
    window.CommonUtil.WPLog('in game Js2JavaCommon GetUserInfo uid='+uid);
    var seq = window.JavaCallback.addCallback(callback);
    var param = JSON.stringify({
        uid : uid,
        seq : seq
    });
    jsb.reflection.callStaticMethod(className, "GetUserInfo", "(Ljava/lang/String;)V", param);
}

Js2JavaCommon.prototype.GetWatcher = function(callback) {
    window.CommonUtil.WPLog('in game Js2JavaCommon GetWatcher');
    var data = jsb.reflection.callStaticMethod(className, "GetWatcher", "()Ljava/lang/String;");
    var json = JSON.parse(data);
    if (json.code == window.WConfig.CODE_SUCCESS) {
        callback(json.data.is_watcher, json.data.target_uid);
    }
    //window.CommonUtil.decode(data)
}

Js2JavaCommon.prototype.GetVerifyKey = function(callback) {
    window.CommonUtil.WPLog('in game Js2JavaCommon GetVerifyKey');
    var data = jsb.reflection.callStaticMethod(className, "GetVerifyKey", "()Ljava/lang/String;");
    callback(data);
}

Js2JavaCommon.prototype.isFriendWithUid = function(uid, callback) {
    window.CommonUtil.WPLog('in game Js2JavaCommon isFriendWithUid');
    var param = JSON.stringify({
        uid : uid
    });
    var isFriend = jsb.reflection.callStaticMethod(className, "isFriendWithUid", "(Ljava/lang/String;)Z", param);
    callback(isFriend);
}

Js2JavaCommon.prototype.ShowUserDialog = function(uid) {
    window.CommonUtil.WPLog('in game Js2JavaCommon ShowUserDialog uid='+uid);
    var param = JSON.stringify({
        uid : uid,
    });
    jsb.reflection.callStaticMethod(className, "ShowUserDialog", "(Ljava/lang/String;)V", param);
}

Js2JavaCommon.prototype.clickAddFriend = function(uid, callback) {
    window.CommonUtil.WPLog('in game Js2JavaCommon clickAddFriend uid='+uid);
    var param = JSON.stringify({
        uid : uid,
    });
    jsb.reflection.callStaticMethod(className, "clickAddFriend", "(Ljava/lang/String;)V", param);
}

Js2JavaCommon.prototype.clickShare = function() {
    window.CommonUtil.WPLog('in game Js2JavaCommon clickShare');
    jsb.reflection.callStaticMethod(className, "clickShare", "()V");
}

Js2JavaCommon.prototype.clickRule = function() {
    window.CommonUtil.WPLog('in game Js2JavaCommon clickRule');
    jsb.reflection.callStaticMethod(className, "clickRule", "()V");
}

Js2JavaCommon.prototype.GameReturn = function() {
    window.CommonUtil.WPLog('in game Js2JavaCommon GameReturn');
    jsb.reflection.callStaticMethod(className, "GameReturn", "()V");
    window.Java2JsCommon.EndDirector();
}

Js2JavaCommon.prototype.ShowRegulateVolumeDialog = function() {
    window.CommonUtil.WPLog('in game Js2JavaCommon ShowRegulateVolumeDialog');
    jsb.reflection.callStaticMethod(className, "ShowRegulateVolumeDialog", "()V");
}

Js2JavaCommon.prototype.ShowInputView = function() {
    window.CommonUtil.WPLog('in game Js2JavaCommon ShowInputView');
    jsb.reflection.callStaticMethod(className, "ShowInputView", "()V");
}

Js2JavaCommon.prototype.ShowGameRule = function() {
    window.CommonUtil.WPLog('in game Js2JavaCommon ShowGameRule');
    jsb.reflection.callStaticMethod(className, "ShowGameRule", "()V");
}

Js2JavaCommon.prototype.TouchMic = function(callback) {
    window.CommonUtil.WPLog('in game Js2JavaCommon TouchMic');
    var data = jsb.reflection.callStaticMethod(className, "TouchMic", "()Ljava/lang/String;");
    var json = JSON.parse(data);
    if (json.code == window.WConfig.CODE_SUCCESS) {
        callback(json.data.is_mic_open, json.data.is_agora_open);
    }
}

Js2JavaCommon.prototype.TouchSpeaker = function(callback) {
    window.CommonUtil.WPLog('in game Js2JavaCommon TouchSpeaker');
    var data = jsb.reflection.callStaticMethod(className, "TouchSpeaker", "()Ljava/lang/String;");
    var json = JSON.parse(data);
    if (json.code == window.WConfig.CODE_SUCCESS) {
        callback(json.data.is_mic_open, json.data.is_agora_open);
    }
}

Js2JavaCommon.prototype.GetAgoraStatus = function(callback) {
    window.CommonUtil.WPLog('in game Js2JavaCommon GetAgoraStatus');
    var data = jsb.reflection.callStaticMethod(className, "GetAgoraStatus", "()Ljava/lang/String;");
    var json = JSON.parse(data);
    if (json.code == window.WConfig.CODE_SUCCESS) {
        callback(json.data.is_mic_open, json.data.is_agora_open);
    }
}

Js2JavaCommon.prototype.SetAudioVolumeIndication = function(interval, smooth) {
    window.CommonUtil.WPLog('in game Js2JavaCommon SetAudioVolumeIndication');
    var param = JSON.stringify({
        interval : interval,
        smooth: smooth
    });
    jsb.reflection.callStaticMethod(className, "SetAudioVolumeIndication", "(Ljava/lang/String;)V", param);
}

Js2JavaCommon.prototype.GameOver = function() {
    window.CommonUtil.WPLog('in game Js2JavaCommon GameOver');
    jsb.reflection.callStaticMethod(className, "GameOver", "()V");
}

Js2JavaCommon.prototype.IsDebug = function(callback) {
    window.CommonUtil.WPLog('in game Js2JavaCommon IsDebug');
    var data = jsb.reflection.callStaticMethod(className, "IsDebug", "()Z");
    callback(data);
}

Js2JavaCommon.prototype.IsDebugUrl = function(callback) {
    window.CommonUtil.WPLog('in game Js2JavaCommon IsDebugUrl');
    var data = jsb.reflection.callStaticMethod(className, "IsDebugUrl", "()Z");
    callback(data);
}

Js2JavaCommon.prototype.MuteRemoteAudioStream = function(uid, is_mute) {
    window.CommonUtil.WPLog('in game Js2JavaCommon MuteRemoteAudioStream');
    var param = JSON.stringify({
        uid : uid,
        is_mute: is_mute
    });
    jsb.reflection.callStaticMethod(className, "MuteRemoteAudioStream", "(Ljava/lang/String;)I", param);
}

Js2JavaCommon.prototype.PlayGameEffect = function(name, isLoop) {
    window.CommonUtil.WPLog('in game Js2JavaCommon PlayGameEffect');
    var param = JSON.stringify({
            effect_name: name,
            is_loop: isLoop
        });
    jsb.reflection.callStaticMethod(className, "PlayGameEffect", "(Ljava/lang/String;)V", param);
}

Js2JavaCommon.prototype.playMusic = function(name, isLoop) {
    window.CommonUtil.WPLog('in game Js2JavaCommon playMusic effect_name='+name);
    var param = JSON.stringify({
        effect_name : name,
        is_loop: isLoop
    });
    jsb.reflection.callStaticMethod(className, "playMusic", "(Ljava/lang/String;)V", param);
}

Js2JavaCommon.prototype.onBackPress = function() {
    window.CommonUtil.WPLog('in game Js2JavaCommon onBackPress');
    jsb.reflection.callStaticMethod(className, "jsBackPress", "()V");
}

Js2JavaCommon.prototype.ImageBase64 = function(base64) {
    window.CommonUtil.WPLog('in game Js2JavaCommon ImageBase64');
    var param = JSON.stringify({
        base : base64,
    });
    jsb.reflection.callStaticMethod(className, "ImageBase64", "(Ljava/lang/String;)V", param);
}

Js2JavaCommon.prototype.CocosCaptureScreen = function(file_name) {
    window.CommonUtil.WPLog('in game Js2JavaCommon CocosCaptureScreen file_name:'+file_name);
    jsb.reflection.callStaticMethod(className, "CocosCaptureScreen", "(Ljava/lang/String;)V", file_name);
}

Js2JavaCommon.prototype.LoadImg = function(uid, url, sprite) {
    window.CommonUtil.WPLog('in game Js2JavaCommon LoadImg url:'+url);
    var callback = function(res_name){
        cc.loader.load(cc.url.raw("resources/"+res_name), function (err, tex) {
            console.log("-----LoadImg err="+err+" tex="+tex);
            if (err) {
                return;
            }
            sprite.spriteFrame = new cc.SpriteFrame(tex);
        });
    };
    var seq = window.JavaCallback.addCallback(callback);
    var param = JSON.stringify({
        uid: uid,
        img_url: url,
        seq: seq
    });
    jsb.reflection.callStaticMethod(className, "LoadImg", "(Ljava/lang/String;)V", param);
}

window.Base64Decode = function(input) {
    // constants
    var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);

    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                   + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                   + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };

    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;

    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };

    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
        return chars.join('');
    };

    var btoa = function(b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };

    var _encode = function (u) { 
        return btoa(utob(u)) 
    };
    var encode = function(u, urisafe) {
        return !urisafe
            ? _encode(String(u))
            : _encode(String(u)).replace(/[+\/]/g, function(m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };

    var encodeURI = function(u) { return encode(u, true) };
    // decoder stuff
    var re_btou = new RegExp([
        '[\xC0-\xDF][\x80-\xBF]',
        '[\xE0-\xEF][\x80-\xBF]{2}',
        '[\xF0-\xF7][\x80-\xBF]{3}'
    ].join('|'), 'g');

    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };

    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };

    var cb_decode = function(cccc) {
        var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };

    var atob = function(a){
        return a.replace(/[\s\S]{1,4}/g, cb_decode);
    };

    var _decode = function(a) { return btou(atob(a)) };
    var decode = function(a){
        return _decode(
            String(a).replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };
    var noConflict = function() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };

    return decode(input);
}
