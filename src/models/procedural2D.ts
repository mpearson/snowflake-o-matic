import * as THREE from "three";



export interface Procedural2DOptions {
  showVertices: boolean;
  vertexCount: number;
  verticesUsed: number;
}

export class ProceduralGeometry2D {
  public options: Procedural2DOptions;
  public geometry: THREE.BufferGeometry;
  public vertices: Float32Array;

  public outline: THREE.LineLoop;
  public outlineMaterial: THREE.LineBasicMaterial;

  public vertexDots: THREE.Points;
  public vertexDotMaterial: THREE.PointsMaterial;

  constructor(options: Partial<Procedural2DOptions>) {
    const o = this.options = {
      showVertices: true,
      vertexCount: 9000,
      verticesUsed: 0,
      ...options,
    };

    const vertices = this.vertices = new Float32Array(o.vertexCount * 3);
    const geometry = this.geometry = new THREE.BufferGeometry();
    geometry.addAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.setDrawRange(0, o.verticesUsed);

    this.outlineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 0.5,
      alphaTest: 0.4,
      transparent: true,
    });
    this.outline = new THREE.LineLoop(this.geometry, this.outlineMaterial);
    this.outline.position.set(0, 0, 0);
    this.outline.scale.set(1, 1, 1);

    this.vertexDotMaterial = new THREE.PointsMaterial({
      size: 5,
      // opacity: 0.4,
      // alphaTest: 0.4,
      // transparent: true
    });
    this.vertexDots = new THREE.Points(this.geometry, this.vertexDotMaterial);
    this.outline.position.set(0, 0, 0);
    this.outline.scale.set(1, 1, 1);
  }



  // private subdivide(index: number, newVertCount: number = 1) {
  //   const points = this.points;
  //   const nextIndex = (index + 1) % points.length;
  //   const step = (points[nextIndex].sub(points[index])).divideScalar(newVertCount + 1);
  //   const newVerts = new Array<THREE.Vector3>(newVertCount);
  //   let prev = points[index];
  //   for (let i = 0; i < newVertCount; i++) {
  //     prev = prev.add(step);
  //     newVerts[i] = prev;
  //   }
  //   this.points = Array.prototype.concat(points.slice(0, index), newVerts, points.slice(index));

  //   this.createGeometry();
  // }


}
