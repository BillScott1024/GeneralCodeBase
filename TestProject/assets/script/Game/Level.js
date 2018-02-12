
cc.Class({
    extends: cc.Component,

    properties: {
        world:{
            default:null,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.world = new p2.World({gravity: [0, -5]});
        this.world.sleepMode = p2.World.BODY_SLEEPING;
        this.world.on("beginContact", this.onContact, this);
    },

    onContact: function (event) {
        cc.log(event.bodyA.name);
        cc.log(event.bodyB.name);
    },

    // start () {

    // },

    update: function(dt) {
        this.world.step(1 / 60);
        }
});
