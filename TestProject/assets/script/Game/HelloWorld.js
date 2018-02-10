var WPAudioPlayer = require('../Platform/WPAudioPlayer');
cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        shuffleAudio : {
            default : null,
            url : cc.AudioClip
        },
        moveAudio:{
            default:null,
            url:cc.AudioClip
        },
        cocosPicNode:{
            default:null,
            type:cc.Node
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;

        this.testAudio();
    },

    testAudio: function () {
        var self = this;


        // var action1 = cc.callFunc(function () {
        // 
        // });

        // var action1 = cc.callFunc(function () {

        // });
        // var move1 = cc.moveTo(1, 50, 50);
        // var move2 = cc.moveTo(1, -50, -50);

        // var delay1 = cc.delayTime(1.0);
        // var delay2 = cc.delayTime(0.8);
        // self.cocosPicNode.runAction(cc.sequence(move1, move2,move1,move2));
 
        //播放洗牌声音
        setTimeout(function () {
            cc.Audio.useWebAudio = true;
            WPAudioPlayer.instance.PlayGameEffect('shuffle', self.shuffleAudio);
            // cc.audioEngine.play(self.moveAudio,false,1);
        }, 10000);

    },


    // called every frame
    update: function (dt) {

    },
});
