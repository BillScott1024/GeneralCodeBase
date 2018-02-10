
cc.Class({
    extends: cc.Component,

    properties: {
   
        bottomMenu: {
            default: null,
            type: cc.Sprite,
            tooltip:"底部状态栏"
        },

        topMenu: {
            default: null,
            type: cc.Sprite,
            tooltip:"顶部状态栏"
        },
    },

    onLoad () {
       var self = this;
       self.fitScreen();
    },

    fitScreen: function () {
        //关掉fps面板
        cc.director.setDisplayStats(false);

        //屏幕适配
        var width = 750;
        var height = 1334;
        var fitWidth = 750;
        var fitHeight = 1334;

        if (window.WConfig.use_native) {
            var size = cc.director.getVisibleSize();
            fitWidth = size.width;
            fitHeight = size.height;
        } else {
            fitWidth = document.body.clientWidth;
            fitHeight = document.body.clientHeight;
            cc.log("document.body.clientWidth:", document.body.clientWidth, "document.body.clientHeight", document.body.clientHeight);
        }

        if (fitWidth / fitHeight > width / height) {
            this.node.getComponent(cc.Canvas).fitWidth = true;
            width = (fitWidth / fitHeight) * height;
            this.topMenu.node.width = width;
            this.bottomMenu.node.width = width;
        } else {
            height = width / (fitWidth / fitHeight);

            this.node.getComponent(cc.Canvas).fitHeight = true;

            var offSetHeight = (height - 1334) / 2;
            cc.log("offSetHeight", offSetHeight)
            this.topMenu.node.y += offSetHeight;
            this.bottomMenu.node.y -= offSetHeight;

            var addTopHeight = offSetHeight - this.topMenu.node.height;
            if (addTopHeight > 0) {
                this.topMenu.node.height += addTopHeight;
            }

            var addBottomHeight = offSetHeight - this.bottomMenu.node.height;
            if (addBottomHeight > 0) {
                this.bottomMenu.node.height += addBottomHeight;
            }
        }

        this.node.getComponent(cc.Canvas).designResolution = new cc.size(width, height);
    },

    start () {

    },

    // update (dt) {},
});
