"use strict";
cc._RF.push(module, '15d6aRVuO1Lt7t5acdMb7uX', 'ccShader_Gray_Frag');
// Src/ccShader_Gray_Frag.js

"use strict";

module.exports = "varying vec4 v_fragmentColor;\n" + "varying vec2 v_texCoord;\n" + "void main()\n" + "{\n" + "   vec4 col = texture2D(CC_Texture0, v_texCoord);\n" + "   float grey = dot(col.rgb, vec3(0.299, 0.587, 0.114));\n" + "   gl_FragColor = vec4(grey, grey, grey, col.a);\n" + "}";

cc._RF.pop();