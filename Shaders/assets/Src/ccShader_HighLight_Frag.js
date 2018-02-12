module.exports = "varying vec4 v_fragmentColor;\n"
                + "varying vec2 v_texCoord;\n"
                + "void main()\n"
                + "{\n"
                + "    vec4 normal = texture2D(CC_Texture0, v_texCoord);\n"
                + "    vec4 lightColor = vec4(normal.rgb * 0.5, 0.0);\n"
                + "    normal = normal+lightColor*normal.a;\n"
                + "    gl_FragColor = v_fragmentColor * normal;\n"
                + "}";