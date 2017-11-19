import * as THREE from "three";

export interface Procedural2DOptions {
  showVertexDots: boolean;
  initialVertices: number;
  maxVerts: number;
}

export class ProceduralGeometry2D {
  public options: Procedural2DOptions;
  public geometry: THREE.BufferGeometry;
  public vertices: Float32Array;
  public vertCount: number;
  private positionAttr: THREE.BufferAttribute;

  public outline: THREE.LineLoop;
  public outlineMaterial: THREE.LineBasicMaterial;

  public vertexDots: THREE.Points;
  public vertexDotMaterial: THREE.PointsMaterial;

  constructor(options: Partial<Procedural2DOptions>) {
    this.options = {
      showVertexDots: true,
      initialVertices: 0,
      maxVerts: 9000,
      ...options,
    };

    this.vertCount = this.options.initialVertices;
    this.vertices = new Float32Array(this.options.maxVerts * 3);
    this.geometry = new THREE.BufferGeometry();
    this.positionAttr = new THREE.BufferAttribute(this.vertices, 3);
    this.geometry.addAttribute("position", this.positionAttr);
    this.geometry.setDrawRange(0, this.vertCount);

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

  public subdivide(vert: number, newVerts: number = 1) {
    const { vertices, vertCount } = this;
    const { maxVerts } = this.options;

    if (vertCount + newVerts >= maxVerts )
      throw new Error(`unable to subdivide! Already using ${vertCount} / ${maxVerts} verts.`);

    // calculate the delta between this vert and the next
    const nextVert = (vert + 1) % vertCount;
    const vertOffset = vert * 3;
    const nextVertOffset = nextVert * 3;
    const factor = 1 / (newVerts + 1);
    const dx = (vertices[nextVertOffset] - vertices[vertOffset]) * factor;
    const dy = (vertices[nextVertOffset + 1] - vertices[vertOffset + 1]) * factor;
    const dz = (vertices[nextVertOffset + 2] - vertices[vertOffset + 2]) * factor;

    // shift all the vertices ahead to make room for the new ones
    const target = (vert + newVerts + 1) * 3;
    vertices.copyWithin(target, nextVertOffset, vertCount * 3);

    for (let offset = vertOffset; offset < target; offset += 3) {
      vertices[offset + 3] = vertices[offset] + dx;
      vertices[offset + 4] = vertices[offset + 1] + dy;
      vertices[offset + 5] = 0; // this is a 2D geometry, ignore Z
    }

    this.vertCount += newVerts;
    this.geometry.setDrawRange(0, this.vertCount);
    this.positionAttr.needsUpdate = true;
  }


}
