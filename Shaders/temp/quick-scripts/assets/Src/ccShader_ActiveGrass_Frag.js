(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Src/ccShader_ActiveGrass_Frag.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4e8b8Hk2TBMpJZnJdQU+CZz', 'ccShader_ActiveGrass_Frag', __filename);
// Src/ccShader_ActiveGrass_Frag.js

"use strict";

module.exports = "varying vec2 v_texCoord;\n" + "varying vec4 v_fragmentColor; \n" + "uniform float u_time;\n" + "const float speed = 2.0;\n" + "const float bendFactor = 0.2;\n" + "void main()\n" + "{\n" + "	    float height = 1.0 - v_texCoord.y;\n" + "	    float offset = pow(height, 2.5);\n" + "	    offset *= (sin( u_time * speed) * bendFactor);\n" + "	    vec3 normalColor = texture2D(CC_Texture0, fract(vec2(v_texCoord.x + offset, v_texCoord.y))).rgb;\n" + "	    gl_FragColor = v_fragmentColor * vec4(normalColor, 1);\n" + "}\n";

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
        //# sourceMappingURL=ccShader_ActiveGrass_Frag.js.map
        