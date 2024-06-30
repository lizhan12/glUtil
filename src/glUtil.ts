function isPowerOf2(n: number) {
  return (n & (n - 1)) == 0;
}
export class glUtil {
  /**
   * 判断是否webgl2
   * @param gl
   * @returns
   */
  static isWebgl2(gl: WebGLRenderingContext) {
    return gl instanceof WebGL2RenderingContext;
  }
  /**
   * 创建顶点着色器
   * @param gl WebGLRenderingContext
   * @param vertexShaderSource 顶点着色器
   * @returns boolen
   */
  static createVertex(gl: WebGLRenderingContext, vertexShaderSource: string) {
    const shader = gl.createShader(gl.VERTEX_SHADER);
    if (shader) {
      gl.shaderSource(shader, vertexShaderSource);
      gl.compileShader(shader);
      return shader;
    }
    throw new Error("create vertexshader fail.");
  }
  /**
   * 获得所有激活的纹理单元
   * @param gl
   * @returns number[]
   */
  static getTextures(gl: WebGLRenderingContext) {
    const maxTextureUnits = gl.getParameter(
      gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS
    );

    // 检查每个纹理单元的绑定状态
    let activeTextureUnits = 0;
    const arr = [];
    for (let i = 0; i < maxTextureUnits; i++) {
      gl.activeTexture(gl.TEXTURE0 + i);
      const textureBinding = gl.getParameter(gl.TEXTURE_BINDING_2D);
      if (textureBinding) {
        arr.push(i);
      }
    }
    return arr;
  }
  /**
   * 删除所有已经绑定的纹理单元
   * @param gl
   */
  static delActiveTextures(gl: WebGLRenderingContext) {
    const nums = glUtil.getTextures(gl);
    nums.forEach((num) => {
      gl.activeTexture(gl.TEXTURE0 + num);
      gl.bindTexture(gl.TEXTURE_2D, null);
    });
  }

  /**
   * 创建片元着色器
   * @deprecated 请使用compileShader
   * @param gl WebGLRenderingContext
   * @param vertexShaderSource 片元着色器
   * @returns boolen
   */
  static createFragment(
    gl: WebGLRenderingContext,
    fragementShaderSource: string
  ) {
    const shader = gl.createShader(gl.FRAGMENT_SHADER);
    if (shader) {
      gl.shaderSource(shader, fragementShaderSource);
      gl.compileShader(shader);
      return shader;
    }
    throw new Error("create fragmentshader fail.");
  }
  /**
   * 创建着色器
   * @param gl WebGLRenderingContext
   * @param source 着色器字符串
   * @param type number 指定着色器类型
   * @returns
   */
  static compileShader(
    gl: WebGLRenderingContext,
    source: string,
    type: number
  ) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        "An error occurred compiling the shaders: " +
          gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
  /**
   * 创建program，uniform,attribute信息
   * @param gl
   * @param v
   * @param f
   * @returns
   */
  static creatProgramInfo(gl: WebGLRenderingContext, v: string, f: string) {
    const vShader = glUtil.compileShader(gl, v, gl.VERTEX_SHADER);
    const fShader = glUtil.compileShader(gl, f, gl.FRAGMENT_SHADER);
    if (!vShader || !fShader) throw new Error("vShader or fShader is fail");
    const program = glUtil.createProgram(gl, vShader, fShader);
    const uniforms = glUtil.getUniforms(gl, program);
    const attributes = glUtil.getAttributes(gl, program);
    return {
      program,
      uniforms,
      attributes,
    };
  }

  /**
   * 创建与使用程序
   * @param gl WebGLRenderingContext
   * @param vertexShaderSource 片元着色器
   * @returns boolen
   */
  static createProgram(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragementShader: WebGLShader
  ) {
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragementShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("create program fail.");
    }
    return program;
  }
  static bindFramebuffer(
    gl: WebGLRenderingContext,
    framebuffer: WebGLFramebuffer | null,
    texture: WebGLTexture | null,
    indx = 0
  ) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    if (texture) {
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        indx
      );
      if (framebuffer) framebuffer.texture = texture;
    }
  }
  /**
   * 创建缓冲区对象
   * @param gl WebGLRenderingContext
   * @param arr Array | Float32Array
   * @returns boolen
   */
  static createBuffer(
    gl: WebGLRenderingContext,
    arr: Array<number> | Float32Array | Uint16Array,
    target = gl.ARRAY_BUFFER
  ) {
    const buffer = gl.createBuffer();
    if (buffer) {
      gl.bindBuffer(target, buffer);
      if (Array.isArray(arr)) {
        gl.bufferData(target, new Float32Array(arr), gl.STATIC_DRAW);
      } else {
        gl.bufferData(target, arr, gl.STATIC_DRAW);
      }
      return buffer;
    }
    throw new Error("create buffer fail.");
  }

  /**
   * 创建缓冲区对象
   * @deprecated
   * @param gl WebGLRenderingContext
   * @param arr Array | Float32Array
   * @returns boolen
   */
  static bindBuffer(
    gl: WebGLRenderingContext,
    arr: Array<number> | Float32Array | Uint16Array,
    target = gl.ARRAY_BUFFER
  ) {
    const buffer = gl.createBuffer();
    if (buffer) {
      gl.bindBuffer(target, buffer);
      if (Array.isArray(arr)) {
        gl.bufferData(target, new Float32Array(arr), gl.STATIC_DRAW);
      } else {
        gl.bufferData(target, arr, gl.STATIC_DRAW);
      }
      return buffer;
    }
    throw new Error("create buffer fail.");
  }

  /**
   * 创建索引缓冲区对象
   * @deprecated
   * @param gl WebGLRenderingContext
   * @param arr Array | Float32Array
   * @returns boolen
   */
  static bindIndexBuffer(
    gl: WebGLRenderingContext,
    arr: Array<number> | Float32Array,
    target = gl.ELEMENT_ARRAY_BUFFER
  ) {
    const buffer = gl.createBuffer();
    if (buffer) {
      gl.bindBuffer(target, buffer);
      if (Array.isArray(arr)) {
        gl.bufferData(target, new Uint16Array(arr), gl.STATIC_DRAW);
      } else {
        gl.bufferData(target, arr, gl.STATIC_DRAW);
      }
      return buffer;
    }
    throw new Error("create buffer fail.");
  }

  /**
   * 创建索引缓冲区对象
   * @param gl WebGLRenderingContext
   * @param arr Array | Float32Array
   * @returns boolen
   */
  static createIndexBuffer(
    gl: WebGLRenderingContext,
    arr: Array<number> | Float32Array,
    target = gl.ELEMENT_ARRAY_BUFFER
  ) {
    const buffer = gl.createBuffer();
    if (buffer) {
      gl.bindBuffer(target, buffer);
      if (Array.isArray(arr)) {
        gl.bufferData(target, new Uint16Array(arr), gl.STATIC_DRAW);
      } else {
        gl.bufferData(target, arr, gl.STATIC_DRAW);
      }
      return buffer;
    }
    throw new Error("create buffer fail.");
  }
  /**
   * 顶点着色器中的顶点属性关联到缓冲区对象中的顶点数据
   * @param gl WebGLRenderingContext
   * @param arr Array | Float32Array
   * @returns void
   */
  static setAttr(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    type: string,
    buffer?: WebGLBuffer,
    num = 3,
    target: any = gl.ARRAY_BUFFER
  ): void {
    // gl.bindBuffer(target, buffer)
    const attributeLocation = gl.getAttribLocation(program, type);
    if (buffer) gl.bindBuffer(target, buffer);
    gl.vertexAttribPointer(attributeLocation, num, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributeLocation);
    // gl.drawArrays(mode, offset, count);
  }
  /**
   * 获得着色器中所有的uniforms
   * @param gl
   * @param program
   * @returns
   */
  static getUniforms(gl: WebGLRenderingContext, program: WebGLProgram) {
    const uniformNames = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    const uniforms: any = {};
    for (let i = 0; i < uniformNames; i++) {
      const uniformName = gl.getActiveUniform(program, i)?.name;
      if (uniformName)
        uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
    }
    return uniforms;
  }
  /**
   * 获得着色器中所有的attributes
   * @param gl
   * @param program
   * @returns
   */
  static getAttributes(gl: WebGLRenderingContext, program: WebGLProgram) {
    const attributeNames = gl.getProgramParameter(
      program,
      gl.ACTIVE_ATTRIBUTES
    );
    const attributes: any = {};
    for (let i = 0; i < attributeNames; i++) {
      const attributeName = gl.getActiveAttrib(program, i)?.name;
      if (attributeName)
        attributes[attributeName] = gl.getAttribLocation(
          program,
          attributeName
        );
    }
    return attributes;
  }

  /**
   * 获得Uniform变量
   * @param gl WebGLRenderingContext
   * @returns WebGLUniformLocation
   */
  static getUniform(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    type: string
  ) {
    const uniform = gl.getUniformLocation(program, type);
    return uniform as WebGLUniformLocation;
    // gl.drawArrays(mode, offset, count);
  }
  /**
   *
   * @param gl
   * @param program
   * @param obj
   */
  static setUniforms(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    obj: any
  ) {
    let i = 0;
    Object.entries(obj).forEach(([key, value]) => {
      let val = value as unknown as any;
      const uniformLocation = glUtil.getUniform(gl, program, key);
      if (val instanceof WebGLTexture) {
        glUtil.setTexture(gl, val, uniformLocation, i++);
      } else if (Array.isArray(val) || ArrayBuffer.isView(val)) {
        val = val as number[];
        if (val.length == 4) gl.uniform4fv(uniformLocation, val);
        else if (val.length == 3) gl.uniform3fv(uniformLocation, val);
        else if (val.length == 2) gl.uniform2fv(uniformLocation, val);
        else if (val.length == 9)
          gl.uniformMatrix3fv(uniformLocation, false, val);
        else if (val.length == 16)
          gl.uniformMatrix4fv(uniformLocation, false, val);
        else {
          gl.uniform1fv(uniformLocation, val);
        }
      } else {
        gl.uniform1f(uniformLocation, val);
      }
    });
  }
  /**
   * 激活纹理单元
   * @param gl
   * @param texture
   * @param unit
   */
  static activeTexture(
    gl: WebGLRenderingContext,
    texture: WebGLTexture,
    unit = 0
  ) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
  }

  /**
   * 绘制图形
   * @param gl  WebGLRenderingContext
   * @param mode
   * @param offset
   * @param count
   */
  static draw(
    gl: WebGLRenderingContext,
    mode = gl.TRIANGLES,
    offset = 0,
    count = 3
  ): void {
    gl.drawArrays(mode, offset, count);
  }

  /**
   * 绑定纹理
   * @param gl  WebGLRenderingContext
   * @param img
   * @returns
   */

  static createTexture(
    gl: WebGL2RenderingContext,
    img: any = null,
    t = [1, 1, 0],
    data: any = null
  ) {
    // const floatTextureExtension = gl.getExtension(
    //   "OES_texture_float"
    // );
    // if (!floatTextureExtension) {
    //   console.error("Float textures not supported.");
    //   // return;
    // }
    // const texture = gl.createTexture();
    // gl.activeTexture(gl.TEXTURE0);
    // gl.bindTexture(gl.TEXTURE_2D, texture);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    // gl.bindTexture(gl.TEXTURE_2D, null);
    // 创建纹理对象
    const texture = gl.createTexture();
    // if(!texture)
    // console.log(data)

    // 设置预处理函数，由于图片坐标系和WebGL坐标的Y轴是反的，这个设置可以将图片Y坐标翻转一下
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // 激活指定纹理单元，WebGL有多个纹理单元，因此在Shader中可以使用多个纹理
    // gl.activeTexture(gl.TEXTURE0);
    // 将纹理绑定到当前上下文
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 设置纹理的一些参数

    // 指定纹理图像
    if (img)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    else if (data instanceof Uint8Array || data instanceof Uint16Array) {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        t[0],
        t[1],
        t[2],
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        data
      );
    } else if (data instanceof Float32Array) {
      // console.log(t,data)
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA32F,
        t[0],
        t[1],
        t[2],
        gl.RGBA,
        gl.FLOAT,
        data
      );
    } else if (data === null) {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA32F,
        t[0],
        t[1],
        t[2],
        gl.RGBA,
        gl.FLOAT,
        null
      );
    } else if (data === 0) {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        t[0],
        t[1],
        t[2],
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
      );
    } else {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        t[0],
        t[1],
        t[2],
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array(data)
      );
    }

    if (img && isPowerOf2(img.width) && isPowerOf2(img.height)) {
      // console.log(222)
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    // 解除纹理绑定
    gl.bindTexture(gl.TEXTURE_2D, null);

    return texture as WebGLTexture;
  }
  /**
   *
   * @param gl
   * @param texture
   * @param loc {string} 纹理名称
   * @param idx
   */
  static setTextureAndLoc(
    program: WebGLProgram,
    gl: WebGLRenderingContext,
    texture: WebGLTexture | null,
    textName: string,
    idx = 0
  ) {
    // console.log(texture)
    const loc = gl.getUniformLocation(
      program,
      textName
    ) as WebGLUniformLocation;
    if (loc) glUtil.setTexture(gl, texture, loc, idx);
  }

  /**
   * 设置纹理
   * @param gl
   * @param texture
   * @param loc
   * @param idx
   */

  static setTexture(
    gl: WebGLRenderingContext,
    texture: WebGLTexture | null,
    loc: WebGLUniformLocation | string,
    idx = 0
  ) {
    // if(!(loc instanceof WebGLUniformLocation)){

    //   loc = gl.getUniformLocation(gl.program, loc) as WebGLUniformLocation;
    // }

    // gl.activeTexture(gl.TEXTURE0);

    // // 绑定纹理到纹理单元
    // gl.bindTexture(gl.TEXTURE_2D, texture);

    // // 将纹理单元索引设置到纹理 uniform 变量
    // gl.uniform1i(textureLocation, 0);
    // 激活纹理单元
    gl.activeTexture(gl.TEXTURE0 + idx);
    // 绑定纹理
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 获取shader中纹理变量
    // 将对应的纹理单元写入shader变量
    gl.uniform1i(loc, idx);
    // 解除纹理绑定
    // gl.bindTexture(gl.TEXTURE_2D, null);
  }

  /**
   * 开启模版、深度测试
   * @param gl
   * @param type
   */
  static enable(gl: WebGLRenderingContext, type = gl.STENCIL_TEST) {
    gl.enable(type);
  }
  /**
   * 设置模版默认False
   * @param gl
   */
  static setSencilFalse(gl: WebGLRenderingContext) {
    gl.stencilFunc(gl.ALWAYS, 1, 0xff);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
    gl.stencilMask(0xff);
    gl.clear(gl.STENCIL_BUFFER_BIT);
    // No need to display the triangle
    gl.colorMask(false, false, false, false);
  }
  /**
   * 设置模版默认True
   * @param gl
   */
  static setSencilTrue(gl: WebGLRenderingContext) {
    gl.stencilFunc(gl.ALWAYS, 1, 0xff);
    gl.stencilMask(0xff);
    gl.colorMask(true, true, true, true);
  }
  /**
   * 创建深度缓冲区
   * @param gl
   * @param w
   * @param h
   * @returns
   */
  static creatDepthFramebuufer(
    gl: WebGLRenderingContext,
    framebuffer: WebGLFramebuffer,
    w: number = 128,
    h: number = 128
  ) {
    const depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
    // const depthFramebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      depthBuffer
    );
    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return depthBuffer;
  }

  /**
   * 创建渲染缓冲区
   * @param gl
   * @param w
   * @param h
   */
  static createFramebuffer(
    gl: WebGLRenderingContext,
    texture: WebGLTexture | null,
    w: number = 128,
    h: number = 128
  ) {
    const framebuffer = gl.createFramebuffer();
    if (!framebuffer) {
      console.error("create framebuffer fail");
      return;
    }
    const ext = gl.getExtension("EXT_color_buffer_float");
    gl.getExtension("EXT_float_blend");
    if (!ext) {
      // console.error("EXT_color_buffer_float not supported");
    }

    if (!texture) return framebuffer;
    framebuffer.texture = texture;

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0
    );
    // const stencilBuffer = gl.createRenderbuffer();
    // gl.bindRenderbuffer(gl.RENDERBUFFER, stencilBuffer);
    // gl.renderbufferStorage(
    //   gl.RENDERBUFFER,
    //   gl.STENCIL_INDEX8,
    //   w,
    //   h
    // );
    // gl.framebufferRenderbuffer(
    //   gl.FRAMEBUFFER,
    //   gl.STENCIL_ATTACHMENT,
    //   gl.RENDERBUFFER,
    //   stencilBuffer
    // );
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      console.log("Framebuffer is incomplete:", status);
      if (framebuffer) gl.deleteFramebuffer(framebuffer);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return framebuffer;
  }

  // static bindFramebuffer(){

  // }
}
export default glUtil;
