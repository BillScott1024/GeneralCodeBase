
cc.Class({
    extends: cc.Component,

    properties: {
        cocosPrefab:{
            type:cc.Prefab,
            default:null
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.loadNode();
    },

    loadNode:function(){
        var self = this;
        var cocosNode = cc.instantiate(self.cocosPrefab);
        self.node.addChild(cocosNode);
        cocosNode.setPosition(0,0);

        // var label = cocosNode.getChildByName('label');
        // cc.log("label:",label);
        // var stringLabel = label.getComponent(cc.Label).string;
        // label.getComponent(cc.Label).string = "Cocos Creator";

        cocosNode.getChildByName('label').getComponent(cc.Label).string = "Creator";

        // cc.log("string:",stringLabel);
        

    },
    // start () {

    // },

    // update (dt) {},
});
