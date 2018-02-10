// var CountDown = require('../Common/CountDown');
cc.Class({
    extends: cc.Component,
    cocosArray: null,
    properties: {
        countDownNode: {
            type: cc.Node,
            default: null,
            tooltip: "倒计时"
        },
        cocosPrefab: {
            type: cc.Prefab,
            default: null
        },
        cocoNode: {
            type: cc.Node,
            default: null
        },


    },


    onLoad() {
        var self = this;
        self.test();
    },

    test: function () {
        var self = this;
        self.CountDown();
        self.instancePrefab();

    },

    instancePrefab: function () {
        var self = this;
        self.cocosArray = [];
        var movePoint = [cc.p(-100, 100), cc.p(100, 100), cc.p(100, -100), cc.p(-100, -100)];
        for (var i = 0; i < 10; i++) {
            var cocos = cc.instantiate(self.cocosPrefab);
            self.cocoNode.addChild(cocos);
            cocos.setPosition(0, 0);
            self.cocosArray.push(cocos);
        }


        var delay = cc.delayTime(3);
        for (var i = 0; i < 10; i++) {
            setTimeout((function (i) {
                return function () {

                    var move = cc.moveTo(0.8, movePoint[i%4]);
                    var moveBack = cc.moveTo(0.8,0,0);
                    var action = cc.repeatForever(cc.sequence( move,moveBack));
                    self.cocosArray[i].runAction(action.clone());
                }
            })(i), 100 * i);
        }


    },

    CountDown: function () {
        var self = this;
        self.countDownNode.getComponent("CountDown").startCountDown(20);
    },

    // start () {

    // },

    // update (dt) {},
});
