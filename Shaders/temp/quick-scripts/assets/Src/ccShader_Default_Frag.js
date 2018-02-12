(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Src/ccShader_Default_Frag.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e01b0D4YYZK0IK9pjQfJq88', 'ccShader_Default_Frag', __filename);
// Src/ccShader_Default_Frag.js

"use strict";

module.exports = "varying vec4 v_fragmentColor;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "    gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);\n" + "}";

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
        //# sourceMappingURL=ccShader_Default_Frag.js.map
        