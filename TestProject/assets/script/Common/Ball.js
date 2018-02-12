
cc.Class({
    extends: cc.Component,

    properties: {
        body: {default: null},
        shape: {default: null}
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.body = new p2.Body({
            mass: 1,
            position: [this.node.x / 100, this.node.y / 100],
            angle: -this.node.rotation / 180 * Math.PI,
            type: p2.Body.DYNAMIC,
            allowSleep: false
        });
        this.body.name = "ball";
        this.body.displays = [this.node];
        this.shape = new p2.Circle({radius: this.node.width / 200});
        this.body.addShape(this.shape);
        this.node.parent.getComponent("Level").world.addBody(this.body);
    },

    lateUpdate: function(dt) {
        this.node.x = this.body.position[0] * 100;
        this.node.y = this.body.position[1] * 100;
        this.node.rotation = -(this.body.angle * 180 / Math.PI);
        }
});
