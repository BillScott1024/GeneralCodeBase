(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ActiveGrass.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '019c4Q4Ug5K76NXRlTvqQyc', 'ActiveGrass', __filename);
// Script/ActiveGrass.js

"use strict";

var ccShader_ActiveGrass_Vert = require("../Src/ccShader_ActiveGrass_Vert.js");
var ccShader_ActiveGrass_Frag = require("../Src/ccShader_ActiveGrass_Frag.js");

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {

        this._time = 0;
        this._useActive();
    },

    _useActive: function _useActive() {
        this._program = new cc.GLProgram();
        this._program.initWithVertexShaderByteArray(ccShader_ActiveGrass_Vert, ccShader_ActiveGrass_Frag);

        this._program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        this._program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        this._program.link();
        this._program.updateUniforms();

        this._uniformLocation = this._program.getUniformLocationForName("u_time");

        cc.setProgram(this.node._sgNode, this._program);
    },

    update: function update(dt) {
        if (this._program) {
            this._time += dt;

            this._program.setUniformLocationWith1f(this._uniformLocation, this._time);
            this._program.updateUniforms();
        }
    }

});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=ActiveGrass.js.map
        