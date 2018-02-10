var WPLog = require('WPLog').WPLog;

var NETWORK_CODE_SUCCESS = 200;

function Platform() {
    //游戏中用户发言
    this.onPushRoomMsg = null;

    //调整游戏音效的音量
    this.onVolumeChange = null;

    //游戏中用户声音变化
    this.onUserSpeak = null;

    //android通过返回键退出
    this.onBackPress = null;

    //提前获取的信息，方便使用
    this.rid = 0;
    this.isWatcher = false;
    this.watchUid = 0;
    this.selfUid = 0;
    this.selfSecret = null;
    this.isDebug = false;
    this.isIOS = false;
    this.isDebugUrl = false;
}

Platform.prototype.setCallbacks = function(onPushRoomMsg, onVolumeChange, onUserSpeak, onBackPress) {
    if(window.WConfig.use_native) {
        var onResume = function(){
            //window.GAME.sync();
        };
        window.Java2JsCommon.RegisterCallback(onPushRoomMsg, onVolumeChange, onUserSpeak, onBackPress, onResume);
    } else {
        this.onPushRoomMsg = onPushRoomMsg;//游戏中用户发言
        this.onVolumeChange = onVolumeChange;//调整游戏音效的音量
        this.onUserSpeak = onUserSpeak;//游戏中用户声音变化
        this.onBackPress = onBackPress;//android通过返回键退出
    }
}

//初始化
Platform.prototype.setup = function() {
    var that = this;

    if(window.WConfig.use_native) {
        return;
    }

    //url参数
    this.req = GetRequest();
    //调用初始化，并注册方法，保存bridge对象
    this.setupWebViewJavascriptBridge(function(bridge) {
        var uniqueId = 1
        function log(message, data) {
            var log = document.getElementById('log')
            var el = document.createElement('div')
            el.className = 'logLine'
            el.innerHTML = uniqueId++ + '. ' + message + ':<br/>' + JSON.stringify(data)
            if (log.children.length) { log.insertBefore(el, log.children[0]) }
            else { log.appendChild(el) }
        }

        that.registerOnPushRoomMsg(bridge);
        that.registerSetSoundEffectVolume(bridge);
        that.registerRefreshUserVolume(bridge);
        that.registerOnBackPress(bridge);
        
        document.body.appendChild(document.createElement('br'));
        that.theBridge = bridge;
    });
}

Platform.prototype.setupWebViewJavascriptBridge = function(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];

    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    if (window.Wespy) {
        window.Wespy.onJsBridge('wvjbscheme://__BRIDGE_LOADED__');
    }
}

//------------------------------------------------------------------------------------

//游戏中用户发言
Platform.prototype.registerOnPushRoomMsg = function(bridge) {
    var self = this;
    bridge.registerHandler('OnPushRoomMsg', function(data, responseCallback) {
        WPLog("OnPushRoomMsg:" + data);
        var json = JSON.parse(data);
        if (json.code == NETWORK_CODE_SUCCESS) {
            var send_uid = json.data.send_uid;
            var msg_content = json.data.msg_content;
            self.onPushRoomMsg(send_uid, msg_content);
        }
    });
}

//游戏音量调节
Platform.prototype.registerSetSoundEffectVolume = function(bridge) {
    var self = this;
    bridge.registerHandler('SetSoundEffectVolume', function(data, responseCallback) {
        WPLog("SetSoundEffectVolume:" + data);
        var json = JSON.parse(data);
        if (json.code == NETWORK_CODE_SUCCESS) {
            var volume = json.data.volume;
            self.onVolumeChange(volume);
        }
    });
}

//用户声音回调
Platform.prototype.registerRefreshUserVolume = function(bridge) {
    var self = this;
    bridge.registerHandler('RefreshUserVolume', function(data, responseCallback) {
        //WPLog("RefreshUserVolume:" + data);
        var json = JSON.parse(data);
        if (json.code == NETWORK_CODE_SUCCESS) {
            var volumeUidList = json.data.volumeList;
            self.onUserSpeak(volumeUidList);
        }
    });
}

//用户退出游戏界面
Platform.prototype.registerOnBackPress = function(bridge) {
    var self = this;
    bridge.registerHandler('GameExit', function(data, responseCallback) {
        WPLog("onBackPress");
        self.onBackPress();
    });
}

//-----------------------------------------------------------------------------------

//获取游戏房间号
Platform.prototype.GetRid = function(callback) {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.GetRid(callback);
        return;
    }

    this.theBridge.callHandler('GetRid', '', function(response) {
        WPLog('GetRid response:' + response);
        var json = JSON.parse(response);
        if (json.code == NETWORK_CODE_SUCCESS) {
            callback(json.data.rid);
        }
    });
}

//获取跟房信息（是否跟房，跟房uid）
Platform.prototype.GetWatchInfo = function(callback) {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.GetWatcher(callback);
        return;
    }

    this.theBridge.callHandler('GetWatcher', '', function(response) {
        WPLog('GetWatcher response:' + response);
        var json = JSON.parse(response);
        if (json.code == NETWORK_CODE_SUCCESS) {
            callback(json.data.is_watcher, json.data.target_uid);
        }
    });
}

//获取自己的 uid
Platform.prototype.GetSelfUid = function(callback) {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.GetSelfUid(callback);
        return;
    }

    this.theBridge.callHandler('GetSelfUid', '', function(response) {
        WPLog('GetSelfUid response:' + response);
        var json = JSON.parse(response);
        if (json.code == NETWORK_CODE_SUCCESS) {
            callback(json.data.uid);
        }
    });
}

//获取认证字符串
Platform.prototype.GetSelfSecret = function(callback) {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.GetVerifyKey(callback);
        return;
    }

    this.theBridge.callHandler('GetVerifyKey', '', function(response) {
        WPLog('GetVerifyKey response:' + response);
        var json = JSON.parse(response);
        if (json.code == NETWORK_CODE_SUCCESS) {
            callback(json.data.verify_key);
        }
    });
}

//客户端是否是debug模式
Platform.prototype.IsDebug = function(callback) {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.IsDebug(callback);
        return;
    }

    this.theBridge.callHandler('IsDebug', '', function(response){
        WPLog('IsDebug response' + response);
        var json = JSON.parse(response);
        if (json.code == NETWORK_CODE_SUCCESS) {
            callback(json.data.is_debug);
        }
    });
}

//客户端显示debugUrl
Platform.prototype.IsDebugUrl = function() {
    var self = this;

    if(window.WConfig.use_native) {
        window.Js2JavaCommon.IsDebugUrl(function(data){
            self.isDebugUrl = data;
        });
        return;
    }

    this.theBridge.callHandler('IsDebugUrl', '', function(response){
        WPLog('IsDebugUrl response' + response);
        var json = JSON.parse(response);
        if (json.code == NETWORK_CODE_SUCCESS) {
            self.isDebugUrl = json.data.is_debug;
        }
    });
}

//获取客户端的版本号和渠道
Platform.prototype.GetAppInfo = function() {
    if(window.WConfig.use_native) {
        //window.Js2JavaCommon.GetAppInfo();
        return;
    }

    var self = this;
    this.theBridge.callHandler('GetAppInfo', '', function(response) {
        WPLog('GetAppInfo response:' + response);
        var json = JSON.parse(response);
        if (json.code == NETWORK_CODE_SUCCESS) {
            var isIOS = json.data.is_ios;
            if (isIOS) {
                self.isIOS = true;
            }
        }
    });   
}

//播放游戏音效
Platform.prototype.PlayGameEffect = function(effectName) {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.PlayGameEffect(effectName, false);
        return;
    }

    var param = JSON.stringify({
        effect_name : effectName
    });
    this.theBridge.callHandler('PlayGameEffect', param, function(response){
        WPLog('PlayGameEffect response:' + response);
    });
}

//在游戏启动时获取到部分数据，避免之后每次使用回调的方式去取比较麻烦
Platform.prototype.preGet = function(callback) {
    var self = this;

    if(window.WConfig.use_native) {
        self.GetAppInfo();
        self.IsDebugUrl();

        self.GetSelfUid(function(uid) {
            self.GetRid(function(rid) {
                self.GetWatchInfo(function(isWatcher, watchUid) {
                    self.GetSelfSecret(function(secret) {
                        self.IsDebug(function(isDebug) {
                            self.selfUid = uid;
                            self.rid = rid;
                            self.isWatcher = isWatcher;
                            self.watchUid = watchUid;
                            self.selfSecret = secret;
                            self.isDebug = isDebug;
                            callback();
                        });
                    });
                });
            });
        });  
        return;
    }

    if (this.theBridge != null) {
        self.GetAppInfo();
        self.IsDebugUrl();

        self.GetSelfUid(function(uid) {
            self.GetRid(function(rid) {
                self.GetWatchInfo(function(isWatcher, watchUid) {
                    self.GetSelfSecret(function(secret) {
                        self.IsDebug(function(isDebug) {
                            self.selfUid = uid;
                            self.rid = rid;
                            self.isWatcher = isWatcher;
                            self.watchUid = watchUid;
                            self.selfSecret = secret;
                            self.isDebug = isDebug;
                            callback();
                        });
                    });
                });
            });
        });    
    } else {
        setTimeout(function() {
            self.preGet(callback);
        }, 200);
    }
}

//-----------------------------------------------------------------------------------

//隐藏游戏的 LoadingView
Platform.prototype.HideLoadingView = function() {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.HideLoadingView();
        return;
    }

    this.theBridge.callHandler('HideLoadingView', '', function(response) {
        WPLog('HideLoadingView response:' + response);
    });
}

//根据用户uid获取用户信息
Platform.prototype.GetUserInfo = function(uid, callback) {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.GetUserInfo(uid, callback);
        return;
    }

    var param = JSON.stringify({
        uid : uid
    });
    this.theBridge.callHandler('GetUserInfo', param, function(response){
        WPLog('GetUserInfo response:' + response);
        var json = JSON.parse(response);
        if (json.code == NETWORK_CODE_SUCCESS) {
            var headImgUrl = json.data.headimgurl;
            var nickname = json.data.nickname;
            var gender = json.data.gender;
            callback(headImgUrl, nickname,gender);
        }
    });
}

//弹出用户详情的窗口
Platform.prototype.ShowUserDialog = function(uid) {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.ShowUserDialog(uid);
        return;
    }

    var param = JSON.stringify({
        uid : uid
    });
    this.theBridge.callHandler('ShowUserDialog', param, function(response){
        WPLog('ShowUserDialog response:' + response);
    });
}

//获取是否为好友关系
Platform.prototype.isFriendWithUid = function(uid, callback) {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.isFriendWithUid(uid, callback);
        return;
    }
        
    var param = JSON.stringify({
        uid : uid
    });
    this.theBridge.callHandler('IsFriend', param, function(response) {
        WPLog('IsFriend response:' + response);
        var json = JSON.parse(response);
        if (json.code == NETWORK_CODE_SUCCESS) {
            var isFriend = json.data.is_friend;
            callback(isFriend);
        }
    });
}

//点击了加好友
Platform.prototype.clickAddFriend = function(uid, callback) {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.clickAddFriend(uid, callback);
        return;
    }

    var param = JSON.stringify({
        uid : uid
    });
    this.theBridge.callHandler('AddFriend', param, function(response) {
        WPLog('AddFriend response:' + response);
        var json = JSON.parse(response);
        callback(json.code == NETWORK_CODE_SUCCESS);
    });
}

//点击了分享
Platform.prototype.clickShare = function() {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.clickShare();
        return;
    }

    this.theBridge.callHandler('ShareGame', '', function(response) {
        WPLog('ShareGame response:' + response);
    });
    
}

//游戏结束后的截图
Platform.prototype.ImageBase64 = function(base64) {
    if(window.WConfig.use_native) {
        //window.Js2JavaCommon.ImageBase64(base64);
        return;
    }

    if (this.theBridge != null) {
        var param = JSON.stringify({
            base : base64,
        });

        this.theBridge.callHandler('ImageBase64', param, function(response) {
            WPLog('ImageBase64 response:' + response);
        });
    }
}

//点击了返回
Platform.prototype.clickExit = function() {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.GameReturn();
        return;
    }

    this.theBridge.callHandler('GameReturn', '', function(response) {
        WPLog('GameReturn response:' + response);
    });
}

//点击了麦克风
Platform.prototype.clickMicrophone = function(callback) {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.TouchMic(callback);
        return;
    }

    this.theBridge.callHandler('TouchMic', '', function(response) {
        WPLog('TouchMic response:' + response);
        var json = JSON.parse(response);
        if (json.code == NETWORK_CODE_SUCCESS) {
            callback(json.data.is_mic_open, json.data.is_agora_open);
        }
    });
}

//点击了喇叭
Platform.prototype.clickVoice = function(callback) {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.TouchSpeaker(callback);
        return;
    }

    this.theBridge.callHandler('TouchSpeaker', '', function(response) {
        WPLog('TouchSpeaker response:' + response);
        var json = JSON.parse(response);
        if (json.code == NETWORK_CODE_SUCCESS) {
            callback(json.data.is_mic_open, json.data.is_agora_open);
        }
    });
}

//获取麦克风和喇叭的状态
Platform.prototype.getMicrophoneAndVoiceState = function(callback) {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.GetAgoraStatus(callback);
        return;
    }

    this.theBridge.callHandler('GetAgoraStatus', '', function(response) {
        WPLog('GetAgoraStatus response:' + response);
        var json = JSON.parse(response);
        if (json.code == NETWORK_CODE_SUCCESS) {
            callback(json.data.is_mic_open, json.data.is_agora_open);
        }
    });
}

//点击了发言
Platform.prototype.clickEdit = function() {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.ShowInputView();
        return;
    }

    this.theBridge.callHandler('ShowInputView', '', function(response) {
        WPLog('ShowInputView response:' + response);
    });
}

//点击了音量调节
Platform.prototype.clickAdjustVolume = function() {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.ShowRegulateVolumeDialog();
        return;
    }

    this.theBridge.callHandler('ShowRegulateVolumeDialog', '', function(response) {
        WPLog('ShowRegulateVolumeDialog response:' + response);
    });
}

//点击了规则
Platform.prototype.clickRule = function() {
    if(window.WConfig.use_native) {
        window.Js2JavaCommon.ShowGameRule();
        return;
    }

    this.theBridge.callHandler('ShowGameRule', '', function(response) {
        WPLog('ShowGameRule response:' + response);
    });
}

//--------------------------------------------------------------------------

function GetRequest() { 
    var url = location.hash; //获取url中"?"符后的字串
    if (url.indexOf("#") != -1) {
        var theRequest = new Object(); 
        var str = url.substr(1); 
        var strs = str.split("&"); 
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
        }
        return theRequest;
    } else {
        return null;
    }
}

var instance = new Platform();

module.exports = {
    instance : instance
};
