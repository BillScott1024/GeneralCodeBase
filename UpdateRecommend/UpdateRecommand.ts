// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
declare var wx;
@ccclass
export default class UpdateRecommand extends cc.Component {

    @property(cc.Sprite)
    spriteComp: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    loadImg(icon: string) {
        let img= wx.createImage();
        img.src=icon;
        let self = this;
        img.onload=function(){
            console.log('交叉推广图片加载成功');
            let tex=new cc.Texture2D();
            tex.initWithElement(img);
            tex.handleLoadedTexture();
            self.spriteComp.spriteFrame = new cc.SpriteFrame(tex);
            self.node.active = true;
        }
        img.onerror = function() {
            self.node.active = false;
        }
    }

    onEnable() {
        var self = this;
        self.spriteComp.spriteFrame = null;
        window["WXManager"].GetGameConfig(
            function (data) {
                if (data != '' && data != null) {
                    var tmp = JSON.parse(data);
                    if(tmp.recommends) {
                        if(tmp.recommends.hasRecommand == 1) {
                            let contents:any[] = tmp.recommends.contents;
                            let indexes: number[] = [];
                            //根据权重构造随机数据
                            for (let i = 0;i < contents.length;i ++) {
                                for (let j = 0;j < contents[i].weight; j ++) {
                                    indexes.push(i);
                                }
                            }
                            let rand = ~~(Math.random() * indexes.length);
                            let target = contents[indexes[rand]];
                            console.log('load recommand:', target.appid);
                            self.loadImg(target.icon);
                            window["WXManager"].jumpAppId = target.appid;
                            window["WXManager"].jumpImage = target.image;
                            window["WXManager"].jumpPath = target.path;
                            window["WXManager"].jumpName = target.jumpName;
                            window["WXManager"].directJump = target.directJump;
                            window['WXManager'].aldSendEvent('promotion_'+window["WXManager"].jumpName,{'交叉推广阶段':'展示'});
                        } else {
                            window["hasRecommand"] = 0;
                            self.node.active = false;
                        }
                    } else {
                        self.node.active = false;
                    }


                } else {
                    self.node.active = false;
                }
            }
        );
    }
}
