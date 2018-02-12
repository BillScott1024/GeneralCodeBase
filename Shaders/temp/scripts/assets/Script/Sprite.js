cc._RFpush(module, '63a35JZuC9CCqNur5HGKzB2', 'Sprite');
// Script/Sprite.js

"use strict";

var ShadersEnum = cc.Enum({
    Default: 0,
    HighLight: 1,
    Gray: 2
});

/* ShadersEnum.HighLight */
var ccShader_HighLight_Vert = require("../Src/ccShader_HighLight_Vert.js");
var ccShader_HighLight_Frag = require("../Src/ccShader_HighLight_Frag.js");
var ccShader_HighLight = 'ccShader_HighLight';

/* ShadersEnum.HighLight */
var ccShader_Gray_Vert = require("../Src/ccShader_Gray_Vert.js");
var ccShader_Gray_Frag = require("../Src/ccShader_Gray_Frag.js");
var ccShader_Gray = 'ccShader_Gray';

cc.Class({
    "extends": cc.Component,

    properties: {
        shaderType: {
            "default": ShadersEnum.Default,
            type: ShadersEnum,
            notify: function notify() {
                this._updateShaderType();
            }
        },

        currState: {
            "default": ShadersEnum.Default,
            type: ShadersEnum,
            visible: false
        }
    },

    onLoad: function onLoad() {
        this.shaderType = ShadersEnum.Default;
        this.currState = this.shaderType;
        this._updateShaderType();
    },

    /* 更新shader */
    _updateShaderType: function _updateShaderType() {
        if (this.shaderType === this.currState) {
            return;
        }

        switch (this.shaderType) {
            case ShadersEnum.Default:
                this._useDefault();
                break;
            case ShadersEnum.HighLight:
                this._useHighLight();
                break;
            case ShadersEnum.Gray:
                this._useGray();
                break;
            default:
                break;
        }
    },

    /* 使用默认 */
    _useDefault: function _useDefault() {
        /* 官方实现原图shader */
        var kProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR);

        /* if 个人认为是多余的, 官方已实现好, 为了处理API相同, 这里还是写上了 */
        if (typeof kProgram === "undefined") {
            var program = new cc.GLProgram();
            program.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_COLOR_VERT, cc.SHADER_POSITION_TEXTURE_COLOR_FRAG);

            program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
            program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
            program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            program.link();
            program.updateUniforms();
            cc.setProgram(this.node._sgNode, program);

            /* 官方不用在添加 key 保存到 shaderCache 中 */
            //cc.shaderCache.addProgram( program, ccShader_Default );
        } else {
                cc.setProgram(this.node._sgNode, kProgram);
            }

        this.currState = this.shaderType;
    },

    /* 使用高亮 */
    _useHighLight: function _useHighLight() {
        var kProgram = cc.shaderCache.programForKey(ccShader_HighLight);
        if (typeof kProgram === 'undefined') {
            var program = new cc.GLProgram();
            program.initWithVertexShaderByteArray(ccShader_HighLight_Vert, ccShader_HighLight_Frag);

            program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
            program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
            program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            program.link();
            program.updateUniforms();
            cc.setProgram(this.node._sgNode, program);

            cc.shaderCache.addProgram(program, ccShader_HighLight);
        } else {
            cc.setProgram(this.node._sgNode, kProgram);
        }

        this.currState = this.shaderType;
    },

    /* 使用置灰 */
    _useGray: function _useGray() {
        var kProgram = cc.shaderCache.programForKey(ccShader_Gray);
        if (typeof kProgram === 'undefined') {
            var program = new cc.GLProgram();
            program.initWithVertexShaderByteArray(ccShader_Gray_Vert, ccShader_Gray_Frag);

            program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
            program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
            program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            program.link();
            program.updateUniforms();
            cc.setProgram(this.node._sgNode, program);

            cc.shaderCache.addProgram(program, ccShader_Gray);
        } else {
            cc.setProgram(this.node._sgNode, kProgram);
        }

        this.currState = this.shaderType;
    }

});

cc._RFpop();