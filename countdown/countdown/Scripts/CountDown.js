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

    //倒计时时长
    duration : 0,
    //进度条进度 1~0
    progress : 0,

    //进度条总长度
    totalLength : 0,
    //进度条四个顶点
    progressPoint1 : 0,
    progressPoint2 : 0,
    progressPoint3 : 0,
    progressPoint4 : 0,
    
    //进度条框
    properties: {
        progressWidth : 200,    //宽
        progressHeight : 100,   //高
        arc : 3,                //圆角半径
    },

    onLoad : function() {
        // this.startProgress(10);
    },

    //开始倒计时
    startProgress : function(duration) {
        this.duration = duration;
        this.progress = 1;

        var totalLength = 2 * (this.progressWidth + this.progressHeight);
        this.totalLength = totalLength;
        this.progressPoint1 = (0.5 * this.progressWidth + 0 * this.progressHeight) / totalLength;
        this.progressPoint2 = (0.5 * this.progressWidth + 1 * this.progressHeight) / totalLength;
        this.progressPoint3 = (1.5 * this.progressWidth + 1 * this.progressHeight) / totalLength;
        this.progressPoint4 = (1.5 * this.progressWidth + 2 * this.progressHeight) / totalLength;
    },

    //停止倒计时
    stopProgress : function() {
        this.duration = 0;
        this.progress = 0;
    },

    //绘制倒计时图线
    update : function(dt) {
        var lastProgress = this.progress;
        
        if (this.duration > 0) {
            this.progress -= dt/this.duration;
            if (this.progress < 0) {
                this.progress = 0;
            }
        } else {
            this.progress = 0;
        }
        // this.progress = 0.16667;
        // console.log('points:' + this.progressPoint1 + '  ' + this.progressPoint2 + '  ' + this.progressPoint3 + '  ' + this.progressPoint4);

        if (lastProgress == this.progress) {
            return;
        }

        var ctx = this.node.getComponent(cc.Graphics);
        ctx.clear();

        if (this.progress == 0) {
            return;
        }
        
        if (this.progress < this.progressPoint1) {
            var extra = this.progress * this.totalLength;
            ctx.moveTo(0, this.progressHeight/2);
            ctx.lineTo(- extra, this.progressHeight/2);
            ctx.stroke();
            return;
        }
        
        if (this.progress < this.progressPoint2) {
            var extra = (this.progress - this.progressPoint1) * this.totalLength;
            ctx.moveTo(0 , this.progressHeight/2);
            ctx.lineTo(- this.progressWidth/2 + this.arc, this.progressHeight/2);
            ctx.arc(- this.progressWidth/2 + this.arc, this.progressHeight/2-this.arc, this.arc, 0.5 * Math.PI, Math.PI, true);
            if (extra > this.arc) {
                ctx.lineTo(- this.progressWidth/2, this.progressHeight/2 - extra);
            }
            ctx.stroke();
            return;
        }

        if (this.progress < this.progressPoint3) {
            var extra = (this.progress - this.progressPoint2) * this.totalLength;
            ctx.moveTo(0 , this.progressHeight/2);
            ctx.lineTo(- this.progressWidth/2 + this.arc, this.progressHeight/2);
            ctx.arc(- this.progressWidth/2 + this.arc, this.progressHeight/2-this.arc, this.arc, 0.5 * Math.PI, Math.PI, true);
            ctx.lineTo(- this.progressWidth/2, - this.progressHeight/2 + this.arc);
            ctx.arc(- this.progressWidth/2 + this.arc, - this.progressHeight/2 + this.arc, this.arc, Math.PI, Math.PI * 1.5, true);
            if (extra > this.arc) {
                ctx.lineTo(-this.progressWidth/2 + extra, - this.progressHeight/2);
            }
            ctx.stroke();
            return;
        }

        if (this.progress < this.progressPoint4) {
            var extra = (this.progress - this.progressPoint3) * this.totalLength;
            ctx.moveTo(0 , this.progressHeight/2);
            ctx.lineTo(- this.progressWidth/2 + this.arc, this.progressHeight/2);
            ctx.arc(- this.progressWidth/2 + this.arc, this.progressHeight/2-this.arc, this.arc, 0.5 * Math.PI, Math.PI, true);
            ctx.lineTo(- this.progressWidth/2, - this.progressHeight/2 + this.arc);
            ctx.arc(- this.progressWidth/2 + this.arc, - this.progressHeight/2 + this.arc, this.arc, Math.PI, Math.PI * 1.5, true);
            ctx.lineTo(this.progressWidth/2 - this.arc, - this.progressHeight/2);
            ctx.arc(this.progressWidth/2 - this.arc, - this.progressHeight/2 + this.arc, this.arc, 1.5 * Math.PI, 0, true);
            if (extra > this.arc) {
                ctx.lineTo(this.progressWidth/2, - this.progressHeight/2 + extra);
            }
            ctx.stroke();
            return;
        }

        var extra = (this.progress - this.progressPoint4) * this.totalLength;
        ctx.moveTo(0 , this.progressHeight/2);
        ctx.lineTo(- this.progressWidth/2 + this.arc, this.progressHeight/2);
        ctx.arc(- this.progressWidth/2 + this.arc, this.progressHeight/2-this.arc, this.arc, 0.5 * Math.PI, Math.PI, true);
        ctx.lineTo(- this.progressWidth/2, - this.progressHeight/2 + this.arc);
        ctx.arc(- this.progressWidth/2 + this.arc, - this.progressHeight/2 + this.arc, this.arc, Math.PI, Math.PI * 1.5, true);
        ctx.lineTo(this.progressWidth/2 - this.arc, - this.progressHeight/2);
        ctx.arc(this.progressWidth/2 - this.arc, - this.progressHeight/2 + this.arc, this.arc, 1.5 * Math.PI, 0, true);
        ctx.lineTo(this.progressWidth/2, this.progressHeight/2 - this.arc);
        ctx.arc(this.progressWidth/2 - this.arc, this.progressHeight/2 - this.arc, this.arc, 0, 0.5 * Math.PI, true);
        if (extra > this.arc) {
            ctx.lineTo(this.progressWidth/2 - extra, this.progressHeight/2);
        }
        ctx.stroke();
    },
});
