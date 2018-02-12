cc._RFpush(module, '4e8b8Hk2TBMpJZnJdQU+CZz', 'ccShader_ActiveGrass_Frag');
// Src/ccShader_ActiveGrass_Frag.js

"use strict";

module.exports = "varying vec2 v_texCoord;\n" + "varying vec4 v_fragmentColor; \n" + "uniform float u_time;\n" + "const float speed = 2.0;\n" + "const float bendFactor = 0.2;\n" + "void main()\n" + "{\n" + "	    float height = 1.0 - v_texCoord.y;\n" + "	    float offset = pow(height, 2.5);\n" + "	    offset *= (sin( u_time * speed) * bendFactor);\n" + "	    vec3 normalColor = texture2D(CC_Texture0, fract(vec2(v_texCoord.x + offset, v_texCoord.y))).rgb;\n" + "	    gl_FragColor = v_fragmentColor * vec4(normalColor, 1);\n" + "}\n";

cc._RFpop();