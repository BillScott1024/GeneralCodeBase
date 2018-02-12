(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Src/ccShader_Gray_Frag.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '15d6aRVuO1Lt7t5acdMb7uX', 'ccShader_Gray_Frag', __filename);
// Src/ccShader_Gray_Frag.js

"use strict";

module.exports = "varying vec4 v_fragmentColor;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "   vec4 col = texture2D(CC_Texture0, v_texCoord);\n" + "   float grey = dot(col.rgb, vec3(0.299, 0.587, 0.114));\n" + "   gl_FragColor = vec4(grey, grey, grey, col.a);\n" + "}";

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
        //# sourceMappingURL=ccShader_Gray_Frag.js.map
        