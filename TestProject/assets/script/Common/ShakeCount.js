
cc.Class({
    extends: cc.Component,

    properties: {
        numberShakeLabel: {
            type: cc.Node,
            default: null,
        },

        numberScaleLabel: {
            type: cc.Node,
            default: null,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.number = 10;
    },

    onClickBtnShake: function () {
        var self = this;
       // var number = self.numberLabel.getComponent(cc.Label).string;
       self.number -= 1;
        if (self.number < 0) {
            self.number = 10;
        }
        
        self.numberShakeLabel.getComponent(cc.Label).string = self.number;
        var animaShake = self.numberShakeLabel.getComponent(cc.Animation);
        animaShake.play('shake_number');
    },

    onClickBtnScale: function () {
        var self = this;
       // var number = self.numberLabel.getComponent(cc.Label).string;
       self.number -= 1;
        if (self.number < 0) {
            self.number = 10;
        }

        self.numberScaleLabel.getComponent(cc.Label).string = self.number;
        var animaScale = self.numberScaleLabel.getComponent(cc.Animation);
       animaScale.play('scale_number');
    },
    // start () {

    // },

    // update (dt) {},
});
