import {
  Matrix3,
  Matrix4,
  Vector3,
  PerspectiveCamera,
  BoxGeometry,
  Scene,
  WebGLRenderer,
  MeshBasicMaterial,
  Mesh,
  FileLoader,
} from "three";

export type Transform = {
  modelTransX: number;
  modelTransY: number;
  modelTransZ: number;
  //Edit Start
  modelRotateX: number;
  modelRotateY: number;
  modelRotateZ: number;
  //Edit End
  modelScaleX: number;
  modelScaleY: number;
  modelScaleZ: number;
};
export function getModeMatrix(
  scale: number | Vector3,
  translate: number | Vector3,
  rotate: number | Vector3
) {
  if (!(scale instanceof Vector3)) {
    scale = new Vector3(scale, scale, scale);
  }
  const scaleMatrix = new Matrix4();
  scaleMatrix.set(
    scale.x,
    0,
    0,
    0,
    0,
    scale.y,
    0,
    0,
    0,
    0,
    scale.z,
    0,
    0,
    0,
    0,
    1
  );
  const translateMatrix = new Matrix4();
  if (!(translate instanceof Vector3)) {
    translate = new Vector3(translate, translate, translate);
  }
  translateMatrix.set(
    1,
    0,
    0,
    translate.x,
    0,
    1,
    0,
    translate.y,
    0,
    0,
    1,
    translate.z,
    0,
    0,
    0,
    1
  );
  // console.log(translateMatrix.transpose())
  const rotateXMatrix = new Matrix4();
  const rotateYMatrix = new Matrix4();
  const rotateZMatrix = new Matrix4();
  if (!(rotate instanceof Vector3)) {
    rotate = new Vector3(rotate, rotate, rotate);
  }
  rotateXMatrix.set(
    1,
    0,
    0,
    0,
    0,
    Math.cos(rotate.x),
    -Math.sin(rotate.x),
    0,
    0,
    Math.sin(rotate.x),
    Math.cos(rotate.x),
    0,
    0,
    0,
    0,
    1
  );
  rotateYMatrix.set(
    Math.cos(rotate.y),
    0,
    Math.sin(rotate.y),
    0,
    0,
    1,
    0,
    0,
    -Math.sin(rotate.y),
    0,
    Math.cos(rotate.y),
    0,
    0,
    0,
    0,
    1
  );
  rotateZMatrix.set(
    Math.cos(rotate.z),
    -Math.sin(rotate.z),
    0,
    0,
    Math.sin(rotate.z),
    Math.cos(rotate.z),
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  );

  // rotalMatrix.multiplyScalar(0.5)
  const m = new Matrix4();
  m.multiply(translateMatrix)
    .multiply(rotateXMatrix)
    .multiply(rotateYMatrix)
    .multiply(rotateZMatrix)
    .multiply(scaleMatrix);
  // m.makeTranslation(translate)
  // console.log(m.transpose())
  // m.t
  return m;
}

export function getOrhMatrix(
  left: number,
  right: number,
  top: number,
  bottom: number,
  near: number,
  far: number
) {
  const out = new Array(16).fill(0);

  function cal(left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
  // return cal(left, right, bottom, top, near,far)
  // const angle = (fov * Math.PI) / 180;
  // // const t = near * Math.tan(angle / 2);
  // // const r = t * aspect;
  // // const l = -r;
  // // const b = -t;
  // const { b, t, f:far, n:near, l, r } = {
  //   b: -200,
  //   f: 500,
  //   l: -200,
  //   n: 0.01,
  //   r: 200,
  //   t: 200,
  // };

  const translateMatrix = new Matrix4();
  const scaleMatrix = new Matrix4();
  const projectionMatrix = new Matrix4();
  const m = new Matrix4();

  translateMatrix.set(
    1,
    0,
    0,
    -(left + right) / 2,
    0,
    1,
    0,
    -(top + bottom) / 2,
    0,
    0,
    1,
    -(near + far) / 2,
    0,
    0,
    0,
    1
  );
  scaleMatrix.set(
    2 / (right - left),
    0,
    0,
    0,
    0,
    2 / (top - bottom),
    0,
    0,
    0,
    0,
    2 / (far - near),
    0,
    0,
    0,
    0,
    1
  );
  const mt = new Matrix4();
  m.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1);
  // mt.multiply(projectionMatrix);
  mt.multiply(scaleMatrix).multiply(translateMatrix).multiply(m);

  // console.log(mt)
  return mt;
}

export function getProjectMatrix(
  fov: number,
  aspect: number,
  near: number,
  far: number
) {
  const angle = (fov * Math.PI) / 180;
  const t = near * Math.tan(angle / 2);
  const r = t * aspect;
  const l = -r;
  const b = -t;
  const translateMatrix = new Matrix4();
  const scaleMatrix = new Matrix4();
  const projectionMatrix = new Matrix4();
  const m = new Matrix4();
  translateMatrix.set(
    1,
    0,
    0,
    -(l + r) / 2,
    0,
    1,
    0,
    -(t + b) / 2,
    0,
    0,
    1,
    -(near + far) / 2,
    0,
    0,
    0,
    1
  );
  scaleMatrix.set(
    2 / (r - l),
    0,
    0,
    0,
    0,
    2 / (t - b),
    0,
    0,
    0,
    0,
    2 / (far - near),
    0,
    0,
    0,
    0,
    1
  );
  projectionMatrix.set(
    near,
    0,
    0,
    0,
    0,
    near,
    0,
    0,
    0,
    0,
    far + near,
    -far * near,
    0,
    0,
    1,
    0
  );
  const mt = new Matrix4();
  mt.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1);
  projectionMatrix.multiply(mt);
  m.multiply(scaleMatrix).multiply(translateMatrix).multiply(projectionMatrix);
  return m;
}

export function getViewMatrix(
  eye: Vector3,
  center = new Vector3(0, 0, 0),
  up = new Vector3(0, 1, 0)
) {
  // const center = new Vector3(0, 0, 0);
  // const up = new Vector3(0, 1, 0);
  const zAxis = eye.clone().sub(center).normalize();
  const xAxis = up.clone().cross(zAxis).normalize();
  const yAxis = zAxis.clone().cross(xAxis).normalize();
  let viewMatrix = new Matrix4();
  viewMatrix.set(
    xAxis.x,
    xAxis.y,
    xAxis.z,
    -xAxis.dot(eye),
    yAxis.x,
    yAxis.y,
    yAxis.z,
    -yAxis.dot(eye),
    zAxis.x,
    zAxis.y,
    zAxis.z,
    -zAxis.dot(eye),
    0,
    0,
    0,
    1
  );
  //   console.log(viewMatrix.transpose())

  const tranMatrix = new Matrix4();
  // const m = new Matrix4();
  // tranMatrix.set(
  //     1, 0, 0, -eye.x,
  //     0, 1, 0, -eye.y,
  //     0, 0, 1, -eye.z,
  //     0, 0, 0, 1
  // )
  // viewMatrix.multiply(tranMatrix)
  // console.log(viewMatrix)
  return viewMatrix;
}

//角度转弧度
export function degrees2Radians(degrees: number) {
  return (3.1415927 / 180) * degrees;
}
/**
 * 转为对象数据
 * @param transform 
 * @returns 
 */
export function getModeMatrix2List(transform:Transform) {
  let translation = [
    transform.modelTransX,
    transform.modelTransY,
    transform.modelTransZ,
  ];
  //Edit Start 添加旋转参数
  let rotation = [
    transform.modelRotateX,
    transform.modelRotateY,
    transform.modelRotateZ,
  ];
  //Edit End
  let scale = [
    transform.modelScaleX,
    transform.modelScaleY,
    transform.modelScaleZ,
  ];

  return {
    translation,
    rotation,
    scale,
  };

}



/**
 * 设置旋转 参数
 * @param t_x
 * @param t_y
 * @param t_z
 * @param r_x
 * @param r_y
 * @param r_z
 * @param s_x
 * @param s_y
 * @param s_z
 * @returns
 */
export function setTransform(
  t_x: number,
  t_y: number,
  t_z: number,
  r_x: number,
  r_y: number,
  r_z: number,
  s_x: number,
  s_y: number,
  s_z: number
):Transform {
  //Edit End
  return {
    modelTransX: t_x,
    modelTransY: t_y,
    modelTransZ: t_z,
    //Edit Start
    modelRotateX: r_x,
    modelRotateY: r_y,
    modelRotateZ: r_z,
    //Edit End
    modelScaleX: s_x,
    modelScaleY: s_y,
    modelScaleZ: s_z,
  };
}
async function loadShaderFile(filename: string) {
  return new Promise((resolve, reject) => {
    const loader = new FileLoader();

    loader.load(filename, (data) => {
      resolve(data);
      //console.log(data);
    });
  });
}

export async function getShaderString(filename: string) {
  let val = "";
  await loadShaderFile(filename).then((result) => {
    val = result as string;
  });
  //console.log(val);
  return val;
}

export const res = {
  width: 1024,
  height: 1024,
};
