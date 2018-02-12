// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        body: {default: null},
        shape: {default: null}
    },

    // LIFE-CYCLE CALLBACKS:


    start: function () {
        this.body = new p2.Body({
            position: [this.node.x / 100, this.node.y / 100],
            angle: -this.node.rotation / 180 * Math.PI,
            type: p2.Body.STATIC
        });
        this.body.name = "black";
        this.body.displays = [this.node];
        this.shape = new p2.Box({width: this.node.width / 100, height: this.node.height / 100});
        this.body.addShape(this.shape);
        this.node.parent.getComponent("Level").world.addBody(this.body);
    },
    
    onLoad() {},
    // update (dt) {},
});
