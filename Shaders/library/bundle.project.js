require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ActiveGrass":[function(require,module,exports){
cc._RFpush(module, '019c4Q4Ug5K76NXRlTvqQyc', 'ActiveGrass');
// Script/ActiveGrass.js

"use strict";

var ccShader_ActiveGrass_Vert = require("../Src/ccShader_ActiveGrass_Vert.js");
var ccShader_ActiveGrass_Frag = require("../Src/ccShader_ActiveGrass_Frag.js");

cc.Class({
    "extends": cc.Component,

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

cc._RFpop();
},{"../Src/ccShader_ActiveGrass_Frag.js":"ccShader_ActiveGrass_Frag","../Src/ccShader_ActiveGrass_Vert.js":"ccShader_ActiveGrass_Vert"}],"Sprite":[function(require,module,exports){
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
},{"../Src/ccShader_Gray_Frag.js":"ccShader_Gray_Frag","../Src/ccShader_Gray_Vert.js":"ccShader_Gray_Vert","../Src/ccShader_HighLight_Frag.js":"ccShader_HighLight_Frag","../Src/ccShader_HighLight_Vert.js":"ccShader_HighLight_Vert"}],"ccShader_ActiveGrass_Frag":[function(require,module,exports){
cc._RFpush(module, '4e8b8Hk2TBMpJZnJdQU+CZz', 'ccShader_ActiveGrass_Frag');
// Src/ccShader_ActiveGrass_Frag.js

"use strict";

module.exports = "varying vec2 v_texCoord;\n" + "varying vec4 v_fragmentColor; \n" + "uniform float u_time;\n" + "const float speed = 2.0;\n" + "const float bendFactor = 0.2;\n" + "void main()\n" + "{\n" + "	    float height = 1.0 - v_texCoord.y;\n" + "	    float offset = pow(height, 2.5);\n" + "	    offset *= (sin( u_time * speed) * bendFactor);\n" + "	    vec3 normalColor = texture2D(CC_Texture0, fract(vec2(v_texCoord.x + offset, v_texCoord.y))).rgb;\n" + "	    gl_FragColor = v_fragmentColor * vec4(normalColor, 1);\n" + "}\n";

cc._RFpop();
},{}],"ccShader_ActiveGrass_Vert":[function(require,module,exports){
cc._RFpush(module, '6efe6dXdMhG/JoHnz2++ss5', 'ccShader_ActiveGrass_Vert');
// Src/ccShader_ActiveGrass_Vert.js

"use strict";

module.exports = "attribute vec4 a_position;\n" + "    attribute vec2 a_texCoord;\n" + "    attribute vec4 a_color;\n" + "    varying vec4 v_fragmentColor;\n" + "    varying vec2 v_texCoord;\n" + "    void main()\n" + "    {\n" + "        gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;\n" + "        v_fragmentColor = a_color;\n" + "        v_texCoord = a_texCoord;\n" + "    }\n";

cc._RFpop();
},{}],"ccShader_Default_Frag":[function(require,module,exports){
cc._RFpush(module, 'e01b0D4YYZK0IK9pjQfJq88', 'ccShader_Default_Frag');
// Src/ccShader_Default_Frag.js

"use strict";

module.exports = "varying vec4 v_fragmentColor;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "    gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);\n" + "}";

cc._RFpop();
},{}],"ccShader_Default_Vert":[function(require,module,exports){
cc._RFpush(module, '97181jtjltDoJ17BHCKAs9l', 'ccShader_Default_Vert');
// Src/ccShader_Default_Vert.js

"use strict";

module.exports = "attribute vec4 a_position;\n" + " attribute vec2 a_texCoord;\n" + " attribute vec4 a_color;\n" + " varying vec2 v_texCoord;\n" + " varying vec4 v_fragmentColor;\n" + " void main()\n" + " {\n" + "     gl_Position = CC_PMatrix * a_position;\n" + "     v_fragmentColor = a_color;\n" + "     v_texCoord = a_texCoord;\n" + " } \n";

cc._RFpop();
},{}],"ccShader_Gray_Frag":[function(require,module,exports){
cc._RFpush(module, '15d6aRVuO1Lt7t5acdMb7uX', 'ccShader_Gray_Frag');
// Src/ccShader_Gray_Frag.js

"use strict";

module.exports = "varying vec4 v_fragmentColor;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "   vec4 col = texture2D(CC_Texture0, v_texCoord);\n" + "   float grey = dot(col.rgb, vec3(0.299, 0.587, 0.114));\n" + "   gl_FragColor = vec4(grey, grey, grey, col.a);\n" + "}";

cc._RFpop();
},{}],"ccShader_Gray_Vert":[function(require,module,exports){
cc._RFpush(module, '45d14bHLcNP2YHTZGUCvs4k', 'ccShader_Gray_Vert');
// Src/ccShader_Gray_Vert.js

"use strict";

module.exports = "attribute vec4 a_position;\n" + "attribute vec2 a_texCoord;\n" + "attribute vec4 a_color;\n" + "varying vec4 v_fragmentColor;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "gl_Position = ( CC_PMatrix * CC_MVMatrix ) * a_position;\n" + "v_fragmentColor = a_color;\n" + "v_texCoord = a_texCoord;\n" + "}";

cc._RFpop();
},{}],"ccShader_HighLight_Frag":[function(require,module,exports){
cc._RFpush(module, 'c115032D5dNW6xxx8OCmsOi', 'ccShader_HighLight_Frag');
// Src/ccShader_HighLight_Frag.js

"use strict";

module.exports = "varying vec4 v_fragmentColor;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "    vec4 normal = texture2D(CC_Texture0, v_texCoord);\n" + "    vec4 lightColor = vec4(normal.rgb * 0.5, 0.0);\n" + "    normal = normal+lightColor*normal.a;\n" + "    gl_FragColor = v_fragmentColor * normal;\n" + "}";

cc._RFpop();
},{}],"ccShader_HighLight_Vert":[function(require,module,exports){
cc._RFpush(module, '0ab74PIz/NNhqfXDmGHuPus', 'ccShader_HighLight_Vert');
// Src/ccShader_HighLight_Vert.js

"use strict";

module.exports = "attribute vec4 a_position;\n" + "attribute vec2 a_texCoord;\n" + "attribute vec4 a_color;\n" + "varying vec4 v_fragmentColor;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "     gl_Position = ( CC_PMatrix * CC_MVMatrix ) * a_position;\n" + "     v_fragmentColor = a_color;\n" + "     v_texCoord = a_texCoord;\n" + "}";

cc._RFpop();
},{}]},{},["ActiveGrass","ccShader_HighLight_Vert","ccShader_Gray_Frag","ccShader_Gray_Vert","ccShader_ActiveGrass_Frag","Sprite","ccShader_ActiveGrass_Vert","ccShader_Default_Vert","ccShader_HighLight_Frag","ccShader_Default_Frag"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL1NjcmlwdC9BY3RpdmVHcmFzcy5qcyIsImFzc2V0cy9TY3JpcHQvU3ByaXRlLmpzIiwiYXNzZXRzL1NyYy9jY1NoYWRlcl9BY3RpdmVHcmFzc19GcmFnLmpzIiwiYXNzZXRzL1NyYy9jY1NoYWRlcl9BY3RpdmVHcmFzc19WZXJ0LmpzIiwiYXNzZXRzL1NyYy9jY1NoYWRlcl9EZWZhdWx0X0ZyYWcuanMiLCJhc3NldHMvU3JjL2NjU2hhZGVyX0RlZmF1bHRfVmVydC5qcyIsImFzc2V0cy9TcmMvY2NTaGFkZXJfR3JheV9GcmFnLmpzIiwiYXNzZXRzL1NyYy9jY1NoYWRlcl9HcmF5X1ZlcnQuanMiLCJhc3NldHMvU3JjL2NjU2hhZGVyX0hpZ2hMaWdodF9GcmFnLmpzIiwiYXNzZXRzL1NyYy9jY1NoYWRlcl9IaWdoTGlnaHRfVmVydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2MuX1JGcHVzaChtb2R1bGUsICcwMTljNFE0VWc1Szc2TlhSbFR2cVF5YycsICdBY3RpdmVHcmFzcycpO1xuLy8gU2NyaXB0L0FjdGl2ZUdyYXNzLmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgY2NTaGFkZXJfQWN0aXZlR3Jhc3NfVmVydCA9IHJlcXVpcmUoXCIuLi9TcmMvY2NTaGFkZXJfQWN0aXZlR3Jhc3NfVmVydC5qc1wiKTtcbnZhciBjY1NoYWRlcl9BY3RpdmVHcmFzc19GcmFnID0gcmVxdWlyZShcIi4uL1NyYy9jY1NoYWRlcl9BY3RpdmVHcmFzc19GcmFnLmpzXCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHt9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG5cbiAgICAgICAgdGhpcy5fdGltZSA9IDA7XG4gICAgICAgIHRoaXMuX3VzZUFjdGl2ZSgpO1xuICAgIH0sXG5cbiAgICBfdXNlQWN0aXZlOiBmdW5jdGlvbiBfdXNlQWN0aXZlKCkge1xuICAgICAgICB0aGlzLl9wcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmluaXRXaXRoVmVydGV4U2hhZGVyQnl0ZUFycmF5KGNjU2hhZGVyX0FjdGl2ZUdyYXNzX1ZlcnQsIGNjU2hhZGVyX0FjdGl2ZUdyYXNzX0ZyYWcpO1xuXG4gICAgICAgIHRoaXMuX3Byb2dyYW0uYWRkQXR0cmlidXRlKGNjLkFUVFJJQlVURV9OQU1FX1BPU0lUSU9OLCBjYy5WRVJURVhfQVRUUklCX1BPU0lUSU9OKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG4gICAgICAgIHRoaXMuX3Byb2dyYW0ubGluaygpO1xuICAgICAgICB0aGlzLl9wcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG5cbiAgICAgICAgdGhpcy5fdW5pZm9ybUxvY2F0aW9uID0gdGhpcy5fcHJvZ3JhbS5nZXRVbmlmb3JtTG9jYXRpb25Gb3JOYW1lKFwidV90aW1lXCIpO1xuXG4gICAgICAgIGNjLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIHRoaXMuX3Byb2dyYW0pO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5fcHJvZ3JhbSkge1xuICAgICAgICAgICAgdGhpcy5fdGltZSArPSBkdDtcblxuICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbS5zZXRVbmlmb3JtTG9jYXRpb25XaXRoMWYodGhpcy5fdW5pZm9ybUxvY2F0aW9uLCB0aGlzLl90aW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnNjNhMzVKWnVDOUNDcU51cjVIR0t6QjInLCAnU3ByaXRlJyk7XG4vLyBTY3JpcHQvU3ByaXRlLmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgU2hhZGVyc0VudW0gPSBjYy5FbnVtKHtcbiAgICBEZWZhdWx0OiAwLFxuICAgIEhpZ2hMaWdodDogMSxcbiAgICBHcmF5OiAyXG59KTtcblxuLyogU2hhZGVyc0VudW0uSGlnaExpZ2h0ICovXG52YXIgY2NTaGFkZXJfSGlnaExpZ2h0X1ZlcnQgPSByZXF1aXJlKFwiLi4vU3JjL2NjU2hhZGVyX0hpZ2hMaWdodF9WZXJ0LmpzXCIpO1xudmFyIGNjU2hhZGVyX0hpZ2hMaWdodF9GcmFnID0gcmVxdWlyZShcIi4uL1NyYy9jY1NoYWRlcl9IaWdoTGlnaHRfRnJhZy5qc1wiKTtcbnZhciBjY1NoYWRlcl9IaWdoTGlnaHQgPSAnY2NTaGFkZXJfSGlnaExpZ2h0JztcblxuLyogU2hhZGVyc0VudW0uSGlnaExpZ2h0ICovXG52YXIgY2NTaGFkZXJfR3JheV9WZXJ0ID0gcmVxdWlyZShcIi4uL1NyYy9jY1NoYWRlcl9HcmF5X1ZlcnQuanNcIik7XG52YXIgY2NTaGFkZXJfR3JheV9GcmFnID0gcmVxdWlyZShcIi4uL1NyYy9jY1NoYWRlcl9HcmF5X0ZyYWcuanNcIik7XG52YXIgY2NTaGFkZXJfR3JheSA9ICdjY1NoYWRlcl9HcmF5JztcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHNoYWRlclR5cGU6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBTaGFkZXJzRW51bS5EZWZhdWx0LFxuICAgICAgICAgICAgdHlwZTogU2hhZGVyc0VudW0sXG4gICAgICAgICAgICBub3RpZnk6IGZ1bmN0aW9uIG5vdGlmeSgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTaGFkZXJUeXBlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3VyclN0YXRlOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogU2hhZGVyc0VudW0uRGVmYXVsdCxcbiAgICAgICAgICAgIHR5cGU6IFNoYWRlcnNFbnVtLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5zaGFkZXJUeXBlID0gU2hhZGVyc0VudW0uRGVmYXVsdDtcbiAgICAgICAgdGhpcy5jdXJyU3RhdGUgPSB0aGlzLnNoYWRlclR5cGU7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVNoYWRlclR5cGUoKTtcbiAgICB9LFxuXG4gICAgLyog5pu05pawc2hhZGVyICovXG4gICAgX3VwZGF0ZVNoYWRlclR5cGU6IGZ1bmN0aW9uIF91cGRhdGVTaGFkZXJUeXBlKCkge1xuICAgICAgICBpZiAodGhpcy5zaGFkZXJUeXBlID09PSB0aGlzLmN1cnJTdGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLnNoYWRlclR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgU2hhZGVyc0VudW0uRGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLl91c2VEZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNoYWRlcnNFbnVtLkhpZ2hMaWdodDpcbiAgICAgICAgICAgICAgICB0aGlzLl91c2VIaWdoTGlnaHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU2hhZGVyc0VudW0uR3JheTpcbiAgICAgICAgICAgICAgICB0aGlzLl91c2VHcmF5KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qIOS9v+eUqOm7mOiupCAqL1xuICAgIF91c2VEZWZhdWx0OiBmdW5jdGlvbiBfdXNlRGVmYXVsdCgpIHtcbiAgICAgICAgLyog5a6Y5pa55a6e546w5Y6f5Zu+c2hhZGVyICovXG4gICAgICAgIHZhciBrUHJvZ3JhbSA9IGNjLnNoYWRlckNhY2hlLnByb2dyYW1Gb3JLZXkoY2MuU0hBREVSX1BPU0lUSU9OX1RFWFRVUkVDT0xPUik7XG5cbiAgICAgICAgLyogaWYg5Liq5Lq66K6k5Li65piv5aSa5L2Z55qELCDlrpjmlrnlt7Llrp7njrDlpb0sIOS4uuS6huWkhOeQhkFQSeebuOWQjCwg6L+Z6YeM6L+Y5piv5YaZ5LiK5LqGICovXG4gICAgICAgIGlmICh0eXBlb2Yga1Byb2dyYW0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHZhciBwcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShjYy5TSEFERVJfUE9TSVRJT05fVEVYVFVSRV9DT0xPUl9WRVJULCBjYy5TSEFERVJfUE9TSVRJT05fVEVYVFVSRV9DT0xPUl9GUkFHKTtcblxuICAgICAgICAgICAgcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuICAgICAgICAgICAgcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICBwcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICBjYy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCBwcm9ncmFtKTtcblxuICAgICAgICAgICAgLyog5a6Y5pa55LiN55So5Zyo5re75YqgIGtleSDkv53lrZjliLAgc2hhZGVyQ2FjaGUg5LitICovXG4gICAgICAgICAgICAvL2NjLnNoYWRlckNhY2hlLmFkZFByb2dyYW0oIHByb2dyYW0sIGNjU2hhZGVyX0RlZmF1bHQgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCBrUHJvZ3JhbSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyU3RhdGUgPSB0aGlzLnNoYWRlclR5cGU7XG4gICAgfSxcblxuICAgIC8qIOS9v+eUqOmrmOS6riAqL1xuICAgIF91c2VIaWdoTGlnaHQ6IGZ1bmN0aW9uIF91c2VIaWdoTGlnaHQoKSB7XG4gICAgICAgIHZhciBrUHJvZ3JhbSA9IGNjLnNoYWRlckNhY2hlLnByb2dyYW1Gb3JLZXkoY2NTaGFkZXJfSGlnaExpZ2h0KTtcbiAgICAgICAgaWYgKHR5cGVvZiBrUHJvZ3JhbSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZhciBwcm9ncmFtID0gbmV3IGNjLkdMUHJvZ3JhbSgpO1xuICAgICAgICAgICAgcHJvZ3JhbS5pbml0V2l0aFZlcnRleFNoYWRlckJ5dGVBcnJheShjY1NoYWRlcl9IaWdoTGlnaHRfVmVydCwgY2NTaGFkZXJfSGlnaExpZ2h0X0ZyYWcpO1xuXG4gICAgICAgICAgICBwcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9QT1NJVElPTiwgY2MuVkVSVEVYX0FUVFJJQl9QT1NJVElPTik7XG4gICAgICAgICAgICBwcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9DT0xPUiwgY2MuVkVSVEVYX0FUVFJJQl9DT0xPUik7XG4gICAgICAgICAgICBwcm9ncmFtLmFkZEF0dHJpYnV0ZShjYy5BVFRSSUJVVEVfTkFNRV9URVhfQ09PUkQsIGNjLlZFUlRFWF9BVFRSSUJfVEVYX0NPT1JEUyk7XG4gICAgICAgICAgICBwcm9ncmFtLmxpbmsoKTtcbiAgICAgICAgICAgIHByb2dyYW0udXBkYXRlVW5pZm9ybXMoKTtcbiAgICAgICAgICAgIGNjLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIHByb2dyYW0pO1xuXG4gICAgICAgICAgICBjYy5zaGFkZXJDYWNoZS5hZGRQcm9ncmFtKHByb2dyYW0sIGNjU2hhZGVyX0hpZ2hMaWdodCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCBrUHJvZ3JhbSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJTdGF0ZSA9IHRoaXMuc2hhZGVyVHlwZTtcbiAgICB9LFxuXG4gICAgLyog5L2/55So572u54GwICovXG4gICAgX3VzZUdyYXk6IGZ1bmN0aW9uIF91c2VHcmF5KCkge1xuICAgICAgICB2YXIga1Byb2dyYW0gPSBjYy5zaGFkZXJDYWNoZS5wcm9ncmFtRm9yS2V5KGNjU2hhZGVyX0dyYXkpO1xuICAgICAgICBpZiAodHlwZW9mIGtQcm9ncmFtID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFyIHByb2dyYW0gPSBuZXcgY2MuR0xQcm9ncmFtKCk7XG4gICAgICAgICAgICBwcm9ncmFtLmluaXRXaXRoVmVydGV4U2hhZGVyQnl0ZUFycmF5KGNjU2hhZGVyX0dyYXlfVmVydCwgY2NTaGFkZXJfR3JheV9GcmFnKTtcblxuICAgICAgICAgICAgcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfUE9TSVRJT04sIGNjLlZFUlRFWF9BVFRSSUJfUE9TSVRJT04pO1xuICAgICAgICAgICAgcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfQ09MT1IsIGNjLlZFUlRFWF9BVFRSSUJfQ09MT1IpO1xuICAgICAgICAgICAgcHJvZ3JhbS5hZGRBdHRyaWJ1dGUoY2MuQVRUUklCVVRFX05BTUVfVEVYX0NPT1JELCBjYy5WRVJURVhfQVRUUklCX1RFWF9DT09SRFMpO1xuICAgICAgICAgICAgcHJvZ3JhbS5saW5rKCk7XG4gICAgICAgICAgICBwcm9ncmFtLnVwZGF0ZVVuaWZvcm1zKCk7XG4gICAgICAgICAgICBjYy5zZXRQcm9ncmFtKHRoaXMubm9kZS5fc2dOb2RlLCBwcm9ncmFtKTtcblxuICAgICAgICAgICAgY2Muc2hhZGVyQ2FjaGUuYWRkUHJvZ3JhbShwcm9ncmFtLCBjY1NoYWRlcl9HcmF5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLnNldFByb2dyYW0odGhpcy5ub2RlLl9zZ05vZGUsIGtQcm9ncmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VyclN0YXRlID0gdGhpcy5zaGFkZXJUeXBlO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnNGU4YjhIazJUQk1wSlpuSmRRVStDWnonLCAnY2NTaGFkZXJfQWN0aXZlR3Jhc3NfRnJhZycpO1xuLy8gU3JjL2NjU2hhZGVyX0FjdGl2ZUdyYXNzX0ZyYWcuanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gXCJ2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwidmFyeWluZyB2ZWM0IHZfZnJhZ21lbnRDb2xvcjsgXFxuXCIgKyBcInVuaWZvcm0gZmxvYXQgdV90aW1lO1xcblwiICsgXCJjb25zdCBmbG9hdCBzcGVlZCA9IDIuMDtcXG5cIiArIFwiY29uc3QgZmxvYXQgYmVuZEZhY3RvciA9IDAuMjtcXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCJcdCAgICBmbG9hdCBoZWlnaHQgPSAxLjAgLSB2X3RleENvb3JkLnk7XFxuXCIgKyBcIlx0ICAgIGZsb2F0IG9mZnNldCA9IHBvdyhoZWlnaHQsIDIuNSk7XFxuXCIgKyBcIlx0ICAgIG9mZnNldCAqPSAoc2luKCB1X3RpbWUgKiBzcGVlZCkgKiBiZW5kRmFjdG9yKTtcXG5cIiArIFwiXHQgICAgdmVjMyBub3JtYWxDb2xvciA9IHRleHR1cmUyRChDQ19UZXh0dXJlMCwgZnJhY3QodmVjMih2X3RleENvb3JkLnggKyBvZmZzZXQsIHZfdGV4Q29vcmQueSkpKS5yZ2I7XFxuXCIgKyBcIlx0ICAgIGdsX0ZyYWdDb2xvciA9IHZfZnJhZ21lbnRDb2xvciAqIHZlYzQobm9ybWFsQ29sb3IsIDEpO1xcblwiICsgXCJ9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnNmVmZTZkWGRNaEcvSm9IbnoyKytzczUnLCAnY2NTaGFkZXJfQWN0aXZlR3Jhc3NfVmVydCcpO1xuLy8gU3JjL2NjU2hhZGVyX0FjdGl2ZUdyYXNzX1ZlcnQuanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gXCJhdHRyaWJ1dGUgdmVjNCBhX3Bvc2l0aW9uO1xcblwiICsgXCIgICAgYXR0cmlidXRlIHZlYzIgYV90ZXhDb29yZDtcXG5cIiArIFwiICAgIGF0dHJpYnV0ZSB2ZWM0IGFfY29sb3I7XFxuXCIgKyBcIiAgICB2YXJ5aW5nIHZlYzQgdl9mcmFnbWVudENvbG9yO1xcblwiICsgXCIgICAgdmFyeWluZyB2ZWMyIHZfdGV4Q29vcmQ7XFxuXCIgKyBcIiAgICB2b2lkIG1haW4oKVxcblwiICsgXCIgICAge1xcblwiICsgXCIgICAgICAgIGdsX1Bvc2l0aW9uID0gKENDX1BNYXRyaXggKiBDQ19NVk1hdHJpeCkgKiBhX3Bvc2l0aW9uO1xcblwiICsgXCIgICAgICAgIHZfZnJhZ21lbnRDb2xvciA9IGFfY29sb3I7XFxuXCIgKyBcIiAgICAgICAgdl90ZXhDb29yZCA9IGFfdGV4Q29vcmQ7XFxuXCIgKyBcIiAgICB9XFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnZTAxYjBENFlZWkswSUs5cGpRZkpxODgnLCAnY2NTaGFkZXJfRGVmYXVsdF9GcmFnJyk7XG4vLyBTcmMvY2NTaGFkZXJfRGVmYXVsdF9GcmFnLmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwidmFyeWluZyB2ZWM0IHZfZnJhZ21lbnRDb2xvcjtcXG5cIiArIFwidmFyeWluZyB2ZWMyIHZfdGV4Q29vcmQ7XFxuXCIgKyBcInZvaWQgbWFpbigpXFxuXCIgKyBcIntcXG5cIiArIFwiICAgIGdsX0ZyYWdDb2xvciA9IHZfZnJhZ21lbnRDb2xvciAqIHRleHR1cmUyRChDQ19UZXh0dXJlMCwgdl90ZXhDb29yZCk7XFxuXCIgKyBcIn1cIjtcblxuY2MuX1JGcG9wKCk7IiwiY2MuX1JGcHVzaChtb2R1bGUsICc5NzE4MWp0amx0RG9KMTdCSENLQXM5bCcsICdjY1NoYWRlcl9EZWZhdWx0X1ZlcnQnKTtcbi8vIFNyYy9jY1NoYWRlcl9EZWZhdWx0X1ZlcnQuanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gXCJhdHRyaWJ1dGUgdmVjNCBhX3Bvc2l0aW9uO1xcblwiICsgXCIgYXR0cmlidXRlIHZlYzIgYV90ZXhDb29yZDtcXG5cIiArIFwiIGF0dHJpYnV0ZSB2ZWM0IGFfY29sb3I7XFxuXCIgKyBcIiB2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwiIHZhcnlpbmcgdmVjNCB2X2ZyYWdtZW50Q29sb3I7XFxuXCIgKyBcIiB2b2lkIG1haW4oKVxcblwiICsgXCIge1xcblwiICsgXCIgICAgIGdsX1Bvc2l0aW9uID0gQ0NfUE1hdHJpeCAqIGFfcG9zaXRpb247XFxuXCIgKyBcIiAgICAgdl9mcmFnbWVudENvbG9yID0gYV9jb2xvcjtcXG5cIiArIFwiICAgICB2X3RleENvb3JkID0gYV90ZXhDb29yZDtcXG5cIiArIFwiIH0gXFxuXCI7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnMTVkNmFSVnVPMUx0N3Q1YWNkTWI3dVgnLCAnY2NTaGFkZXJfR3JheV9GcmFnJyk7XG4vLyBTcmMvY2NTaGFkZXJfR3JheV9GcmFnLmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFwidmFyeWluZyB2ZWM0IHZfZnJhZ21lbnRDb2xvcjtcXG5cIiArIFwidmFyeWluZyB2ZWMyIHZfdGV4Q29vcmQ7XFxuXCIgKyBcInZvaWQgbWFpbigpXFxuXCIgKyBcIntcXG5cIiArIFwiICAgdmVjNCBjb2wgPSB0ZXh0dXJlMkQoQ0NfVGV4dHVyZTAsIHZfdGV4Q29vcmQpO1xcblwiICsgXCIgICBmbG9hdCBncmV5ID0gZG90KGNvbC5yZ2IsIHZlYzMoMC4yOTksIDAuNTg3LCAwLjExNCkpO1xcblwiICsgXCIgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGdyZXksIGdyZXksIGdyZXksIGNvbC5hKTtcXG5cIiArIFwifVwiO1xuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzQ1ZDE0YkhMY05QMllIVFpHVUN2czRrJywgJ2NjU2hhZGVyX0dyYXlfVmVydCcpO1xuLy8gU3JjL2NjU2hhZGVyX0dyYXlfVmVydC5qc1xuXG5cInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBcImF0dHJpYnV0ZSB2ZWM0IGFfcG9zaXRpb247XFxuXCIgKyBcImF0dHJpYnV0ZSB2ZWMyIGFfdGV4Q29vcmQ7XFxuXCIgKyBcImF0dHJpYnV0ZSB2ZWM0IGFfY29sb3I7XFxuXCIgKyBcInZhcnlpbmcgdmVjNCB2X2ZyYWdtZW50Q29sb3I7XFxuXCIgKyBcInZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCJ2b2lkIG1haW4oKVxcblwiICsgXCJ7XFxuXCIgKyBcImdsX1Bvc2l0aW9uID0gKCBDQ19QTWF0cml4ICogQ0NfTVZNYXRyaXggKSAqIGFfcG9zaXRpb247XFxuXCIgKyBcInZfZnJhZ21lbnRDb2xvciA9IGFfY29sb3I7XFxuXCIgKyBcInZfdGV4Q29vcmQgPSBhX3RleENvb3JkO1xcblwiICsgXCJ9XCI7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnYzExNTAzMkQ1ZE5XNnh4eDhPQ21zT2knLCAnY2NTaGFkZXJfSGlnaExpZ2h0X0ZyYWcnKTtcbi8vIFNyYy9jY1NoYWRlcl9IaWdoTGlnaHRfRnJhZy5qc1xuXG5cInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBcInZhcnlpbmcgdmVjNCB2X2ZyYWdtZW50Q29sb3I7XFxuXCIgKyBcInZhcnlpbmcgdmVjMiB2X3RleENvb3JkO1xcblwiICsgXCJ2b2lkIG1haW4oKVxcblwiICsgXCJ7XFxuXCIgKyBcIiAgICB2ZWM0IG5vcm1hbCA9IHRleHR1cmUyRChDQ19UZXh0dXJlMCwgdl90ZXhDb29yZCk7XFxuXCIgKyBcIiAgICB2ZWM0IGxpZ2h0Q29sb3IgPSB2ZWM0KG5vcm1hbC5yZ2IgKiAwLjUsIDAuMCk7XFxuXCIgKyBcIiAgICBub3JtYWwgPSBub3JtYWwrbGlnaHRDb2xvcipub3JtYWwuYTtcXG5cIiArIFwiICAgIGdsX0ZyYWdDb2xvciA9IHZfZnJhZ21lbnRDb2xvciAqIG5vcm1hbDtcXG5cIiArIFwifVwiO1xuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzBhYjc0UEl6L05OaHFmWERtR0h1UHVzJywgJ2NjU2hhZGVyX0hpZ2hMaWdodF9WZXJ0Jyk7XG4vLyBTcmMvY2NTaGFkZXJfSGlnaExpZ2h0X1ZlcnQuanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gXCJhdHRyaWJ1dGUgdmVjNCBhX3Bvc2l0aW9uO1xcblwiICsgXCJhdHRyaWJ1dGUgdmVjMiBhX3RleENvb3JkO1xcblwiICsgXCJhdHRyaWJ1dGUgdmVjNCBhX2NvbG9yO1xcblwiICsgXCJ2YXJ5aW5nIHZlYzQgdl9mcmFnbWVudENvbG9yO1xcblwiICsgXCJ2YXJ5aW5nIHZlYzIgdl90ZXhDb29yZDtcXG5cIiArIFwidm9pZCBtYWluKClcXG5cIiArIFwie1xcblwiICsgXCIgICAgIGdsX1Bvc2l0aW9uID0gKCBDQ19QTWF0cml4ICogQ0NfTVZNYXRyaXggKSAqIGFfcG9zaXRpb247XFxuXCIgKyBcIiAgICAgdl9mcmFnbWVudENvbG9yID0gYV9jb2xvcjtcXG5cIiArIFwiICAgICB2X3RleENvb3JkID0gYV90ZXhDb29yZDtcXG5cIiArIFwifVwiO1xuXG5jYy5fUkZwb3AoKTsiXX0=
