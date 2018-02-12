"use strict";
cc._RF.push(module, 'e01b0D4YYZK0IK9pjQfJq88', 'ccShader_Default_Frag');
// Src/ccShader_Default_Frag.js

"use strict";

module.exports = "varying vec4 v_fragmentColor;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "    gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);\n" + "}";

cc._RF.pop();