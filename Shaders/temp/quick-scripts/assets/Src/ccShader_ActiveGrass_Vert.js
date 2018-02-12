(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Src/ccShader_ActiveGrass_Vert.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6efe6dXdMhG/JoHnz2++ss5', 'ccShader_ActiveGrass_Vert', __filename);
// Src/ccShader_ActiveGrass_Vert.js

"use strict";

module.exports = "attribute vec4 a_position;\n" + "    attribute vec2 a_texCoord;\n" + "    attribute vec4 a_color;\n" + "    varying vec4 v_fragmentColor;\n" + "    varying vec2 v_texCoord;\n" + "    void main()\n" + "    {\n" + "        gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;\n" + "        v_fragmentColor = a_color;\n" + "        v_texCoord = a_texCoord;\n" + "    }\n";

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
        //# sourceMappingURL=ccShader_ActiveGrass_Vert.js.map
        