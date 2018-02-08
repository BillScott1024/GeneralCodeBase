
cc.Class({
    extends: cc.Component,

    countDownCallback: null,
    countDownTime: null,
    properties: {

        //---------Node---------/
        countDownTimeLabel: {
            type: cc.Node,
            default: null,
            tooltip: "倒计时文字"
        },
        countDownLayer: {
            type: cc.Node,
            default: null,
            tooltip: "遮罩"
        },


        //---------property-----/
    },


    onLoad() {

    },

    clear: function () {
        var self = this;

        self.countDownLayer.active = false;
        self.countDownLayer.getComponent(cc.ProgressBar).progress = 1;
        self.countDownTime = 0;
    },

    startCountDown: function (totalCountTime) {
        var self = this;
        self.clear();

        self.countDownLayer.active = true;
        var startCountDownTime = new Date().getTime();
        self.countDownTime = totalCountTime;

        this.countDownCallback = function () {
            var now = new Date().getTime();
            var countTime = totalCountTime - parseInt((now - startCountDownTime) / 1000);

            if (countTime >= 0) {
                self.countDownTimeLabel.getComponent(cc.Label).string = '倒计时：' + countTime + ' s';
            }
            if (countTime <= 0) {
                self.stopCountDown();
            }
        };
        self.unschedule(self.countDownCallback);
        self.schedule(this.countDownCallback, 0.25);
    },

    stopCountDown: function () {
        var self = this;
        self.countDownLayer.active = false;

        if (self.countDownCallback) {
            self.unschedule(self.countDownCallback);
            self.countDownCallback = null;
        }
    },

    update(dt) {
        if (this.countDownLayer.active == true) {
            this.countDownLayer.getComponent(cc.ProgressBar).progress -= dt / this.countDownTime;
        }
    },
});
