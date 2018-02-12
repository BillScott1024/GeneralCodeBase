"use strict";
cc._RF.push(module, '45d14bHLcNP2YHTZGUCvs4k', 'ccShader_Gray_Vert');
// Src/ccShader_Gray_Vert.js

"use strict";

module.exports = "attribute vec4 a_position;\n" + "attribute vec2 a_texCoord;\n" + "attribute vec4 a_color;\n" + "varying vec4 v_fragmentColor;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "gl_Position = ( CC_PMatrix * CC_MVMatrix ) * a_position;\n" + "v_fragmentColor = a_color;\n" + "v_texCoord = a_texCoord;\n" + "}";

cc._RF.pop();