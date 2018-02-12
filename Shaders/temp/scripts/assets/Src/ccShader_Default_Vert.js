cc._RFpush(module, '97181jtjltDoJ17BHCKAs9l', 'ccShader_Default_Vert');
// Src/ccShader_Default_Vert.js

"use strict";

module.exports = "attribute vec4 a_position;\n" + " attribute vec2 a_texCoord;\n" + " attribute vec4 a_color;\n" + " varying vec2 v_texCoord;\n" + " varying vec4 v_fragmentColor;\n" + " void main()\n" + " {\n" + "     gl_Position = CC_PMatrix * a_position;\n" + "     v_fragmentColor = a_color;\n" + "     v_texCoord = a_texCoord;\n" + " } \n";

cc._RFpop();