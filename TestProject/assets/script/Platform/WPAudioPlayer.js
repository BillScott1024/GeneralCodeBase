var Platform = require('Platform');

function WPAudioPlayer() {
    this.volume = 0.5;
}

WPAudioPlayer.prototype.setVolume = function(volume) {
    if (volume < 0) {
        volume = 0;
    }
    if (volume > 1) {
        volume = 1;
    }
    this.volume = volume;
}

WPAudioPlayer.prototype.PlayGameEffect = function(gameEffectName, gameEffectAudioNode) {
    if (Platform.instance.isIOS) {
        Platform.instance.PlayGameEffect(gameEffectName);
    } else {
        if(window.WConfig.use_native) {
            window.Js2JavaCommon.PlayGameEffect(gameEffectName, false);
        } else {
            cc.audioEngine.play(gameEffectAudioNode, false, this.volume);
        }
    }
}

var instance = new WPAudioPlayer();

module.exports = {
    instance : instance
};
