module.exports = "varying vec4 v_fragmentColor;\n"
                + "varying vec2 v_texCoord;\n"
                + "void main()\n"
                + "{\n"
                + "    gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);\n"
                + "}"; 