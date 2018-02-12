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

    // onLoad () {},

    start: function () {
        this.body = new p2.Body({
            mass: 0,
            position: [this.node.x / 100, this.node.y / 100],
            angle: -this.node.rotation / 180 * Math.PI,
            type: p2.Body.STATIC
        });
        this.body.name = "green";
        this.body.displays = [this.node];
        this.shape = new p2.Box({width: this.node.width / 100, height: this.node.height / 100});
        this.body.addShape(this.shape);
        this.node.parent.getComponent("Level").world.addBody(this.body);
        this.shape.sensor = !this.node.getComponent(cc.Sprite).enabled;
        this.node.on(cc.Node.EventType.TOUCH_START, this.change, this);
    },

    change: function (event) {
        this.getComponent(cc.Sprite).enabled = !this.getComponent(cc.Sprite).enabled;
        this.body.shapes[0].sensor = !this.body.shapes[0].sensor;
    },

    onDestroy: function () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.change, this);
    }
    // update (dt) {},
});
